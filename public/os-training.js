/* KHAYUBDI OS 2.0 â€” DEV-05 Active Training Engines */

const KhayubdiTraining = (() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const state = () => window.KhayubdiData.read();
  const save = (mutator, eventName, payload = {}) => {
    const result = window.KhayubdiData.update((draft) => {
      const next = mutator(draft) || draft;
      if (eventName) emit(next, eventName, payload);
      return next;
    });
    if (!result?.ok) toast(result?.message || "Progress is temporarily not saved.");
    return result;
  };
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[m]));
  const kgToUnit = (kg, units) => units === "imperial" ? kg / 0.45359237 : kg;
  const unitToKg = (weight, units) => units === "imperial" ? weight * 0.45359237 : weight;
  const unitLabel = (units) => units === "imperial" ? "lb" : "kg";
  const round = (value, places = 1) => Math.round(Number(value || 0) * (10 ** places)) / (10 ** places);
  let tickId = 0;
  let lastRenderKey = "";

  function init() {
    bindOnce();
    render();
    startTicker();
  }

  function bindOnce() {
    if (document.documentElement.dataset.osDev05Bound) return;
    document.documentElement.dataset.osDev05Bound = "true";
    document.addEventListener("click", onClick);
    document.addEventListener("change", onChange);
    window.addEventListener("hashchange", render);
    window.addEventListener("khayubdi:datachange", render);
  }

  function onClick(event) {
    const startWorkout = event.target.closest("[data-dev-start-workout]");
    if (startWorkout) return startWorkoutSession(startWorkout.dataset.devStartWorkout);
    const logSet = event.target.closest("[data-dev-log-set]");
    if (logSet) return logCurrentSet();
    const editSet = event.target.closest("[data-dev-edit-set]");
    if (editSet) return editCompletedSet(editSet.dataset.devEditSet);
    const deleteSet = event.target.closest("[data-dev-delete-set]");
    if (deleteSet) return deleteCompletedSet(deleteSet.dataset.devDeleteSet);
    const move = event.target.closest("[data-dev-move-exercise]");
    if (move) return moveExercise(Number(move.dataset.devMoveExercise));
    const workoutAction = event.target.closest("[data-dev-workout-action]");
    if (workoutAction) return workoutControl(workoutAction.dataset.devWorkoutAction);
    const timerAction = event.target.closest("[data-dev-rest-action]");
    if (timerAction) return restControl(timerAction.dataset.devRestAction);
    const finishSave = event.target.closest("[data-dev-save-summary]");
    if (finishSave) return route("track", "gymHome");
    const startOutdoor = event.target.closest("[data-dev-start-outdoor]");
    if (startOutdoor) return startOutdoorActivity();
    const outdoorAction = event.target.closest("[data-dev-outdoor-action]");
    if (outdoorAction) return outdoorControl(outdoorAction.dataset.devOutdoorAction);
    const range = event.target.closest("[data-dev-record-range]");
    if (range) return setRecordRange(range.dataset.devRecordRange);
  }

  function onChange(event) {
    if (event.target.matches("[data-dev-note]")) {
      const note = event.target.value;
      save((draft) => {
        if (draft.activeWorkout) draft.activeWorkout.notes = note;
      });
    }
  }

  function render() {
    renderResumeCards();
    const current = state();
    const routeState = current.route || {};
    if (routeState.tab === "track") renderGymTraining(current, routeState);
    if (routeState.tab === "outdoor") renderOutdoorTraining(current, routeState);
    if (routeState.tab === "progress") renderRecords(current);
  }

  function root(id) {
    return document.getElementById(`os-${id}`);
  }

  function route(tab, view, id = "") {
    if (window.KhayubdiOS?.routeTo) window.KhayubdiOS.routeTo(tab, view, id);
  }

  function emit(draft, type, payload) {
    const event = { id: uid("event"), type, payload, timestamp: new Date().toISOString() };
    draft.eventLog = [event, ...(Array.isArray(draft.eventLog) ? draft.eventLog : [])].slice(0, 160);
    window.dispatchEvent(new CustomEvent(`khayubdi:${type}`, { detail: payload }));
  }

  function uid(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function normalizeExercise(item, index, workout) {
    if (typeof item !== "string") return {
      id: item.id || `exercise-${index + 1}`,
      name: item.name || item.nameEn || `Exercise ${index + 1}`,
      targetMuscle: item.targetMuscle || item.primaryMuscle || "Full Body",
      inputType: item.inputType || "weight-reps",
      targetSets: Number(item.targetSets || item.defaultSets || 3),
      targetReps: Number(item.targetReps || item.defaultReps || 10),
      targetDuration: Number(item.targetDuration || 0),
      targetDistance: Number(item.targetDistance || 0),
      suggestedWeightKg: Number(item.suggestedWeightKg || 0),
      defaultRestSeconds: Number(item.defaultRestSeconds || workout.defaultRestSeconds || 90),
      completedSets: item.completedSets || [],
    };
    const isTimed = item.toLowerCase().includes("plank") || item.toLowerCase().includes("walk") || item.toLowerCase().includes("run");
    return {
      id: item.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `exercise-${index + 1}`,
      name: item,
      targetMuscle: "Full Body",
      inputType: isTimed ? "duration" : "weight-reps",
      targetSets: isTimed ? 1 : 3,
      targetReps: isTimed ? 0 : 10,
      targetDuration: isTimed ? 45 : 0,
      targetDistance: 0,
      suggestedWeightKg: 0,
      defaultRestSeconds: Number(workout.defaultRestSeconds || 90),
      completedSets: [],
    };
  }

  function startWorkoutSession(workoutId) {
    save((draft) => {
      const workout = draft.workouts.find((item) => item.id === workoutId) || draft.workouts[0];
      draft.activeWorkout = {
        id: uid("active-workout"),
        workoutId: workout.id,
        title: workout.title,
        startedAt: new Date().toISOString(),
        pausedAt: null,
        totalPausedMs: 0,
        status: "active",
        currentExerciseIndex: 0,
        exercises: (workout.exercises || []).map((item, index) => normalizeExercise(item, index, workout)),
        restTimer: null,
        notes: "",
      };
      draft.route = { tab: "track", view: "activeWorkout", detailId: draft.activeWorkout.id };
    }, "workout_started", { workoutId });
    route("track", "activeWorkout");
  }

  function renderGymTraining(current, routeState) {
    const mount = root("track");
    if (!mount) return;
    if (routeState.view === "workoutDetail") return renderWorkoutDetail(mount, current, routeState.detailId);
    if (routeState.view === "activeWorkout") return renderActiveWorkout(mount, current);
    if (routeState.view === "workoutSummary") return renderWorkoutSummary(mount, current, routeState.detailId);
    if (current.activeWorkout && routeState.view === "gymHome") appendResume(mount, "workout");
  }

  function renderWorkoutDetail(mount, current, workoutId) {
    const workout = current.workouts.find((item) => item.id === workoutId) || current.workouts[0];
    mount.innerHTML = `
      <section class="os-hero">
        <button class="os-button os-button--ghost" data-os-navigate="track">Back</button>
        <span class="os-eyebrow">Workout Detail</span>
        <h1 class="os-title">${esc(workout.title)}</h1>
        <p class="os-subtitle">${esc(workout.description)}</p>
        <div class="os-actions"><span class="os-chip">${workout.duration} min</span><span class="os-chip">${esc(workout.difficulty)}</span><span class="os-chip">${esc(workout.equipment)}</span></div>
        <button class="os-button os-button--primary" data-dev-start-workout="${esc(workout.id)}">Start Workout</button>
      </section>
      <section class="os-section"><h2 class="os-section__title">Exercises</h2><div class="os-grid">${(workout.exercises || []).map((item, index) => {
        const ex = normalizeExercise(item, index, workout);
        return `<button class="os-card os-card--button" data-os-exercise-detail="${esc(ex.name)}"><strong>${esc(ex.name)}</strong><span class="os-stat__hint">${esc(ex.targetMuscle)} Â· ${ex.targetSets} sets</span></button>`;
      }).join("")}</div></section>`;
  }

  function renderActiveWorkout(mount, current) {
    const active = current.activeWorkout;
    if (!active) {
      mount.innerHTML = empty("No active workout", "Start a workout to begin logging sets.", "Open Gym", "track");
      return;
    }
    const exercise = active.exercises[active.currentExerciseIndex] || active.exercises[0];
    const units = current.settings?.units || "metric";
    const previous = previousPerformance(current, exercise.id);
    const suggestedWeight = previous?.weightKg ?? exercise.suggestedWeightKg ?? 0;
    mount.innerHTML = `
      <section class="os-hero os-live">
        <div class="os-row"><span class="os-eyebrow">Live Workout</span><span class="os-chip" id="devWorkoutElapsed">${formatDuration(elapsed(active))}</span></div>
        <h1 class="os-title">${esc(active.title)}</h1>
        <p class="os-subtitle">${active.status === "paused" ? "Paused" : "Exercise"} ${active.currentExerciseIndex + 1} of ${active.exercises.length}</p>
        <div class="os-actions">
          ${active.status === "paused" ? `<button class="os-button os-button--primary" data-dev-workout-action="resume">Resume</button>` : `<button class="os-button" data-dev-workout-action="pause">Pause</button>`}
          <button class="os-button os-button--danger" data-dev-workout-action="finish">Finish</button>
          <button class="os-button os-button--ghost" data-dev-workout-action="save-exit">Save & Exit</button>
        </div>
      </section>
      ${active.restTimer ? restTimerCard(active.restTimer) : ""}
      <section class="os-card os-stack" aria-labelledby="devActiveExerciseTitle">
        <div class="os-row"><span class="os-chip">${esc(exercise.targetMuscle)}</span><span class="os-stat__hint">Previous: ${previous ? `${round(kgToUnit(previous.weightKg, units))}${unitLabel(units)} Ã— ${previous.reps}` : "No history"}</span></div>
        <h2 class="os-title" id="devActiveExerciseTitle">${esc(exercise.name)}</h2>
        <div class="os-card os-empty"><div class="os-empty__icon">ðŸŽ¬</div><p class="os-subtitle">Exercise media placeholder</p></div>
        <div class="os-grid os-grid--2">
          <label class="os-stack">Set type<select class="os-select" id="devSetType"><option>Working</option><option>Warm-up</option><option>Drop set</option><option>Failure set</option><option>Bodyweight</option><option>Timed set</option></select></label>
          <label class="os-stack">Weight (${unitLabel(units)})<input class="os-input" id="devSetWeight" inputmode="decimal" value="${round(kgToUnit(suggestedWeight, units))}" aria-label="Current weight"></label>
          <label class="os-stack">Completed reps<input class="os-input" id="devSetReps" inputmode="numeric" value="${previous?.reps || exercise.targetReps || 10}" aria-label="Completed reps"></label>
          <label class="os-stack">Duration seconds<input class="os-input" id="devSetDuration" inputmode="numeric" value="${exercise.targetDuration || 0}" aria-label="Duration seconds"></label>
          <label class="os-stack">Distance km<input class="os-input" id="devSetDistance" inputmode="decimal" value="${exercise.targetDistance || 0}" aria-label="Distance kilometers"></label>
          <label class="os-stack">RPE<input class="os-input" id="devSetRpe" inputmode="decimal" value="7" min="1" max="10" aria-label="RPE difficulty"></label>
        </div>
        <button class="os-button os-button--primary" data-dev-log-set>Complete Set</button>
        <div class="os-actions">
          <button class="os-button" data-dev-workout-action="add-set">Add set</button>
          <button class="os-button os-button--ghost" data-dev-workout-action="replace">Replace exercise</button>
          <button class="os-button os-button--ghost" data-dev-workout-action="skip">Skip exercise</button>
          <button class="os-button os-button--ghost" data-dev-move-exercise="-1">Previous</button>
          <button class="os-button os-button--ghost" data-dev-move-exercise="1">Next</button>
        </div>
      </section>
      <section class="os-section">
        <h2 class="os-section__title">Completed sets</h2>
        <div class="os-grid">${completedSetList(exercise.completedSets, units)}</div>
      </section>
      <section class="os-section"><h2 class="os-section__title">Exercise overview</h2><div class="os-grid">${active.exercises.map((item, index) => `<button class="os-card os-card--button" data-dev-move-exercise="${index - active.currentExerciseIndex}"><strong>${index + 1}. ${esc(item.name)}</strong><span class="os-stat__hint">${item.completedSets.length}/${item.targetSets} sets complete</span></button>`).join("")}</div></section>
      <label class="os-stack">Workout notes<textarea class="os-textarea" data-dev-note>${esc(active.notes || "")}</textarea></label>`;
  }

  function completedSetList(sets, units) {
    if (!sets.length) return `<article class="os-card os-empty"><div class="os-empty__icon">âœ“</div><h3>No sets logged yet</h3><p class="os-subtitle">Complete your first set to start the session history.</p></article>`;
    return sets.map((set) => `<article class="os-card os-row"><div><strong>${esc(set.setType)} ${set.setNumber}</strong><p class="os-stat__hint">${round(kgToUnit(set.weightKg, units))}${unitLabel(units)} Ã— ${set.reps || 0} Â· ${set.durationSeconds || 0}s Â· RPE ${set.rpe || "-"}</p></div><div class="os-actions"><button class="os-button os-button--ghost" data-dev-edit-set="${set.id}">Edit</button><button class="os-button os-button--danger" data-dev-delete-set="${set.id}">Delete</button></div></article>`).join("");
  }

  function logCurrentSet() {
    const current = state();
    const active = current.activeWorkout;
    if (!active) return;
    const exercise = active.exercises[active.currentExerciseIndex];
    const recent = exercise.completedSets.at(-1);
    if (recent && Date.now() - new Date(recent.timestamp).getTime() < 900) return toast("Set already saved.");
    const set = {
      id: uid("set"),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      setType: $("#devSetType")?.value || "Working",
      setNumber: exercise.completedSets.length + 1,
      weightKg: unitToKg(Number($("#devSetWeight")?.value || 0), current.settings?.units),
      reps: Number($("#devSetReps")?.value || 0),
      durationSeconds: Number($("#devSetDuration")?.value || 0),
      distanceKm: Number($("#devSetDistance")?.value || 0),
      rpe: Number($("#devSetRpe")?.value || 0),
      timestamp: new Date().toISOString(),
      completed: true,
    };
    const result = save((draft) => {
      const target = draft.activeWorkout.exercises[draft.activeWorkout.currentExerciseIndex];
      target.completedSets.push(set);
      draft.completedSetLogs.unshift(set);
      draft.activeWorkout.restTimer = createRestTimer((target.defaultRestSeconds || draft.timerPreferences.defaultRestSeconds || 90), draft.timerPreferences);
    }, "set_completed", { exerciseId: set.exerciseId, setId: set.id });
    if (result?.ok) toast("Set saved. Rest timer started.");
  }

  function editCompletedSet(setId) {
    if (window.KhayubdiRelease?.editWorkoutSet) return window.KhayubdiRelease.editWorkoutSet(setId);
    toast("Edit dialog is unavailable.");
  }

  function deleteCompletedSet(setId) {
    if (window.KhayubdiRelease?.confirmAction) {
      return window.KhayubdiRelease.confirmAction({
        title: "Delete set?",
        description: "This removes the set from the active workout and set log.",
        actionLabel: "Delete",
        tone: "danger",
        onConfirm: () => deleteSetById(setId),
      });
    }
    toast("Delete dialog is unavailable.");
  }

  function moveExercise(delta) {
    save((draft) => {
      const active = draft.activeWorkout;
      if (!active) return;
      active.currentExerciseIndex = Math.max(0, Math.min(active.exercises.length - 1, active.currentExerciseIndex + delta));
      active.restTimer = null;
    });
  }

  function workoutControl(action) {
    if (action === "pause") return save((draft) => { draft.activeWorkout.status = "paused"; draft.activeWorkout.pausedAt = new Date().toISOString(); }, "workout_paused");
    if (action === "resume") return save((draft) => {
      const active = draft.activeWorkout;
      if (active.pausedAt) active.totalPausedMs += Date.now() - new Date(active.pausedAt).getTime();
      active.status = "active"; active.pausedAt = null;
    }, "workout_resumed");
    if (action === "save-exit") return route("dashboard", "home");
    if (action === "discard") return confirmWorkoutDiscard();
    if (action === "finish") return confirmWorkoutFinish();
    if (action === "skip") return moveExercise(1);
    if (action === "replace") return toast("Replace exercise placeholder ready for DEV-06.");
    if (action === "add-set") return toast("Optional set added. Log it when ready.");
  }

  function finishWorkout() {
    const result = save((draft) => {
      const active = draft.activeWorkout;
      if (!active) return;
      if (active.finishing) return;
      active.finishing = true;
      const endedAt = new Date().toISOString();
      const sets = active.exercises.flatMap((exercise) => exercise.completedSets);
      const workingSets = sets.filter((set) => set.setType !== "Warm-up");
      const totalVolumeKg = workingSets.reduce((total, set) => total + Number(set.weightKg || 0) * Number(set.reps || 0), 0);
      const summary = {
        id: uid("workout-session"),
        workoutId: active.workoutId,
        title: active.title,
        startedAt: active.startedAt,
        endedAt,
        durationSeconds: elapsed(active, endedAt),
        exercisesCompleted: active.exercises.filter((exercise) => exercise.completedSets.length).length,
        setsCompleted: sets.length,
        totalReps: sets.reduce((total, set) => total + Number(set.reps || 0), 0),
        totalVolumeKg,
        workingVolumeKg: totalVolumeKg,
        warmupVolumeKg: sets.filter((set) => set.setType === "Warm-up").reduce((total, set) => total + Number(set.weightKg || 0) * Number(set.reps || 0), 0),
        estimatedCalories: Math.round(elapsed(active, endedAt) / 60 * 6),
        bestSet: bestSet(sets),
        previousComparison: comparePrevious(draft.workoutSessions, totalVolumeKg),
        notes: active.notes || "",
        sets,
      };
      summary.personalRecords = workoutRecords(summary, draft.workoutSessions);
      draft.workoutSessions.unshift(summary);
      draft.recentWorkouts.unshift({ id: summary.id, title: summary.title, date: "Today", duration: Math.round(summary.durationSeconds / 60), volume: Math.round(summary.totalVolumeKg) });
      draft.personalRecords = [...summary.personalRecords, ...(draft.personalRecords || [])].slice(0, 100);
      draft.activeWorkout = null;
      draft.route = { tab: "track", view: "workoutSummary", detailId: summary.id };
    }, "workout_completed");
    if (!result?.ok) route("track", "activeWorkout");
  }

  function confirmWorkoutFinish() {
    if (window.KhayubdiRelease?.confirmAction) {
      return window.KhayubdiRelease.confirmAction({
        title: "Finish workout?",
        description: "This creates the workout summary, updates records, and closes the active session.",
        actionLabel: "Finish workout",
        tone: "primary",
        onConfirm: finishWorkout,
      });
    }
    toast("Finish dialog is unavailable.");
  }

  function confirmWorkoutDiscard() {
    if (window.KhayubdiRelease?.confirmAction) {
      return window.KhayubdiRelease.confirmAction({
        title: "Discard workout?",
        description: "This removes the unfinished workout. Completed workout history is not changed.",
        actionLabel: "Discard",
        tone: "danger",
        onConfirm: discardWorkout,
      });
    }
    toast("Discard dialog is unavailable.");
  }

  function discardWorkout() {
    save((draft) => { draft.activeWorkout = null; draft.route = { tab: "track", view: "gymHome", detailId: "" }; }, "workout_discarded");
  }

  function deleteSetById(setId) {
    save((draft) => {
      draft.activeWorkout?.exercises.forEach((exercise) => {
        exercise.completedSets = exercise.completedSets.filter((item) => item.id !== setId);
      });
      draft.completedSetLogs = draft.completedSetLogs.filter((item) => item.id !== setId);
    }, "set_deleted", { setId });
  }

  function restTimerCard(timer) {
    return `<section class="os-card os-row" role="status" aria-live="polite" aria-atomic="true">
      <div><span class="os-stat__label">Rest Timer</span><div class="os-stat__value" id="devRestRemaining">${formatDuration(restRemaining(timer))}</div><p class="os-stat__hint">${timer.status === "paused" ? "Paused" : "Calculates from timestamps for refresh recovery"}</p></div>
      <div class="os-actions"><button class="os-button" data-dev-rest-action="${timer.status === "paused" ? "resume" : "pause"}">${timer.status === "paused" ? "Resume" : "Pause"}</button><button class="os-button" data-dev-rest-action="add15">+15s</button><button class="os-button" data-dev-rest-action="sub15">-15s</button><button class="os-button os-button--ghost" data-dev-rest-action="skip">Skip</button></div>
    </section>`;
  }

  function createRestTimer(seconds, prefs) {
    const startedAt = Date.now();
    return { durationMs: Number(seconds || 90) * 1000, startedAt, endsAt: startedAt + Number(seconds || 90) * 1000, pausedAt: null, totalPausedMs: 0, status: "running", soundEnabled: Boolean(prefs?.soundEnabled), hapticEnabled: Boolean(prefs?.hapticEnabled) };
  }

  function restControl(action) {
    save((draft) => {
      const timer = draft.activeWorkout?.restTimer;
      if (!timer) return;
      const now = Date.now();
      if (action === "pause" && timer.status === "running") { timer.status = "paused"; timer.pausedAt = now; }
      if (action === "resume" && timer.status === "paused") { const paused = now - Number(timer.pausedAt || now); timer.endsAt += paused; timer.totalPausedMs += paused; timer.pausedAt = null; timer.status = "running"; }
      if (action === "skip") timer.status = "complete";
      if (action === "add15") timer.endsAt += 15000;
      if (action === "sub15") timer.endsAt = Math.max(now, timer.endsAt - 15000);
    }, action === "skip" ? "rest_timer_skipped" : "rest_timer_started", { action });
  }

  function renderWorkoutSummary(mount, current, id) {
    const session = current.workoutSessions.find((item) => item.id === id) || current.workoutSessions[0];
    if (!session) return;
    mount.innerHTML = `<section class="os-hero"><span class="os-eyebrow">Workout Complete</span><h1 class="os-title">${esc(session.title)}</h1><p class="os-subtitle">${formatDuration(session.durationSeconds)} Â· ${session.setsCompleted} sets Â· ${round(session.totalVolumeKg)} kg volume</p><div class="os-actions"><button class="os-button os-button--primary" data-dev-save-summary>Done</button><button class="os-button" data-os-navigate="progress">View Analytics</button><button class="os-button os-button--ghost">Share summary</button></div></section><div class="os-grid os-grid--2">${stat("Duration", formatDuration(session.durationSeconds), "Active time")}${stat("Exercises", session.exercisesCompleted, "completed")}${stat("Total reps", session.totalReps, "all sets")}${stat("Calories", session.estimatedCalories, "estimated")}</div><section class="os-section"><h2 class="os-section__title">Personal records</h2><div class="os-grid">${session.personalRecords?.length ? session.personalRecords.map((item) => `<article class="os-card"><strong>${esc(item.title)}</strong><span class="os-stat__hint">${esc(item.type)} Â· ${esc(item.value)}</span></article>`).join("") : empty("No PR", "No new records this session.", "", "", "")}</div></section><article class="os-card"><h2 class="os-section__title">Best set</h2><p class="os-subtitle">${session.bestSet ? `${esc(session.bestSet.exerciseName)} Â· ${round(session.bestSet.weightKg)} kg Ã— ${session.bestSet.reps}` : "No set data"}</p><p class="os-stat__hint">Estimated 1RM uses Epley: weight Ã— (1 + reps / 30).</p></article>`;
  }

  function renderOutdoorTraining(current, routeState) {
    const mount = root("outdoor");
    if (!mount) return;
    if (routeState.view === "gpsReady") return renderGpsReady(mount, current, routeState.detailId || "Running");
    if (routeState.view === "outdoorLive") return renderOutdoorLive(mount, current);
    if (routeState.view === "outdoorSummary") return renderOutdoorSummary(mount, current, routeState.detailId);
    if (current.activeOutdoorActivity && routeState.view === "outdoorHome") appendResume(mount, "outdoor");
  }

  function renderGpsReady(mount, current, type) {
    mount.innerHTML = `<section class="os-hero"><button class="os-button os-button--ghost" data-os-navigate="outdoor" data-os-view="activitySetup" data-os-id="${esc(type)}">Back</button><span class="os-eyebrow">GPS Ready</span><h1 class="os-title">${esc(type)} starts in 3</h1><div class="os-ring" style="--value:92" data-label="GPS"></div><p class="os-subtitle">Signal strong Â· permission granted Â· offline-safe simulation.</p><button class="os-button os-button--primary" data-dev-start-outdoor>Start ${esc(type)}</button></section>`;
  }

  function startOutdoorActivity() {
    const type = $("#osActivityType")?.value || state().route?.detailId || "Running";
    save((draft) => {
      draft.activeOutdoorActivity = { id: uid("outdoor-active"), type, goalType: "Open goal", distanceGoalKm: 0, timeGoalMinutes: 0, audioCues: true, startedAt: new Date().toISOString(), pausedAt: null, totalPausedMs: 0, status: "active", distanceKm: 0, gpsSignal: "strong", splits: [], locked: false };
      draft.route = { tab: "outdoor", view: "outdoorLive", detailId: draft.activeOutdoorActivity.id };
    }, "outdoor_activity_started", { type });
    route("outdoor", "outdoorLive");
  }

  function renderOutdoorLive(mount, current) {
    const active = current.activeOutdoorActivity;
    if (!active) return;
    const seconds = outdoorElapsed(active);
    const pace = active.distanceKm > 0 ? seconds / active.distanceKm : 0;
    const devControls = isDevelopmentMode(current)
      ? `<section class="os-card"><h2 class="os-section__title">Development simulation</h2><p class="os-stat__hint">Visible only when development mode is enabled.</p><div class="os-actions"><button class="os-button" data-dev-outdoor-action="add-025">+0.25 km</button><button class="os-button" data-dev-outdoor-action="add-1">+1 km</button><button class="os-button os-button--ghost" data-dev-outdoor-action="weak-gps">Weak GPS</button><button class="os-button os-button--ghost" data-dev-outdoor-action="lost-gps">Lost GPS</button></div></section>`
      : "";
    mount.innerHTML = `<section class="os-hero"><span class="os-eyebrow">Live ${esc(active.type)}</span><h1 class="os-title">${formatDuration(seconds)}</h1><p class="os-subtitle">${round(active.distanceKm, 2)} km · ${formatPace(pace)} pace · GPS ${esc(active.gpsSignal)}</p><div class="os-actions"><button class="os-button os-button--primary" data-dev-outdoor-action="${active.status === "paused" ? "resume" : "pause"}">${active.status === "paused" ? "Resume" : "Pause"}</button><button class="os-button" data-dev-outdoor-action="finish">Finish</button><button class="os-button os-button--ghost" data-dev-outdoor-action="lock">${active.locked ? "Unlock" : "Screen Lock"}</button><button class="os-button os-button--danger" data-dev-outdoor-action="discard">Discard</button></div></section><div class="os-grid os-grid--2">${stat("Distance", `${round(active.distanceKm, 2)} km`, "simulated GPS")}${stat("Current pace", formatPace(pace), "per km")}${stat("Calories", Math.round(active.distanceKm * (active.type === "Running" ? 72 : 45)), "estimated")}${stat("Steps", Math.round(active.distanceKm * (active.type === "Running" ? 1250 : 1450)), "estimated")}</div>${devControls}<section class="os-section"><h2 class="os-section__title">Splits</h2><div class="os-grid">${active.splits.length ? active.splits.map((split) => `<article class="os-card os-row"><strong>Km ${split.kilometer}</strong><span>${formatPace(split.paceSeconds)}</span></article>`).join("") : empty("No splits", "Splits appear after the first kilometer.", "", "", "")}</div></section>`;
  }

  function isDevelopmentMode(current) {
    return new URLSearchParams(location.search).get("dev") === "1" || Boolean(current?.developmentFlags?.enabled);
  }

  function outdoorControl(action) {
    if (action === "pause") return save((draft) => { draft.activeOutdoorActivity.status = "paused"; draft.activeOutdoorActivity.pausedAt = new Date().toISOString(); }, "outdoor_activity_paused");
    if (action === "resume") return save((draft) => { const active = draft.activeOutdoorActivity; if (active.pausedAt) active.totalPausedMs += Date.now() - new Date(active.pausedAt).getTime(); active.status = "active"; active.pausedAt = null; }, "outdoor_activity_resumed");
    if (action === "discard") return confirmOutdoorDiscard();
    if (action === "finish") return confirmOutdoorFinish();
    if (action === "add-025") return addDistance(.25);
    if (action === "add-1") return addDistance(1);
    if (action === "weak-gps") return save((draft) => { draft.activeOutdoorActivity.gpsSignal = "weak"; }, "outdoor_signal_changed");
    if (action === "lost-gps") return save((draft) => { draft.activeOutdoorActivity.gpsSignal = "lost"; }, "outdoor_signal_changed");
    if (action === "lock") return save((draft) => { draft.activeOutdoorActivity.locked = !draft.activeOutdoorActivity.locked; });
  }

  function addDistance(km) {
    save((draft) => {
      const active = draft.activeOutdoorActivity;
      const before = active.distanceKm;
      active.distanceKm = round(active.distanceKm + km, 3);
      const seconds = outdoorElapsed(active);
      for (let split = Math.floor(before) + 1; split <= Math.floor(active.distanceKm); split += 1) {
        const paceSeconds = seconds / Math.max(active.distanceKm, .01);
        active.splits.push({ kilometer: split, paceSeconds, timestamp: new Date().toISOString() });
      }
    }, "outdoor_activity_updated", { km });
  }

  function finishOutdoor() {
    const result = save((draft) => {
      const active = draft.activeOutdoorActivity;
      const durationSeconds = outdoorElapsed(active);
      const pace = active.distanceKm > 0 ? durationSeconds / active.distanceKm : 0;
      const session = { id: uid("outdoor-session"), type: active.type, startedAt: active.startedAt, endedAt: new Date().toISOString(), durationSeconds, distanceKm: round(active.distanceKm, 2), averagePaceSecondsPerKm: pace, bestPaceSecondsPerKm: Math.min(...active.splits.map((s) => s.paceSeconds || Infinity), pace || Infinity), calories: Math.round(active.distanceKm * (active.type === "Running" ? 72 : 45)), steps: Math.round(active.distanceKm * (active.type === "Running" ? 1250 : 1450)), splits: active.splits, goalCompletion: active.distanceKm > 0 ? 100 : 0 };
      draft.outdoorSessions.unshift(session);
      draft.outdoorActivities.unshift({ id: session.id, type: session.type, date: "Today", distance: session.distanceKm, pace: formatPace(session.averagePaceSecondsPerKm), duration: Math.round(durationSeconds / 60) });
      draft.splitRecords.unshift(...session.splits.map((split) => ({ ...split, sessionId: session.id })));
      draft.activeOutdoorActivity = null;
      draft.route = { tab: "outdoor", view: "outdoorSummary", detailId: session.id };
    }, "outdoor_activity_completed");
    if (!result?.ok) route("outdoor", "outdoorLive");
  }

  function confirmOutdoorFinish() {
    if (window.KhayubdiRelease?.confirmAction) {
      return window.KhayubdiRelease.confirmAction({
        title: "Finish outdoor activity?",
        description: "This saves the simulated outdoor session and updates outdoor records.",
        actionLabel: "Finish activity",
        tone: "primary",
        onConfirm: finishOutdoor,
      });
    }
    toast("Finish dialog is unavailable.");
  }

  function confirmOutdoorDiscard() {
    if (window.KhayubdiRelease?.confirmAction) {
      return window.KhayubdiRelease.confirmAction({
        title: "Discard outdoor activity?",
        description: "This removes the unfinished outdoor activity. Completed history is not changed.",
        actionLabel: "Discard",
        tone: "danger",
        onConfirm: discardOutdoor,
      });
    }
    toast("Discard dialog is unavailable.");
  }

  function discardOutdoor() {
    save((draft) => { draft.activeOutdoorActivity = null; draft.route = { tab: "outdoor", view: "outdoorHome", detailId: "" }; }, "outdoor_activity_discarded");
  }

  function renderOutdoorSummary(mount, current, id) {
    const session = current.outdoorSessions.find((item) => item.id === id) || current.outdoorSessions[0];
    if (!session) return;
    mount.innerHTML = `<section class="os-hero"><span class="os-eyebrow">Outdoor Complete</span><h1 class="os-title">${esc(session.type)} Summary</h1><p class="os-subtitle">${round(session.distanceKm, 2)} km Â· ${formatDuration(session.durationSeconds)} Â· ${formatPace(session.averagePaceSecondsPerKm)}</p><button class="os-button os-button--primary" data-os-navigate="outdoor">Done</button></section><div class="os-grid os-grid--2">${stat("Calories", session.calories, "estimated")}${stat("Steps", session.steps, "estimated")}${stat("Best pace", formatPace(session.bestPaceSecondsPerKm), "per km")}${stat("Goal", `${session.goalCompletion}%`, "complete")}</div>`;
  }

  function renderRecords(current) {
    const mount = root("progress");
    if (!mount) return;
    const range = current.recordsRange || "week";
    const records = calculateRecords(current, range);
    mount.innerHTML = `<section class="os-section"><div class="os-section__head"><h1 class="os-title">Records</h1><div class="os-actions">${["week","month","year"].map((item) => `<button class="os-chip" data-dev-record-range="${item}" aria-pressed="${item === range}">${item}</button>`).join("")}</div></div><div class="os-grid os-grid--2 os-grid--tablet-3">${stat("Workout volume", `${round(records.workoutVolumeKg)} kg`, "working sets")}${stat("Workout frequency", records.workoutFrequency, "sessions")}${stat("Outdoor distance", `${round(records.outdoorDistanceKm, 2)} km`, "completed")}${stat("Avg pace", formatPace(records.averagePaceSecondsPerKm), "outdoor")}${stat("Calories", records.dailyCalories, "nutrition")}${stat("Protein avg", `${records.proteinAverage}g`, "per meal")}</div><article class="os-card"><h2 class="os-section__title">Accessible summary</h2><p class="os-subtitle">${records.summary}</p><div class="os-chart-bars" role="img" aria-label="${esc(records.summary)}">${records.bars.map((value) => `<span style="--value:${value}%"></span>`).join("")}</div></article><section class="os-section"><h2 class="os-section__title">Personal records</h2><div class="os-grid">${current.personalRecords.length ? current.personalRecords.slice(0, 8).map((item) => `<article class="os-card"><strong>${esc(item.title)}</strong><span class="os-stat__hint">${esc(item.type || "record")} Â· ${esc(item.value)}</span></article>`).join("") : empty("No records yet", "Complete a workout to generate personal records.", "Start Workout", "track")}</div></section></section>`;
  }

  function setRecordRange(range) {
    save((draft) => { draft.recordsRange = range; });
  }

  function calculateRecords(current, range) {
    const since = new Date();
    since.setDate(since.getDate() - (range === "year" ? 365 : range === "month" ? 30 : 7));
    const inRange = (date) => new Date(date).getTime() >= since.getTime();
    const workouts = current.workoutSessions.filter((item) => inRange(item.endedAt || item.startedAt));
    const outdoor = current.outdoorSessions.filter((item) => inRange(item.endedAt || item.startedAt));
    const meals = current.nutritionMeals.filter((item) => inRange(item.createdAt));
    const workoutVolumeKg = workouts.reduce((total, item) => total + Number(item.totalVolumeKg || 0), 0);
    const outdoorDistanceKm = outdoor.reduce((total, item) => total + Number(item.distanceKm || 0), 0);
    const outdoorSeconds = outdoor.reduce((total, item) => total + Number(item.durationSeconds || 0), 0);
    const dailyCalories = meals.reduce((total, item) => total + Number(item.calories || 0), 0);
    return { workoutVolumeKg, workoutFrequency: workouts.length, outdoorDistanceKm, averagePaceSecondsPerKm: outdoorDistanceKm ? outdoorSeconds / outdoorDistanceKm : 0, dailyCalories, proteinAverage: average(meals, "protein"), summary: `${workouts.length} workouts, ${round(outdoorDistanceKm, 2)} km outdoors, and ${meals.length} meals logged in this ${range}.`, bars: [workouts.length * 18, Math.min(100, outdoorDistanceKm * 8), Math.min(100, dailyCalories / 35), Math.min(100, average(meals, "protein") * 2)].map((v) => Math.max(8, Math.min(100, v))) };
  }

  function renderResumeCards() {
    const current = state();
    ["dashboard", "track", "outdoor"].forEach((section) => {
      const mount = root(section);
      if (!mount) return;
      $$(".dev-resume-card", mount).forEach((item) => item.remove());
      if ((section === "dashboard" || section === "track") && current.activeWorkout) mount.insertAdjacentHTML("afterbegin", resumeCard("workout", current.activeWorkout.title));
      if ((section === "dashboard" || section === "outdoor") && current.activeOutdoorActivity) mount.insertAdjacentHTML("afterbegin", resumeCard("outdoor", current.activeOutdoorActivity.type));
    });
  }

  function appendResume(mount, type) {
    if (!$(".dev-resume-card", mount)) mount.insertAdjacentHTML("afterbegin", resumeCard(type, type === "workout" ? state().activeWorkout?.title : state().activeOutdoorActivity?.type));
  }

  function resumeCard(type, title) {
    const isWorkout = type === "workout";
    return `<article class="os-card dev-resume-card"><span class="os-eyebrow">Resume ${isWorkout ? "Workout" : "Outdoor"}</span><h2 class="os-section__title">${esc(title || "Active session")}</h2><p class="os-subtitle">Recovered from local device storage. Nothing is deleted unless you discard it.</p><div class="os-actions"><button class="os-button os-button--primary" data-os-navigate="${isWorkout ? "track" : "outdoor"}" data-os-view="${isWorkout ? "activeWorkout" : "outdoorLive"}">Resume</button><button class="os-button os-button--danger" data-dev-${isWorkout ? "workout" : "outdoor"}-action="discard">Discard</button></div></article>`;
  }

  function empty(icon, title, message, action, tab) {
    return `<article class="os-card os-empty"><div class="os-empty__icon">${esc(icon)}</div><h3>${esc(title)}</h3><p class="os-subtitle">${esc(message)}</p>${action ? `<button class="os-button os-button--primary" data-os-navigate="${esc(tab)}">${esc(action)}</button>` : ""}</article>`;
  }

  function stat(label, value, hint) {
    return `<article class="os-card"><span class="os-stat__label">${esc(label)}</span><div class="os-stat__value">${esc(value)}</div><p class="os-stat__hint">${esc(hint)}</p></article>`;
  }

  function elapsed(active, endIso) {
    const end = endIso ? new Date(endIso).getTime() : Date.now();
    const paused = active.status === "paused" && active.pausedAt ? Date.now() - new Date(active.pausedAt).getTime() : 0;
    return Math.max(0, Math.round((end - new Date(active.startedAt).getTime() - Number(active.totalPausedMs || 0) - paused) / 1000));
  }

  function outdoorElapsed(active) {
    return elapsed(active);
  }

  function restRemaining(timer) {
    if (timer.status === "complete") return 0;
    const now = timer.status === "paused" && timer.pausedAt ? Number(timer.pausedAt) : Date.now();
    return Math.max(0, Math.ceil((Number(timer.endsAt || now) - now) / 1000));
  }

  function formatDuration(seconds) {
    const total = Math.max(0, Number(seconds || 0));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = Math.floor(total % 60);
    return h ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
  }

  function formatPace(secondsPerKm) {
    if (!secondsPerKm || !Number.isFinite(secondsPerKm)) return "--:--/km";
    return `${Math.floor(secondsPerKm / 60)}:${String(Math.round(secondsPerKm % 60)).padStart(2, "0")}/km`;
  }

  function previousPerformance(current, exerciseId) {
    return current.completedSetLogs.find((set) => set.exerciseId === exerciseId && set.completed);
  }

  function bestSet(sets) {
    return [...sets].sort((a, b) => (Number(b.weightKg || 0) * Number(b.reps || 0)) - (Number(a.weightKg || 0) * Number(a.reps || 0)))[0] || null;
  }

  function epley(weightKg, reps) {
    return Number(weightKg || 0) * (1 + Number(reps || 0) / 30);
  }

  function workoutRecords(session, previousSessions) {
    const previousSets = previousSessions.flatMap((item) => item.sets || []);
    const records = [];
    session.sets.forEach((set) => {
      const same = previousSets.filter((item) => item.exerciseId === set.exerciseId);
      if (set.weightKg > Math.max(0, ...same.map((item) => item.weightKg || 0))) records.push(record("Highest weight", set.exerciseName, `${round(set.weightKg)} kg`));
      if (epley(set.weightKg, set.reps) > Math.max(0, ...same.map((item) => epley(item.weightKg, item.reps)))) records.push(record("Highest estimated 1RM", set.exerciseName, `${round(epley(set.weightKg, set.reps))} kg`));
      if ((set.weightKg * set.reps) > Math.max(0, ...same.map((item) => (item.weightKg || 0) * (item.reps || 0)))) records.push(record("Highest set volume", set.exerciseName, `${round(set.weightKg * set.reps)} kg`));
    });
    if (session.totalVolumeKg > Math.max(0, ...previousSessions.map((item) => item.totalVolumeKg || 0))) records.push(record("Highest workout volume", session.title, `${round(session.totalVolumeKg)} kg`));
    return records;
  }

  function record(type, title, value) {
    const item = { id: uid("pr"), type, title, value, date: new Date().toISOString() };
    window.dispatchEvent(new CustomEvent("khayubdi:record_achieved", { detail: { type, title } }));
    return item;
  }

  function comparePrevious(sessions, volume) {
    const previous = sessions[0];
    if (!previous) return "First completed session";
    const delta = volume - Number(previous.totalVolumeKg || 0);
    return `${delta >= 0 ? "+" : ""}${round(delta)} kg versus previous workout`;
  }

  function average(items, key) {
    if (!items.length) return 0;
    return Math.round(items.reduce((total, item) => total + Number(item[key] || 0), 0) / items.length);
  }

  function startTicker() {
    if (tickId) clearInterval(tickId);
    tickId = setInterval(updateTimersOnly, 1000);
  }

  function updateTimersOnly() {
    const current = state();
    const active = current.activeWorkout;
    const outdoor = current.activeOutdoorActivity;
    const workoutTimer = $("#devWorkoutElapsed");
    if (workoutTimer && active) workoutTimer.textContent = formatDuration(elapsed(active));
    const rest = $("#devRestRemaining");
    if (rest && active?.restTimer) {
      const remaining = restRemaining(active.restTimer);
      rest.textContent = formatDuration(remaining);
      if (remaining <= 0 && active.restTimer.status === "running") {
        save((draft) => { if (draft.activeWorkout?.restTimer) draft.activeWorkout.restTimer.status = "complete"; }, "rest_timer_completed");
        toast("Rest complete.");
      }
    }
    const outdoorTimer = $("#devOutdoorElapsed");
    if (outdoorTimer && outdoor) outdoorTimer.textContent = formatDuration(outdoorElapsed(outdoor));
  }

  function toast(message) {
    const host = document.getElementById("osToastHost");
    if (!host) return;
    const item = document.createElement("div");
    item.className = "os-toast";
    item.textContent = message;
    host.appendChild(item);
    setTimeout(() => item.remove(), 2600);
  }

  return { init, render, finishWorkout, finishOutdoor, discardWorkout, discardOutdoor };
})();

window.KhayubdiTraining = KhayubdiTraining;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", KhayubdiTraining.init);
} else {
  KhayubdiTraining.init();
}

