import http from "node:http";
import { createReadStream, createWriteStream, existsSync, mkdirSync, readFileSync, renameSync, statSync, unlinkSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const privateDataRoot = fileURLToPath(new URL("../../data/", import.meta.url));
const mime = {
  ".html":"text/html; charset=utf-8", ".js":"text/javascript; charset=utf-8",
  ".mjs":"text/javascript; charset=utf-8", ".css":"text/css; charset=utf-8",
  ".json":"application/json; charset=utf-8", ".wasm":"application/wasm",
  ".task":"application/octet-stream", ".jpg":"image/jpeg", ".png":"image/png",
  ".webp":"image/webp", ".mp4":"video/mp4"
};

const practiceModel = process.env.AISA_PRACTICE_MODEL || "deepseek-v4-flash";
const maxRequestBytes = 48 * 1024;

function readAisaConfig() {
  let apiKey = process.env.AISA_API_KEY || "";
  let baseUrl = process.env.AISA_BASE_URL || "https://api.aisa.one/v1";
  if (!apiKey) {
    const configPath = process.env.AISA_CONFIG_PATH || join(
      process.env.APPDATA || join(homedir(), "AppData", "Roaming"),
      "aisa-cli-nodejs", "Config", "config.json"
    );
    if (existsSync(configPath)) {
      try {
        const config = JSON.parse(readFileSync(configPath, "utf8"));
        apiKey = config.apiKey || "";
        baseUrl = config.baseUrl || baseUrl;
      } catch {
        // The endpoint below returns a clear configuration error.
      }
    }
  }
  baseUrl = baseUrl.replace(/\/+$/, "");
  if (!/\/v1$/i.test(baseUrl)) baseUrl += "/v1";
  return { apiKey, baseUrl };
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}


function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", chunk => {
      size += chunk.length;
      if (size > maxRequestBytes) {
        reject(new Error("REQUEST_TOO_LARGE"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"));
      } catch {
        reject(new Error("INVALID_JSON"));
      }
    });
    req.on("error", reject);
  });
}

function parseModelJson(content) {
  const text = Array.isArray(content)
    ? content.map(part => part?.text || "").join("")
    : String(content || "");
  const unfenced = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  const start = unfenced.indexOf("{");
  const end = unfenced.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("MODEL_JSON_MISSING");
  return JSON.parse(unfenced.slice(start, end + 1));
}

function cleanPracticeData(value) {
  const source = value && typeof value === "object" ? value : {};
  const string = key => typeof source[key] === "string" ? source[key].trim() : "";
  const list = key => Array.isArray(source[key])
    ? source[key].filter(item => typeof item === "string").map(item => item.trim()).filter(Boolean).slice(0, 20)
    : (string(key) ? [string(key)] : []);
  return {
    date: /^\d{4}-\d{2}-\d{2}$/.test(string("date")) ? string("date") : "",
    location: string("location"),
    partners: list("partners"),
    danceStyle: string("danceStyle"),
    music: list("music"),
    knownMoves: list("knownMoves"),
    otherMoves: list("otherMoves"),
    feeling: string("feeling"),
    wins: string("wins"),
    attention: string("attention"),
    technique: string("technique"),
    feedback: string("feedback"),
    nextStep: string("nextStep"),
    douyinTitle: string("douyinTitle"),
    isDouyin: source.isDouyin === true
  };
}

async function parsePracticeWithAisa({ transcript, currentDate, elementNames }) {
  const { apiKey, baseUrl } = readAisaConfig();
  if (!apiKey) {
    const error = new Error("AISA_NOT_CONFIGURED");
    error.status = 503;
    throw error;
  }

  const safeTranscript = String(transcript || "").trim().slice(0, 4000);
  if (!safeTranscript) {
    const error = new Error("TRANSCRIPT_REQUIRED");
    error.status = 400;
    throw error;
  }
  const knownElements = Array.isArray(elementNames)
    ? elementNames.filter(name => typeof name === "string").map(name => name.trim()).filter(Boolean).slice(0, 200)
    : [];

  const schema = {
    date: "YYYY-MM-DD；根据今天日期解析今天/昨天/前天，不确定则空字符串",
    location: "练习地点",
    partners: ["同伴姓名"],
    danceStyle: "舞种或主要练习方向",
    music: ["歌曲、舞曲或 Routine 名称"],
    knownMoves: ["只能填写动作库中完全一致的名称"],
    otherMoves: ["动作库以外的动作、Routine 或抖舞名称"],
    feeling: "整体感受和情绪，保留重要语气",
    wins: "做得好的地方，完整归纳",
    attention: "需要注意或改进的问题，完整归纳",
    technique: "动作要领、新发现或身体使用方法",
    feedback: "老师、同伴或他人给出的反馈；没有则空",
    nextStep: "下次练习重点；可从明确的改进意图中提取，不要凭空建议",
    douyinTitle: "明确提到的抖音舞曲/视频名称；没有则空",
    isDouyin: "是否明确提到抖音、抖舞或抖音视频，布尔值"
  };
const prompt = [
    "你是私人练舞日志整理助手。把用户的自然语言完整地整理成结构化字段。",
    "只提取用户明确表达的信息，不评价、不补写知识、不杜撰建议。允许同一内容按语义拆到不同字段，但不要遗漏细节。",
    `今天是 ${currentDate || new Date().toISOString().slice(0, 10)}，时区 Asia/Shanghai。`,
    `网站动作库：${knownElements.join("、") || "（空）"}`,
    `严格只输出一个 JSON 对象，结构说明：${JSON.stringify(schema)}`,
    `用户口述：\n${safeTranscript}`
  ].join("\n\n");

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: practiceModel,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 1200,
      response_format: { type: "json_object" }
    }),
    signal: AbortSignal.timeout(45000)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload?.error?.message || `AISA_HTTP_${response.status}`);
    error.status = 502;
    throw error;
  }
  const content = payload?.choices?.[0]?.message?.content;
  return {
    data: cleanPracticeData(parseModelJson(content)),
    model: payload.model || practiceModel,
    usage: payload.usage || null
  };
}

