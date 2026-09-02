const PART_SIZE = 8 * 1024 * 1024;
const MAX_VIDEO_SIZE = 1024 * 1024 * 1024;
const MAX_TRANSCRIPTION_SIZE = 24 * 1024 * 1024;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const VIDEO_TYPES = new Set(["video/mp4", "video/quicktime", "video/webm", "video/x-m4v"]);
const TRANSCRIPTION_TYPES = new Set([...VIDEO_TYPES, "audio/webm", "audio/mp4", "audio/mpeg", "audio/wav", "audio/x-wav", "audio/ogg"]);

type AuthUser = { id: string };
type UploadedPart = { partNumber: number; etag: string };

function json(data: unknown, status = 200, extraHeaders: HeadersInit = {}): Response {
  return Response.json(data, { status, headers: extraHeaders });
}

function allowedOrigin(request: Request, env: Env): string | null {
  const origin = request.headers.get("origin");
  if (!origin) return null;
  const allowed = env.ALLOWED_ORIGINS.split(",").map((value) => value.trim()).filter(Boolean);
  return allowed.includes(origin) ? origin : null;
}

function corsHeaders(request: Request, env: Env): Headers {
  const headers = new Headers({
    "access-control-allow-headers": "authorization,content-type,content-length",
    "access-control-allow-methods": "GET,HEAD,POST,PUT,DELETE,OPTIONS",
    "access-control-max-age": "86400",
    "vary": "Origin"
  });
  const origin = allowedOrigin(request, env);
  if (origin) headers.set("access-control-allow-origin", origin);
  return headers;
}

function withCors(response: Response, request: Request, env: Env): Response {
  const headers = new Headers(response.headers);
  corsHeaders(request, env).forEach((value, key) => headers.set(key, value));
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

async function authenticate(request: Request, env: Env): Promise<AuthUser | null> {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  const response = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: {
      authorization,
      apikey: env.SUPABASE_PUBLISHABLE_KEY
    }
  });
  if (!response.ok) return null;
  const payload: unknown = await response.json();
  if (!payload || typeof payload !== "object" || !("id" in payload) || typeof payload.id !== "string") return null;
  return { id: payload.id };
}

function safeName(value: string): string {
  const normalized = value.normalize("NFKC").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return (normalized || "practice-video.mp4").slice(-120);
}

function validOwnedKey(key: string, userId: string): boolean {
  return key.startsWith(`${userId}/`) && !key.includes("..") && !key.startsWith("/") && key.length <= 1024;
}

function arrayBufferToBase64(value: ArrayBuffer): string {
  const bytes = new Uint8Array(value);
  const chunkSize = 32 * 1024;
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
}

async function readJson<T>(request: Request): Promise<T | null> {
  try {
    return await request.json<T>();
  } catch {
    return null;
  }
}

async function startUpload(request: Request, env: Env, user: AuthUser): Promise<Response> {
  const payload = await readJson<{ sessionId?: string; fileName?: string; contentType?: string; size?: number }>(request);
  if (!payload || !payload.sessionId || !UUID_PATTERN.test(payload.sessionId)) return json({ error: "INVALID_SESSION" }, 400);
  if (!payload.fileName || !payload.contentType || !VIDEO_TYPES.has(payload.contentType)) return json({ error: "INVALID_VIDEO" }, 400);
  const size = Number(payload.size);
  if (!Number.isFinite(size) || size <= 0 || size > MAX_VIDEO_SIZE) return json({ error: "VIDEO_SIZE_NOT_ALLOWED" }, 400);

  const key = `${user.id}/${payload.sessionId}/${crypto.randomUUID()}-${safeName(payload.fileName)}`;
  const upload = await env.PRACTICE_VIDEOS.createMultipartUpload(key, {
    httpMetadata: { contentType: payload.contentType },
    customMetadata: {
      userId: user.id,
      sessionId: payload.sessionId,
      originalName: payload.fileName.slice(0, 300)
    }
  });
  return json({ key, uploadId: upload.uploadId, partSize: PART_SIZE });
}

