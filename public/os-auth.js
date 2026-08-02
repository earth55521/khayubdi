/* KHAYUBDI OS 2.0 Canonical Local Authentication and Bootstrap */

window.KHAYUBDI_OS_AUTH_CANONICAL = true;

const KhayubdiAuth = (() => {
  const LEGACY_KEYS = {
    users: "khayubdi_users",
    session: "khayubdi_session_user",
    token: "khayubdi_auth_token",
    remember: "khayubdi_remember_login",
    profileBase: "khayubdi_profile",
  };
  const SESSION_AGE = {
    remembered: 1000 * 60 * 60 * 24 * 30,
    standard: 1000 * 60 * 60 * 8,
  };
  const state = () => window.KhayubdiData.read();
  let booted = false;
  let submitting = false;

  function init() {
    migrateLegacyAuth();
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") validateSession({ showExpired: true });
    });
  }

  function bootstrap() {
    if (booted) return;
    booted = true;
    init();
    const current = state();
    showLegacySurface("splash");
    window.KhayubdiRelease?.showSplash?.(current);
    setTimeout(() => decideStartup(), prefersReducedMotion() ? 40 : 260);
  }

  function decideStartup() {
    migrateLegacyAuth();
    const current = state();
    if (current.activeWorkout) return renderAuthenticatedRoute({ tab: "track", view: "activeWorkout" }, "workout");
    if (current.activeOutdoorActivity) return renderAuthenticatedRoute({ tab: "outdoor", view: "outdoorLive" }, "outdoor");
    if (!current.onboardingComplete || !current.onboardingDraft?.completed) {
      showLegacySurface("auth");
      return window.KhayubdiRelease?.showOnboarding?.();
    }
    const session = getSession();
    if (!session) {
      showLegacySurface("auth");
      return showAuth("login", current.authSession ? "Session expired. Please log in again." : "");
    }
    return renderAuthenticatedRoute(current.route || { tab: "dashboard", view: "home" });
  }

  function renderAuthenticatedRoute(route, recoveryType = "") {
    showLegacySurface("app");
    if (recoveryType && window.KhayubdiRelease?.offerRecovery) {
      window.KhayubdiRelease.offerRecovery(recoveryType);
    } else {
      window.KhayubdiRelease?.closeOverlay?.();
    }
    const safe = safeRoute(route);
    window.KhayubdiOS?.routeTo?.(safe.tab, safe.view, safe.detailId || "");
  }

  function showAuth(mode = "login", message = "") {
    showLegacySurface("auth");
    window.KhayubdiRelease?.showAuth?.(mode, message);
    if (message) setTimeout(() => {
      const panel = document.querySelector("#osReleaseHost .os-release-panel");
      if (panel && !panel.querySelector("[data-auth-status]")) panel.insertAdjacentHTML("beforeend", `<p class="os-subtitle" role="status" data-auth-status>${escapeHtml(message)}</p>`);
    }, 0);
  }

  async function register(input = {}) {
    if (submitting) return { ok: false, message: "Please wait." };
    submitting = true;
    try {
      const name = String(input.name || "").trim();
      const email = normalizeEmail(input.email);
      const password = String(input.password || "");
      const confirm = String(input.confirm || "");
      const terms = Boolean(input.terms);
      if (!name || !email || !password) return fail("Complete all required fields.");
      if (password !== confirm) return fail("Passwords do not match.");
      if (!strongPassword(password)) return fail("Use at least 8 chars with letters and numbers.");
      if (!terms) return fail("Accept local MVP terms.");
      if (state().accounts.some((account) => normalizeEmail(account.email) === email)) return fail("A local account already exists for this email.");
      const credential = await hashPassword(password);
      const accountId = uid("account");
      const saveResult = window.KhayubdiData.update((draft) => {
        draft.accounts.push({
          id: accountId,
          name,
          email,
          passwordHash: credential.hash,
          salt: credential.salt,
          requiresPasswordSetup: false,
          createdAt: new Date().toISOString(),
        });
        draft.authSession = createSession(accountId, Boolean(input.remember ?? true));
        draft.profile.name = name;
        track(draft, "registration_completed");
        return draft;
      });
      if (!saveResult?.ok) return fail(saveResult?.message || "Local account was not safely saved.");
      clearSensitiveLegacySessionKeys();
      return { ok: true, accountId };
    } finally {
      submitting = false;
    }
  }

  async function login(input = {}) {
    if (submitting) return { ok: false, message: "Please wait." };
    submitting = true;
    try {
      const email = normalizeEmail(input.email);
      const password = String(input.password || "");
      const account = state().accounts.find((item) => normalizeEmail(item.email) === email);
      if (!account) return fail("No local account found.");
      if (account.requiresPasswordSetup || !account.passwordHash || !account.salt) return fail("This migrated local account needs a new password setup before password login.");
      const ok = await verifyPassword(password, account);
      if (!ok) return fail("Password did not match.");
      const saveResult = window.KhayubdiData.update((draft) => {
        draft.authSession = createSession(account.id, Boolean(input.remember));
        track(draft, "login_completed");
        return draft;
      });
      if (!saveResult?.ok) return fail(saveResult?.message || "Login could not be safely saved.");
      clearSensitiveLegacySessionKeys();
      return { ok: true, accountId: account.id };
    } finally {
      submitting = false;
    }
  }

  function logout() {
    const hadSession = Boolean(state().authSession);
    const result = window.KhayubdiData.update((draft) => {
      draft.authSession = null;
      if (hadSession) track(draft, "logout_completed");
      return draft;
    });
    if (!result?.ok) return result;
    clearSensitiveLegacySessionKeys();
    showLegacySurface("auth");
    showAuth("login");
  }

  function deleteAccount(options = {}) {
    const preserveFitnessData = options.preserveFitnessData !== false;
    const session = state().authSession;
    const result = window.KhayubdiData.update((draft) => {
      const accountId = session?.accountId;
      draft.accounts = accountId ? draft.accounts.filter((account) => account.id !== accountId) : draft.accounts;
      draft.authSession = null;
      if (!preserveFitnessData) {
        const fresh = window.KhayubdiData.defaults();
        Object.assign(draft, { ...fresh, accounts: [], authSession: null, onboardingComplete: false });
      }
      track(draft, "account_deleted", { preserveFitnessData });
      return draft;
    });
    if (!result?.ok) return result;
    removeLegacyAuthKeys();
    showLegacySurface("auth");
    decideStartup();
  }

  function getSession() {
    const current = state();
    const session = normalizeSession(current.authSession, current.accounts);
    if (!session) return null;
    if (Number(session.expiresAt || 0) <= Date.now()) {
      expireSession();
      return null;
    }
    return session;
  }

  function requireSession(options = {}) {
    const session = getSession();
    if (session) return session;
    if (!options.silent) showAuth("login", "Please log in to continue.");
    return null;
  }

  function validateSession(options = {}) {
    const before = state().authSession;
    const session = getSession();
    if (!session && before && options.showExpired) showAuth("login", "Session expired. Please log in again.");
    if (session) window.KhayubdiData.update((draft) => { if (draft.authSession) draft.authSession.lastValidatedAt = Date.now(); return draft; });
    return session;
  }

  function migrateLegacyAuth() {
    const current = state();
    if (current.authMigration?.legacyAuthMigrated) {
      normalizeCanonicalSession();
      return { migrated: false, disposition: current.authMigration.disposition || {} };
    }
    const legacy = readLegacy();
    const disposition = {
      [LEGACY_KEYS.users]: legacy.users ? "migrated/read-only compatibility" : "ignored: not present",
      [LEGACY_KEYS.session]: legacy.sessionUser ? "migrated/read-only compatibility" : "ignored: not present",
      [LEGACY_KEYS.token]: legacy.token ? "read-only compatibility; not trusted alone" : "ignored: not present",
      [LEGACY_KEYS.remember]: legacy.remember !== null ? "migrated/read-only compatibility" : "ignored: not present",
      [`${LEGACY_KEYS.profileBase}_<legacyUserId>`]: "migrated when matching signed-in user profile exists",
    };
    const result = window.KhayubdiData.update((draft) => {
      const foundAccount = legacyToAccount(legacy, draft.accounts);
      if (foundAccount.account && !draft.accounts.some((account) => account.id === foundAccount.account.id)) draft.accounts.push(foundAccount.account);
      if (legacy.credibleSignedIn && foundAccount.account) draft.authSession = createSession(foundAccount.account.id, legacy.remember === "true");
      if (legacy.profile?.onboardingComplete || legacy.profile?.displayName || legacy.profile?.name) {
        draft.onboardingComplete = Boolean(legacy.profile.onboardingComplete || draft.onboardingComplete);
        draft.onboardingDraft = { ...draft.onboardingDraft, completed: draft.onboardingComplete || draft.onboardingDraft?.completed, step: draft.onboardingComplete ? 4 : draft.onboardingDraft?.step || 0 };
        draft.profile.name = legacy.profile.displayName || legacy.profile.name || foundAccount.account?.name || draft.profile.name;
      }
      draft.authMigration = {
        legacyAuthMigrated: true,
        migratedAt: new Date().toISOString(),
        migratedKeys: Object.keys(disposition),
        disposition,
      };
      if (foundAccount.account || legacy.credibleSignedIn) track(draft, "legacy_auth_migrated");
      return draft;
    });
    sanitizeLegacyUserStore();
    normalizeCanonicalSession();
    return { migrated: Boolean(result?.ok), disposition };
  }

  function readLegacy() {
    const users = parseStorage(localStorage.getItem(LEGACY_KEYS.users));
    const sessionUser = localStorage.getItem(LEGACY_KEYS.session) || sessionStorage.getItem(LEGACY_KEYS.session) || "";
    const token = localStorage.getItem(LEGACY_KEYS.token) || sessionStorage.getItem(LEGACY_KEYS.token) || "";
    const remember = localStorage.getItem(LEGACY_KEYS.remember);
    const profile = sessionUser ? parseStorage(localStorage.getItem(`${LEGACY_KEYS.profileBase}_${sessionUser}`)) : null;
    return { users, sessionUser, token, remember, profile, credibleSignedIn: Boolean(sessionUser && (token || users?.[sessionUser] || profile)) };
  }

  function legacyToAccount(legacy, existingAccounts) {
    if (!legacy.sessionUser && !legacy.profile) return { account: null };
    const legacyUser = legacy.users?.[legacy.sessionUser] || {};
    const email = normalizeEmail(legacyUser.email || legacy.profile?.email || `${legacy.sessionUser}@local.khayubdi`);
    const existing = existingAccounts.find((account) => normalizeEmail(account.email) === email || account.legacyUserId === legacy.sessionUser);
    if (existing) return { account: existing };
    const name = legacy.profile?.displayName || legacy.profile?.name || legacyUser.displayName || legacyUser.username || legacy.sessionUser || "Khayubdi Athlete";
    return {
      account: {
        id: uid("legacy-account"),
        name,
        email,
        passwordHash: "",
        salt: "",
        requiresPasswordSetup: true,
        legacyUserId: legacy.sessionUser || "",
        createdAt: legacyUser.createdAt || new Date().toISOString(),
        migratedAt: new Date().toISOString(),
      },
    };
  }

  function normalizeCanonicalSession() {
    const current = state();
    const normalized = normalizeSession(current.authSession, current.accounts);
    if (current.authSession && (!normalized || JSON.stringify(current.authSession) !== JSON.stringify(normalized))) {
      window.KhayubdiData.update((draft) => { draft.authSession = normalized; return draft; });
    }
  }

  function normalizeSession(session, accounts) {
    if (!session || typeof session !== "object") return null;
    let accountId = session.accountId || "";
    if (!accountId && session.email) accountId = accounts.find((account) => normalizeEmail(account.email) === normalizeEmail(session.email))?.id || "";
    if (!accountId || !accounts.some((account) => account.id === accountId)) return null;
    return {
      accountId,
      createdAt: Number(session.createdAt || Date.now()),
      expiresAt: Number(session.expiresAt || 0),
      rememberMe: Boolean(session.rememberMe ?? session.remember),
      lastValidatedAt: Date.now(),
    };
  }

  function expireSession() {
    window.KhayubdiData.update((draft) => {
      draft.authSession = null;
      track(draft, "session_expired");
      return draft;
    });
    clearSensitiveLegacySessionKeys();
  }

  function createSession(accountId, rememberMe) {
    const now = Date.now();
    return { accountId, createdAt: now, expiresAt: now + (rememberMe ? SESSION_AGE.remembered : SESSION_AGE.standard), rememberMe, lastValidatedAt: now };
  }

  async function hashPassword(password, salt = uid("salt")) {
    if (window.crypto?.subtle && window.TextEncoder) {
      const data = new TextEncoder().encode(`${salt}:${password}`);
      const digest = await window.crypto.subtle.digest("SHA-256", data);
      return { salt, hash: Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("") };
    }
    let hash = 2166136261;
    for (const char of `${salt}:${password}`) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
    return { salt, hash: `fallback-${(hash >>> 0).toString(16)}` };
  }

  async function verifyPassword(password, account) {
    const hashed = await hashPassword(password, account.salt);
    return hashed.hash === account.passwordHash;
  }

  function track(draft, name, payload = {}) {
    if (draft.analyticsPreference?.enabled === false) return;
    const safePayload = Object.fromEntries(Object.entries(payload || {}).filter(([key]) => !/password|email|token|secret|hash|salt/i.test(key)));
    const last = draft.analyticsQueue?.[0];
    if (last && last.name === name && Date.now() - new Date(last.timestamp).getTime() < 1000) return;
    draft.analyticsQueue = [{ id: uid("analytics"), name, payload: safePayload, timestamp: new Date().toISOString() }, ...(draft.analyticsQueue || [])].slice(0, 200);
  }

  function safeRoute(route) {
    const tabs = ["dashboard", "track", "outdoor", "progress", "profile"];
    const next = route && tabs.includes(route.tab) ? route : { tab: "dashboard", view: "home", detailId: "" };
    return { tab: next.tab, view: next.view || "home", detailId: next.detailId || "" };
  }

  function showLegacySurface(surface) {
    const splash = document.getElementById("splashShell");
    const auth = document.getElementById("authShell");
    const onboard = document.getElementById("onboardingShell");
    const app = document.getElementById("appShell");
    splash?.classList.add("hidden");
    auth?.classList.add("hidden");
    onboard?.classList.add("hidden");
    if (surface === "app") app?.classList.remove("hidden");
    else app?.classList.add("hidden");
  }

  function clearSensitiveLegacySessionKeys() {
    [localStorage, sessionStorage].forEach((storage) => {
      storage.removeItem(LEGACY_KEYS.session);
      storage.removeItem(LEGACY_KEYS.token);
    });
  }

  function removeLegacyAuthKeys() {
    clearSensitiveLegacySessionKeys();
    localStorage.removeItem(LEGACY_KEYS.remember);
  }

  function parseStorage(raw) {
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  function sanitizeLegacyUserStore() {
    const users = parseStorage(localStorage.getItem(LEGACY_KEYS.users));
    if (!users || typeof users !== "object" || Array.isArray(users)) return;
    let changed = false;
    const safeUsers = Object.fromEntries(Object.entries(users).map(([id, user]) => {
      const safeUser = user && typeof user === "object" && !Array.isArray(user) ? { ...user } : {};
      ["password", "plaintextPassword", "confirmPassword"].forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(safeUser, key)) {
          delete safeUser[key];
          changed = true;
        }
      });
      return [id, safeUser];
    }));
    if (changed) localStorage.setItem(LEGACY_KEYS.users, JSON.stringify(safeUsers));
  }

  function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char]));
  }

  function strongPassword(password) {
    return String(password || "").length >= 8 && /[a-z]/i.test(password) && /\d/.test(password);
  }

  function fail(message) {
    return { ok: false, message };
  }

  function prefersReducedMotion() {
    return state().settings?.reducedMotion || matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function uid(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  return {
    isCanonical: true,
    init,
    bootstrap,
    decideStartup,
    register,
    login,
    logout,
    deleteAccount,
    getSession,
    requireSession,
    validateSession,
    migrateLegacyAuth,
    showAuth,
  };
})();

window.KhayubdiAuth = KhayubdiAuth;
