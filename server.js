const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

loadEnv();

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET || "";
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || "";
const LINE_CONFIGURED = hasRealLineCredential(LINE_CHANNEL_SECRET) && hasRealLineCredential(LINE_CHANNEL_ACCESS_TOKEN);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_VISION_MODEL = process.env.OPENAI_VISION_MODEL || "gpt-4o-mini";
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "store.json");
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;
const AUTH_RATE_LIMIT_WINDOW_MS = 1000 * 60 * 10;
const AUTH_RATE_LIMIT_MAX = 25;
const authRateLimit = new Map();
const OAUTH_PROVIDERS = {
  google: {
    label: "Google",
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    userInfoUrl: "https://www.googleapis.com/oauth2/v3/userinfo",
    scope: "openid email profile",
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  },
  facebook: {
    label: "Facebook",
    authUrl: "https://www.facebook.com/v20.0/dialog/oauth",
    tokenUrl: "https://graph.facebook.com/v20.0/oauth/access_token",
    userInfoUrl: "https://graph.facebook.com/me?fields=id,name,email",
    scope: "email,public_profile",
    clientId: process.env.FACEBOOK_CLIENT_ID || "",
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
  },
  apple: {
    label: "Apple",
    authUrl: "https://appleid.apple.com/auth/authorize",
    tokenUrl: "https://appleid.apple.com/auth/token",
    scope: "name email",
    clientId: process.env.APPLE_CLIENT_ID || "",
    clientSecret: process.env.APPLE_CLIENT_SECRET || "",
  },
};

function createServer() {
  return http.createServer(async (req, res) => {
  try {
    applySecurityHeaders(res);
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === "GET" && url.pathname === "/api/status") {
      const networkUrls = getLocalNetworkUrls(PORT);
      return sendJson(res, 200, {
        ok: true,
        appUrl: `http://localhost:${PORT}/`,
        phoneUrls: networkUrls,
        phoneSetupUrl: `http://localhost:${PORT}/phone`,
        webhookPath: "/webhook/line",
        lineConfigured: LINE_CONFIGURED,
        hasChannelSecret: hasRealLineCredential(LINE_CHANNEL_SECRET),
        hasChannelAccessToken: hasRealLineCredential(LINE_CHANNEL_ACCESS_TOKEN),
      });
    }

    if (req.method === "GET" && url.pathname === "/privacy") {
      return sendHtml(res, 200, privacyPolicyHtml());
    }

    if (req.method === "GET" && url.pathname === "/terms") {
      return sendHtml(res, 200, termsHtml());
    }

    if (req.method === "GET" && url.pathname === "/phone") {
      return sendHtml(res, 200, phoneSetupHtml(req));
    }

    if (url.pathname.startsWith("/api/auth/")) {
      const limit = checkAuthRateLimit(req);
      if (!limit.ok) {
        return sendJson(res, 429, { ok: false, error: "Too many login attempts. Try again later." });
      }
      return handleAuthApi(req, res, url);
    }

    if (url.pathname.startsWith("/api/app/")) {
      return handleAppApi(req, res, url);
    }

    if (req.method === "POST" && url.pathname === "/api/test-reply") {
      const body = await readJson(req);
      const text = buildAssistantReply(body.text || "");
      return sendJson(res, 200, { reply: text });
    }

    if (req.method === "POST" && url.pathname === "/webhook/line") {
      return handleLineWebhook(req, res);
    }

    if (req.method === "GET") {
      const staticPath = url.pathname === "/" ? "/exercise.html" : url.pathname;
      if (staticPath.startsWith("/api/") || staticPath.startsWith("/webhook/")) {
        return sendJson(res, 404, { ok: false, error: "Not found" });
      }
      return servePublicFile(res, staticPath);
    }

    return sendJson(res, 404, { ok: false, error: "Not found" });
  } catch (error) {
    console.error(error);
    return sendJson(res, 500, { ok: false, error: "Internal server error" });
  }
});
}