async function uploadPart(request: Request, env: Env, user: AuthUser, url: URL): Promise<Response> {
  const key = url.searchParams.get("key") || "";
  const uploadId = url.searchParams.get("uploadId") || "";
  const partNumber = Number(url.searchParams.get("partNumber"));
  const contentLength = Number(request.headers.get("content-length"));
  if (!validOwnedKey(key, user.id) || !uploadId || !Number.isInteger(partNumber) || partNumber < 1 || partNumber > 10000) {
    return json({ error: "INVALID_UPLOAD_PART" }, 400);
  }
  if (!request.body || !Number.isFinite(contentLength) || contentLength <= 0 || contentLength > PART_SIZE) {
    return json({ error: "INVALID_PART_SIZE" }, 400);
  }
  const upload = env.PRACTICE_VIDEOS.resumeMultipartUpload(key, uploadId);
  const part = await upload.uploadPart(partNumber, request.body);
  return json({ partNumber: part.partNumber, etag: part.etag });
}

function validParts(value: unknown): value is UploadedPart[] {
  return Array.isArray(value) && value.length > 0 && value.length <= 10000 && value.every((part) => {
    if (!part || typeof part !== "object") return false;
    const candidate = part as Record<string, unknown>;
    return Number.isInteger(candidate.partNumber) && Number(candidate.partNumber) >= 1 && Number(candidate.partNumber) <= 10000 && typeof candidate.etag === "string";
  });
}

async function completeUpload(request: Request, env: Env, user: AuthUser): Promise<Response> {
  const payload = await readJson<{ key?: string; uploadId?: string; parts?: unknown }>(request);
  if (!payload || !payload.key || !validOwnedKey(payload.key, user.id) || !payload.uploadId || !validParts(payload.parts)) {
    return json({ error: "INVALID_COMPLETE_REQUEST" }, 400);
  }
  const parts = [...payload.parts].sort((a, b) => a.partNumber - b.partNumber);
  if (new Set(parts.map((part) => part.partNumber)).size !== parts.length) return json({ error: "DUPLICATE_PART" }, 400);
  const upload = env.PRACTICE_VIDEOS.resumeMultipartUpload(payload.key, payload.uploadId);
  const object = await upload.complete(parts);
  return json({ key: object.key, size: object.size, etag: object.httpEtag, uploadedAt: object.uploaded.toISOString() });
}

async function abortUpload(request: Request, env: Env, user: AuthUser): Promise<Response> {
  const payload = await readJson<{ key?: string; uploadId?: string }>(request);
  if (!payload?.key || !validOwnedKey(payload.key, user.id) || !payload.uploadId) return json({ error: "INVALID_ABORT_REQUEST" }, 400);
  await env.PRACTICE_VIDEOS.resumeMultipartUpload(payload.key, payload.uploadId).abort();
  return json({ aborted: true });
}

async function readObject(request: Request, env: Env, user: AuthUser, key: string): Promise<Response> {
  if (!validOwnedKey(key, user.id)) return json({ error: "NOT_FOUND" }, 404);
  if (request.method === "HEAD") {
    const object = await env.PRACTICE_VIDEOS.head(key);
    if (!object) return json({ error: "NOT_FOUND" }, 404);
    const headers = new Headers({ "content-length": String(object.size), etag: object.httpEtag, "accept-ranges": "bytes" });
    object.writeHttpMetadata(headers);
    return new Response(null, { status: 200, headers });
  }

  const rangeHeader = request.headers.get("range");
  const object = await env.PRACTICE_VIDEOS.get(key, rangeHeader ? { range: request.headers } : undefined);
  if (!object) return json({ error: "NOT_FOUND" }, 404);
  const headers = new Headers({ etag: object.httpEtag, "accept-ranges": "bytes", "cache-control": "private, max-age=0, no-store" });
  object.writeHttpMetadata(headers);
  let status = 200;
  const rangeStart = object.range && "offset" in object.range ? Number(object.range.offset) : Number.NaN;
  const rangeLength = object.range && "length" in object.range ? Number(object.range.length) : Number.NaN;
  if (rangeHeader && Number.isFinite(rangeStart) && Number.isFinite(rangeLength) && rangeLength > 0) {
    const start = rangeStart;
    const end = start + rangeLength - 1;
    headers.set("content-range", `bytes ${start}-${end}/${object.size}`);
    headers.set("content-length", String(rangeLength));
    status = 206;
  } else {
    headers.set("content-length", String(object.size));
  }
  return new Response(object.body, { status, headers });
}