async function handlePracticeParse(req, res) {
  try {
    const input = await readJsonBody(req);
    const result = await parsePracticeWithAisa(input);
    sendJson(res, 200, result);
  } catch (error) {
    console.error(JSON.stringify({
      event: "practice_parse_failed",
      model: practiceModel,
      message: error instanceof Error ? error.message : "unknown"
    }));
    const status = Number(error?.status) || (error?.message === "REQUEST_TOO_LARGE" ? 413 : 500);
    const publicMessage = status === 503
      ? "AIsa 尚未配置"
      : status === 400 || status === 413
        ? "练舞内容为空或过长"
        : "AIsa 暂时没有完成整理";
    sendJson(res, status, { error: publicMessage });
  }
}

function cleanClassData(value) {
  const source = value && typeof value === "object" ? value : {};
  const list = key => Array.isArray(source[key])
    ? source[key].filter(item => typeof item === "string").map(item => item.trim()).filter(Boolean).slice(0, 24)
    : [];
  return {
    knownMoves: list("knownMoves"),
    otherMoves: list("otherMoves"),
    exercises: list("exercises"),
    practicePoints: list("practicePoints"),
    problems: list("problems"),
    summary: typeof source.summary === "string" ? source.summary.trim().slice(0, 2400) : "",
    needsConfirmation: list("needsConfirmation")
  };
}

async function parseClassWithAisa({ transcript, elementNames, classTitle, teacher }) {
  const { apiKey, baseUrl } = readAisaConfig();
  if (!apiKey) {
    const error = new Error("AISA_NOT_CONFIGURED");
    error.status = 503;
    throw error;
  }
  const safeTranscript = String(transcript || "").trim().slice(0, 6000);
  if (!safeTranscript) {
    const error = new Error("TRANSCRIPT_REQUIRED");
    error.status = 400;
    throw error;
  }
  const knownElements = Array.isArray(elementNames)
    ? elementNames.filter(name => typeof name === "string").map(name => name.trim()).filter(Boolean).slice(0, 200)
    : [];
  const schema = {
    knownMoves: ["只能填写动作库中完全一致的名称"],
    otherMoves: ["动作库以外、但课堂中明确提到的动作或组合"],
    exercises: ["课堂中明确进行的 drill、分解练习、组合练习、慢速或原速跟练；每项一句完整的话"],
    practicePoints: ["老师明确讲到的练习要点，每项是一句完整的话"],
    problems: ["仅记录老师或学员在课堂文字中明确说出的观察；不能当作视频分析结论"],
    summary: "使用 Hip-Hop / 舞蹈训练常用话语体系，围绕 Groove、Bounce、重心、身体控制、动作路径、节奏层次等课堂原文中确实出现的概念，生成简短专业总结；不补写课堂没有的信息",
    needsConfirmation: ["无法确定含义、动作名称或归属的信息"]
  };
  const prompt = [
    "你是舞蹈课堂记录整理助手。请把老师口述、课堂转写或学员笔记整理成可复核的课堂分析草稿。",
    "练习要点必须且只能从课堂文字中提取。不要用常识补写老师没说过的要点。不要用文字猜测视频里的动作问题；视频问题会由另一套人体轨迹分析提供。",
    "明确区分课堂做了哪些练习（exercises）、老师讲了哪些要点（practicePoints）、课堂文字明确指出哪些问题（problems）。同一句话如果同时包含练习、要点和问题，可以分别进入多个字段；不要因为已归入一个字段就漏掉另一个字段。不要把建议当成已做练习。",
    "课堂总结请使用专业但清晰的舞蹈行业话语体系组织原文，例如 Groove、Bounce、重心转换、身体控制、动作路径、节奏层次、质感等，但只有原文提到或能由原文直接归纳时才能使用。不要诊断动作质量，不要虚构老师观点。口语或动作名不确定时放入 needsConfirmation，并明确写出需要确认的对象。",
    `课堂名称：${String(classTitle || "").trim().slice(0, 120) || "未填写"}`,
    `老师：${String(teacher || "").trim().slice(0, 80) || "未填写"}`,
    `网站动作库：${knownElements.join("、") || "（空）"}`,
    `严格只输出一个 JSON 对象，结构说明：${JSON.stringify(schema)}`,
    `课堂文字：\n${safeTranscript}`
  ].join("\n\n");
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: practiceModel,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 1400,
      response_format: { type: "json_object" }
    }),
    signal: AbortSignal.timeout(45000)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload?.error?.message || `AISA_HTTP_${response.status}`);
    error.status = 502;
    throw error;
  }
  return {
    data: cleanClassData(parseModelJson(payload?.choices?.[0]?.message?.content)),
    model: payload.model || practiceModel,
    usage: payload.usage || null
  };
}