async function handleAuthApi(req, res, url) {
  if (url.pathname.startsWith("/api/auth/oauth/")) {
    return handleOAuthApi(req, res, url);
  }

  if (req.method !== "POST") {
    return sendJson(res, 405, { ok: false, error: "Method not allowed" });
  }

  const body = await readJson(req);
  const loginId = normalizeUserId(body.userId);
  const username = normalizeUserId(body.username || body.userId);
  const email = normalizeUserId(body.email);
  const userId = username || email || loginId;
  const password = String(body.password || "");
  const store = readStore();

  if (url.pathname === "/api/auth/register") {
    if (!username || !email || password.length < 8) {
      return sendJson(res, 400, { ok: false, error: "Use username, email, and a password with at least 8 characters" });
    }
    if (store.users[userId] || findUserIdForLogin(store, email)) {
      return sendJson(res, 409, { ok: false, error: "Account already exists" });
    }

    store.users[userId] = {
      id: userId,
      username,
      email,
      displayName: String(body.displayName || username).trim().slice(0, 120),
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
    };
    store.entries[userId] = [];
    store.foods[userId] = [];
    store.profiles[userId] = sanitizeProfile({ ...body, bodyWeight: body.currentWeight, onboardingComplete: false }, defaultProfile());
    store.clients[userId] = defaultClient(store, userId, { email, name: body.displayName || username });
    const token = createSession(store, userId);
    writeStore(store);
    return sendJson(res, 201, { ok: true, token, user: sanitizeUserForExport(store.users[userId]) });
  }

  if (url.pathname === "/api/auth/login") {
    const resolvedUserId = findUserIdForLogin(store, loginId);
    const user = store.users[resolvedUserId];
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return sendJson(res, 401, { ok: false, error: "Invalid login" });
    }
    if (!user.passwordHash.startsWith("pbkdf2$")) {
      user.passwordHash = hashPassword(password);
    }
    const token = createSession(store, resolvedUserId);
    writeStore(store);
    return sendJson(res, 200, { ok: true, token, user: sanitizeUserForExport(user) });
  }

  if (url.pathname === "/api/auth/logout") {
    const token = getBearerToken(req);
    if (token) delete store.sessions[token];
    writeStore(store);
    return sendJson(res, 200, { ok: true });
  }

  return sendJson(res, 404, { ok: false, error: "Not found" });
}

async function handleOAuthApi(req, res, url) {
  const parts = url.pathname.split("/").filter(Boolean);
  const providerName = parts[3];
  const action = parts[4] || "start";
  const provider = OAUTH_PROVIDERS[providerName];

  if (!provider) return sendJson(res, 404, { ok: false, error: "Unknown OAuth provider" });

  if (action === "start" && req.method === "GET") {
    if (!isOAuthConfigured(provider)) {
      return sendHtml(res, 503, oauthSetupHtml(provider));
    }

    const store = readStore();
    const state = crypto.randomBytes(24).toString("hex");
    store.oauthStates[state] = {
      provider: providerName,
      createdAt: new Date().toISOString(),
    };
    writeStore(store);

    const authUrl = new URL(provider.authUrl);
    authUrl.searchParams.set("client_id", provider.clientId);
    authUrl.searchParams.set("redirect_uri", oauthRedirectUri(req, providerName));
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", provider.scope);
    authUrl.searchParams.set("state", state);
    if (providerName === "google") authUrl.searchParams.set("access_type", "offline");
    if (providerName === "apple") authUrl.searchParams.set("response_mode", "query");
    return redirect(res, authUrl.toString());
  }

  if (action === "callback" && req.method === "GET") {
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const store = readStore();
    const savedState = store.oauthStates[state];

    if (!code || !state || !savedState || savedState.provider !== providerName) {
      return sendHtml(res, 400, oauthCompleteHtml({ error: "OAuth state is invalid or expired." }));
    }

    delete store.oauthStates[state];

    try {
      const identity = await exchangeOAuthCode(req, providerName, provider, code);
      const userId = upsertOAuthUser(store, providerName, identity);
      const token = createSession(store, userId);
      writeStore(store);
      return sendHtml(res, 200, oauthCompleteHtml({ token, userId }));
    } catch (error) {
      writeStore(store);
      return sendHtml(res, 502, oauthCompleteHtml({ error: error.message || "OAuth login failed." }));
    }
  }

  return sendJson(res, 404, { ok: false, error: "Not found" });
}