async function deleteObject(env: Env, user: AuthUser, key: string): Promise<Response> {
  if (!validOwnedKey(key, user.id)) return json({ error: "NOT_FOUND" }, 404);
  await env.PRACTICE_VIDEOS.delete(key);
  return json({ deleted: true });
}

async function transcribeClassVideo(request: Request, env: Env): Promise<Response> {
  const contentType = (request.headers.get("content-type") || "").split(";", 1)[0].trim().toLowerCase();
  const contentLength = Number(request.headers.get("content-length"));
  if (!TRANSCRIPTION_TYPES.has(contentType)) return json({ error: "INVALID_TRANSCRIPTION_MEDIA" }, 415);
  if (!Number.isFinite(contentLength) || contentLength <= 0 || contentLength > MAX_TRANSCRIPTION_SIZE) {
    return json({ error: "TRANSCRIPTION_VIDEO_TOO_LARGE", maxBytes: MAX_TRANSCRIPTION_SIZE }, 413);
  }
  const bytes = await request.arrayBuffer();
  if (!bytes.byteLength || bytes.byteLength > MAX_TRANSCRIPTION_SIZE) {
    return json({ error: "TRANSCRIPTION_VIDEO_TOO_LARGE", maxBytes: MAX_TRANSCRIPTION_SIZE }, 413);
  }
  const audio = arrayBufferToBase64(bytes);
  const result = await env.AI.run("@cf/openai/whisper-large-v3-turbo", {
    audio,
    task: "transcribe",
    language: "zh",
    vad_filter: true,
    initial_prompt: "Hip-Hop 舞蹈课堂，可能包含 Groove、Bounce、重心、拍点、律动、动作元素与老师口令。保留中英文舞蹈术语。"
  });
  const text = String(result.text || "").trim();
  if (!text) return json({ error: "NO_SPEECH_DETECTED" }, 422);
  return json({
    text,
    model: "@cf/openai/whisper-large-v3-turbo",
    transcriptionInfo: result.transcription_info || null
  });
}

async function handle(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  if (request.method === "OPTIONS") {
    if (request.headers.get("origin") && !allowedOrigin(request, env)) return json({ error: "ORIGIN_NOT_ALLOWED" }, 403);
    return new Response(null, { status: 204, headers: corsHeaders(request, env) });
  }
  if (url.pathname === "/health" && request.method === "GET") {
    return json({ ok: true, storage: "private-r2", maxVideoBytes: MAX_VIDEO_SIZE, partSize: PART_SIZE });
  }
  if (request.headers.get("origin") && !allowedOrigin(request, env)) return json({ error: "ORIGIN_NOT_ALLOWED" }, 403);

  const user = await authenticate(request, env);
  if (!user) return json({ error: "UNAUTHORIZED" }, 401);

  if (url.pathname === "/uploads/start" && request.method === "POST") return startUpload(request, env, user);
  if (url.pathname === "/uploads/part" && request.method === "PUT") return uploadPart(request, env, user, url);
  if (url.pathname === "/uploads/complete" && request.method === "POST") return completeUpload(request, env, user);
  if (url.pathname === "/uploads/abort" && request.method === "POST") return abortUpload(request, env, user);
  if (url.pathname === "/transcriptions/class" && request.method === "POST") return transcribeClassVideo(request, env);
  if (url.pathname.startsWith("/objects/") && (request.method === "GET" || request.method === "HEAD")) {
    const key = decodeURIComponent(url.pathname.slice("/objects/".length));
    return readObject(request, env, user, key);
  }
  if (url.pathname.startsWith("/objects/") && request.method === "DELETE") {
    const key = decodeURIComponent(url.pathname.slice("/objects/".length));
    return deleteObject(env, user, key);
  }
  return json({ error: "NOT_FOUND" }, 404);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestId = crypto.randomUUID();
    try {
      const response = await handle(request, env);
      const headers = new Headers(response.headers);
      headers.set("x-request-id", requestId);
      return withCors(new Response(response.body, { status: response.status, statusText: response.statusText, headers }), request, env);
    } catch (error) {
      console.error(JSON.stringify({ requestId, event: "request_failed", error: error instanceof Error ? error.message : "unknown" }));
      return withCors(json({ error: "INTERNAL_ERROR", requestId }, 500), request, env);
    }
  }
} satisfies ExportedHandler<Env>;

