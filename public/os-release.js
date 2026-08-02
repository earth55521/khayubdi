/* KHAYUBDI OS 2.0 — DEV-06 Product Completion & Release Candidate */

const KhayubdiRelease = (() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[m]));
  const state = () => window.KhayubdiData.read();
  const IMPORT_FORMAT = "khayubdi-os-export";
  const EXPORT_VERSION = 1;
  const MAX_IMPORT_BYTES = 8 * 1024 * 1024;
  const RELEASE_METADATA = Object.freeze({
    version: "1.0.0-rc2",
    build: 70,
    schemaVersion: 3,
  });
  const IMPORT_LIMITS = Object.freeze({
    maxAccounts: 5,
    maxWorkouts: 200,
    maxWorkoutSessions: 1000,
    maxSetsPerWorkout: 200,
    maxOutdoorSessions: 1000,
    maxMeals: 3000,
    maxGoals: 100,
    maxRecords: 500,
    maxEvents: 200,
    maxString: 240,
    maxNote: 2000,
  });
  const save = (mutator, eventName, payload = {}) => {
    const result = window.KhayubdiData.update((draft) => {
      const next = mutator(draft) || draft;
      if (eventName) track(eventName, payload, next);
      return next;
    });
    if (!result?.ok) toast(result?.message || "Local save failed. Previous data was kept safe.");
    return result;
  };
  const devMode = () => new URLSearchParams(location.search).get("dev") === "1" || state().developmentFlags?.enabled;
  let previousFocus = null;
  let dialogSequence = 0;

  function init() {
    ensureHosts();
    bindOnce();
    applySettings();
    boot();
    renderContextual();
  }

  function ensureHosts() {
    if (!$("#osSkipLink")) document.body.insertAdjacentHTML("afterbegin", `<a class="os-button os-skip-link" id="osSkipLink" href="#appShell">Skip to app</a>`);
    if (!$("#osReleaseHost")) document.body.insertAdjacentHTML("beforeend", `<div id="osReleaseHost"></div>`);
    if (!$("#osDialogHost")) document.body.insertAdjacentHTML("beforeend", `<div class="os-dialog-backdrop" id="osDialogHost" role="dialog" aria-modal="true"></div>`);
    if (!$("#osImportInput")) document.body.insertAdjacentHTML("beforeend", `<input id="osImportInput" type="file" accept="application/json,.json" hidden>`);
  }

  function bindOnce() {
    if (document.documentElement.dataset.osDev06Bound) return;
    document.documentElement.dataset.osDev06Bound = "true";
    document.addEventListener("click", onClick);
    document.addEventListener("change", onChange);
    window.addEventListener("khayubdi:datachange", () => { applySettings(); renderContextual(); });
    window.addEventListener("khayubdi:storagewarning", (event) => toast(event.detail?.message || "Local storage needs attention."));
    window.addEventListener("khayubdi:externalstate", () => toast("Local data changed in another tab. Refresh if anything looks out of date."));
    window.addEventListener("error", (event) => handleError("Unexpected app error", event.message));
    window.addEventListener("unhandledrejection", (event) => handleError("Unexpected async error", event.reason?.message || String(event.reason || "")));
  }

  function boot() {
    if (window.KhayubdiAuth?.bootstrap) return window.KhayubdiAuth.bootstrap();
    const current = state();
    showSplash(current);
    setTimeout(() => {
      const fresh = state();
      if (fresh.activeWorkout) return offerRecovery("workout");
      if (fresh.activeOutdoorActivity) return offerRecovery("outdoor");
      if (!fresh.onboardingComplete || !fresh.onboardingDraft?.completed) return showOnboarding();
      if (!validSession(fresh)) return showAuth("login");
      routeSafe(fresh.route);
      closeOverlay();
    }, prefersReducedMotion() ? 60 : 420);
  }

  function showSplash(current) {
    overlay(`<div class="os-brand-mark">K</div><span class="os-eyebrow">KHAYUBDI OS 2.0</span><h1 class="os-title">Preparing your local fitness OS</h1><div class="os-skeleton" role="status" aria-label="Checking app readiness"></div><p class="os-subtitle">Migration v${current.schemaVersion}, ${navigator.onLine ? "online" : "offline"}, service worker ${navigator.serviceWorker ? "supported" : "unavailable"}.</p>`);
  }

  function offerRecovery(type) {
    const isWorkout = type === "workout";
    overlay(`<span class="os-eyebrow">Session Recovery</span><h1 class="os-title">Resume ${isWorkout ? "Workout" : "Activity"}?</h1><p class="os-subtitle">An unfinished ${isWorkout ? "workout" : "outdoor activity"} was found on this device. It will not be deleted unless you discard it.</p><div class="os-actions"><button class="os-button os-button--primary" data-release-resume="${type}">Resume</button><button class="os-button os-button--danger" data-release-discard="${type}">Discard</button></div>`);
  }

  function showOnboarding() {
    const current = state();
    const step = Number(current.onboardingDraft?.step || 0);
    const answers = current.onboardingDraft?.answers || {};
    const screens = [
      ["Move Better", "Build a body that feels better every day.", ""],
      ["Train Smarter", "Use workout, outdoor, recovery, and records together.", ""],
      ["Track Everything", "Log workouts, meals, pace, records, and streaks locally.", ""],
      ["Meet Your AI Coach", "Deterministic local coaching. No external AI required for MVP.", ""],
      ["Personalize Your Experience", "Set your goals, units, language, and preferences.", formPersonalize(answers)],
    ];
    overlay(`<div class="os-stepper">${screens.map((_, i) => `<span class="${i <= step ? "is-active" : ""}"></span>`).join("")}</div><span class="os-eyebrow">Onboarding ${step + 1} / ${screens.length}</span><h1 class="os-title">${screens[step][0]}</h1><p class="os-subtitle">${screens[step][1]}</p>${screens[step][2]}<div class="os-actions"><button class="os-button os-button--ghost" data-release-onboard-back ${step === 0 ? "disabled" : ""}>Back</button><button class="os-button" data-release-onboard-skip>Skip optional</button><button class="os-button os-button--primary" data-release-onboard-next>${step === screens.length - 1 ? "Complete" : "Next"}</button></div>`);
  }

  function formPersonalize(answers) {
    return `<div class="os-grid os-grid--2"><label class="os-stack">Display name<input class="os-input" id="onboardName" value="${esc(answers.name || "")}" required></label><label class="os-stack">Primary goal<select class="os-select" id="onboardGoal">${["Fat loss","Muscle gain","General fitness","Running improvement","Strength","Healthy lifestyle"].map(v => `<option ${answers.goal === v ? "selected" : ""}>${v}</option>`).join("")}</select></label><label class="os-stack">Experience<select class="os-select" id="onboardExperience"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label><label class="os-stack">Workout days/week<input class="os-input" id="onboardDays" inputmode="numeric" min="1" max="7" value="${esc(answers.days || 4)}"></label><label class="os-stack">Units<select class="os-select" id="onboardUnits"><option value="metric">kg / km</option><option value="imperial">lb / mi</option></select></label><label class="os-stack">Language<select class="os-select" id="onboardLanguage"><option value="en">English</option><option value="th">ไทย</option></select></label><label class="os-row os-card"><span>Notifications</span><input id="onboardNotifications" type="checkbox" ${answers.notifications === false ? "" : "checked"}></label><label class="os-row os-card"><span>Reduced motion</span><input id="onboardReducedMotion" type="checkbox" ${answers.reducedMotion ? "checked" : ""}></label></div>`;
  }

  function showAuth(mode = "login", message = "") {
    const register = mode === "register";
    const forgot = mode === "forgot";
    overlay(`<span class="os-eyebrow">Local MVP Account</span><h1 class="os-title">${register ? "Create local account" : forgot ? "Reset password" : "Log in"}</h1><p class="os-subtitle">Local-only authentication. No backend or external provider is used.</p><form class="os-stack" id="releaseAuthForm">${register ? `<label class="os-stack">Name<input class="os-input" id="authName" autocomplete="name" required></label>` : ""}<label class="os-stack">Email<input class="os-input" id="authEmail" type="email" autocomplete="email" required></label>${forgot ? "" : `<label class="os-stack">Password<input class="os-input" id="authPasswordLocal" type="password" autocomplete="${register ? "new-password" : "current-password"}" required></label>`}${register ? `<label class="os-stack">Confirm password<input class="os-input" id="authConfirm" type="password" autocomplete="new-password" required></label><label class="os-row os-card"><span>Accept local MVP terms</span><input id="authTerms" type="checkbox" required></label>` : ""}${!register && !forgot ? `<label class="os-row os-card"><span>Remember me</span><input id="authRemember" type="checkbox"></label>` : ""}<button class="os-button os-button--primary" type="submit" data-release-auth-submit="${mode}">${register ? "Register" : forgot ? "Create reset link locally" : "Log in"}</button></form><div class="os-actions"><button class="os-button os-button--ghost" data-release-auth-mode="${register ? "login" : "register"}">${register ? "Have account? Log in" : "Create account"}</button><button class="os-button os-button--ghost" data-release-auth-mode="forgot">Forgot password</button></div><div class="os-grid os-grid--2"><button class="os-button" disabled>Continue with Apple · Unavailable</button><button class="os-button" disabled>Continue with Google · Unavailable</button></div>`);
  }

  function overlay(content) {
    $("#osReleaseHost").innerHTML = `<div class="os-release-overlay"><section class="os-release-panel" role="document">${content}</section></div>`;
    $("#osReleaseHost button, #osReleaseHost input, #osReleaseHost select")?.focus();
  }

  function closeOverlay() {
    $("#osReleaseHost").innerHTML = "";
  }

  async function onClick(event) {
    const target = event.target.closest("[data-release-onboard-next],[data-release-onboard-back],[data-release-onboard-skip],[data-release-auth-mode],[data-release-resume],[data-release-discard],[data-release-export],[data-release-import],[data-release-notifications],[data-release-dev],[data-release-coach-action],[data-release-goal-action],[data-release-meal-duplicate],[data-release-meal-delete],[data-release-auth-submit],[data-release-logout],[data-release-delete-account],[data-release-reset]");
    if (!target) return;
    if (target.dataset.releaseOnboardNext !== undefined) return nextOnboarding();
    if (target.dataset.releaseOnboardBack !== undefined) return moveOnboarding(-1);
    if (target.dataset.releaseOnboardSkip !== undefined) return moveOnboarding(1);
    if (target.dataset.releaseAuthMode) return showAuth(target.dataset.releaseAuthMode);
    if (target.dataset.releaseResume) { closeOverlay(); return routeSafe({ tab: target.dataset.releaseResume === "workout" ? "track" : "outdoor", view: target.dataset.releaseResume === "workout" ? "activeWorkout" : "outdoorLive" }); }
    if (target.dataset.releaseDiscard) return releaseDiscard(target.dataset.releaseDiscard);
    if (target.dataset.releaseExport !== undefined) return exportData();
    if (target.dataset.releaseImport !== undefined) return $("#osImportInput").click();
    if (target.dataset.releaseNotifications !== undefined) return requestNotifications();
    if (target.dataset.releaseDev) return developmentAction(target.dataset.releaseDev);
    if (target.dataset.releaseCoachAction) return coachAction(target.dataset.releaseCoachAction);
    if (target.dataset.releaseGoalAction) return goalAction(target.dataset.releaseGoalAction);
    if (target.dataset.releaseMealDuplicate) return duplicateMeal(target.dataset.releaseMealDuplicate);
    if (target.dataset.releaseMealDelete) return deleteMeal(target.dataset.releaseMealDelete);
    if (target.dataset.releaseLogout !== undefined) return logout();
    if (target.dataset.releaseDeleteAccount !== undefined) return deleteAccount();
    if (target.dataset.releaseReset !== undefined) return resetApp();
  }

  function onChange(event) {
    if (event.target.id === "osImportInput") return importFile(event.target.files?.[0]);
    if (event.target.matches("[data-release-setting]")) return updateSetting(event.target.dataset.releaseSetting, event.target.type === "checkbox" ? event.target.checked : event.target.value);
    if (event.target.matches("[data-release-meal-field]")) return updateMeal(event.target.dataset.releaseMealField, event.target.dataset.releaseMealId, event.target.value);
  }

  document.addEventListener("submit", async (event) => {
    const form = event.target.closest("#releaseAuthForm");
    if (!form) return;
    event.preventDefault();
    const mode = form.querySelector("[data-release-auth-submit]")?.dataset.releaseAuthSubmit || "login";
    if (mode === "register") return register();
    if (mode === "forgot") return forgotPassword();
    return login();
  });

  function moveOnboarding(delta) {
    save((draft) => {
      draft.onboardingDraft.step = Math.max(0, Math.min(4, Number(draft.onboardingDraft.step || 0) + delta));
      draft.onboardingDraft.updatedAt = new Date().toISOString();
    }, "onboarding_started");
    showOnboarding();
  }

  function collectOnboarding() {
    return {
      name: $("#onboardName")?.value.trim(),
      goal: $("#onboardGoal")?.value,
      experience: $("#onboardExperience")?.value,
      days: Number($("#onboardDays")?.value || 4),
      units: $("#onboardUnits")?.value || "metric",
      language: $("#onboardLanguage")?.value || "en",
      notifications: Boolean($("#onboardNotifications")?.checked),
      reducedMotion: Boolean($("#onboardReducedMotion")?.checked),
    };
  }

  function nextOnboarding() {
    const current = state();
    if (Number(current.onboardingDraft.step || 0) < 4) return moveOnboarding(1);
    const answers = collectOnboarding();
    if (!answers.name) return toast("Please enter a display name.");
    save((draft) => {
      draft.profile.name = answers.name;
      draft.goals.workout = `${answers.days} sessions / week`;
      draft.goals.weight = answers.goal;
      draft.settings.units = answers.units;
      draft.settings.language = answers.language;
      draft.settings.notifications = answers.notifications;
      draft.settings.reducedMotion = answers.reducedMotion;
      draft.onboardingComplete = true;
      draft.onboardingDraft = { step: 4, answers, completed: true, updatedAt: new Date().toISOString() };
    }, "onboarding_completed");
    showAuth("register");
  }

  async function register() {
    const name = $("#authName")?.value.trim();
    const email = normalizeEmail($("#authEmail")?.value);
    const password = $("#authPasswordLocal")?.value || "";
    const confirm = $("#authConfirm")?.value || "";
    if (!name || !email || !password) return toast("Complete all required fields.");
    if (password !== confirm) return toast("Passwords do not match.");
    if (!strongPassword(password)) return toast("Use at least 8 chars with letters and numbers.");
    if (!$("#authTerms")?.checked) return toast("Accept local MVP terms.");
    const result = await window.KhayubdiAuth.register({ name, email, password, confirm, terms: $("#authTerms")?.checked, remember: true });
    if (!result.ok) return toast(result.message);
    closeOverlay();
    routeSafe(state().route);
  }

  async function login() {
    const email = normalizeEmail($("#authEmail")?.value);
    const password = $("#authPasswordLocal")?.value || "";
    const remember = Boolean($("#authRemember")?.checked);
    const result = await window.KhayubdiAuth.login({ email, password, remember });
    if (!result.ok) return toast(result.message);
    closeOverlay();
    routeSafe(state().route);
  }

  function forgotPassword() {
    toast("Local MVP reset: create a new account password after deleting the local account.");
    showAuth("login");
  }

  function validSession(current) {
    if (window.KhayubdiAuth?.getSession) return Boolean(window.KhayubdiAuth.getSession());
    return current.authSession && Number(current.authSession.expiresAt || 0) > Date.now();
  }

  function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
  }

  function strongPassword(password) {
    return password.length >= 8 && /[a-z]/i.test(password) && /\d/.test(password);
  }

  function renderContextual() {
    renderCoach();
    renderSettingsPanel();
    renderGoalsPanel();
    renderNutritionTools();
    renderDevPanel();
  }

  function coachRecommendation(current = state()) {
    const recentWorkout = current.workoutSessions[0];
    const recentOutdoor = current.outdoorSessions[0];
    const pr = current.personalRecords[0];
    let title = "Keep today simple";
    let message = "Your best next step is one clear action: train, walk, or log your next meal.";
    let reason = "Based on your current local workout, outdoor, nutrition, and streak data.";
    if (current.activeWorkout) { title = "Resume your workout"; message = "You have an unfinished workout saved locally."; reason = "Active session recovery has priority over new recommendations."; }
    else if (pr) { title = "New record momentum"; message = `You recently hit ${pr.title}: ${pr.value}. Keep progression gradual.`; reason = "Personal records are useful signals, but recovery still matters."; }
    else if (recentWorkout && recentOutdoor) { title = "Balanced week"; message = "You have both strength and outdoor activity logged. Maintain consistency."; reason = "Mixed training supports adherence and general fitness."; }
    else if (!recentWorkout) { title = "Start with a short session"; message = "A 25–45 minute workout is a safe, useful default today."; reason = "No recent completed workout was found in local records."; }
    return { id: `rec-${title.replace(/\s+/g, "-").toLowerCase()}`, title, message, reason, language: current.settings?.language || "en" };
  }

  function renderCoach() {
    const mount = root("dashboard");
    if (!mount || $("#releaseCoachCard", mount)) return;
    const rec = coachRecommendation();
    mount.insertAdjacentHTML("beforeend", `<article class="os-card" id="releaseCoachCard"><span class="os-eyebrow">Contextual AI Coach</span><h2 class="os-section__title">${esc(rec.title)}</h2><p class="os-subtitle">${esc(rec.message)}</p><p class="os-stat__hint">Why: ${esc(rec.reason)}</p><div class="os-actions"><button class="os-button os-button--primary" data-release-coach-action="save">Save</button><button class="os-button os-button--ghost" data-release-coach-action="dismiss">Dismiss</button></div></article>`);
    save((draft) => {
      if (!draft.recommendationHistory.some((item) => item.id === rec.id)) draft.recommendationHistory.unshift({ ...rec, viewedAt: new Date().toISOString(), saved: false, dismissed: false });
      draft.recommendationHistory = draft.recommendationHistory.slice(0, 40);
    }, "ai_recommendation_viewed", { id: rec.id });
  }

  function coachAction(action) {
    save((draft) => {
      const rec = draft.recommendationHistory[0];
      if (rec) rec[action === "save" ? "saved" : "dismissed"] = true;
    }, action === "save" ? "ai_recommendation_saved" : "ai_recommendation_dismissed");
    $("#releaseCoachCard")?.remove();
  }

  function renderSettingsPanel() {
    const mount = root("profile");
    if (!mount || $("#releaseSettingsPanel", mount)) return;
    const current = state();
    mount.insertAdjacentHTML("beforeend", `<section class="os-card" id="releaseSettingsPanel"><span class="os-eyebrow">Release Settings</span><h2 class="os-section__title">Functional settings</h2><div class="os-grid os-grid--2"><label class="os-stack">Theme<select class="os-select" data-release-setting="theme"><option value="dark">Dark</option><option value="system">System</option><option value="high-contrast">High contrast</option></select></label><label class="os-stack">Language<select class="os-select" data-release-setting="language"><option value="en">English</option><option value="th">ไทย</option></select></label><label class="os-stack">Units<select class="os-select" data-release-setting="units"><option value="metric">kg / km</option><option value="imperial">lb / mi</option></select></label><label class="os-row os-card"><span>Notifications</span><input type="checkbox" data-release-setting="notifications" ${current.settings.notifications ? "checked" : ""}></label><label class="os-row os-card"><span>Sound</span><input type="checkbox" data-release-setting="soundEnabled" ${current.timerPreferences.soundEnabled ? "checked" : ""}></label><label class="os-row os-card"><span>Haptics</span><input type="checkbox" data-release-setting="hapticEnabled" ${current.timerPreferences.hapticEnabled ? "checked" : ""}></label><label class="os-row os-card"><span>Reduced motion</span><input type="checkbox" data-release-setting="reducedMotion" ${current.settings.reducedMotion ? "checked" : ""}></label></div><div class="os-actions"><button class="os-button" data-release-export>Export data</button><button class="os-button" data-release-import>Import data</button><button class="os-button" data-release-notifications>Prepare notifications</button><button class="os-button os-button--ghost" data-release-logout>Logout</button><button class="os-button os-button--danger" data-release-reset>Reset app</button><button class="os-button os-button--danger" data-release-delete-account>Delete account</button></div></section>`);
  }

  function renderGoalsPanel() {
    const mount = root("profile");
    if (!mount || $("#releaseGoalsPanel", mount)) return;
    const current = state();
    const goals = current.goalItems.length ? current.goalItems : [
      { id: "goal-workout", type: "weekly_workout", title: "Weekly workouts", target: 4, unit: "sessions", status: "active", startDate: new Date().toISOString(), targetDate: "" },
      { id: "goal-outdoor", type: "weekly_outdoor", title: "Weekly outdoor distance", target: 12, unit: "km", status: "active", startDate: new Date().toISOString(), targetDate: "" },
      { id: "goal-protein", type: "daily_protein", title: "Daily protein", target: 120, unit: "g", status: "active", startDate: new Date().toISOString(), targetDate: "" },
    ];
    mount.insertAdjacentHTML("beforeend", `<section class="os-card" id="releaseGoalsPanel"><span class="os-eyebrow">Goals Engine</span><h2 class="os-section__title">Functional goals</h2><div class="os-grid">${goals.map((goal) => goalCard(goal, current)).join("")}</div><button class="os-button os-button--primary" data-release-goal-action="create">Create default goals</button></section>`);
  }

  function goalCard(goal, current) {
    const progress = goalProgress(goal, current);
    return `<article class="os-card"><div class="os-row"><strong>${esc(goal.title)}</strong><span class="os-chip">${esc(goal.status || "active")}</span></div><p class="os-stat__hint">${progress.value} / ${esc(goal.target)} ${esc(goal.unit || "")}</p><div class="os-progress"><span style="--value:${Math.min(100, progress.percent)}%"></span></div><div class="os-actions"><button class="os-button os-button--ghost" data-release-goal-action="pause:${esc(goal.id)}">Pause</button><button class="os-button os-button--ghost" data-release-goal-action="complete:${esc(goal.id)}">Complete</button><button class="os-button os-button--danger" data-release-goal-action="reset:${esc(goal.id)}">Reset</button></div></article>`;
  }

  function goalProgress(goal, current) {
    let value = 0;
    if (goal.type === "weekly_workout") value = current.workoutSessions.filter((s) => daysAgo(s.endedAt) <= 7).length;
    if (goal.type === "weekly_outdoor") value = current.outdoorSessions.filter((s) => daysAgo(s.endedAt) <= 7).reduce((t, s) => t + Number(s.distanceKm || 0), 0);
    if (goal.type === "daily_protein") value = current.nutritionMeals.filter((m) => daysAgo(m.createdAt) <= 1).reduce((t, m) => t + Number(m.protein || 0), 0);
    return { value: Math.round(value * 10) / 10, percent: goal.target ? value / Number(goal.target) * 100 : 0 };
  }

  function daysAgo(date) {
    return (Date.now() - new Date(date || 0).getTime()) / 86400000;
  }

  function updateSetting(key, value) {
    save((draft) => {
      if (key === "soundEnabled" || key === "hapticEnabled") draft.timerPreferences[key] = value;
      else draft.settings[key] = value;
    });
  }

  function applySettings() {
    const current = state();
    document.documentElement.classList.toggle("os-high-contrast", current.settings?.theme === "high-contrast");
    document.documentElement.style.scrollBehavior = current.settings?.reducedMotion ? "auto" : "";
    document.documentElement.lang = current.settings?.language === "th" ? "th" : "en";
  }

  function renderNutritionTools() {
    const mount = root("dashboard");
    if (!mount || $("#releaseNutritionTools", mount)) return;
    const meals = state().nutritionMeals.slice(0, 5);
    mount.insertAdjacentHTML("beforeend", `<section class="os-card" id="releaseNutritionTools"><span class="os-eyebrow">Nutrition</span><h2 class="os-section__title">Daily macro tools</h2><div class="os-grid">${meals.map((meal) => `<article class="os-card"><strong>${esc(meal.name)}</strong><div class="os-grid os-grid--2"><label class="os-stack">Calories<input class="os-input" data-release-meal-field="calories" data-release-meal-id="${esc(meal.id)}" inputmode="numeric" value="${esc(meal.calories)}"></label><label class="os-stack">Serving<input class="os-input" data-release-meal-field="serving" data-release-meal-id="${esc(meal.id)}" value="${esc(meal.serving || "1")}"></label></div><div class="os-actions"><button class="os-button os-button--ghost" data-release-meal-duplicate="${esc(meal.id)}">Duplicate</button><button class="os-button os-button--danger" data-release-meal-delete="${esc(meal.id)}">Delete</button></div></article>`).join("")}</div></section>`);
  }

  function duplicateMeal(id) {
    save((draft) => {
      const meal = draft.nutritionMeals.find((item) => item.id === id);
      if (!meal) return;
      draft.nutritionMeals.unshift({ ...meal, id: uid("meal"), createdAt: new Date().toISOString(), notes: meal.notes || "", favorite: Boolean(meal.favorite) });
      draft.recentFoods = [meal.name, ...(draft.recentFoods || []).filter((name) => name !== meal.name)].slice(0, 20);
    }, "meal_saved");
  }

  function deleteMeal(id) {
    dialog("Delete meal?", "This removes the meal from local nutrition records.", "Delete", "danger", () => save((draft) => { draft.nutritionMeals = draft.nutritionMeals.filter((item) => item.id !== id); }, "meal_deleted"));
  }

  function updateMeal(field, id, value) {
    save((draft) => {
      const meal = draft.nutritionMeals.find((item) => item.id === id);
      if (!meal) return;
      meal[field] = ["calories","protein","carbs","fat"].includes(field) ? Math.max(0, Number(value || 0)) : value;
      draft.recentFoods = [meal.name, ...(draft.recentFoods || []).filter((name) => name !== meal.name)].slice(0, 20);
    }, "meal_saved");
  }

  function dialog(title, description, actionLabel, tone, onConfirm, cancelLabel = "Cancel") {
    if ($("#osDialogHost")?.classList.contains("is-open")) return;
    previousFocus = document.activeElement;
    const host = $("#osDialogHost");
    const id = ++dialogSequence;
    const titleId = `osDialogTitle${id}`;
    const describedBy = `osDialogDescription${id}`;
    host.setAttribute("role", tone === "danger" ? "alertdialog" : "dialog");
    host.setAttribute("aria-modal", "true");
    host.setAttribute("aria-labelledby", titleId);
    host.setAttribute("aria-describedby", describedBy);
    host.innerHTML = `<section class="os-dialog" aria-labelledby="${titleId}" aria-describedby="${describedBy}"><h2 class="os-section__title" id="${titleId}">${esc(title)}</h2><p class="os-subtitle" id="${describedBy}">${esc(description)}</p><p class="os-stat__hint" role="status" aria-live="polite" data-dialog-status></p><div class="os-actions"><button class="os-button os-button--ghost" data-dialog-cancel>${esc(cancelLabel)}</button><button class="os-button ${tone === "danger" ? "os-button--danger" : "os-button--primary"}" data-dialog-confirm>${esc(actionLabel)}</button></div></section>`;
    host.classList.add("is-open");
    setBackgroundInert(true);
    let submitted = false;
    const close = () => { host.classList.remove("is-open"); host.innerHTML = ""; setBackgroundInert(false); previousFocus?.focus?.(); };
    $("[data-dialog-cancel]", host).onclick = close;
    $("[data-dialog-confirm]", host).onclick = () => {
      if (submitted) return;
      submitted = true;
      const confirm = $("[data-dialog-confirm]", host);
      const status = $("[data-dialog-status]", host);
      confirm.disabled = true;
      if (status) status.textContent = "Working…";
      try {
        const result = onConfirm();
        if (result && typeof result.then === "function") result.finally(close);
        else close();
      } catch (error) {
        submitted = false;
        confirm.disabled = false;
        if (status) status.textContent = "Action failed. Please try again.";
      }
    };
    host.onkeydown = (e) => trapDialogKeydown(e, close, host);
    $("[data-dialog-cancel]", host).focus();
  }

  function confirmAction(options) {
    return dialog(options.title, options.description, options.actionLabel, options.tone || "primary", options.onConfirm, options.cancelLabel || "Cancel");
  }

  function editWorkoutSet(setId) {
    const set = state().activeWorkout?.exercises.flatMap((ex) => ex.completedSets).find((item) => item.id === setId);
    if (!set) return;
    previousFocus = document.activeElement;
    const host = $("#osDialogHost");
    const id = ++dialogSequence;
    const titleId = `osDialogTitle${id}`;
    const descriptionId = `osDialogDescription${id}`;
    const errorId = `osDialogError${id}`;
    host.setAttribute("role", "dialog");
    host.setAttribute("aria-modal", "true");
    host.setAttribute("aria-labelledby", titleId);
    host.setAttribute("aria-describedby", descriptionId);
    host.innerHTML = `<section class="os-dialog" aria-labelledby="${titleId}" aria-describedby="${descriptionId}"><h2 class="os-section__title" id="${titleId}">Edit set</h2><p class="os-subtitle" id="${descriptionId}">Update completed reps and RPE. Cancel makes no state changes.</p><p class="os-stat__hint" id="${errorId}" role="status" aria-live="polite"></p><label class="os-stack">Reps<input class="os-input" id="dialogSetReps" inputmode="numeric" min="0" aria-describedby="${errorId}" value="${esc(set.reps)}"></label><label class="os-stack">RPE<input class="os-input" id="dialogSetRpe" inputmode="decimal" min="0" max="10" aria-describedby="${errorId}" value="${esc(set.rpe || "")}"></label><div class="os-actions"><button class="os-button os-button--ghost" data-dialog-cancel>Cancel</button><button class="os-button os-button--primary" data-dialog-confirm>Save</button></div></section>`;
    host.classList.add("is-open");
    setBackgroundInert(true);
    let submitted = false;
    $("[data-dialog-cancel]", host).onclick = () => closeDialog();
    $("[data-dialog-confirm]", host).onclick = () => {
      if (submitted) return;
      const reps = Number($("#dialogSetReps").value || 0);
      const rpe = Number($("#dialogSetRpe").value || 0);
      const error = $(`#${errorId}`, host);
      if (!Number.isFinite(reps) || reps < 0 || !Number.isFinite(rpe) || rpe < 0 || rpe > 10) {
        $("#dialogSetReps").setAttribute("aria-invalid", !Number.isFinite(reps) || reps < 0 ? "true" : "false");
        $("#dialogSetRpe").setAttribute("aria-invalid", !Number.isFinite(rpe) || rpe < 0 || rpe > 10 ? "true" : "false");
        if (error) error.textContent = "Enter valid reps and an RPE from 0 to 10.";
        return;
      }
      submitted = true;
      $("[data-dialog-confirm]", host).disabled = true;
      save((draft) => updateSetInDraft(draft, setId, { reps: Math.max(0, reps), rpe: Math.max(0, Math.min(10, rpe)) }), "set_updated", { setId });
      closeDialog();
    };
    host.onkeydown = (e) => trapDialogKeydown(e, closeDialog, host);
    $("#dialogSetReps").focus();
  }

  function closeDialog() {
    const host = $("#osDialogHost");
    host.classList.remove("is-open");
    host.innerHTML = "";
    setBackgroundInert(false);
    previousFocus?.focus?.();
  }

  function trapDialogKeydown(event, close, host) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = Array.from(host.querySelectorAll("button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])"));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function setBackgroundInert(active) {
    ["appShell", "osTopbar", "osNutritionFab", "rcTools"].forEach((id) => {
      const node = document.getElementById(id);
      if (!node) return;
      if ("inert" in node) node.inert = active;
      node.setAttribute("aria-hidden", active ? "true" : "false");
    });
  }

  function updateSetInDraft(draft, setId, changes) {
    draft.activeWorkout?.exercises.forEach((ex) => {
      const set = ex.completedSets.find((item) => item.id === setId);
      if (set) Object.assign(set, changes);
    });
    const log = draft.completedSetLogs.find((item) => item.id === setId);
    if (log) Object.assign(log, changes);
  }

  function discardWorkoutSafe() {
    if (window.KhayubdiTraining?.discardWorkout) return window.KhayubdiTraining.discardWorkout();
    save((draft) => { draft.activeWorkout = null; draft.route = { tab: "track", view: "gymHome", detailId: "" }; }, "workout_discarded");
  }

  function discardOutdoorSafe() {
    if (window.KhayubdiTraining?.discardOutdoor) return window.KhayubdiTraining.discardOutdoor();
    save((draft) => { draft.activeOutdoorActivity = null; draft.route = { tab: "outdoor", view: "outdoorHome", detailId: "" }; }, "outdoor_activity_discarded");
  }

  function releaseDiscard(type) {
    dialog(`Discard ${type}?`, "This only removes the unfinished local session.", "Discard", "danger", () => type === "workout" ? discardWorkoutSafe() : discardOutdoorSafe());
  }

  function exportData() {
    const current = state();
    const payload = createExportEnvelope(current);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `khayubdi-os-export-v${current.schemaVersion}-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    save((draft) => { draft.importExportMetadata.lastExportedAt = new Date().toISOString(); }, "data_exported");
  }

  function importFile(file) {
    const fileCheck = validateImportFile(file);
    if (!fileCheck.ok) return toast(fileCheck.message);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const prepared = prepareImport(String(reader.result || ""));
        if (!prepared.ok) return toast(prepared.message);
        const preview = prepared.preview;
        dialog(
          "Import Khayubdi data?",
          `Export ${preview.exportedAt}; schema v${preview.schemaVersion}; ${preview.workoutSessions} workouts, ${preview.outdoorSessions} outdoor sessions, ${preview.meals} meals, ${preview.accounts} accounts. Active sessions: ${preview.activeSessions}. Current local data will be replaced and login will be required.`,
          "Import",
          "primary",
          () => commitImport(prepared)
        );
      } catch (error) {
        handleError("Invalid imported data", devMode() ? error.message : "");
      }
    };
    reader.onerror = () => toast("File could not be read.");
    reader.readAsText(file);
  }

  function createExportEnvelope(current) {
    const exported = sanitizeStateForExport(current);
    return {
      format: IMPORT_FORMAT,
      exportVersion: EXPORT_VERSION,
      version: RELEASE_METADATA.version,
      build: RELEASE_METADATA.build,
      schemaVersion: RELEASE_METADATA.schemaVersion,
      exportedAt: new Date().toISOString(),
      appVersion: RELEASE_METADATA.version,
      notice: "This file contains personal fitness data. Store it securely.",
      data: exported,
    };
  }

  function sanitizeStateForExport(current) {
    const copy = JSON.parse(JSON.stringify(current || {}));
    copy.authSession = null;
    copy.developmentFlags = { enabled: false, simulateOffline: false, notificationsDenied: false, demoDataSeeded: false };
    copy.errorMetadata = { lastErrorAt: null, recentErrors: [] };
    copy.analyticsQueue = [];
    if (copy.activeWorkout) copy.activeWorkout = { ...copy.activeWorkout, finishing: false, restTimer: null };
    if (copy.activeOutdoorActivity) copy.activeOutdoorActivity = { ...copy.activeOutdoorActivity, locked: false, status: "paused" };
    return copy;
  }

  function validateImportFile(file) {
    if (!file) return { ok: false, message: "Choose a JSON export file." };
    if (!String(file.name || "").toLowerCase().endsWith(".json")) return { ok: false, message: "Unsupported file. Choose a .json Khayubdi export." };
    if (file.type && !["application/json", "text/json", ""].includes(file.type)) return { ok: false, message: "Unsupported file type. Choose a JSON export." };
    if (!Number(file.size)) return { ok: false, message: "Import file is empty." };
    if (Number(file.size) > MAX_IMPORT_BYTES) return { ok: false, message: "Import file is too large for local import." };
    return { ok: true };
  }

  function prepareImport(rawText) {
    if (!rawText || rawText.length > MAX_IMPORT_BYTES * 2) return { ok: false, message: "Import file is too large." };
    let parsed;
    try { parsed = JSON.parse(rawText); } catch { return { ok: false, message: "Invalid JSON export file." }; }
    const envelope = normalizeImportEnvelope(parsed);
    if (!envelope.ok) return envelope;
    const migrated = migrateImportedState(envelope.data, envelope.schemaVersion);
    if (!migrated.ok) return migrated;
    const sanitized = sanitizeImportedState(migrated.state);
    if (!sanitized.ok) return sanitized;
    const validation = validateImportedState(sanitized.state);
    if (!validation.ok) return validation;
    return { ok: true, envelope, state: sanitized.state, preview: importPreview(envelope, sanitized.state) };
  }

  function normalizeImportEnvelope(root) {
    if (!isPlainObject(root)) return { ok: false, message: "Invalid import structure." };
    if (hasDangerousKeys(root)) return { ok: false, message: "Import contains unsafe object keys." };
    if (root.format === IMPORT_FORMAT) {
      if (root.exportVersion !== EXPORT_VERSION) return { ok: false, message: "Unsupported export version." };
      if (!Number.isInteger(root.schemaVersion) || root.schemaVersion > window.KhayubdiData.SCHEMA_VERSION || root.schemaVersion < 1) return { ok: false, message: "Unsupported schema version." };
      if (!isIsoDate(root.exportedAt)) return { ok: false, message: "Export timestamp is invalid." };
      if (!isPlainObject(root.data) || hasDangerousKeys(root.data)) return { ok: false, message: "Import data root is invalid." };
      return { ok: true, schemaVersion: root.schemaVersion, exportedAt: root.exportedAt, appVersion: safeText(root.appVersion || "Unknown", 80), data: root.data };
    }
    if (Number.isInteger(root.schemaVersion) && root.schemaVersion >= 1 && root.schemaVersion <= window.KhayubdiData.SCHEMA_VERSION) {
      return { ok: true, schemaVersion: root.schemaVersion, exportedAt: root.exportTimestamp || root.exportedAt || "Legacy export", appVersion: "Legacy Khayubdi export", data: root };
    }
    return { ok: false, message: "This is not a supported Khayubdi export file." };
  }

  function migrateImportedState(data, schemaVersion) {
    if (schemaVersion > window.KhayubdiData.SCHEMA_VERSION) return { ok: false, message: "Future schema versions cannot be imported." };
    const candidate = { ...window.KhayubdiData.defaults(), ...data, schemaVersion };
    candidate.authSession = null;
    candidate.activeWorkout = null;
    candidate.activeOutdoorActivity = null;
    candidate.developmentFlags = { enabled: false, simulateOffline: false, notificationsDenied: false, demoDataSeeded: false };
    candidate.route = { tab: "dashboard", view: "home", detailId: "" };
    return { ok: true, state: candidate };
  }

  function sanitizeImportedState(input) {
    try {
      const state = JSON.parse(JSON.stringify(input || {}));
      const walk = (value, note = false) => {
        if (typeof value === "string") return safeText(value, note ? IMPORT_LIMITS.maxNote : IMPORT_LIMITS.maxString);
        if (Array.isArray(value)) return value.map((item) => walk(item, note));
        if (isPlainObject(value)) {
          if (hasDangerousKeys(value)) throw new Error("unsafe_keys");
          const out = {};
          Object.entries(value).forEach(([key, item]) => { out[key] = walk(item, /note|description|instruction/i.test(key)); });
          return out;
        }
        return value;
      };
      return { ok: true, state: walk(state) };
    } catch {
      return { ok: false, message: "Import contains unsafe values." };
    }
  }

  function validateImportedState(candidate) {
    const stateValidation = window.KhayubdiData.validateState(candidate);
    if (!stateValidation.ok) return { ok: false, message: "Imported data structure is invalid." };
    if (candidate.authSession !== null) return { ok: false, message: "Imported sessions are not allowed." };
    if (candidate.developmentFlags?.enabled) return { ok: false, message: "Import cannot enable development mode." };
    if (!boundedArray(candidate.accounts, IMPORT_LIMITS.maxAccounts)) return { ok: false, message: "Import has too many accounts." };
    if (!boundedArray(candidate.workouts, IMPORT_LIMITS.maxWorkouts)) return { ok: false, message: "Import has too many workouts." };
    if (!boundedArray(candidate.workoutSessions, IMPORT_LIMITS.maxWorkoutSessions)) return { ok: false, message: "Import has too many workout sessions." };
    if (!boundedArray(candidate.outdoorSessions, IMPORT_LIMITS.maxOutdoorSessions)) return { ok: false, message: "Import has too many outdoor sessions." };
    if (!boundedArray(candidate.nutritionMeals, IMPORT_LIMITS.maxMeals)) return { ok: false, message: "Import has too many meals." };
    if (candidate.activeWorkout || candidate.activeOutdoorActivity) return { ok: false, message: "Imported active sessions must be resolved before import." };
    if (!uniqueIds(candidate.accounts) || !uniqueIds(candidate.workoutSessions) || !uniqueIds(candidate.outdoorSessions) || !uniqueIds(candidate.nutritionMeals)) return { ok: false, message: "Import contains duplicate IDs." };
    const accountEmails = candidate.accounts.map((account) => normalizeEmail(account.email || ""));
    if (accountEmails.length !== new Set(accountEmails).size) return { ok: false, message: "Import contains duplicate account emails." };
    if (candidate.accounts.some((account) => account.password || !validEmail(account.email || "") || tooLong(account.passwordHash, 512) || tooLong(account.salt, 256))) return { ok: false, message: "Import contains unsafe account data." };
    if (!["dark", "system", "high-contrast", "high_contrast"].includes(String(candidate.settings.theme || "dark"))) return { ok: false, message: "Import contains unsupported settings." };
    if (!["en", "th"].includes(String(candidate.settings.language || "en"))) return { ok: false, message: "Import contains unsupported language settings." };
    if (!["metric", "imperial"].includes(String(candidate.settings.units || "metric"))) return { ok: false, message: "Import contains unsupported unit settings." };
    if (["notifications", "reducedMotion"].some((key) => typeof candidate.settings[key] !== "boolean")) return { ok: false, message: "Import contains invalid setting values." };
    if (Array.isArray(candidate.goalItems) && candidate.goalItems.some(invalidGoal)) return { ok: false, message: "Import contains invalid goals." };
    if (candidate.workoutSessions.some(invalidWorkoutSession)) return { ok: false, message: "Import contains invalid workout values." };
    if (candidate.outdoorSessions.some(invalidOutdoorSession)) return { ok: false, message: "Import contains invalid outdoor values." };
    if (candidate.nutritionMeals.some(invalidMeal)) return { ok: false, message: "Import contains invalid nutrition values." };
    return { ok: true };
  }

  function importPreview(envelope, imported) {
    return {
      exportedAt: envelope.exportedAt || "Unknown",
      appVersion: envelope.appVersion || "Unknown",
      schemaVersion: envelope.schemaVersion,
      workoutSessions: imported.workoutSessions.length,
      outdoorSessions: imported.outdoorSessions.length,
      meals: imported.nutritionMeals.length,
      goals: Array.isArray(imported.goalItems) ? imported.goalItems.length : Object.keys(imported.goals || {}).length,
      accounts: imported.accounts.length,
      activeSessions: "not imported",
    };
  }

  function commitImport(prepared) {
    const backup = window.KhayubdiData.createImportBackup({ sourceSchema: prepared.envelope.schemaVersion, sourceVersion: prepared.envelope.appVersion });
    if (!backup.ok) return toast(backup.message || "Backup failed. Import cancelled.");
    const next = {
      ...prepared.state,
      authSession: null,
      importExportMetadata: {
        ...(prepared.state.importExportMetadata || {}),
        lastBackupAt: backup.backup.createdAt,
        importBackupAt: backup.backup.createdAt,
        importBackupBuild: RELEASE_METADATA.build,
        lastImportedAt: new Date().toISOString(),
      },
    };
    const result = window.KhayubdiData.write(next, { eventName: "data_imported", payload: { schemaVersion: prepared.envelope.schemaVersion } });
    if (!result?.ok) {
      window.KhayubdiData.restoreImportBackup();
      return toast(result?.message || "Import failed. Previous data was restored.");
    }
    const verification = window.KhayubdiData.validateState(window.KhayubdiData.read());
    if (!verification.ok) {
      window.KhayubdiData.restoreImportBackup();
      return toast("Import verification failed. Previous data was restored.");
    }
    toast("Import succeeded. Please log in again.");
    window.KhayubdiAuth?.showAuth?.("login", "Import succeeded. Please log in again.");
  }

  function isPlainObject(value) {
    return value && typeof value === "object" && !Array.isArray(value) && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
  }

  function hasDangerousKeys(value) {
    const stack = [value];
    while (stack.length) {
      const item = stack.pop();
      if (!isPlainObject(item) && !Array.isArray(item)) continue;
      for (const key of Object.keys(item)) {
        if (key === "__proto__" || key === "constructor" || key === "prototype") return true;
        const child = item[key];
        if (child && typeof child === "object") stack.push(child);
      }
    }
    return false;
  }

  function safeText(value, max) {
    return String(value || "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").replace(/\r\n?/g, "\n").slice(0, max);
  }

  function isIsoDate(value) {
    return typeof value === "string" && !Number.isNaN(Date.parse(value));
  }

  function boundedArray(value, max) {
    return Array.isArray(value) && value.length <= max;
  }

  function uniqueIds(items) {
    const ids = items.map((item) => String(item.id || "")).filter(Boolean);
    return ids.length === new Set(ids).size;
  }

  function validEmail(email) {
    return typeof email === "string" && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function tooLong(value, max) {
    return String(value || "").length > max;
  }

  function finiteIn(value, min, max) {
    return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
  }

  function optionalNumberIn(value, min, max) {
    if (value === undefined || value === null || value === "") return true;
    return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
  }

  function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
  }

  function invalidGoal(goal) {
    const allowedTypes = ["body_weight", "weekly_workout", "weekly_outdoor", "daily_calorie", "daily_protein", "streak", "weight", "workout", "outdoor", "nutrition"];
    const allowedStatus = ["active", "paused", "completed", "draft"];
    return !isPlainObject(goal) || (goal.type && !allowedTypes.includes(String(goal.type))) || (goal.status && !allowedStatus.includes(String(goal.status))) || !optionalNumberIn(goal.target, 0, 100000);
  }

  function invalidWorkoutSession(session) {
    if (!isPlainObject(session) || !isIsoDate(session.startedAt || session.endedAt || new Date().toISOString())) return true;
    if (!optionalNumberIn(session.durationSeconds, 0, 86400)) return true;
    if (!optionalNumberIn(session.totalVolumeKg, 0, 1000000)) return true;
    const sets = Array.isArray(session.sets) ? session.sets : [];
    if (sets.length > IMPORT_LIMITS.maxSetsPerWorkout) return true;
    return sets.some((set) => !optionalNumberIn(set.weightKg, 0, 1000) || !optionalNumberIn(set.reps, 0, 1000) || !optionalNumberIn(set.durationSeconds, 0, 86400) || !optionalNumberIn(set.distanceKm, 0, 500));
  }

  function invalidOutdoorSession(session) {
    return !isPlainObject(session) || !["Walking", "Running", "Walk", "Run"].includes(String(session.type || "")) || !optionalNumberIn(session.durationSeconds, 0, 172800) || !optionalNumberIn(session.distanceKm, 0, 500) || !optionalNumberIn(session.averagePaceSecondsPerKm, 0, 86400) || (Array.isArray(session.splits) && session.splits.length > 500);
  }

  function invalidMeal(meal) {
    return !isPlainObject(meal) || !["breakfast", "lunch", "dinner", "snack"].includes(String(meal.mealType || "snack")) || !optionalNumberIn(meal.calories, 0, 10000) || !optionalNumberIn(meal.protein, 0, 1000) || !optionalNumberIn(meal.carbs, 0, 2000) || !optionalNumberIn(meal.fat, 0, 1000);
  }

  async function requestNotifications() {
    if (!("Notification" in window)) return toast("Notifications are not supported here.");
    dialog("Enable local reminders?", "Khayubdi can show workout, meal, streak, and rest timer reminders when supported by this browser.", "Request", "primary", async () => {
      try {
        const result = await Notification.requestPermission();
        save((draft) => { draft.notificationState.permission = result; draft.notificationState.promptedAt = new Date().toISOString(); if (result === "denied") draft.notificationState.deniedAt = new Date().toISOString(); }, "notifications_prepared");
      } catch (error) {
        handleError("Notification request failed", error.message);
      }
    });
  }

  function logout() {
    dialog("Logout?", "Your local account remains on this device.", "Logout", "primary", () => window.KhayubdiAuth?.logout?.());
  }

  function deleteAccount() {
    dialog("Delete local account?", "This removes local account credentials. Fitness data is preserved unless you reset the app.", "Delete account", "danger", () => window.KhayubdiAuth?.deleteAccount?.({ preserveFitnessData: true }));
  }

  function resetApp() {
    dialog("Reset app?", "This clears local KHAYUBDI OS state on this device.", "Reset", "danger", () => window.KhayubdiData.reset());
  }

  function routeSafe(route) {
    const safe = route || { tab: "dashboard", view: "home" };
    if (window.KhayubdiOS?.routeTo) window.KhayubdiOS.routeTo(safe.tab || "dashboard", safe.view || "home", safe.detailId || "");
  }

  function track(name, payload = {}, draft = state()) {
    if (draft.analyticsPreference?.enabled === false) return;
    const safePayload = Object.fromEntries(Object.entries(payload || {}).filter(([key]) => !/password|email|token|secret/i.test(key)));
    const last = draft.analyticsQueue?.[0];
    if (last && last.name === name && Date.now() - new Date(last.timestamp).getTime() < 1000) return;
    draft.analyticsQueue = [{ id: uid("analytics"), name, payload: safePayload, timestamp: new Date().toISOString() }, ...(draft.analyticsQueue || [])].slice(0, 200);
  }

  function handleError(title, details) {
    const safe = devMode() ? String(details || "") : "";
    save((draft) => {
      draft.errorMetadata.lastErrorAt = new Date().toISOString();
      draft.errorMetadata.recentErrors = [{ title, details: safe, timestamp: new Date().toISOString() }, ...(draft.errorMetadata.recentErrors || [])].slice(0, 20);
    });
    toast(title);
  }

  function developmentAction(action) {
    if (!devMode()) return;
    if (action === "seed") save((draft) => { draft.developmentFlags.demoDataSeeded = true; draft.workoutSessions.unshift({ id: uid("demo-workout"), title: "Demo Workout", endedAt: new Date().toISOString(), totalVolumeKg: 3200, sets: [] }); }, "demo_seeded");
    if (action === "clear") save((draft) => { draft.developmentFlags.demoDataSeeded = false; draft.workoutSessions = draft.workoutSessions.filter((item) => !String(item.id).includes("demo")); }, "demo_cleared");
    if (action === "first") save((draft) => { draft.onboardingComplete = false; draft.onboardingDraft.completed = false; }, "dev_first_launch");
    if (action === "corrupt") handleError("Simulated storage corruption", "Development simulation only");
  }

  function renderDevPanel() {
    if (!devMode()) return;
    const mount = root("profile");
    if (!mount || $("#releaseDevPanel", mount)) return;
    mount.insertAdjacentHTML("beforeend", `<section class="os-card os-dev-panel" id="releaseDevPanel"><span class="os-eyebrow">Development Mode</span><h2 class="os-section__title">Safe local tools</h2><div class="os-actions"><button class="os-button" data-release-dev="seed">Seed demo data</button><button class="os-button" data-release-dev="clear">Clear demo data</button><button class="os-button" data-release-dev="first">Simulate first launch</button><button class="os-button os-button--danger" data-release-dev="corrupt">Simulate corruption</button></div><pre class="os-card">${esc(JSON.stringify(state().eventLog?.slice(0, 8) || [], null, 2))}</pre></section>`);
  }

  function goalAction(raw) {
    const [action, id] = String(raw || "").split(":");
    save((draft) => {
      if (action === "create" && !draft.goalItems.length) {
        draft.goalItems = [
          { id: "goal-workout", type: "weekly_workout", title: "Weekly workouts", target: 4, unit: "sessions", status: "active", startDate: new Date().toISOString(), targetDate: "" },
          { id: "goal-outdoor", type: "weekly_outdoor", title: "Weekly outdoor distance", target: 12, unit: "km", status: "active", startDate: new Date().toISOString(), targetDate: "" },
          { id: "goal-protein", type: "daily_protein", title: "Daily protein", target: 120, unit: "g", status: "active", startDate: new Date().toISOString(), targetDate: "" },
        ];
      }
      const goal = draft.goalItems.find((item) => item.id === id);
      if (goal && action === "pause") goal.status = "paused";
      if (goal && action === "complete") goal.status = "completed";
      if (goal && action === "reset") goal.status = "active";
    }, action === "create" ? "goal_created" : "goal_updated");
  }

  function prefersReducedMotion() {
    return state().settings?.reducedMotion || matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function toast(message) {
    const host = $("#osToastHost");
    if (!host) return;
    const item = document.createElement("div");
    item.className = "os-toast";
    item.textContent = message;
    host.appendChild(item);
    setTimeout(() => item.remove(), 2800);
  }

  function uid(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function root(id) {
    return document.getElementById(`os-${id}`);
  }

  return { init, showSplash, offerRecovery, showAuth, showOnboarding, closeOverlay, dialog, confirmAction, editWorkoutSet, track, handleError, toast };
})();

window.KhayubdiRelease = KhayubdiRelease;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", KhayubdiRelease.init);
} else {
  KhayubdiRelease.init();
}