async function handleAppApi(req, res, url) {
  const auth = authenticate(req);
  if (!auth.ok) return sendJson(res, 401, { ok: false, error: "Unauthorized" });

  const { store, userId } = auth;

  if (req.method === "GET" && url.pathname === "/api/app/me") {
    return sendJson(res, 200, {
      ok: true,
      user: { id: userId },
      entries: store.entries[userId] || [],
      foods: store.foods[userId] || [],
      profile: store.profiles[userId] || defaultProfile(),
      client: ensureClient(store, userId),
    });
  }

  if (req.method === "GET" && url.pathname === "/api/app/export") {
    return sendJson(res, 200, {
      ok: true,
      exportedAt: new Date().toISOString(),
      user: sanitizeUserForExport(store.users[userId]),
      client: ensureClient(store, userId),
      entries: store.entries[userId] || [],
      foods: store.foods[userId] || [],
      profile: store.profiles[userId] || defaultProfile(),
    });
  }

  if (req.method === "GET" && url.pathname === "/api/app/client") {
    return sendJson(res, 200, { ok: true, client: ensureClient(store, userId) });
  }

  if (req.method === "PUT" && url.pathname === "/api/app/client") {
    const body = await readJson(req);
    const existing = ensureClient(store, userId);
    store.clients[userId] = sanitizeClient(body, existing);
    writeStore(store);
    return sendJson(res, 200, { ok: true, client: store.clients[userId] });
  }

  if (req.method === "GET" && url.pathname === "/api/app/entries") {
    return sendJson(res, 200, { ok: true, entries: store.entries[userId] || [] });
  }

  if (req.method === "GET" && url.pathname === "/api/app/foods") {
    return sendJson(res, 200, { ok: true, foods: store.foods[userId] || [] });
  }

  if (req.method === "POST" && url.pathname === "/api/app/foods/vision-estimate") {
    const body = await readJson(req);
    if (!OPENAI_API_KEY) {
      return sendJson(res, 503, { ok: false, error: "Vision AI is not configured. Add OPENAI_API_KEY to .env." });
    }
    const estimate = await estimateFoodWithVision(body);
    return sendJson(res, 200, { ok: true, estimate });
  }

  if (req.method === "POST" && url.pathname === "/api/app/foods") {
    const body = await readJson(req);
    const food = sanitizeFood(body);
    if (!food.name || food.calories < 0) {
      return sendJson(res, 400, { ok: false, error: "Food name is required" });
    }
    store.foods[userId] = store.foods[userId] || [];
    store.foods[userId].unshift(food);
    writeStore(store);
    return sendJson(res, 201, { ok: true, food, foods: store.foods[userId] });
  }

  if (req.method === "POST" && url.pathname === "/api/app/foods/clear-today") {
    const today = dateKey(new Date());
    store.foods[userId] = (store.foods[userId] || []).filter((food) => dateKey(new Date(food.createdAt)) !== today);
    writeStore(store);
    return sendJson(res, 200, { ok: true, foods: store.foods[userId] });
  }

  if (req.method === "POST" && url.pathname === "/api/app/entries") {
    const body = await readJson(req);
    const entry = sanitizeEntry(body);
    if (!entry.name || entry.minutes <= 0) {
      return sendJson(res, 400, { ok: false, error: "Exercise name and minutes are required" });
    }
    store.entries[userId] = store.entries[userId] || [];
    store.entries[userId].unshift(entry);
    writeStore(store);
    return sendJson(res, 201, { ok: true, entry, entries: store.entries[userId] });
  }

  if (req.method === "POST" && url.pathname === "/api/app/entries/clear-today") {
    const today = dateKey(new Date());
    store.entries[userId] = (store.entries[userId] || []).filter((entry) => dateKey(new Date(entry.createdAt)) !== today);
    writeStore(store);
    return sendJson(res, 200, { ok: true, entries: store.entries[userId] });
  }

  if (req.method === "GET" && url.pathname === "/api/app/profile") {
    return sendJson(res, 200, { ok: true, profile: store.profiles[userId] || defaultProfile() });
  }

  if (req.method === "PUT" && url.pathname === "/api/app/profile") {
    const body = await readJson(req);
    const existing = store.profiles[userId] || defaultProfile();
    store.profiles[userId] = sanitizeProfile(body, existing);
    writeStore(store);
    return sendJson(res, 200, { ok: true, profile: store.profiles[userId] });
  }

  if (req.method === "PUT" && url.pathname === "/api/app/privacy") {
    const body = await readJson(req);
    const existing = store.profiles[userId] || defaultProfile();
    store.profiles[userId] = {
      ...existing,
      privacy: sanitizePrivacy(body.privacy || body),
    };
    writeStore(store);
    return sendJson(res, 200, { ok: true, profile: store.profiles[userId] });
  }

  if (req.method === "DELETE" && url.pathname === "/api/app/account") {
    delete store.users[userId];
    delete store.entries[userId];
    delete store.foods[userId];
    delete store.profiles[userId];
    delete store.clients[userId];
    for (const [token, session] of Object.entries(store.sessions)) {
      if (session.userId === userId) delete store.sessions[token];
    }
    writeStore(store);
    return sendJson(res, 200, { ok: true });
  }

  return sendJson(res, 404, { ok: false, error: "Not found" });
}

if (require.main === module) {
  const server = createServer();
  server.listen(PORT, HOST, () => {
    const networkUrls = getLocalNetworkUrls(PORT);
    console.log(`Khayubdi app is running at http://localhost:${PORT}`);
    networkUrls.forEach((url) => console.log(`Phone URL: ${url}`));
    console.log(`LINE webhook endpoint: http://localhost:${PORT}/webhook/line`);
  });
}

async function handleLineWebhook(req, res) {
  const rawBody = await readRawBody(req);
  const signature = req.headers["x-line-signature"];

  if (!LINE_CONFIGURED) {
    console.warn("LINE credentials are missing. Copy .env.example to .env and fill in the values.");
    return sendJson(res, 503, { ok: false, error: "LINE credentials are not configured" });
  }

  if (!isValidLineSignature(rawBody, signature)) {
    return sendJson(res, 401, { ok: false, error: "Invalid LINE signature" });
  }

  const payload = JSON.parse(rawBody.toString("utf8") || "{}");
  const events = Array.isArray(payload.events) ? payload.events : [];

  await Promise.all(events.map(replyToLineEvent));
  return sendJson(res, 200, { ok: true, events: events.length });
}

