import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const workerOrigin =
  "https://hiphop-practice-video-vault.hiphop-practice-vault-2026.workers.dev";
const allowedOrigins = new Set([
  "http://127.0.0.1:4173",
  "http://localhost:4173",
  "http://127.0.0.1:4174",
  "http://localhost:4174",
]);
const allowedMethods = new Set(["GET", "HEAD", "POST", "PUT", "DELETE"]);
const allowedPaths = [
  "/health",
  "/uploads/start",
  "/uploads/part",
  "/uploads/complete",
  "/uploads/abort",
  "/transcriptions/class",
  "/objects/",
];

function corsHeaders(origin: string | null): Headers {
  const headers = new Headers({
    "access-control-allow-headers":
      "authorization,apikey,content-type,content-length,x-client-info",
    "access-control-allow-methods": "GET,HEAD,POST,PUT,DELETE,OPTIONS",
    "access-control-max-age": "86400",
    vary: "Origin",
  });
  if (origin && allowedOrigins.has(origin)) {
    headers.set("access-control-allow-origin", origin);
  }
  return headers;
}

function withCors(response: Response, origin: string | null): Response {
  const headers = new Headers(response.headers);
  corsHeaders(origin).forEach((value, key) => headers.set(key, value));
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

Deno.serve(async (request: Request) => {
  const origin = request.headers.get("origin");
  if (origin && !allowedOrigins.has(origin)) {
    return withCors(Response.json({ error: "ORIGIN_NOT_ALLOWED" }, { status: 403 }), origin);
  }

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (!allowedMethods.has(request.method)) {
    return withCors(Response.json({ error: "METHOD_NOT_ALLOWED" }, { status: 405 }), origin);
  }

  const incoming = new URL(request.url);
  const functionMarker = "/practice-video-vault";
  const markerIndex = incoming.pathname.indexOf(functionMarker);
  const upstreamPath = markerIndex >= 0
    ? incoming.pathname.slice(markerIndex + functionMarker.length) || "/"
    : incoming.pathname;
  if (!allowedPaths.some((path) =>
    path.endsWith("/") ? upstreamPath.startsWith(path) : upstreamPath === path
  )) {
    return withCors(Response.json({ error: "NOT_FOUND" }, { status: 404 }), origin);
  }

  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return withCors(Response.json({ error: "UNAUTHORIZED" }, { status: 401 }), origin);
  }

  const upstreamHeaders = new Headers({ authorization });
  for (const name of ["content-type", "content-length", "range"]) {
    const value = request.headers.get(name);
    if (value) upstreamHeaders.set(name, value);
  }
  if (origin) upstreamHeaders.set("origin", origin);

  try {
    const response = await fetch(workerOrigin + upstreamPath + incoming.search, {
      method: request.method,
      headers: upstreamHeaders,
      body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
      redirect: "error",
    });
    return withCors(response, origin);
  } catch (error) {
    console.error(JSON.stringify({
      event: "practice_video_proxy_failed",
      path: upstreamPath,
      message: error instanceof Error ? error.message : "unknown",
    }));
    return withCors(
      Response.json({ error: "UPSTREAM_UNAVAILABLE" }, { status: 502 }),
      origin,
    );
  }
});

