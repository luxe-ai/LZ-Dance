(() => {
  "use strict";

  const config = globalThis.HIPHOP_CLOUD_CONFIG || {};
  const supabaseUrl = String(config.supabaseUrl || "").replace(/\/$/, "");
  const publishableKey = String(config.supabasePublishableKey || "");
  const workerUrl = String(config.r2WorkerUrl || "").replace(/\/$/, "");
  const sessionStorageKey = "hiphop-supabase-session-v1";
  const pendingDeleteKey = "hiphop-cloud-pending-deletes-v1";
  let authSession = readStoredSession();
  let adapters = null;
  let syncing = false;

  const ui = {};

  function readStoredSession() {
    try {
      const value = JSON.parse(localStorage.getItem(sessionStorageKey) || "null");
      return value?.access_token && value?.refresh_token ? value : null;
    } catch {
      return null;
    }
  }

  function storeSession(value) {
    authSession = value?.access_token ? {
      access_token: value.access_token,
      refresh_token: value.refresh_token,
      expires_at: value.expires_at || Math.floor(Date.now() / 1000) + Number(value.expires_in || 3600),
      user: value.user || authSession?.user || null
    } : null;
    if (authSession) localStorage.setItem(sessionStorageKey, JSON.stringify(authSession));
    else localStorage.removeItem(sessionStorageKey);
    renderAuthState();
  }

  function setStatus(message, state = "local", badge) {
    if (ui.status) ui.status.textContent = message;
    if (ui.badge) {
      ui.badge.dataset.state = state;
      ui.badge.textContent = badge || ({ online: "云端在线", local: "本机模式", error: "连接异常", checking: "检查中" }[state] || state);
    }
  }

  function renderAuthState() {
    if (!ui.form) return;
    const signedIn = Boolean(authSession?.access_token);
    ui.form.hidden = signedIn;
    ui.account.hidden = !signedIn;
    ui.accountEmail.textContent = authSession?.user?.email || "已登录私人账户";
    if (signedIn) {
      setStatus(workerUrl
        ? "已登录。文字记录同步到 Supabase，视频保存到私有 Cloudflare R2。"
        : "已登录 Supabase；文字记录可同步。Cloudflare R2 尚待部署连接。", "online", workerUrl ? "完整云端" : "数据库在线");
    }
  }

  async function authRequest(path, body) {
    const response = await fetch(`${supabaseUrl}/auth/v1/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: publishableKey },
      body: JSON.stringify(body)
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.msg || payload.message || payload.error_description || payload.error || `AUTH_${response.status}`);
    return payload;
  }

  async function refreshSession() {
    if (!authSession?.refresh_token) return null;
    try {
      const payload = await authRequest("token?grant_type=refresh_token", { refresh_token: authSession.refresh_token });
      storeSession(payload);
      return authSession;
    } catch (error) {
      storeSession(null);
      throw error;
    }
  }

  async function accessToken() {
    if (!authSession) return "";
    if (Number(authSession.expires_at || 0) <= Math.floor(Date.now() / 1000) + 60) await refreshSession();
    return authSession?.access_token || "";
  }

  async function supabaseFetch(path, options = {}, retry = true) {
    const token = await accessToken();
    if (!token) throw new Error("SIGN_IN_REQUIRED");
    const headers = new Headers(options.headers || {});
    headers.set("apikey", publishableKey);
    headers.set("Authorization", `Bearer ${token}`);
    if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, { ...options, headers });
    if (response.status === 401 && retry && authSession?.refresh_token) {
      await refreshSession();
      return supabaseFetch(path, options, false);
    }
    const payload = response.status === 204 ? null : await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.message || payload?.hint || payload?.details || `DATABASE_${response.status}`);
    return payload;
  }

  async function workerFetch(path, options = {}, retry = true) {
    if (!workerUrl) throw new Error("R2_NOT_CONFIGURED");
    const token = await accessToken();
    if (!token) throw new Error("SIGN_IN_REQUIRED");
    const headers = new Headers(options.headers || {});
    headers.set("Authorization", `Bearer ${token}`);
    headers.set("apikey", publishableKey);
    const response = await fetch(`${workerUrl}${path}`, { ...options, headers });
    if (response.status === 401 && retry && authSession?.refresh_token) {
      await refreshSession();
      return workerFetch(path, options, false);
    }
    return response;
  }

  async function transcribeClassVideo(file) {
    if (!(file instanceof Blob)) throw new Error("VIDEO_REQUIRED");
    const response = await workerFetch("/transcriptions/class", {
      method: "POST",
      headers: {
        "Content-Type": file.type || "video/mp4",
        "Content-Length": String(file.size)
      },
      body: file
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.error || `TRANSCRIPTION_${response.status}`);
    return payload;
  }

  async function checkVideoVault() {
    if (!workerUrl) return false;
    const token = await accessToken();
    if (!token) return false;
    const response = await workerFetch("/health", { method: "GET" });
    if (!response.ok) return false;
    const payload = await response.json().catch(() => ({}));
    return payload?.ok === true && payload?.storage === "private-r2";
  }

  function splitList(value) {
    if (Array.isArray(value)) return value.filter(Boolean);
    return String(value || "").split(/[、,，\n]+/).map(item => item.trim()).filter(Boolean);
  }

  function toCloudRow(session) {
    return {
      id: session.id,
      user_id: authSession.user.id,
      practiced_on: session.practicedOn,
      created_at: session.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      location: session.location || "",
      partners: splitList(session.partners),
      dance_style: session.danceStyle || "",
      music: splitList(session.music),
      feeling: session.feeling || "",
      wins: session.wins || "",
      attention: session.attention || "",
      technique: session.technique || "",
      feedback: session.feedback || "",
      next_step: session.nextStep || "",
      voice_note: session.voiceNote || "",
      other_moves: splitList(session.otherMoves),
      douyin_title: session.douyinTitle || "",
      moves: Array.isArray(session.moves) ? session.moves : []
    };
  }

  function fromCloudRow(row, media) {
    return {
      id: row.id,
      practicedOn: row.practiced_on,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      location: row.location || "",
      partners: (row.partners || []).join("、"),
      danceStyle: row.dance_style || "",
      music: (row.music || []).join("、"),
      feeling: row.feeling || "",
      wins: row.wins || "",
      attention: row.attention || "",
      technique: row.technique || "",
      feedback: row.feedback || "",
      nextStep: row.next_step || "",
      voiceNote: row.voice_note || "",
      otherMoves: (row.other_moves || []).join("、"),
      douyinTitle: row.douyin_title || "",
      douyinVideo: null,
      moves: Array.isArray(row.moves) ? row.moves : [],
      cloudBacked: true,
      cloudMedia: media || null
    };
  }

  async function upsertSession(session) {
    await supabaseFetch("practice_sessions?on_conflict=id", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(toCloudRow(session))
    });
  }

  async function uploadVideo(session) {
    const stored = session.douyinVideo?.blob || session.douyinVideo;
    if (!(stored instanceof Blob) || session.cloudMedia || !workerUrl) return session;
    const name = session.douyinVideo?.name || `practice-${session.id}.mp4`;
    const contentType = session.douyinVideo?.type || stored.type || "video/mp4";
    const startResponse = await workerFetch("/uploads/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: session.id, fileName: name, contentType, size: stored.size })
    });
    const start = await startResponse.json().catch(() => ({}));
    if (!startResponse.ok) throw new Error(start.error || `R2_START_${startResponse.status}`);
    const parts = [];
    let completedObjectKey = "";
    try {
      for (let offset = 0, partNumber = 1; offset < stored.size; offset += start.partSize, partNumber += 1) {
        const chunk = stored.slice(offset, Math.min(offset + start.partSize, stored.size), contentType);
        const partResponse = await workerFetch(`/uploads/part?key=${encodeURIComponent(start.key)}&uploadId=${encodeURIComponent(start.uploadId)}&partNumber=${partNumber}`, {
          method: "PUT",
          headers: { "Content-Type": contentType },
          body: chunk
        });
        const part = await partResponse.json().catch(() => ({}));
        if (!partResponse.ok) throw new Error(part.error || `R2_PART_${partResponse.status}`);
        parts.push({ partNumber: part.partNumber, etag: part.etag });
        ui.syncMeta.textContent = `正在上传视频 ${Math.min(offset + start.partSize, stored.size)} / ${stored.size} bytes`;
      }
      const completeResponse = await workerFetch("/uploads/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: start.key, uploadId: start.uploadId, parts })
      });
      const complete = await completeResponse.json().catch(() => ({}));
      if (!completeResponse.ok) throw new Error(complete.error || `R2_COMPLETE_${completeResponse.status}`);
      completedObjectKey = complete.key;
      const mediaRows = await supabaseFetch("practice_media?on_conflict=session_id,user_id", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify({
          user_id: authSession.user.id,
          session_id: session.id,
          object_path: complete.key,
          original_name: name,
          mime_type: contentType,
          bytes: stored.size,
          remote_etag: complete.etag || null,
          uploaded_at: complete.uploadedAt || new Date().toISOString()
        })
      });
      session.cloudMedia = Array.isArray(mediaRows) ? mediaRows[0] : mediaRows;
      session.cloudBacked = true;
      await adapters.saveLocal(session);
      return session;
    } catch (error) {
      if (completedObjectKey) {
        await workerFetch(`/objects/${encodeURIComponent(completedObjectKey)}`, { method: "DELETE" }).catch(() => {});
      } else {
        await workerFetch("/uploads/abort", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: start.key, uploadId: start.uploadId })
        }).catch(() => {});
      }
      throw error;
    }
  }

  async function deleteRemoteMedia(media) {
    if (!media) return;
    if (media.object_path) {
      if (!workerUrl) throw new Error("R2_NOT_CONFIGURED");
      const response = await workerFetch(`/objects/${encodeURIComponent(media.object_path)}`, { method: "DELETE" });
      if (!response.ok && response.status !== 404) throw new Error(`R2_DELETE_${response.status}`);
    }
    if (media.session_id) {
      await supabaseFetch(`practice_media?session_id=eq.${encodeURIComponent(media.session_id)}`, {
        method: "DELETE",
        headers: { Prefer: "return=minimal" }
      });
    }
  }

  async function saveSession(session) {
    if (!authSession) return { localOnly: true };
    await upsertSession(session);
    session.cloudBacked = true;
    await adapters.saveLocal(session);
    if (session.mediaChanged) {
      const previousMedia = session.previousCloudMedia || session.cloudMedia;
      await deleteRemoteMedia(previousMedia);
      if (!previousMedia?.session_id && session.id) {
        await supabaseFetch(`practice_media?session_id=eq.${encodeURIComponent(session.id)}`, {
          method: "DELETE",
          headers: { Prefer: "return=minimal" }
        });
      }
      session.cloudMedia = null;
      await uploadVideo(session);
      delete session.mediaChanged;
      delete session.previousCloudMedia;
      await adapters.saveLocal(session);
    } else {
      await uploadVideo(session);
    }
    return { localOnly: false, videoStored: Boolean(session.cloudMedia) };
  }

  function pendingDeletes() {
    try { return JSON.parse(localStorage.getItem(pendingDeleteKey) || "[]"); } catch { return []; }
  }

  function queueDelete(id, media) {
    const queued = pendingDeletes().filter(item => (typeof item === "string" ? item : item.id) !== id);
    queued.push({ id, objectPath: media?.object_path || "" });
    localStorage.setItem(pendingDeleteKey, JSON.stringify(queued));
  }

  async function deleteRemoteSession(id, media) {
    if (media?.object_path && workerUrl) {
      const response = await workerFetch(`/objects/${encodeURIComponent(media.object_path)}`, { method: "DELETE" });
      if (!response.ok && response.status !== 404) throw new Error(`R2_DELETE_${response.status}`);
    }
    await supabaseFetch(`practice_sessions?id=eq.${encodeURIComponent(id)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
  }

  async function deleteSession(id, media) {
    if (!authSession) { queueDelete(id, media); return; }
    try {
      await deleteRemoteSession(id, media);
    } catch (error) {
      queueDelete(id, media);
      throw error;
    }
  }

  async function fetchRemoteSessions() {
    const [rows, mediaRows] = await Promise.all([
      supabaseFetch("practice_sessions?select=*&order=practiced_on.desc,created_at.desc"),
      supabaseFetch("practice_media?select=*")
    ]);
    const mediaBySession = new Map((mediaRows || []).map(media => [media.session_id, media]));
    return (rows || []).map(row => fromCloudRow(row, mediaBySession.get(row.id)));
  }

  async function syncNow() {
    if (!authSession) throw new Error("SIGN_IN_REQUIRED");
    if (syncing) return;
    syncing = true;
    ui.syncNow.disabled = true;
    ui.syncMeta.textContent = "正在同步本机与云端…";
    try {
      const deletions = pendingDeletes();
      for (const item of deletions) {
        const id = typeof item === "string" ? item : item.id;
        const media = typeof item === "string" || !item.objectPath ? null : { object_path: item.objectPath };
        await deleteRemoteSession(id, media).catch(error => {
        if (!String(error.message).includes("DATABASE_404")) throw error;
        });
      }
      localStorage.removeItem(pendingDeleteKey);

      const localSessions = await adapters.readLocal();
      let remoteSessions = await fetchRemoteSessions();
      const remoteById = new Map(remoteSessions.map(session => [session.id, session]));
      for (const session of localSessions) {
        const remote = remoteById.get(session.id);
        const localVersion = Date.parse(session.updatedAt || session.createdAt || 0) || 0;
        const remoteVersion = Date.parse(remote?.updatedAt || remote?.createdAt || 0) || 0;
        if (!remote || session.mediaChanged || localVersion > remoteVersion) {
          await saveSession(session);
        } else if (!remote.cloudMedia && session.douyinVideo && workerUrl) {
          await uploadVideo(session);
        }
      }
      remoteSessions = await fetchRemoteSessions();
      const currentLocal = await adapters.readLocal();
      const localById = new Map(currentLocal.map(session => [session.id, session]));
      for (const remote of remoteSessions) {
        const local = localById.get(remote.id);
        if (local?.douyinVideo) remote.douyinVideo = local.douyinVideo;
        if (local?.cloudMedia && !remote.cloudMedia) remote.cloudMedia = local.cloudMedia;
        await adapters.saveLocal(remote);
      }
      await adapters.render();
      ui.syncMeta.textContent = `同步完成 · 云端 ${remoteSessions.length} 条记录 · ${new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`;
      setStatus(workerUrl ? "Supabase 与 Cloudflare R2 已连接。" : "Supabase 已连接；R2 尚待部署。", "online", workerUrl ? "完整云端" : "数据库在线");
    } catch (error) {
      ui.syncMeta.textContent = `同步未完成：${humanError(error)}`;
      setStatus("云端暂时不可用，本机记录仍然安全保存。", "error");
      throw error;
    } finally {
      syncing = false;
      ui.syncNow.disabled = false;
    }
  }

  async function getVideoObjectUrl(media) {
    if (!media?.object_path) throw new Error("VIDEO_NOT_FOUND");
    const response = await workerFetch(`/objects/${encodeURIComponent(media.object_path)}`);
    if (!response.ok) throw new Error(`R2_READ_${response.status}`);
    return URL.createObjectURL(await response.blob());
  }

  function humanError(error) {
    const message = String(error?.message || error || "未知错误");
    if (message.includes("Invalid login credentials")) return "邮箱或密码不正确";
    if (message.includes("Email not confirmed")) return "请先在邮箱中确认账户";
    if (message.includes("User already registered")) return "该邮箱已经注册";
    if (message.includes("R2_NOT_CONFIGURED")) return "R2 尚未部署";
    if (message.includes("R2_HEALTH_FAILED")) return "R2 视频库暂时不可用";
    if (message.includes("SIGN_IN_REQUIRED")) return "请先登录";
    return message;
  }

  async function checkCloudAvailability() {
    if (!supabaseUrl || !publishableKey) {
      setStatus("缺少 Supabase 配置，当前仅使用本机存储。", "error");
      return;
    }
    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/settings`, { headers: { apikey: publishableKey } });
      if (!response.ok) throw new Error(`SUPABASE_${response.status}`);
      if (authSession) {
        await accessToken();
        if (workerUrl && !(await checkVideoVault())) throw new Error("R2_HEALTH_FAILED");
        renderAuthState();
        await syncNow();
      } else {
        setStatus(workerUrl ? "云服务可用。登录后开启跨设备同步与私有视频库。" : "Supabase 可用；R2 尚待部署。登录后可先同步文字记录。", "local");
      }
    } catch {
      setStatus("暂时连接不到云端，网站继续使用本机存储。", "error");
    }
  }

  function bindUi() {
    ui.form = document.querySelector("#cloudAuthForm");
    ui.email = document.querySelector("#cloudEmail");
    ui.password = document.querySelector("#cloudPassword");
    ui.signIn = document.querySelector("#cloudSignIn");
    ui.signUp = document.querySelector("#cloudSignUp");
    ui.account = document.querySelector("#cloudAccount");
    ui.accountEmail = document.querySelector("#cloudAccountEmail");
    ui.syncMeta = document.querySelector("#cloudSyncMeta");
    ui.syncNow = document.querySelector("#cloudSyncNow");
    ui.signOut = document.querySelector("#cloudSignOut");
    ui.status = document.querySelector("#cloudStatus");
    ui.badge = document.querySelector("#cloudBadge");

    ui.form.addEventListener("submit", async event => {
      event.preventDefault();
      ui.signIn.disabled = true;
      setStatus("正在登录 Supabase…", "checking");
      try {
        const payload = await authRequest("token?grant_type=password", { email: ui.email.value.trim(), password: ui.password.value });
        storeSession(payload);
        ui.password.value = "";
        await syncNow();
      } catch (error) {
        setStatus(`登录失败：${humanError(error)}`, "error");
      } finally {
        ui.signIn.disabled = false;
      }
    });

    ui.signUp.addEventListener("click", async () => {
      if (!ui.form.reportValidity()) return;
      ui.signUp.disabled = true;
      setStatus("正在创建私人账户…", "checking");
      try {
        const payload = await authRequest("signup", { email: ui.email.value.trim(), password: ui.password.value });
        if (payload.access_token) {
          storeSession(payload);
          await syncNow();
        } else {
          setStatus("账户已创建。请检查邮箱并完成确认，然后回来登录。", "local", "等待确认");
        }
        ui.password.value = "";
      } catch (error) {
        setStatus(`注册失败：${humanError(error)}`, "error");
      } finally {
        ui.signUp.disabled = false;
      }
    });

    ui.syncNow.addEventListener("click", () => void syncNow().catch(() => {}));
    ui.signOut.addEventListener("click", async () => {
      const token = await accessToken().catch(() => "");
      if (token) await fetch(`${supabaseUrl}/auth/v1/logout`, { method: "POST", headers: { apikey: publishableKey, Authorization: `Bearer ${token}` } }).catch(() => {});
      storeSession(null);
      ui.syncMeta.textContent = "已退出，继续使用本机存储";
      setStatus("已退出云端；本机记录不会删除。", "local");
    });
  }

  async function init(nextAdapters) {
    adapters = nextAdapters;
    bindUi();
    renderAuthState();
    await checkCloudAvailability();
  }

  globalThis.HipHopCloud = Object.freeze({
    init,
    saveSession,
    deleteSession,
    syncNow,
    getVideoObjectUrl,
    transcribeClassVideo,
    checkVideoVault,
    isSignedIn: () => Boolean(authSession),
    hasVideoVault: () => Boolean(workerUrl)
  });
})();