async function replyToLineEvent(event) {
  if (event.type !== "message" || event.message?.type !== "text" || !event.replyToken) {
    return;
  }

  const replyText = buildAssistantReply(event.message.text);
  const response = await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      replyToken: event.replyToken,
      messages: [{ type: "text", text: replyText }],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("LINE reply failed:", response.status, text);
  }
}

function buildAssistantReply(message) {
  const text = String(message || "").trim().toLowerCase();

  if (!text) {
    return "พิมพ์เป้าหมายสุขภาพของคุณมาได้เลยครับ เช่น ลดน้ำหนัก เพิ่มกล้าม หรือคุมอาหาร";
  }

  if (text.includes("น้ำหนัก") || text.includes("weight")) {
    return "บันทึกน้ำหนักวันนี้ให้แล้วครับ ต่อไปลองส่งน้ำหนักเป็นตัวเลข เช่น 72.5 kg";
  }

  if (text.includes("อาหาร") || text.includes("calorie") || text.includes("แคล")) {
    return "ส่งชื่ออาหารหรือรูปอาหารมาได้เลยครับ Khayubdi OS จะช่วยประเมินมื้ออาหารให้";
  }

  if (text.includes("ออกกำลัง") || text.includes("workout") || text.includes("gym")) {
    return "วันนี้อยากซ้อมแบบไหนครับ: เวท คาร์ดิโอ หรือ mobility? เดี๋ยวผมช่วยจัดแผนให้";
  }

  if (text.includes("น้ำ") || text.includes("water")) {
    return "รับทราบครับ เป้าหมายวันนี้คือดื่มน้ำให้สม่ำเสมอ ส่งเช่น ดื่มน้ำ 500 ml เพื่อบันทึกได้เลย";
  }

  return `รับข้อความแล้วครับ: "${message}"\n\nKhayubdi OS พร้อมช่วยเรื่องอาหาร ออกกำลัง น้ำหนัก น้ำ นอน และ mood`;
}

function isValidLineSignature(rawBody, signature) {
  if (!signature) return false;
  const hmac = crypto.createHmac("sha256", LINE_CHANNEL_SECRET).update(rawBody).digest("base64");
  const expected = Buffer.from(hmac);
  const received = Buffer.from(signature);
  if (expected.length !== received.length) return false;
  return crypto.timingSafeEqual(expected, received);
}

function isOAuthConfigured(provider) {
  return Boolean(provider.clientId && provider.clientSecret);
}

function oauthRedirectUri(req, providerName) {
  const proto = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${proto}://${host}/api/auth/oauth/${providerName}/callback`;
}

