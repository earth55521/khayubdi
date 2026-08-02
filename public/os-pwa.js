/* KHAYUBDI OS 2.0 Service Worker Client API */

const KhayubdiPWA = (() => {
  const LEADER_KEY = "khayubdi_pwa_update_leader_v1";
  const LEADER_TTL_MS = 45_000;
  const DIAGNOSTIC_TTL_MS = 30_000;
  const channel = "BroadcastChannel" in window ? new BroadcastChannel("khayubdi-pwa") : null;
  const seenDiagnostics = new Map();
  let registration = null;
  let updateWorker = null;
  let registering = false;
  let listenersBound = false;
  let reloadRequested = false;
  let updateAvailable = false;
  let updatePromptScheduled = false;
  let lastStatus = {
    supported: "serviceWorker" in navigator,
    registered: false,
    updateAvailable: false,
    waiting: false,
    deferred: false,
    version: "70",
  };

  async function register() {
    if (!("serviceWorker" in navigator)) {
      lastStatus = { ...lastStatus, supported: false };
      logDiagnostic("sw_registration_failed", { code: "unsupported" });
      return { ok: false, code: "unsupported", message: "Service worker is not supported." };
    }
    if (registration || registering) return { ok: true, registration, status: getStatus() };
    registering = true;
    bindListeners();
    try {
      registration = await navigator.serviceWorker.register("/service-worker.js", { scope: "/" });
      lastStatus = { ...lastStatus, registered: true };
      bindRegistration(registration);
      if (registration.waiting) notifyUpdateAvailable(registration.waiting);
      return { ok: true, registration, status: getStatus() };
    } catch (error) {
      logDiagnostic("sw_registration_failed", { code: "register_failed" }, error);
      return { ok: false, code: "register_failed", message: "PWA setup failed. The app still works in the browser." };
    } finally {
      registering = false;
    }
  }

  async function checkForUpdate() {
    if (!registration) await register();
    if (!registration?.update) return { ok: false, code: "not_registered" };
    try {
      await registration.update();
      return { ok: true, status: getStatus() };
    } catch (error) {
      logDiagnostic("sw_registration_failed", { code: "update_check_failed" }, error);
      return { ok: false, code: "update_check_failed" };
    }
  }

  async function applyUpdate(options = {}) {
    if (!registration) await register();
    const active = activeSessionStatus();
    if ((active.hasActiveSession || active.unsavedStorage) && !options.force) {
      lastStatus = { ...lastStatus, deferred: true };
      logDiagnostic("sw_update_deferred", { reason: active.reason });
      broadcast("update_deferred", { reason: active.reason });
      toast(active.unsavedStorage ? "Update available after current progress is safely saved." : "Update available after activity.");
      return { ok: false, code: "active_session_deferred", deferred: true };
    }
    const worker = registration?.waiting || updateWorker;
    if (!worker) {
      await checkForUpdate();
      return { ok: false, code: "no_waiting_worker" };
    }
    reloadRequested = true;
    logDiagnostic("sw_update_applied", { version: "70" });
    broadcast("update_applied", { version: "70" });
    worker.postMessage({ type: "SKIP_WAITING" });
    return { ok: true, applying: true };
  }

  function getStatus() {
    return {
      ...lastStatus,
      registered: Boolean(registration) || lastStatus.registered,
      updateAvailable,
      waiting: Boolean(registration?.waiting || updateWorker),
      controller: Boolean(navigator.serviceWorker?.controller),
      activeSession: activeSessionStatus(),
    };
  }

  function bindRegistration(swRegistration) {
    if (swRegistration.__khayubdiBound) return;
    swRegistration.__khayubdiBound = true;
    swRegistration.addEventListener("updatefound", () => {
      const worker = swRegistration.installing;
      if (!worker || worker.__khayubdiBound) return;
      worker.__khayubdiBound = true;
      worker.addEventListener("statechange", () => {
        if (worker.state === "installed" && navigator.serviceWorker.controller) notifyUpdateAvailable(worker);
      });
    });
  }

  function bindListeners() {
    if (listenersBound) return;
    listenersBound = true;
    navigator.serviceWorker.addEventListener("message", onServiceWorkerMessage);
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!reloadRequested) return;
      const active = activeSessionStatus();
      if (active.hasActiveSession || active.unsavedStorage) {
        reloadRequested = false;
        lastStatus = { ...lastStatus, deferred: true };
        logDiagnostic("sw_update_deferred", { reason: active.reason || "controllerchange_active_session" });
        return;
      }
      window.location.reload();
    });
    window.addEventListener("storage", (event) => {
      if (event.key === LEADER_KEY && updateAvailable) lastStatus = { ...lastStatus, updateAvailable: true };
    });
    channel?.addEventListener("message", (event) => {
      if (event.data?.type === "update_available") lastStatus = { ...lastStatus, updateAvailable: true };
      if (event.data?.type === "update_deferred") lastStatus = { ...lastStatus, deferred: true };
    });
  }

  function onServiceWorkerMessage(event) {
    if (event.data?.type === "KHAYUBDI_SW_DIAGNOSTIC") {
      logDiagnostic(event.data.name, event.data.payload || {});
      if (event.data.name === "sw_critical_shell_failed") toast("Offline shell update needs attention. Current version remains available.");
      return;
    }
    if (event.data?.type === "SW_STATUS") {
      lastStatus = { ...lastStatus, ...(event.data.payload || {}) };
    }
  }

  function notifyUpdateAvailable(worker) {
    updateWorker = worker;
    updateAvailable = true;
    lastStatus = { ...lastStatus, updateAvailable: true, waiting: true };
    logDiagnostic("sw_update_available", { version: "70" });
    broadcast("update_available", { version: "70" });
    if (!claimUpdateLeader()) return;
    const active = activeSessionStatus();
    if (active.hasActiveSession || active.unsavedStorage) {
      lastStatus = { ...lastStatus, deferred: true };
      logDiagnostic("sw_update_deferred", { reason: active.reason });
      toast(active.unsavedStorage ? "Update available after current progress is safely saved." : "Update available after activity.");
      return;
    }
    confirmUpdate();
  }

  function confirmUpdate() {
    const dialog = window.KhayubdiRelease?.confirmAction;
    if (typeof dialog === "function") {
      updatePromptScheduled = false;
      dialog({
        title: "Update available",
        description: "A safer offline version is ready. Update now, or keep using the current version.",
        actionLabel: "Update now",
        cancelLabel: "Update later",
        tone: "primary",
        onConfirm: () => applyUpdate(),
      });
      return;
    }
    if (!updatePromptScheduled) {
      updatePromptScheduled = true;
      window.setTimeout(() => {
        if (updateAvailable) confirmUpdate();
      }, 1000);
    }
    toast("Update available. It will apply when safe.");
  }

  function activeSessionStatus() {
    let state = {};
    try { state = window.KhayubdiData?.read?.() || {}; } catch {}
    if (state.activeWorkout) return { hasActiveSession: true, reason: "active_workout" };
    if (state.activeOutdoorActivity) return { hasActiveSession: true, reason: "active_outdoor_activity" };
    if (state.storage?.lastWriteStatus && state.storage.lastWriteStatus !== "ok") return { hasActiveSession: false, unsavedStorage: true, reason: "unsaved_storage_warning" };
    return { hasActiveSession: false, unsavedStorage: false, reason: "safe" };
  }

  function claimUpdateLeader() {
    try {
      const now = Date.now();
      const current = JSON.parse(localStorage.getItem(LEADER_KEY) || "null");
      if (current?.timestamp && now - current.timestamp < LEADER_TTL_MS) return false;
      localStorage.setItem(LEADER_KEY, JSON.stringify({ id: `${now}-${Math.random().toString(36).slice(2)}`, timestamp: now }));
      return true;
    } catch {
      return true;
    }
  }

  function broadcast(type, payload = {}) {
    try { channel?.postMessage({ type, payload }); } catch {}
  }

  function logDiagnostic(name, payload = {}, error) {
    if (!name || repeated(name, payload)) return;
    const safePayload = sanitizePayload({ ...payload, detail: devMode() ? String(error?.message || "") : "" });
    if (window.KhayubdiData?.update) {
      const result = window.KhayubdiData.update((state) => {
        state.eventLog = [{ id: `event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name, payload: safePayload, timestamp: new Date().toISOString() }, ...(state.eventLog || [])].slice(0, 200);
      });
      if (!result?.ok && devMode()) console.warn("Khayubdi PWA diagnostic not persisted", name);
    } else if (devMode()) {
      console.warn("Khayubdi PWA diagnostic", name, safePayload);
    }
  }

  function repeated(name, payload) {
    const key = `${name}:${JSON.stringify(sanitizePayload(payload || {}))}`;
    const now = Date.now();
    const last = seenDiagnostics.get(key) || 0;
    seenDiagnostics.set(key, now);
    return now - last < DIAGNOSTIC_TTL_MS;
  }

  function sanitizePayload(payload) {
    const safe = {};
    Object.entries(payload || {}).forEach(([key, value]) => {
      if (/email|password|token|secret|hash|salt|note|raw|state/i.test(key)) return;
      if (typeof value === "string") safe[key] = value.slice(0, 160);
      else if (typeof value === "number" || typeof value === "boolean") safe[key] = value;
      else if (value == null) safe[key] = value;
    });
    return safe;
  }

  function toast(message) {
    if (!message) return;
    const releaseToast = window.KhayubdiRelease?.toast;
    if (typeof releaseToast === "function") return releaseToast(message);
    const host = document.querySelector("#appToast");
    if (!host) return;
    host.textContent = message;
    host.classList.remove("hidden");
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(() => host.classList.add("hidden"), 3000);
  }

  function devMode() {
    return new URLSearchParams(location.search).get("dev") === "1";
  }

  return { register, checkForUpdate, applyUpdate, getStatus };
})();

window.KhayubdiPWA = KhayubdiPWA;
