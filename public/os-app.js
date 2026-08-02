/* KHAYUBDI OS 2.0 — DEV-04 Core App Screens */

const KhayubdiOS = (() => {
  const tabMap = {
    dashboard: { label: "Home", view: "home" },
    track: { label: "Gym", view: "gymHome" },
    outdoor: { label: "Outdoor", view: "outdoorHome" },
    progress: { label: "Records", view: "recordsHome" },
    profile: { label: "Profile", view: "profileOverview" },
  };

  let previousFocus = null;
  let lastMealResult = null;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const data = () => window.KhayubdiData?.read?.() || {};
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[m]));

  function init() {
    ensureShell();
    bindOnce();
    if (!window.KhayubdiAuth?.isCanonical || window.KhayubdiAuth.requireSession({ silent: true })) renderAll();
    restoreRoute();
  }

  function ensureShell() {
    if (!$("#osTopbar")) {
      document.body.insertAdjacentHTML("afterbegin", `
        <header class="os-topbar" id="osTopbar">
          <div class="os-brand">
            <span class="os-brand__title">KHAYUBDI OS</span>
            <span class="os-brand__meta" id="osTopbarMeta">Closed Beta · Online</span>
          </div>
          <button class="os-button os-button--ghost" type="button" data-os-navigate="profile" data-os-view="profileSettings" aria-label="Open settings">⚙️</button>
        </header>
      `);
    }
    if (!$("#osNutritionFab")) {
      document.body.insertAdjacentHTML("beforeend", `<button class="os-fab" id="osNutritionFab" type="button" data-os-open-nutrition aria-label="Quick add nutrition">📷</button>`);
    }
    if (!$("#osNutritionSheet")) {
      document.body.insertAdjacentHTML("beforeend", `<div class="os-sheet-backdrop" id="osNutritionSheet" role="dialog" aria-modal="true" aria-labelledby="osNutritionTitle" aria-describedby="osNutritionDescription"></div>`);
    }
    if (!$("#osToastHost")) {
      document.body.insertAdjacentHTML("beforeend", `<div class="os-toast-host" id="osToastHost" aria-live="polite" aria-atomic="true"></div>`);
    }
    document.body.classList.add("os-shell");
    renderOfflineState();
  }

  function bindOnce() {
    if (document.documentElement.dataset.osDev04Bound) return;
    document.documentElement.dataset.osDev04Bound = "true";
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", applyRouteFromHash);
    window.addEventListener("online", renderOfflineState);
    window.addEventListener("offline", renderOfflineState);
    window.addEventListener("khayubdi:datachange", () => {
      if (!window.KhayubdiAuth?.isCanonical || window.KhayubdiAuth.requireSession({ silent: true })) renderAll();
    });
    const appShell = $("#appShell");
    if (appShell) new MutationObserver(syncShellVisibility).observe(appShell, { attributes: true, attributeFilter: ["class"] });
  }

  function onClick(event) {
    const nav = event.target.closest("[data-os-navigate]");
    if (nav) {
      routeTo(nav.dataset.osNavigate, nav.dataset.osView, nav.dataset.osId);
      return;
    }
    const detail = event.target.closest("[data-os-workout-detail]");
    if (detail) routeTo("track", "workoutDetail", detail.dataset.osWorkoutDetail);
    const exercise = event.target.closest("[data-os-exercise-detail]");
    if (exercise) routeTo("track", "exerciseDetail", exercise.dataset.osExerciseDetail);
    const outdoor = event.target.closest("[data-os-outdoor-setup]");
    if (outdoor) routeTo("outdoor", "activitySetup", outdoor.dataset.osOutdoorSetup);
    if (event.target.closest("[data-os-gps-ready]")) routeTo("outdoor", "gpsReady", $("#osActivityType")?.value || "Running");
    if (event.target.closest("[data-os-open-nutrition]")) openNutritionSheet();
    if (event.target.closest("[data-os-close-sheet]")) closeNutritionSheet();
    if (event.target.closest("[data-os-detect-food]")) simulateFoodDetection();
    if (event.target.closest("[data-os-save-meal]")) saveMeal();
    if (event.target.closest("[data-os-reset]")) resetAppData();
  }

  function routeTo(tab, view, detailId) {
    const safeTab = tabMap[tab] ? tab : "dashboard";
    const safeView = view || tabMap[safeTab].view;
    const hash = `tab=${encodeURIComponent(safeTab)}&view=${encodeURIComponent(safeView)}${detailId ? `&id=${encodeURIComponent(detailId)}` : ""}`;
    if (location.hash.slice(1) !== hash) location.hash = hash;
    applyRoute({ tab: safeTab, view: safeView, detailId: detailId || "" });
  }

  function restoreRoute() {
    if (location.hash) applyRouteFromHash();
    else {
      const route = data().route || { tab: "dashboard", view: "home" };
      routeTo(route.tab, route.view, route.detailId);
    }
  }

  function applyRouteFromHash() {
    const params = new URLSearchParams(location.hash.replace(/^#/, ""));
    applyRoute({ tab: params.get("tab") || "dashboard", view: params.get("view") || "home", detailId: params.get("id") || "" });
  }

  function applyRoute(route) {
    const safeTab = tabMap[route.tab] ? route.tab : "dashboard";
    const safeView = route.view || tabMap[safeTab].view;
    if (window.KhayubdiAuth?.isCanonical && !window.KhayubdiAuth.requireSession({ silent: true })) {
      window.KhayubdiAuth.showAuth("login", "Please log in to continue.");
      return;
    }
    window.KhayubdiData?.setRoute?.({ tab: safeTab, view: safeView, detailId: route.detailId || "" });
    if (typeof switchTab === "function") switchTab(safeTab);
    updateActiveNav(safeTab);
    renderAll();
  }

  function updateActiveNav(tab) {
    $$(".bottom-tab, [data-tab]").forEach((item) => {
      const active = item.dataset.tab === tab || item.dataset.osNavigate === tab;
      item.classList.toggle("active", active);
      item.setAttribute("aria-current", active ? "page" : "false");
    });
  }

  function sectionRoot(id) {
    const section = document.getElementById(id);
    if (!section) return null;
    let root = $(`#os-${id}`, section);
    if (!root) {
      root = document.createElement("div");
      root.id = `os-${id}`;
      root.className = "os-view-root";
      section.prepend(root);
    }
    return root;
  }

  function renderAll() {
    ensureShell();
    syncShellVisibility();
    renderHome();
    renderGym();
    renderOutdoor();
    renderRecords();
    renderProfile();
    renderOfflineState();
    updateActiveNav(data().route?.tab || "dashboard");
    window.KhayubdiTraining?.render?.();
  }

  function syncShellVisibility() {
    const appShell = $("#appShell");
    const isAppVisible = !appShell || !appShell.classList.contains("hidden");
    $("#osTopbar")?.toggleAttribute("hidden", !isAppVisible);
    $("#osNutritionFab")?.toggleAttribute("hidden", !isAppVisible);
  }

  function renderHome() {
    const state = data();
    const root = sectionRoot("dashboard");
    if (!root) return;
    const mealsToday = state.nutritionMeals || [];
    const calories = sum(mealsToday, "calories");
    const protein = sum(mealsToday, "protein");
    const carbs = sum(mealsToday, "carbs");
    const fat = sum(mealsToday, "fat");
    const workoutDone = Math.min(100, Math.round((state.recentWorkouts?.length || 0) / 4 * 100));
    const outdoorDone = Math.min(100, Math.round(sum(state.outdoorActivities || [], "distance") / 12 * 100));
    root.innerHTML = `
      <section class="os-hero" aria-labelledby="osHomeTitle">
        <span class="os-eyebrow">Today</span>
        <h1 class="os-title" id="osHomeTitle">👋 สวัสดี ${esc(state.profile?.name || "Khayubdi Athlete")}</h1>
        <p class="os-subtitle">พร้อมทำให้วันนี้ดีกว่าเมื่อวานไหม?</p>
        <div class="os-actions">
          <button class="os-button os-button--primary" type="button" data-os-navigate="track">Start Workout</button>
          <button class="os-button" type="button" data-os-open-nutrition>Log Meal</button>
          <button class="os-button os-button--ghost" type="button" data-os-navigate="dashboard">Ask AI</button>
        </div>
      </section>
      <section class="os-section" aria-labelledby="osSummaryTitle">
        <div class="os-section__head"><h2 class="os-section__title" id="osSummaryTitle">Today's Summary</h2><span class="os-chip">${esc(state.profile?.streak || 0)} day streak</span></div>
        <div class="os-grid os-grid--3">
          ${statCard("Workout", `${workoutDone}%`, "Weekly target", workoutDone)}
          ${statCard("Outdoor", `${outdoorDone}%`, "Distance goal", outdoorDone)}
          ${statCard("Nutrition", `${calories}`, "Calories logged", Math.min(100, Math.round(calories / 2200 * 100)))}
        </div>
      </section>
      <section class="os-grid os-grid--tablet-2">
        <article class="os-card"><div class="os-row"><div><span class="os-stat__label">Macros</span><div class="os-stat__value">${protein}g P</div><p class="os-stat__hint">${carbs}g carbs · ${fat}g fat</p></div><div class="os-ring" style="--value:${Math.min(100, Math.round(protein / 150 * 100))}" data-label="${Math.min(100, Math.round(protein / 150 * 100))}%"></div></div></article>
        <article class="os-card"><span class="os-stat__label">Weekly consistency</span><div class="os-stat__value">82%</div><div class="os-chart-bars" aria-label="Weekly consistency chart">${[72,88,60,90,82,76,95].map(v => `<span style="--value:${v}%"></span>`).join("")}</div></article>
      </section>
      <article class="os-card"><span class="os-eyebrow">AI Coach</span><h2 class="os-section__title">Keep today simple</h2><p class="os-subtitle">Recovery and adherence look stable. Start the recommended workout or log your next meal.</p></article>
      <section class="os-section"><h2 class="os-section__title">Recent Activity</h2>${recentList(state)}</section>
    `;
  }

  function statCard(label, value, hint, progress) {
    return `<article class="os-card"><span class="os-stat__label">${label}</span><div class="os-stat__value">${value}</div><p class="os-stat__hint">${hint}</p><div class="os-progress" aria-label="${label} progress"><span style="--value:${progress}%"></span></div></article>`;
  }

  function recentList(state) {
    const items = [
      ...(state.recentWorkouts || []).slice(0, 2).map((w) => `${w.title} · ${w.duration} min`),
      ...(state.nutritionMeals || []).slice(0, 2).map((m) => `${m.name} · ${m.calories} kcal`),
    ];
    if (!items.length) return empty("🏁", "No activity yet", "Start a workout or log a meal to build your timeline.", "Start Workout", "track");
    return `<div class="os-stack">${items.map((item) => `<div class="os-card os-row"><span>${esc(item)}</span><span aria-hidden="true">›</span></div>`).join("")}</div>`;
  }

  function renderGym() {
    const state = data();
    const root = sectionRoot("track");
    if (!root) return;
    const route = state.route || {};
    if (route.view === "workoutLibrary") return renderWorkoutLibrary(root, state);
    if (route.view === "workoutDetail") return renderWorkoutDetail(root, state, route.detailId);
    if (route.view === "exerciseDetail") return renderExerciseDetail(root, state, route.detailId);
    if (route.view === "activeWorkout" || route.view === "workoutSummary") return;
    root.innerHTML = `
      <section class="os-hero"><span class="os-eyebrow">Gym</span><h1 class="os-title">Workout วันนี้</h1><p class="os-subtitle">Start fast or choose a prepared session.</p><button class="os-button os-button--primary" type="button" data-os-workout-detail="w-upper">Start Workout</button></section>
      <section class="os-grid os-grid--tablet-2">
        <button class="os-card os-card--button" data-os-workout-detail="w-upper"><span class="os-stat__label">Continue workout</span><strong>Upper Body Strength</strong><span class="os-stat__hint">45 min · 8 exercises</span></button>
        <button class="os-card os-card--button" data-os-navigate="track" data-os-view="workoutLibrary"><span class="os-stat__label">Recommended</span><strong>Browse workout library</strong><span class="os-stat__hint">Search, filters, favorites</span></button>
      </section>
      <section class="os-section"><h2 class="os-section__title">Categories</h2><div class="os-actions">${["Strength","Hypertrophy","Cardio","Mobility"].map(c => `<button class="os-chip" data-os-navigate="track" data-os-view="workoutLibrary">${c}</button>`).join("")}</div></section>
      <section class="os-section"><h2 class="os-section__title">Favorites</h2><div class="os-grid">${state.workouts.filter(w => w.favorite).map(workoutButton).join("")}</div></section>`;
  }

  function renderWorkoutLibrary(root, state) {
    root.innerHTML = `<section class="os-section"><div class="os-section__head"><h1 class="os-title">Workout Library</h1><button class="os-button os-button--ghost" data-os-navigate="track">Back</button></div><input class="os-input" type="search" placeholder="Search workouts" aria-label="Search workouts"><div class="os-actions">${["Easy","Medium","Gym","Bodyweight","Dumbbells"].map(c => `<button class="os-chip">${c}</button>`).join("")}</div><div class="os-grid">${state.workouts.map(workoutButton).join("")}</div></section>`;
  }

  function workoutButton(workout) {
    return `<button class="os-card os-card--button" data-os-workout-detail="${esc(workout.id)}"><span class="os-stat__label">${esc(workout.category)} · ${esc(workout.difficulty)}</span><strong>${esc(workout.title)}</strong><span class="os-stat__hint">${esc(workout.duration)} min · ${esc(workout.equipment)}</span></button>`;
  }

  function renderWorkoutDetail(root, state, id) {
    const workout = state.workouts.find((w) => w.id === id) || state.workouts[0];
    root.innerHTML = `<section class="os-hero"><button class="os-button os-button--ghost" data-os-navigate="track">Back</button><h1 class="os-title">${esc(workout.title)}</h1><p class="os-subtitle">${esc(workout.description)}</p><div class="os-actions"><span class="os-chip">${workout.duration} min</span><span class="os-chip">${esc(workout.difficulty)}</span><span class="os-chip">${esc(workout.equipment)}</span></div><button class="os-button os-button--primary" type="button">Start workout in DEV-05</button></section><section class="os-section"><h2 class="os-section__title">Exercise list</h2><div class="os-grid">${workout.exercises.map((name) => `<button class="os-card os-card--button" data-os-exercise-detail="${esc(name)}"><strong>${esc(name)}</strong><span class="os-stat__hint">Instructions, tips, previous performance</span></button>`).join("")}</div></section>`;
  }

  function renderExerciseDetail(root, state, name) {
    root.innerHTML = `<section class="os-hero"><button class="os-button os-button--ghost" data-os-navigate="track" data-os-view="workoutDetail" data-os-id="w-upper">Back</button><h1 class="os-title">${esc(name || "Exercise")}</h1><p class="os-subtitle">Media placeholder · target muscles · coaching cues.</p></section><div class="os-grid os-grid--tablet-2">${["Target muscles","Instructions","Common mistakes","Coaching tips","Previous performance"].map((title) => `<article class="os-card"><h2 class="os-section__title">${title}</h2><p class="os-subtitle">${exerciseCopy(title)}</p></article>`).join("")}</div>`;
  }

  function exerciseCopy(title) {
    return ({ "Target muscles": "Primary and supporting muscles are shown here.", "Instructions": "Controlled setup, stable range of motion, smooth reps.", "Common mistakes": "Avoid rushing reps or losing posture under fatigue.", "Coaching tips": "Keep effort consistent and stop before form breaks.", "Previous performance": "Recent sets and best effort will appear here." })[title];
  }

  function renderOutdoor() {
    const state = data();
    const root = sectionRoot("outdoor");
    if (!root) return;
    const view = state.route?.view;
    if (view === "activitySetup") return renderActivitySetup(root, state.route.detailId || "Running");
    if (view === "gpsReady") return renderGpsReady(root, state.route.detailId || "Running");
    if (view === "outdoorLive" || view === "outdoorSummary") return;
    root.innerHTML = `<section class="os-hero"><span class="os-eyebrow">Outdoor</span><h1 class="os-title">Move outside</h1><p class="os-subtitle">Quick start walking or running with GPS readiness prepared for DEV-05.</p><div class="os-actions"><button class="os-button os-button--primary" data-os-outdoor-setup="Running">Start Run</button><button class="os-button" data-os-outdoor-setup="Walking">Start Walk</button></div></section><div class="os-grid os-grid--2">${statCard("Weekly distance", `${sum(state.outdoorActivities,"distance").toFixed(1)} km`, "12 km goal", Math.min(100, sum(state.outdoorActivities,"distance") / 12 * 100))}${statCard("Pace", "6:10", "Average / km", 68)}</div><section class="os-section"><h2 class="os-section__title">Recent activities</h2><div class="os-grid">${state.outdoorActivities.map(a => `<article class="os-card"><strong>${esc(a.type)}</strong><span class="os-stat__hint">${a.distance} km · ${a.duration} min · ${a.pace}</span></article>`).join("")}</div></section>`;
  }

  function renderActivitySetup(root, type) {
    root.innerHTML = `<section class="os-section"><div class="os-section__head"><h1 class="os-title">Activity Setup</h1><button class="os-button os-button--ghost" data-os-navigate="outdoor">Back</button></div><label class="os-stack">Activity type<select id="osActivityType" class="os-select"><option ${type === "Running" ? "selected" : ""}>Running</option><option ${type === "Walking" ? "selected" : ""}>Walking</option></select></label><label class="os-stack">Goal type<select class="os-select"><option>Distance</option><option>Time</option><option>Open goal</option></select></label><div class="os-grid os-grid--2"><label class="os-stack">Distance goal<input class="os-input" inputmode="decimal" value="5" aria-label="Distance goal"></label><label class="os-stack">Time goal<input class="os-input" inputmode="numeric" value="30" aria-label="Time goal"></label></div><label class="os-row os-card"><span>Audio cues</span><input type="checkbox" checked></label><article class="os-card"><span class="os-stat__label">GPS permission</span><strong>Simulated: Ready</strong></article><button class="os-button os-button--primary" data-os-gps-ready>Continue</button></section>`;
  }

  function renderGpsReady(root, type) {
    root.innerHTML = `<section class="os-hero"><button class="os-button os-button--ghost" data-os-navigate="outdoor" data-os-view="activitySetup" data-os-id="${esc(type)}">Back</button><span class="os-eyebrow">GPS Ready</span><h1 class="os-title">${esc(type)} starts soon</h1><div class="os-ring" style="--value:92" data-label="GPS"></div><p class="os-subtitle">Signal strong · permission granted · countdown prepared.</p><div class="os-actions"><button class="os-button os-button--primary">Start in DEV-05</button><button class="os-button os-button--danger" data-os-navigate="outdoor">Cancel</button></div></section>`;
  }

  function renderRecords() {
    const state = data();
    const root = sectionRoot("progress");
    if (!root) return;
    root.innerHTML = `<section class="os-section"><div class="os-section__head"><h1 class="os-title">Records</h1><div class="os-actions">${["Week","Month","Year"].map(f => `<button class="os-chip">${f}</button>`).join("")}</div></div><div class="os-grid os-grid--2 os-grid--tablet-3">${statCard("Workout volume", `${sum(state.recentWorkouts,"volume")}`, "kg this week", 72)}${statCard("Frequency", `${state.recentWorkouts.length}`, "sessions", 50)}${statCard("Outdoor", `${sum(state.outdoorActivities,"distance").toFixed(1)} km`, "distance", 65)}${statCard("Calories", `${sum(state.nutritionMeals,"calories")}`, "logged", 58)}${statCard("Consistency", "82%", "score", 82)}</div><article class="os-card"><h2 class="os-section__title">Calories trend</h2><div class="os-chart-bars" role="img" aria-label="Seven day calories trend">${[42,66,58,74,70,82,64].map(v => `<span style="--value:${v}%"></span>`).join("")}</div><p class="os-stat__hint">Text summary: logged intake is trending stable across recent days.</p></article><section class="os-section"><h2 class="os-section__title">Personal records</h2><div class="os-grid">${state.personalRecords.map(pr => `<article class="os-card os-row"><strong>${esc(pr.title)}</strong><span>${esc(pr.value)}</span></article>`).join("")}</div></section></section>`;
  }

  function renderProfile() {
    const state = data();
    const root = sectionRoot("profile");
    if (!root) return;
    const view = state.route?.view;
    const settings = state.settings || {};
    root.innerHTML = `<section class="os-hero"><div class="os-row"><div class="os-ring" style="--value:${Math.min(100, (state.profile?.xp || 0) / 20)}" data-label="${esc(state.profile?.avatar || "K")}"></div><div><h1 class="os-title">${esc(state.profile?.name || "Khayubdi Athlete")}</h1><p class="os-subtitle">Level ${esc(state.profile?.level || 1)} · ${esc(state.profile?.xp || 0)} XP</p></div></div></section><div class="os-grid os-grid--2">${statCard("Current streak", `${state.profile?.streak || 0}`, "days", 70)}${statCard("Achievements", "4", "preview", 40)}</div><section class="os-section"><h2 class="os-section__title">Goals</h2><div class="os-grid">${Object.entries(state.goals || {}).map(([k,v]) => `<article class="os-card"><span class="os-stat__label">${esc(k)}</span><strong>${esc(v)}</strong></article>`).join("")}</div></section><section class="os-section"><h2 class="os-section__title">Settings</h2><div class="os-grid"><label class="os-row os-card"><span>Theme</span><select class="os-select" aria-label="Theme"><option>${esc(settings.theme || "dark")}</option></select></label><label class="os-row os-card"><span>Language</span><select class="os-select" aria-label="Language"><option>${esc(settings.language || "en")}</option></select></label><label class="os-row os-card"><span>Reduced motion</span><input type="checkbox" ${settings.reducedMotion ? "checked" : ""}></label><button class="os-button os-button--danger" data-os-reset>Reset local app data</button></div></section><section class="os-section"><h2 class="os-section__title">About</h2><article class="os-card"><p class="os-subtitle">Version 1.0.0 RC · Cache khayubdi-exercise-v70 · PWA ${isStandalone() ? "Installed" : "Browser"}</p><div class="os-actions"><a class="os-button os-button--ghost" href="/privacy.html">Privacy</a><a class="os-button os-button--ghost" href="/terms.html">Terms</a></div></article></section>`;
  }

  function openNutritionSheet() {
    previousFocus = document.activeElement;
    lastMealResult = null;
    const sheet = $("#osNutritionSheet");
    sheet.innerHTML = nutritionSheetMarkup("idle");
    sheet.setAttribute("aria-hidden", "false");
    sheet.classList.add("is-open");
    sheet.onkeydown = trapSheetKeydown;
    $("button, input, select", sheet)?.focus();
  }

  function closeNutritionSheet() {
    const sheet = $("#osNutritionSheet");
    sheet.classList.remove("is-open");
    sheet.setAttribute("aria-hidden", "true");
    sheet.onkeydown = null;
    sheet.innerHTML = "";
    previousFocus?.focus?.();
  }

  function nutritionSheetMarkup(mode) {
    const result = lastMealResult || { name: "Chicken rice bowl", calories: 520, protein: 42, carbs: 58, fat: 10, serving: "1 bowl", mealType: "lunch" };
    return `<div class="os-sheet"><div class="os-section__head"><h2 class="os-section__title" id="osNutritionTitle">Quick add nutrition</h2><button class="os-button os-button--ghost" data-os-close-sheet aria-label="Close nutrition sheet">Close</button></div><p class="os-subtitle" id="osNutritionDescription">Add a meal locally using simulated detection or manual values.</p>${mode === "loading" ? `<div class="os-skeleton" role="status" aria-label="Detecting food"></div><p class="os-subtitle">Detecting food...</p>` : `<article class="os-card os-empty"><div class="os-empty__icon">📷</div><h3>Camera placeholder</h3><p class="os-subtitle">Use simulated food detection, gallery, or manual entry.</p><div class="os-actions"><button class="os-button os-button--primary" data-os-detect-food>Detect food</button><button class="os-button">Gallery</button><button class="os-button">Manual entry</button></div></article><div class="os-grid os-grid--2"><label class="os-stack">Food<input class="os-input" id="osMealName" value="${esc(result.name)}"></label><label class="os-stack">Serving<input class="os-input" id="osMealServing" value="${esc(result.serving)}"></label><label class="os-stack">Calories<input class="os-input" id="osMealCalories" inputmode="numeric" aria-label="Calories" value="${esc(result.calories)}"></label><label class="os-stack">Protein grams<input class="os-input" id="osMealProtein" inputmode="decimal" aria-label="Protein grams" value="${esc(result.protein)}"></label><label class="os-stack">Carbohydrates grams<input class="os-input" id="osMealCarbs" inputmode="decimal" aria-label="Carbohydrates grams" value="${esc(result.carbs)}"></label><label class="os-stack">Fat grams<input class="os-input" id="osMealFat" inputmode="decimal" aria-label="Fat grams" value="${esc(result.fat)}"></label></div><label class="os-stack">Meal type<select class="os-select" id="osMealType">${["breakfast","lunch","dinner","snack"].map(t => `<option ${result.mealType === t ? "selected" : ""}>${t}</option>`).join("")}</select></label><button class="os-button os-button--primary" data-os-save-meal>Save meal</button>`}</div>`;
  }


  function trapSheetKeydown(event) {
    const sheet = $("#osNutritionSheet");
    if (!sheet?.classList.contains("is-open")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeNutritionSheet();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = $$("button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])", sheet);
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

  function simulateFoodDetection() {
    const sheet = $("#osNutritionSheet");
    sheet.innerHTML = nutritionSheetMarkup("loading");
    setTimeout(() => {
      lastMealResult = { name: "ข้าวมันไก่", calories: 610, protein: 32, carbs: 72, fat: 20, serving: "1 plate", mealType: "lunch" };
      sheet.innerHTML = nutritionSheetMarkup("result");
      $("#osMealName", sheet)?.focus();
    }, 650);
  }

  function saveMeal() {
    const meal = {
      name: $("#osMealName")?.value,
      serving: $("#osMealServing")?.value,
      calories: $("#osMealCalories")?.value,
      protein: $("#osMealProtein")?.value,
      carbs: $("#osMealCarbs")?.value,
      fat: $("#osMealFat")?.value,
      mealType: $("#osMealType")?.value,
    };
    window.KhayubdiData?.addMeal?.(meal);
    closeNutritionSheet();
    toast("Meal saved locally.");
  }

  function resetAppData() {
    const confirmAction = window.KhayubdiRelease?.confirmAction;
    if (typeof confirmAction === "function") {
      confirmAction({
        title: "Reset local app data?",
        description: "This clears local KHAYUBDI OS state on this device.",
        actionLabel: "Reset app",
        tone: "danger",
        onConfirm: () => {
          window.KhayubdiData?.reset?.();
          toast("Local OS data reset.");
        },
      });
      return;
    }
    toast("Reset confirmation is unavailable.");
  }

  function toast(message) {
    const host = $("#osToastHost");
    if (!host) return;
    const item = document.createElement("div");
    item.className = "os-toast";
    item.textContent = message;
    host.appendChild(item);
    setTimeout(() => item.remove(), 2600);
  }

  function renderOfflineState() {
    const meta = $("#osTopbarMeta");
    if (meta) meta.textContent = `Closed Beta · ${navigator.onLine ? "Online" : "Offline"}`;
    document.body.classList.toggle("is-offline", !navigator.onLine);
  }

  function empty(icon, title, message, action, tab) {
    return `<article class="os-card os-empty"><div class="os-empty__icon">${icon}</div><h3>${esc(title)}</h3><p class="os-subtitle">${esc(message)}</p><button class="os-button os-button--primary" data-os-navigate="${esc(tab)}">${esc(action)}</button></article>`;
  }

  function sum(items, key) {
    return (items || []).reduce((total, item) => total + Number(item[key] || 0), 0);
  }

  function isStandalone() {
    return window.matchMedia?.("(display-mode: standalone)")?.matches || navigator.standalone;
  }

  return { init, renderAll, routeTo };
})();

window.KhayubdiOS = KhayubdiOS;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", KhayubdiOS.init);
} else {
  KhayubdiOS.init();
}