async function exchangeOAuthCode(req, providerName, provider, code) {
  const tokenBody = new URLSearchParams({
    client_id: provider.clientId,
    client_secret: provider.clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: oauthRedirectUri(req, providerName),
  });

  const tokenResponse = await fetch(provider.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: tokenBody,
  });
  const tokenData = await tokenResponse.json().catch(() => ({}));
  if (!tokenResponse.ok || !tokenData.access_token && !tokenData.id_token) {
    throw new Error(tokenData.error_description || tokenData.error || "Token exchange failed");
  }

  if (providerName === "apple") {
    const claims = decodeJwtPayload(tokenData.id_token || "");
    return {
      providerId: claims.sub,
      email: claims.email || "",
      name: claims.email || "Apple user",
    };
  }

  const userInfoResponse = await fetch(provider.userInfoUrl, {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const userInfo = await userInfoResponse.json().catch(() => ({}));
  if (!userInfoResponse.ok) throw new Error("Could not read OAuth profile");

  if (providerName === "google") {
    return {
      providerId: userInfo.sub,
      email: userInfo.email || "",
      name: userInfo.name || userInfo.email || "Google user",
    };
  }

  return {
    providerId: userInfo.id,
    email: userInfo.email || "",
    name: userInfo.name || userInfo.email || "Facebook user",
  };
}

function upsertOAuthUser(store, providerName, identity) {
  if (!identity.providerId) throw new Error("OAuth identity is missing provider id");
  const userId = `${providerName}:${identity.providerId}`;
  store.users[userId] = {
    id: userId,
    authProvider: providerName,
    providerId: identity.providerId,
    email: normalizeUserId(identity.email),
    name: String(identity.name || "").slice(0, 120),
    updatedAt: new Date().toISOString(),
    createdAt: store.users[userId]?.createdAt || new Date().toISOString(),
  };
  store.entries[userId] = store.entries[userId] || [];
  store.foods[userId] = store.foods[userId] || [];
  store.profiles[userId] = store.profiles[userId] || defaultProfile();
  store.clients[userId] = store.clients[userId] || defaultClient(store, userId, {
    name: identity.name || "",
    email: identity.email || "",
  });
  return userId;
}

function decodeJwtPayload(jwt) {
  const payload = jwt.split(".")[1] || "";
  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(Buffer.from(normalized, "base64").toString("utf8") || "{}");
}

function oauthSetupHtml(provider) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${provider.label} setup required</title></head><body style="font-family:Arial,sans-serif;max-width:560px;margin:48px auto;line-height:1.5"><h1>${provider.label} login is not configured</h1><p>Add the provider client id and client secret to <code>.env</code>, then restart the app.</p><p><a href="/">Back to app</a></p></body></html>`;
}

function oauthCompleteHtml(result) {
  const payload = JSON.stringify(result).replace(/</g, "\\u003c");
  return `<!doctype html><html><head><meta charset="utf-8"><title>Login complete</title></head><body style="font-family:Arial,sans-serif;max-width:560px;margin:48px auto;line-height:1.5"><h1>Finishing login...</h1><p>You can close this page if it does not redirect automatically.</p><script>
    const result = ${payload};
    if (result.error) {
      document.body.innerHTML = '<h1>Login failed</h1><p>' + result.error + '</p><p><a href="/">Back to app</a></p>';
    } else {
      localStorage.setItem('khayubdi_auth_token', result.token);
      localStorage.setItem('khayubdi_session_user', result.userId);
      location.replace('/');
    }
  </script></body></html>`;
}

function readStore() {
  ensureDataFile();
  try {
    return {
      users: {},
      sessions: {},
      entries: {},
      foods: {},
      profiles: {},
      clients: {},
      oauthStates: {},
      ...JSON.parse(fs.readFileSync(DATA_FILE, "utf8")),
    };
  } catch {
    return { users: {}, sessions: {}, entries: {}, foods: {}, profiles: {}, clients: {}, oauthStates: {} };
  }
}

function writeStore(store) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ users: {}, sessions: {}, entries: {}, foods: {}, profiles: {}, clients: {}, oauthStates: {} }, null, 2));
  }
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const iterations = 120000;
  const hash = crypto.pbkdf2Sync(String(password), salt, iterations, 32, "sha256").toString("hex");
  return `pbkdf2$sha256$${iterations}$${salt}$${hash}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash) return false;
  if (!storedHash.startsWith("pbkdf2$")) {
    return storedHash === crypto.createHash("sha256").update(`khayubdi:${password}`).digest("hex");
  }

  const [, digest, iterationsText, salt, hash] = storedHash.split("$");
  const iterations = Number(iterationsText);
  if (digest !== "sha256" || !iterations || !salt || !hash) return false;
  const computed = crypto.pbkdf2Sync(String(password), salt, iterations, 32, digest).toString("hex");
  return safeEqualHex(computed, hash);
}

function safeEqualHex(a, b) {
  const left = Buffer.from(a, "hex");
  const right = Buffer.from(b, "hex");
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function pruneExpiredSessions(store) {
  const now = Date.now();
  for (const [token, session] of Object.entries(store.sessions || {})) {
    if (!session.expiresAt || new Date(session.expiresAt).getTime() <= now) {
      delete store.sessions[token];
    }
  }
}

function checkAuthRateLimit(req) {
  const key = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "local";
  const now = Date.now();
  const current = authRateLimit.get(key) || { count: 0, resetAt: now + AUTH_RATE_LIMIT_WINDOW_MS };

  if (current.resetAt <= now) {
    current.count = 0;
    current.resetAt = now + AUTH_RATE_LIMIT_WINDOW_MS;
  }

  current.count += 1;
  authRateLimit.set(key, current);
  return { ok: current.count <= AUTH_RATE_LIMIT_MAX, resetAt: current.resetAt };
}

function createSession(store, userId) {
  const token = crypto.randomBytes(32).toString("hex");
  const now = Date.now();
  store.sessions[token] = {
    userId,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + SESSION_TTL_MS).toISOString(),
  };
  return token;
}

function authenticate(req) {
  const token = getBearerToken(req);
  if (!token) return { ok: false };
  const store = readStore();
  pruneExpiredSessions(store);
  const session = store.sessions[token];
  if (!session || !store.users[session.userId]) {
    writeStore(store);
    return { ok: false };
  }
  return { ok: true, store, token, userId: session.userId };
}

function getBearerToken(req) {
  const value = req.headers.authorization || "";
  const match = value.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : "";
}

