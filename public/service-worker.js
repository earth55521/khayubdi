const CACHE_NAME = "khayubdi-exercise-v70";
const RUNTIME_CACHE = "khayubdi-runtime-v70";
const KHAYUBDI_CACHE_PREFIXES = ["khayubdi-exercise-", "khayubdi-runtime-"];
const VERSION = "70";

const CRITICAL_SHELL_ASSETS = [
  "/",
  "/index.html",
  "/exercise.html",
  "/exercise.css?v=70",
  "/components.css?v=70",
  "/os-screens.css?v=70",
  "/os-release.css?v=70",
  "/components.js?v=70",
  "/os-data.js?v=70",
  "/os-auth.js?v=70",
  "/os-pwa.js?v=70",
  "/exercise.js?v=70",
  "/os-app.js?v=70",
  "/os-training.js?v=70",
  "/os-release.js?v=70",
  "/manifest.webmanifest",
  "/icon.svg",
  "/icon-192.png",
  "/icon-512.png",
];

const FEATURE_ASSETS = [
  "/privacy.html",
  "/terms.html",
  "/os-rc-tools.css?v=70",
  "/os-rc-tools.js?v=70",
  "/release-manifest.json",
  "/icon-maskable-512.png",
  "/apple-touch-icon.png",
];

const ALL_PRECACHE_ASSETS = [...CRITICAL_SHELL_ASSETS, ...FEATURE_ASSETS];

async function cacheAsset(cache, url, critical) {
  try {
    const request = new Request(url, { cache: "reload" });
    const response = await fetch(request);
    if (!isCacheableResponse(response)) throw new Error(`Uncacheable response ${response.status}`);
    await cache.put(request, response.clone());
    return { ok: true, url };
  } catch (error) {
    const type = critical ? "sw_critical_shell_failed" : "sw_install_asset_failed";
    notifyClients(type, { path: safePath(url), critical: Boolean(critical), message: String(error?.message || "cache_failed").slice(0, 120) });
    return { ok: false, url, critical: Boolean(critical) };
  }
}

async function cacheGroup(cache, urls, critical) {
  const results = [];
  for (const url of urls) results.push(await cacheAsset(cache, url, critical));
  return results.filter((result) => !result.ok);
}

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const criticalFailures = await cacheGroup(cache, CRITICAL_SHELL_ASSETS, true);
    const optionalFailures = await cacheGroup(cache, FEATURE_ASSETS, false);
    if (optionalFailures.length) notifyClients("sw_install_asset_failed", { count: optionalFailures.length, critical: false });
    if (criticalFailures.length) {
      notifyClients("sw_critical_shell_failed", { count: criticalFailures.length, critical: true });
      throw new Error(`Critical shell cache failed: ${criticalFailures.map((item) => safePath(item.url)).join(", ")}`);
    }
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    const removed = [];
    await Promise.all(keys.map(async (key) => {
      const isKhayubdiCache = KHAYUBDI_CACHE_PREFIXES.some((prefix) => key.startsWith(prefix));
      if (!isKhayubdiCache || key === CACHE_NAME || key === RUNTIME_CACHE) return;
      const deleted = await caches.delete(key);
      if (deleted) removed.push(key);
    }));
    if (removed.length) notifyClients("sw_cache_cleanup", { count: removed.length });
    await self.clients.claim();
  })());
});

self.addEventListener("message", (event) => {
  const type = event.data?.type;
  if (type === "SKIP_WAITING") {
    notifyClients("sw_update_applied", { version: VERSION });
    self.skipWaiting();
    return;
  }
  if (type === "GET_STATUS") {
    event.source?.postMessage?.({ type: "SW_STATUS", payload: { cacheName: CACHE_NAME, runtimeCache: RUNTIME_CACHE, version: VERSION } });
  }
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(navigationStrategy(request));
    return;
  }

  if (shouldNeverCache(url)) {
    event.respondWith(fetch(request));
    return;
  }

  if (isVersionedStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (isManifestOrIcon(url)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  if (url.pathname === "/release-manifest.json") {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(cacheFirst(request));
});

async function navigationStrategy(request) {
  try {
    const response = await fetch(request);
    if (isCacheableResponse(response)) {
      const cache = await caches.open(RUNTIME_CACHE);
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    notifyClients("sw_fetch_fallback", { path: safePath(request.url), mode: "navigation" });
    return (await caches.match("/index.html")) || (await caches.match("/exercise.html")) || Response.error();
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request, { ignoreSearch: false });
  if (cached) return cached;
  const response = await fetch(request);
  if (isCacheableResponse(response)) {
    const cache = await caches.open(isPrecacheAsset(request.url) ? CACHE_NAME : RUNTIME_CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (isCacheableResponse(response)) {
      const cache = await caches.open(RUNTIME_CACHE);
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    notifyClients("sw_fetch_fallback", { path: safePath(request.url), mode: "network-first" });
    return Response.error();
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const refresh = fetch(request).then(async (response) => {
    if (isCacheableResponse(response)) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  }).catch(() => null);
  if (cached) return cached;
  return (await refresh) || Response.error();
}

function isCacheableResponse(response) {
  return Boolean(response && response.ok && (response.type === "basic" || response.type === "default"));
}

function isVersionedStaticAsset(url) {
  return url.searchParams.get("v") === VERSION && /\.(css|js)$/i.test(url.pathname);
}

function isManifestOrIcon(url) {
  return url.pathname === "/manifest.webmanifest" || /\.(png|svg|ico)$/i.test(url.pathname);
}

function shouldNeverCache(url) {
  if (url.pathname === "/manifest.webmanifest" || url.pathname === "/release-manifest.json") return false;
  if (/export|import|diagnostic|backup/i.test(url.pathname)) return true;
  return /\.json$/i.test(url.pathname);
}

function isPrecacheAsset(url) {
  const parsed = new URL(url, self.location.origin);
  const comparable = parsed.search ? `${parsed.pathname}${parsed.search}` : parsed.pathname;
  return ALL_PRECACHE_ASSETS.includes(comparable);
}

function safePath(value) {
  try {
    const url = new URL(value, self.location.origin);
    return url.origin === self.location.origin ? url.pathname : "external";
  } catch {
    return "unknown";
  }
}

async function notifyClients(name, payload = {}) {
  const clients = await self.clients.matchAll({ includeUncontrolled: true, type: "window" });
  clients.forEach((client) => client.postMessage({ type: "KHAYUBDI_SW_DIAGNOSTIC", name, payload: sanitizePayload(payload) }));
}

function sanitizePayload(payload) {
  return Object.fromEntries(Object.entries(payload || {}).filter(([key]) => !/email|password|token|secret|hash|salt|note|raw|state/i.test(key)));
}