async function handleClassParse(req, res) {
  try {
    const input = await readJsonBody(req);
    sendJson(res, 200, await parseClassWithAisa(input));
  } catch (error) {
    console.error(JSON.stringify({
      event: "class_parse_failed",
      model: practiceModel,
      message: error instanceof Error ? error.message : "unknown"
    }));
    const status = Number(error?.status) || (error?.message === "REQUEST_TOO_LARGE" ? 413 : 500);
    const publicMessage = status === 503
      ? "AIsa 尚未配置"
      : status === 400 || status === 413
        ? "课堂文字为空或过长"
        : "AIsa 暂时没有完成课堂整理";
    sendJson(res, status, { error: publicMessage });
  }
}

function handlePracticeBackup(req, res) {
  if (req.headers["content-type"] !== "application/x-tar") {
    sendJson(res, 415, { error: "备份格式不正确" });
    return;
  }
  const backupDirectory = join(privateDataRoot, "backups");
  mkdirSync(backupDirectory, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `hiphop-practice-backup-${timestamp}.tar`;
  const finalPath = join(backupDirectory, fileName);
  const temporaryPath = `${finalPath}.part`;
  const output = createWriteStream(temporaryPath, { flags: "wx" });
  const maximumBackupBytes = 20 * 1024 * 1024 * 1024;
  let receivedBytes = 0;
  let settled = false;

  const cleanup = () => {
    try { if (existsSync(temporaryPath)) unlinkSync(temporaryPath); } catch { /* best effort */ }
  };
  const fail = (status, message) => {
    if (settled) return;
    settled = true;
    output.destroy();
    cleanup();
    if (!res.headersSent) sendJson(res, status, { error: message });
  };

  req.on("data", chunk => {
    receivedBytes += chunk.length;
    if (receivedBytes > maximumBackupBytes) {
      fail(413, "备份文件过大");
      req.destroy();
    }
  });
  req.on("aborted", () => fail(499, "备份上传已中断"));
  req.on("error", () => fail(500, "备份读取失败"));
  output.on("error", () => fail(500, "备份写入失败"));
  output.on("finish", () => {
    if (settled) return;
    try {
      renameSync(temporaryPath, finalPath);
      settled = true;
      sendJson(res, 201, {
        fileName,
        bytes: receivedBytes,
        location: `data/backups/${fileName}`
      });
    } catch {
      fail(500, "备份完成时发生错误");
    }
  });
  req.pipe(output);
}

http.createServer(async (req, res) => {
  const pathname = decodeURIComponent((req.url || "/").split("?")[0]);
  if (req.method === "POST" && pathname === "/api/practice/parse") {
    await handlePracticeParse(req, res);
    return;
  }
  if (req.method === "POST" && pathname === "/api/class/parse") {
    await handleClassParse(req, res);
    return;
  }
  if (req.method === "POST" && pathname === "/api/backups/practice") {
    handlePracticeBackup(req, res);
    return;
  }
  if (pathname.startsWith("/api/")) {
    sendJson(res, 404, { error: "Not found" });
    return;
  }

  const relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const file = normalize(join(root, relative));
  if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
  try {
    const { size } = statSync(file);
    const range = req.headers.range;
    res.setHeader("Content-Type", mime[extname(file)] || "application/octet-stream");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Accept-Ranges", "bytes");
    if (range) {
      const [startText, endText] = range.replace("bytes=", "").split("-");
      const start = Number(startText);
      const end = endText ? Number(endText) : size - 1;
      res.writeHead(206, { "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": end - start + 1 });
      createReadStream(file, { start, end }).pipe(res);
    } else {
      res.writeHead(200, { "Content-Length": size });
      createReadStream(file).pipe(res);
    }
  } catch { res.writeHead(404).end("Not found"); }
}).listen(Number(process.env.PORT || 4173), "127.0.0.1");