function sanitizeEntry(input) {
  const createdAt = safeIsoDate(input.createdAt);
  return {
    id: crypto.randomUUID(),
    name: String(input.name || "").trim().slice(0, 80),
    sets: Number(input.sets || 0),
    reps: Number(input.reps || 0),
    weight: Number(input.weight || 0),
    minutes: Number(input.minutes || 0),
    caloriesBurned: Number(input.caloriesBurned || 0),
    distanceKm: Number(input.distanceKm || 0),
    steps: Number(input.steps || 0),
    source: String(input.source || "manual").trim().slice(0, 60),
    notes: String(input.notes || "").trim().slice(0, 500),
    createdAt,
  };
}

function safeIsoDate(value) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function getLocalNetworkUrls(port) {
  const os = require("os");
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((item) => item && item.family === "IPv4" && !item.internal)
    .map((item) => `http://${item.address}:${port}/`);
}

function sanitizeFood(input) {
  return {
    id: crypto.randomUUID(),
    name: String(input.name || "").trim().slice(0, 100),
    meal: String(input.meal || "meal").trim().slice(0, 40),
    calories: Number(input.calories || 0),
    protein: Number(input.protein || 0),
    carbs: Number(input.carbs || 0),
    fat: Number(input.fat || 0),
    notes: String(input.notes || "").trim().slice(0, 500),
    photos: sanitizeFoodPhotos(input.photos),
    createdAt: new Date().toISOString(),
  };
}

function sanitizeFoodPhotos(photos) {
  if (!Array.isArray(photos)) return [];
  return photos.slice(0, 3).map((photo) => ({
    name: String(photo.name || "food-photo").slice(0, 120),
    dataUrl: String(photo.dataUrl || "").startsWith("data:image/") ? String(photo.dataUrl).slice(0, 750000) : "",
  })).filter((photo) => photo.dataUrl);
}

async function estimateFoodWithVision(input) {
  const photos = sanitizeFoodPhotos(input.photos);
  if (!photos.length) throw new Error("At least one food photo is required");

  const prompt = [
    "You are estimating nutrition from food photos for a fitness tracking app.",
    "Return only valid JSON with these keys: name, meal, calories, protein, carbs, fat, confidence, reason.",
    "Values must be practical estimates for the whole meal shown across all images.",
    "protein, carbs, fat are grams. calories is kcal. confidence is 0-100.",
    `Meal type: ${input.meal || "unknown"}.`,
    `User text: ${input.name || ""}. Notes: ${input.notes || ""}.`,
  ].join("\n");

  const content = [
    { type: "text", text: prompt },
    ...photos.map((photo) => ({ type: "image_url", image_url: { url: photo.dataUrl } })),
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_VISION_MODEL,
      messages: [{ role: "user", content }],
      response_format: { type: "json_object" },
      temperature: 0.2,
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error?.message || "Vision estimate failed");
  }

  const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}");
  return {
    name: String(parsed.name || input.name || "Scanned meal").slice(0, 100),
    meal: String(parsed.meal || input.meal || "meal").slice(0, 40),
    calories: Number(parsed.calories || 0),
    protein: Number(parsed.protein || 0),
    carbs: Number(parsed.carbs || 0),
    fat: Number(parsed.fat || 0),
    confidence: Math.max(0, Math.min(100, Number(parsed.confidence || 70))),
    reason: String(parsed.reason || "Estimated from food photos").slice(0, 240),
    source: "vision",
  };
}

function normalizeUserId(value) {
  return String(value || "").trim().toLowerCase();
}

function findUserIdForLogin(store, loginId) {
  const normalized = normalizeUserId(loginId);
  if (store.users[normalized]) return normalized;
  const match = Object.entries(store.users || {}).find(([, user]) => {
    return normalizeUserId(user.email) === normalized || normalizeUserId(user.username) === normalized;
  });
  return match ? match[0] : "";
}

function defaultProfile() {
  return {
    displayName: "",
    gender: "",
    age: 0,
    heightCm: 0,
    goal: "health",
    bodyWeight: 70,
    targetWeight: 0,
    activityLevel: "moderate",
    weeklyTarget: 150,
    onboardingComplete: false,
    privacy: defaultPrivacy(),
    health: defaultHealth(),
  };
}

function defaultHealth() {
  return { provider: "", connectedAt: "", status: "disconnected" };
}

function defaultPrivacy() {
  return {
    analytics: false,
    marketing: false,
    shareForCoaching: false,
  };
}

function sanitizePrivacy(input) {
  return {
    analytics: Boolean(input.analytics),
    marketing: Boolean(input.marketing),
    shareForCoaching: Boolean(input.shareForCoaching),
  };
}

