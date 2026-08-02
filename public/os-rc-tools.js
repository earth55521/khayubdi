/* KHAYUBDI OS 2.0 ? RC2 local release tooling */

const KhayubdiRCTools = (() => {
  const CRASH_KEY = "khayubdi_rc_crash_log_v1";
  const PERF_KEY = "khayubdi_rc_performance_log_v1";
  const FEEDBACK_KEY = "khayubdi_rc_feedback_v1";
  const MAX_ITEMS = 80;
  const BUILD = Object.freeze({
    app: "KHAYUBDI OS 2.0",
    release: "Closed Beta RC2",
    version: "1.0.0-rc2",
    build: 70,
    cache: "khayubdi-exercise-v70",
    schema: 3,
    storageKey: "khayubdi_os2_state_v1",
  });

  const $ = (selector, root = document) => root.querySelector(selector);
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[m]));
  const devMode = () => new URLSearchParams(location.search).get("dev") === "1";

  let perfStart = performance.now();

  function init() {
    bindCrashLogging();
    markPerformance("rc_tools_loaded");
    if (devMode()) mountDevTools();
  }

  function bindCrashLogging() {
    if (document.documentElement.dataset.rcCrashBound) return;
    document.documentElement.dataset.rcCrashBound = "true";
    window.addEventListener("error", (event) => {
      logCrash({
        type: "error",
        message: event.message,
        source: safeSource(event.filename),
        line: event.lineno,
        column: event.colno,
      });
    });
    window.addEventListener("unhandledrejection", (event) => {
      logCrash({
        type: "unhandledrejection",
        message: event.reason?.message || String(event.reason || "Unhandled rejection"),
      });
    });
  }

  function logCrash(entry) {
    safeWriteList(CRASH_KEY, {
      ...entry,
      timestamp: new Date().toISOString(),
      route: location.hash || "",
      online: navigator.onLine,
      userAgent: navigator.userAgent,
    });
  }

  function markPerformance(name, detail = {}) {
    const now = performance.now();
    const item = {
      name,
      detail,
      deltaMs: Math.round(now - perfStart),
      timestamp: new Date().toISOString(),
      memory: performance.memory ? {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
      } : null,
    };
    perfStart = now;
    if (devMode()) safeWriteList(PERF_KEY, item);
    return item;
  }

  function mountDevTools() {
    if ($("#rcTools")) return;
    document.body.insertAdjacentHTML("beforeend", `
      <aside class="rc-tools" id="rcTools" aria-label="Release diagnostics tools">
        <button class="rc-tools__toggle" type="button" data-rc-toggle>RC Tools</button>
        <section class="rc-tools__panel" aria-label="Release tools panel">
          <strong>${BUILD.release} ? Build ${BUILD.build}</strong>
          <div class="rc-tools__grid">
            <button type="button" data-rc-view="build">Build</button>
            <button type="button" data-rc-view="storage">Storage</button>
            <button type="button" data-rc-view="state">State</button>
            <button type="button" data-rc-view="events">Events</button>
            <button type="button" data-rc-view="crashes">Crashes</button>
            <button type="button" data-rc-view="performance">Performance</button>
            <button type="button" data-rc-feedback>Feedback</button>
            <button type="button" data-rc-export>Export diagnostics</button>
          </div>
          <div class="rc-tools__pre" id="rcToolsOutput" role="status" aria-live="polite">Select a diagnostic view.</div>
        </section>
      </aside>
    `);
    document.addEventListener("click", onDevClick);
    markPerformance("dev_tools_mounted");
  }

  function onDevClick(event) {
    const toggle = event.target.closest("[data-rc-toggle]");
    if (toggle) return $("#rcTools")?.classList.toggle("is-open");
    const view = event.target.closest("[data-rc-view]");
    if (view) return renderView(view.dataset.rcView);
    if (event.target.closest("[data-rc-export]")) return exportDiagnostics();
    if (event.target.closest("[data-rc-feedback]")) return openFeedbackDialog();
    if (event.target.closest("[data-rc-feedback-save]")) return saveFeedback();
    if (event.target.closest("[data-rc-feedback-close]")) return closeFeedbackDialog();
  }

  function renderView(view) {
    markPerformance(`view_${view}`);
    const out = $("#rcToolsOutput");
    if (!out) return;
    const current = safeState();
    const views = {
      build: () => ({ ...BUILD, serviceWorker: Boolean(navigator.serviceWorker), standalone: isStandalone(), online: navigator.onLine }),
      storage: storageSummary,
      state: () => sanitizeState(current),
      events: () => current.eventLog || [],
      crashes: () => readList(CRASH_KEY),
      performance: () => readList(PERF_KEY),
    };
    out.textContent = JSON.stringify((views[view] || views.build)(), null, 2);
  }

  function openFeedbackDialog() {
    const host = ensureDialogHost();
    host.innerHTML = `
      <section class="os-dialog" aria-labelledby="rcFeedbackTitle">
        <h2 class="os-section__title" id="rcFeedbackTitle">Feedback dialog</h2>
        <div class="rc-feedback">
          <label>Category<select id="rcFeedbackCategory"><option>Bug</option><option>UX</option><option>Performance</option><option>Accessibility</option><option>Other</option></select></label>
          <label>Message<textarea id="rcFeedbackMessage" rows="5" placeholder="Describe what happened"></textarea></label>
          <label>Optional email<input id="rcFeedbackEmail" type="email" autocomplete="email"></label>
        </div>
        <div class="os-actions"><button class="os-button os-button--ghost" data-rc-feedback-close>Close</button><button class="os-button os-button--primary" data-rc-feedback-save>Save locally</button></div>
      </section>`;
    host.classList.add("is-open");
    $("#rcFeedbackMessage")?.focus();
  }

  function closeFeedbackDialog() {
    const host = $("#osDialogHost");
    if (!host) return;
    host.classList.remove("is-open");
    host.innerHTML = "";
  }

  function saveFeedback() {
    safeWriteList(FEEDBACK_KEY, {
      category: $("#rcFeedbackCategory")?.value || "Other",
      message: $("#rcFeedbackMessage")?.value || "",
      emailProvided: Boolean($("#rcFeedbackEmail")?.value),
      timestamp: new Date().toISOString(),
      build: BUILD.build,
    });
    closeFeedbackDialog();
    toast("Feedback saved locally.");
  }

  function exportDiagnostics() {
    markPerformance("diagnostics_exported");
    const payload = diagnosticsPayload();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `khayubdi-diagnostics-build-${BUILD.build}.json`;
    link.rel = "noopener";
    link.click();
    URL.revokeObjectURL(url);
  }

  function diagnosticsPayload() {
    return {
      build: BUILD,
      exportedAt: new Date().toISOString(),
      platform: navigator.platform,
      userAgent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      viewport: { width: innerWidth, height: innerHeight, devicePixelRatio },
      online: navigator.onLine,
      standalone: isStandalone(),
      storage: storageSummary(),
      state: sanitizeState(safeState()),
      eventLog: safeState().eventLog || [],
      crashLog: readList(CRASH_KEY),
      performanceLog: readList(PERF_KEY),
      feedbackCount: readList(FEEDBACK_KEY).length,
    };
  }

  function storageSummary() {
    const keys = Object.keys(localStorage).sort();
    return {
      keyCount: keys.length,
      approximateBytes: keys.reduce((total, key) => total + key.length + String(localStorage.getItem(key) || "").length, 0),
      khayubdiKeys: keys.filter((key) => key.startsWith("khayubdi")).map((key) => ({
        key,
        bytes: key.length + String(localStorage.getItem(key) || "").length,
      })),
    };
  }

  function sanitizeState(value) {
    const clone = JSON.parse(JSON.stringify(value || {}));
    if (Array.isArray(clone.accounts)) {
      clone.accounts = clone.accounts.map((account) => ({
        id: account.id,
        emailDomain: String(account.email || "").split("@")[1] || "",
        hasPasswordHash: Boolean(account.passwordHash),
        hasSalt: Boolean(account.salt),
        requiresPasswordSetup: Boolean(account.requiresPasswordSetup),
        createdAt: account.createdAt,
      }));
    }
    if (clone.authSession) clone.authSession = { rememberMe: Boolean(clone.authSession.rememberMe ?? clone.authSession.remember), expiresAt: clone.authSession.expiresAt, lastValidatedAt: clone.authSession.lastValidatedAt };
    return clone;
  }

  function safeState() {
    try { return window.KhayubdiData?.read?.() || {}; }
    catch (error) {
      logCrash({ type: "state_read_failure", message: error.message });
      return {};
    }
  }

  function readList(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  function safeWriteList(key, item) {
    try {
      const next = [item, ...readList(key)].slice(0, MAX_ITEMS);
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* local-only diagnostics must never break the app */
    }
  }

  function safeSource(value) {
    try { return value ? new URL(value, location.href).pathname : ""; }
    catch { return ""; }
  }

  function ensureDialogHost() {
    let host = $("#osDialogHost");
    if (!host) {
      document.body.insertAdjacentHTML("beforeend", `<div class="os-dialog-backdrop" id="osDialogHost" role="dialog" aria-modal="true"></div>`);
      host = $("#osDialogHost");
    }
    return host;
  }

  function toast(message) {
    const host = $("#osToastHost");
    if (!host) return;
    const item = document.createElement("div");
    item.className = "os-toast";
    item.textContent = message;
    host.appendChild(item);
    setTimeout(() => item.remove(), 2400);
  }

  function isStandalone() {
    return matchMedia?.("(display-mode: standalone)")?.matches || navigator.standalone === true;
  }

  return { init, logCrash, markPerformance, diagnosticsPayload };
})();

window.KhayubdiRCTools = KhayubdiRCTools;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", KhayubdiRCTools.init);
} else {
  KhayubdiRCTools.init();
}