function sanitizeProfile(input, existing = defaultProfile()) {
  return {
    ...existing,
    displayName: String(input.displayName ?? existing.displayName ?? "").trim().slice(0, 120),
    gender: sanitizeEnum(input.gender, ["", "female", "male", "non_binary", "self_describe"], existing.gender || ""),
    age: clampNumber(input.age, 0, 13, 120),
    heightCm: clampNumber(input.heightCm, existing.heightCm || 0, 80, 250),
    goal: sanitizeEnum(input.goal, ["fat_loss", "muscle_gain", "endurance", "health"], existing.goal || "health"),
    bodyWeight: clampNumber(input.bodyWeight ?? input.currentWeight, existing.bodyWeight || 70, 20, 350),
    targetWeight: clampNumber(input.targetWeight, existing.targetWeight || 0, 0, 350),
    activityLevel: sanitizeEnum(input.activityLevel, ["sedentary", "light", "moderate", "active", "athlete"], existing.activityLevel || "moderate"),
    weeklyTarget: clampNumber(input.weeklyTarget, existing.weeklyTarget || 150, 1, 10000),
    onboardingComplete: Boolean(input.onboardingComplete),
    privacy: input.privacy ? sanitizePrivacy(input.privacy) : existing.privacy || defaultPrivacy(),
    health: sanitizeHealth(input.health || existing.health || {}),
  };
}

function sanitizeEnum(value, allowed, fallback) {
  const text = String(value ?? fallback ?? "");
  return allowed.includes(text) ? text : fallback;
}

function clampNumber(value, fallback, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number) || number === 0 && min > 0) return fallback;
  return Math.max(min, Math.min(max, number));
}

function sanitizeHealth(input) {
  const allowedProviders = new Set(["", "apple_health", "google_fit", "health_connect"]);
  const provider = allowedProviders.has(input.provider) ? input.provider : "";
  return {
    provider,
    connectedAt: String(input.connectedAt || "").slice(0, 40),
    status: provider ? "connected" : "disconnected",
  };
}

function defaultClient(store, userId, seed = {}) {
  return {
    clientId: generateClientId(store),
    userId,
    name: String(seed.name || "").slice(0, 120),
    email: normalizeUserId(seed.email || ""),
    phone: String(seed.phone || "").slice(0, 40),
    birthday: String(seed.birthday || "").slice(0, 20),
    note: String(seed.note || "").slice(0, 500),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function ensureClient(store, userId) {
  store.clients = store.clients || {};
  if (!store.clients[userId]) {
    store.clients[userId] = defaultClient(store, userId, {
      email: store.users[userId]?.email || (userId.includes("@") ? userId : ""),
      name: store.users[userId]?.name || "",
    });
    writeStore(store);
  }
  return store.clients[userId];
}

function sanitizeClient(input, existing) {
  return {
    ...existing,
    name: String(input.name || "").trim().slice(0, 120),
    email: normalizeUserId(input.email || ""),
    phone: String(input.phone || "").trim().slice(0, 40),
    birthday: String(input.birthday || "").trim().slice(0, 20),
    note: String(input.note || "").trim().slice(0, 500),
    updatedAt: new Date().toISOString(),
  };
}

function generateClientId(store) {
  const existing = new Set(Object.values(store.clients || {}).map((client) => client.clientId));
  let id = "";
  do {
    id = `KHD-${new Date().getFullYear()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  } while (existing.has(id));
  return id;
}

function sanitizeUserForExport(user) {
  if (!user) return null;
  return {
    id: user.id,
    username: user.username || user.id,
    email: user.email || "",
    name: user.name || "",
    displayName: user.displayName || user.name || "",
    authProvider: user.authProvider || "password",
    createdAt: user.createdAt || "",
  };
}

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

function servePublicFile(res, staticPath) {
  const publicDir = path.join(__dirname, "public");
  const absolutePath = path.normalize(path.join(publicDir, staticPath));

  if (!absolutePath.startsWith(publicDir)) {
    return sendJson(res, 403, { ok: false, error: "Forbidden" });
  }

  fs.readFile(absolutePath, (error, data) => {
    if (error) return sendJson(res, 404, { ok: false, error: "File not found" });
    res.writeHead(200, { "Content-Type": getContentType(absolutePath) });
    res.end(data);
  });
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".webmanifest": "application/manifest+json; charset=utf-8",
  };
  return contentTypes[ext] || "application/octet-stream";
}

function applySecurityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; form-action 'self' https://accounts.google.com https://www.facebook.com https://appleid.apple.com; frame-ancestors 'none'"
  );
}

function privacyPolicyHtml() {
  return policyPageHtml(
    "Privacy Policy",
    `<p>Khayubdi stores account, profile, and exercise log data only for providing the tracking experience.</p>
     <h2>Data collected</h2>
     <p>Account identifier, login provider, profile settings, workout entries, and privacy preferences.</p>
     <h2>Controls</h2>
     <p>You can export your data or delete your account from the Privacy tab.</p>
     <h2>Social login</h2>
     <p>Google, Apple, and Facebook login use OAuth. The app stores only the provider id, email when provided, and display name when provided.</p>
     <h2>Security</h2>
     <p>Password accounts use salted PBKDF2 password hashes. Sessions expire automatically.</p>`
  );
}

function termsHtml() {
  return policyPageHtml(
    "Terms",
    `<p>Khayubdi is an exercise tracking tool. It does not provide medical diagnosis or emergency support.</p>
     <h2>Use safely</h2>
     <p>Stop exercising and seek professional advice if you feel pain, dizziness, or other concerning symptoms.</p>
     <h2>Your account</h2>
     <p>You are responsible for keeping your login credentials private.</p>
     <h2>Data deletion</h2>
     <p>You can delete your account from the Privacy tab. This removes stored account, profile, and exercise log data from this app backend.</p>`
  );
}

function policyPageHtml(title, body) {
  return `<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title} - Khayubdi</title><style>body{font-family:Arial,sans-serif;background:#f3f6f4;color:#13201d;line-height:1.6;margin:0}.page{max-width:760px;margin:0 auto;padding:28px 18px}a{color:#115e59}h1,h2{line-height:1.15}</style></head><body><main class="page"><p><a href="/">Back to app</a></p><h1>${title}</h1>${body}</main></body></html>`;
}

function phoneSetupHtml(req) {
  const localUrl = `http://localhost:${PORT}/`;
  const networkUrls = getLocalNetworkUrls(PORT);
  const requestedUrl = `http://${req.headers.host}/`;
  const urls = [...new Set([requestedUrl, localUrl, ...networkUrls])];
  const urlCards = urls.map((url) => `
    <article class="url-card">
      <strong>${escapeHtml(url)}</strong>
      <a href="${escapeHtml(url)}">Open</a>
    </article>
  `).join("");

  return `<!doctype html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Open Khayubdi on Phone</title>
  <style>
    :root{color-scheme:dark;--bg:#050806;--surface:#0d1711;--line:rgba(41,242,124,.26);--ink:#eefaf1;--muted:#9bb5a3;--primary:#29f27c;--accent:#b8ff3d}
    *{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;background:radial-gradient(circle at 20% 0,rgba(41,242,124,.13),transparent 30%),var(--bg);color:var(--ink);line-height:1.55}
    main{width:min(720px,100%);margin:0 auto;padding:28px 16px 40px}h1{margin:0 0 8px;font-size:32px;line-height:1.1}p{color:var(--muted)}.eyebrow{color:var(--accent);font-weight:900;margin:0 0 6px}
    .panel,.url-card{border:1px solid var(--line);border-radius:8px;background:linear-gradient(145deg,rgba(41,242,124,.08),transparent 42%),var(--surface);box-shadow:0 16px 40px rgba(0,0,0,.24)}
    .panel{padding:18px;margin-top:16px}.url-list{display:grid;gap:10px;margin-top:14px}.url-card{display:flex;gap:12px;align-items:center;justify-content:space-between;padding:14px;overflow-wrap:anywhere}
    strong{color:var(--primary)}a,button{border:0;border-radius:8px;background:linear-gradient(180deg,var(--accent),var(--primary));color:#041006;font-weight:900;text-decoration:none;padding:10px 14px;white-space:nowrap}
    ol{padding-left:22px;color:var(--ink)}li{margin:8px 0}.note{border-left:3px solid var(--primary);padding-left:12px}.muted{font-size:14px;color:var(--muted)}
  </style>
</head>
<body>
  <main>
    <p class="eyebrow">ขยับดิ</p>
    <h1>Open the app on your phone</h1>
    <p>Keep this computer running. Your phone must use the same Wi-Fi network.</p>
    <section class="panel">
      <h2>Phone URLs</h2>
      <div class="url-list">${urlCards}</div>
      <p class="muted">On your phone, open Safari or Chrome and type the URL that starts with 192.168.</p>
    </section>
    <section class="panel">
      <h2>Steps</h2>
      <ol>
        <li>Double-click <strong>START_PHONE_APP.bat</strong> and keep the window open.</li>
        <li>Connect the phone to the same Wi-Fi as this computer.</li>
        <li>Open the Phone URL above on Safari or Chrome.</li>
        <li>If it does not load, allow Node.js through Windows Firewall on Private networks.</li>
      </ol>
      <p class="note">To open from 4G/5G outside this Wi-Fi, the app needs public HTTPS hosting.</p>
    </section>
  </main>
</body>
</html>`;
}

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function sendHtml(res, status, html) {
  res.writeHead(status, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
}

function redirect(res, location) {
  res.writeHead(302, { Location: location });
  res.end();
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function readJson(req) {
  const rawBody = await readRawBody(req);
  if (!rawBody.length) return {};
  return JSON.parse(rawBody.toString("utf8"));
}

function loadEnv() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function hasRealLineCredential(value) {
  return Boolean(value && !value.startsWith("put_your_"));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

module.exports = { buildAssistantReply, createServer };
