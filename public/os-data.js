/* KHAYUBDI OS 2.0 Central Data Layer */

const KhayubdiData = (() => {
  const KEY = "khayubdi_os2_state_v1";
  const BACKUP_KEY = "khayubdi_os2_state_v1_backup";
  const PENDING_KEY = "khayubdi_os2_state_v1_pending";
  const CORRUPT_KEY = "khayubdi_os2_state_v1_corrupt";
  const IMPORT_BACKUP_KEY = "khayubdi_os2_state_v1_import_backup";
  const SCHEMA_VERSION = 3;
  const APP_BUILD = 70;
  const MAX_EVENT_LOG = 200;
  const MAX_ANALYTICS = 200;
  const MAX_ERRORS = 20;
  const MAX_RECOMMENDATIONS = 50;
  let lastRecoverySignature = "";
  let writeLocked = false;

  const defaults = () => ({
    schemaVersion: SCHEMA_VERSION,
    activeTab: "dashboard",
    activeViews: {
      dashboard: "home",
      track: "gymHome",
      outdoor: "outdoorHome",
      progress: "recordsHome",
      profile: "profileOverview",
    },
    onboardingComplete: false,
    profile: {
      name: "Khayubdi Athlete",
      level: 4,
      xp: 1280,
      streak: 6,
      avatar: "K",
    },
    goals: {
      weight: "Maintain healthy trend",
      workout: "4 sessions / week",
      outdoor: "12 km / week",
      nutrition: "Hit protein target",
    },
    workouts: [
      { id: "w-upper", title: "Upper Body Strength", category: "Strength", duration: 45, difficulty: "Medium", equipment: "Dumbbells", favorite: true, description: "Push, pull, and core work for a balanced upper-body session.", exercises: ["Push up", "Dumbbell Row", "Shoulder Press", "Plank"] },
      { id: "w-lower", title: "Lower Body Builder", category: "Hypertrophy", duration: 50, difficulty: "Medium", equipment: "Gym", favorite: false, description: "Leg strength and volume without unnecessary setup.", exercises: ["Squat", "Romanian Deadlift", "Lunge", "Calf Raise"] },
      { id: "w-cardio", title: "Conditioning Reset", category: "Cardio", duration: 25, difficulty: "Easy", equipment: "Bodyweight", favorite: true, description: "Simple conditioning for low-friction training days.", exercises: ["Walking", "Running", "Mobility"] },
    ],
    recentWorkouts: [
      { id: "rw-1", title: "Upper Body Strength", date: "Today", duration: 42, volume: 4200 },
      { id: "rw-2", title: "Conditioning Reset", date: "Yesterday", duration: 24, volume: 0 },
    ],
    outdoorActivities: [
      { id: "oa-1", type: "Walk", date: "Today", distance: 2.4, pace: "10:20/km", duration: 25 },
      { id: "oa-2", type: "Run", date: "This week", distance: 4.8, pace: "6:10/km", duration: 30 },
    ],
    nutritionMeals: [
      { id: "meal-1", name: "Chicken breast rice bowl", mealType: "lunch", calories: 520, protein: 42, carbs: 58, fat: 10, serving: "1 bowl", createdAt: new Date().toISOString() },
    ],
    personalRecords: [
      { id: "pr-1", title: "Push up", value: "20 reps", date: "This week" },
      { id: "pr-2", title: "Weekly streak", value: "6 days", date: "Current" },
    ],
    settings: {
      theme: "dark",
      language: "en",
      units: "metric",
      notifications: true,
      reducedMotion: false,
    },
    route: {
      tab: "dashboard",
      view: "home",
      detailId: "",
    },
    activeWorkout: null,
    workoutSessions: [],
    completedSetLogs: [],
    activeOutdoorActivity: null,
    outdoorSessions: [],
    splitRecords: [],
    sessionNotes: {},
    timerPreferences: {
      defaultRestSeconds: 90,
      soundEnabled: false,
      hapticEnabled: true,
    },
    eventLog: [],
    accounts: [],
    authSession: null,
    authMigration: {
      legacyAuthMigrated: false,
      migratedAt: null,
      migratedKeys: [],
      disposition: {},
    },
    onboardingDraft: {
      step: 0,
      answers: {},
      completed: false,
      updatedAt: null,
    },
    recommendationHistory: [],
    goalItems: [],
    favoriteFoods: [],
    recentFoods: [],
    notificationState: {
      permission: "default",
      promptedAt: null,
      deniedAt: null,
      inAppReminders: [],
    },
    analyticsPreference: {
      enabled: true,
    },
    analyticsQueue: [],
    importExportMetadata: {
      lastExportedAt: null,
      lastImportedAt: null,
      lastBackupAt: null,
      importBackupAt: null,
      importBackupBuild: null,
    },
    developmentFlags: {
      enabled: false,
      simulateOffline: false,
      notificationsDenied: false,
      demoDataSeeded: false,
    },
    errorMetadata: {
      lastErrorAt: null,
      recentErrors: [],
    },
    storage: {
      stateRevision: 0,
      stateUpdatedAt: null,
      lastPersistedAt: null,
      lastWriteStatus: null,
      recovery: null,
      warningDismissedAt: null,
    },
  });

  function read() {
    const canonical = readCandidate(KEY);
    if (canonical.ok) return canonical.state;
    const pending = readCandidate(PENDING_KEY);
    if (pending.ok) return recoverFrom("pending", PENDING_KEY, pending.state, canonical.error);
    const backup = readCandidate(BACKUP_KEY);
    if (backup.ok) return recoverFrom("backup", BACKUP_KEY, backup.state, canonical.error);
    preserveCorruptRaw(KEY);
    const fresh = withRecovery(defaults(), KEY, "defaults", canonical.error || pending.error || backup.error || "missing_state");
    const result = persistTransaction(fresh, { eventName: "storage_backup_restored", allowInitial: true });
    return result.state || fresh;
  }

  function migrate(state) {
    if (!state || typeof state !== "object") return defaults();
    if (state.schemaVersion === SCHEMA_VERSION) return state;
    return {
      ...defaults(),
      ...state,
      schemaVersion: SCHEMA_VERSION,
      workouts: normalizeWorkouts(state.workouts),
      nutritionMeals: Array.isArray(state.nutritionMeals) ? state.nutritionMeals : [],
      recentWorkouts: Array.isArray(state.recentWorkouts) ? state.recentWorkouts : [],
      outdoorActivities: Array.isArray(state.outdoorActivities) ? state.outdoorActivities : [],
      personalRecords: Array.isArray(state.personalRecords) ? state.personalRecords : [],
      activeWorkout: state.activeWorkout || null,
      workoutSessions: Array.isArray(state.workoutSessions) ? state.workoutSessions : [],
      completedSetLogs: Array.isArray(state.completedSetLogs) ? state.completedSetLogs : [],
      activeOutdoorActivity: state.activeOutdoorActivity || null,
      outdoorSessions: Array.isArray(state.outdoorSessions) ? state.outdoorSessions : [],
      splitRecords: Array.isArray(state.splitRecords) ? state.splitRecords : [],
      sessionNotes: state.sessionNotes && typeof state.sessionNotes === "object" ? state.sessionNotes : {},
      timerPreferences: { ...defaults().timerPreferences, ...(state.timerPreferences || {}) },
      eventLog: Array.isArray(state.eventLog) ? state.eventLog : [],
      accounts: Array.isArray(state.accounts) ? state.accounts : [],
      authSession: state.authSession || null,
      authMigration: { ...defaults().authMigration, ...(state.authMigration || {}) },
      onboardingDraft: state.onboardingComplete
        ? { ...defaults().onboardingDraft, ...(state.onboardingDraft || {}), completed: true, step: 4 }
        : { ...defaults().onboardingDraft, ...(state.onboardingDraft || {}) },
      recommendationHistory: Array.isArray(state.recommendationHistory) ? state.recommendationHistory : [],
      goalItems: Array.isArray(state.goalItems) ? state.goalItems : [],
      favoriteFoods: Array.isArray(state.favoriteFoods) ? state.favoriteFoods : [],
      recentFoods: Array.isArray(state.recentFoods) ? state.recentFoods : [],
      notificationState: { ...defaults().notificationState, ...(state.notificationState || {}) },
      analyticsPreference: { ...defaults().analyticsPreference, ...(state.analyticsPreference || {}) },
      analyticsQueue: Array.isArray(state.analyticsQueue) ? state.analyticsQueue : [],
      importExportMetadata: { ...defaults().importExportMetadata, ...(state.importExportMetadata || {}) },
      developmentFlags: { ...defaults().developmentFlags, ...(state.developmentFlags || {}) },
      errorMetadata: { ...defaults().errorMetadata, ...(state.errorMetadata || {}) },
      storage: { ...defaults().storage, ...(state.storage || {}) },
    };
  }

  function normalizeWorkouts(workouts) {
    const catalog = defaults().workouts;
    if (!Array.isArray(workouts) || !workouts.length) return catalog;
    return workouts.map((workout, index) => {
      const fallback = catalog[index] || catalog[0];
      const exercises = Array.isArray(workout.exercises)
        ? workout.exercises.map((item, exerciseIndex) => {
            if (typeof item !== "string") return { ...(fallback.exercises?.[exerciseIndex] || {}), ...item };
            return {
              id: item.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `exercise-${exerciseIndex + 1}`,
              name: item,
              targetMuscle: "Full Body",
              inputType: item.toLowerCase().includes("plank") ? "duration" : "weight-reps",
              targetSets: item.toLowerCase().includes("plank") ? 2 : 3,
              targetReps: item.toLowerCase().includes("plank") ? 0 : 10,
              targetDuration: item.toLowerCase().includes("plank") ? 45 : 0,
              targetDistance: 0,
              suggestedWeightKg: 0,
              defaultRestSeconds: workout.defaultRestSeconds || 90,
            };
          })
        : fallback.exercises;
      return { ...fallback, ...workout, exercises, defaultRestSeconds: workout.defaultRestSeconds || fallback.defaultRestSeconds || 90 };
    });
  }

  function merge(base, value) {
    if (!value || typeof value !== "object") return base;
    const next = Array.isArray(base) ? value : { ...base };
    Object.keys(value).forEach((key) => {
      if (base[key] && typeof base[key] === "object" && !Array.isArray(base[key])) next[key] = merge(base[key], value[key]);
      else next[key] = value[key];
    });
    return next;
  }

  function write(next, options = {}) {
    return persistTransaction(next, options);
  }

  function update(mutator, options = {}) {
    if (writeLocked) return failure("write_locked", "Another save is in progress.", read(), false);
    const snapshot = read();
    let draft;
    try {
      draft = structuredCloneSafe(snapshot);
    } catch (error) {
      return failure("clone_failed", "Unable to prepare local save.", snapshot, false, error);
    }
    let next;
    try {
      next = mutator(draft) || draft;
    } catch (error) {
      return failure("mutator_failed", "Unable to apply local save.", snapshot, false, error);
    }
    return persistTransaction(next, { ...options, expectedRevision: snapshot.storage?.stateRevision || 0 });
  }

  function structuredCloneSafe(value) {
    try { return structuredClone(value); }
    catch { return JSON.parse(JSON.stringify(value)); }
  }

  function addMeal(meal) {
    return update((state) => {
      state.nutritionMeals.unshift({
        id: window.crypto && typeof window.crypto.randomUUID === "function" ? window.crypto.randomUUID() : `meal-${Date.now()}`,
        name: meal.name || "Detected meal",
        mealType: meal.mealType || "snack",
        calories: Number(meal.calories || 0),
        protein: Number(meal.protein || 0),
        carbs: Number(meal.carbs || 0),
        fat: Number(meal.fat || 0),
        serving: meal.serving || "1 serving",
        createdAt: new Date().toISOString(),
      });
      return state;
    });
  }

  function setRoute(route) {
    return update((state) => {
      state.route = { ...state.route, ...route };
      state.activeTab = state.route.tab;
      if (state.route.tab && state.route.view) state.activeViews[state.route.tab] = state.route.view;
      return state;
    });
  }

  function updateSettings(settings) {
    return update((state) => {
      state.settings = { ...state.settings, ...settings };
      return state;
    });
  }

  function reset() {
    safeRemove(BACKUP_KEY);
    safeRemove(PENDING_KEY);
    safeRemove(CORRUPT_KEY);
    safeRemove(IMPORT_BACKUP_KEY);
    return write(defaults(), { eventName: "app_reset" });
  }

  function createImportBackup(metadata = {}) {
    const current = read();
    const validation = validateState(current);
    if (!validation.ok) return { ok: false, code: "backup_invalid", message: "Current data could not be backed up.", state: current };
    const backup = {
      createdAt: new Date().toISOString(),
      appBuild: APP_BUILD,
      metadata: Object.fromEntries(Object.entries(metadata || {}).filter(([key]) => !/password|email|token|secret|hash|salt|raw|state/i.test(key))),
      state: current,
    };
    const result = safeSet(IMPORT_BACKUP_KEY, JSON.stringify(backup));
    if (!result.ok) return { ok: false, code: result.code, message: "Import backup could not be created.", state: current };
    const parsed = readImportBackup();
    if (!parsed.ok) return { ok: false, code: "backup_verification_failed", message: "Import backup verification failed.", state: current };
    return { ok: true, code: "ok", message: "Import backup created.", state: current, backup };
  }

  function readImportBackup() {
    try {
      const raw = localStorage.getItem(IMPORT_BACKUP_KEY);
      if (!raw) return { ok: false, code: "missing" };
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || !parsed.state) return { ok: false, code: "invalid_backup" };
      const state = normalizeState(parsed.state);
      const validation = validateState(state);
      if (!validation.ok) return { ok: false, code: validation.error };
      return { ok: true, backup: { ...parsed, state } };
    } catch (error) {
      return { ok: false, code: errorCode(error) };
    }
  }

  function restoreImportBackup() {
    const backup = readImportBackup();
    if (!backup.ok) return { ok: false, code: backup.code, message: "Import backup was not usable." };
    return write(backup.backup.state, { eventName: "storage_backup_restored", payload: { source: "import_backup" } });
  }

  function persistTransaction(next, options = {}) {
    writeLocked = true;
    const previous = readCandidate(KEY);
    try {
      const normalized = normalizeState(next);
      const validation = validateState(normalized);
      if (!validation.ok) return failure("validation_failed", "Local data did not pass validation.", previous.state || defaults(), false, validation.error);
      if (options.expectedRevision !== undefined && previous.ok && Number(previous.state.storage?.stateRevision || 0) !== Number(options.expectedRevision)) {
        return failure("stale_write", "Another tab updated local data first. Refreshing local state.", previous.state, true);
      }
      normalized.storage = {
        ...normalized.storage,
        stateRevision: Number(previous.state?.storage?.stateRevision || normalized.storage?.stateRevision || 0) + 1,
        stateUpdatedAt: new Date().toISOString(),
        lastPersistedAt: null,
        lastWriteStatus: "pending",
      };
      trimState(normalized);
      const serialized = JSON.stringify(normalized);
      JSON.parse(serialized);
      if (previous.ok) safeSet(BACKUP_KEY, JSON.stringify(previous.state));
      const pendingResult = safeSet(PENDING_KEY, serialized);
      if (!pendingResult.ok) return failure(pendingResult.code, pendingResult.message, previous.state || normalized, false, pendingResult.error);
      const pendingVerify = readCandidate(PENDING_KEY);
      if (!pendingVerify.ok || Number(pendingVerify.state.storage?.stateRevision || 0) !== Number(normalized.storage.stateRevision || 0)) return failure("write_verification_mismatch", "Local save verification failed.", previous.state || normalized, false);
      normalized.storage.lastPersistedAt = new Date().toISOString();
      normalized.storage.lastWriteStatus = "ok";
      const committed = JSON.stringify(normalized);
      const commitResult = safeSet(KEY, committed);
      if (!commitResult.ok) return failure(commitResult.code, commitResult.message, previous.state || normalized, false, commitResult.error);
      const canonicalVerify = readCandidate(KEY);
      if (!canonicalVerify.ok || Number(canonicalVerify.state.storage?.stateRevision || 0) !== Number(normalized.storage.stateRevision || 0)) return failure("commit_verification_mismatch", "Local save commit verification failed.", previous.state || normalized, false);
      safeRemove(PENDING_KEY);
      dispatchDataChange(normalized, options.eventName, options.payload);
      return { ok: true, code: "ok", recovered: false, persisted: true, message: "Saved locally.", state: normalized };
    } catch (error) {
      return failure(errorCode(error), userMessage(error), previous.state || defaults(), false, error);
    } finally {
      writeLocked = false;
    }
  }

  function normalizeState(value) {
    const base = merge(defaults(), migrate(stripDangerousPrototype(value)));
    base.schemaVersion = SCHEMA_VERSION;
    base.accounts = Array.isArray(base.accounts) ? base.accounts : [];
    base.workouts = normalizeWorkouts(base.workouts);
    base.workoutSessions = Array.isArray(base.workoutSessions) ? base.workoutSessions : [];
    base.completedSetLogs = Array.isArray(base.completedSetLogs) ? base.completedSetLogs : [];
    base.outdoorSessions = Array.isArray(base.outdoorSessions) ? base.outdoorSessions : [];
    base.splitRecords = Array.isArray(base.splitRecords) ? base.splitRecords : [];
    base.nutritionMeals = Array.isArray(base.nutritionMeals) ? base.nutritionMeals : [];
    base.eventLog = Array.isArray(base.eventLog) ? base.eventLog : [];
    base.analyticsQueue = Array.isArray(base.analyticsQueue) ? base.analyticsQueue : [];
    base.recommendationHistory = Array.isArray(base.recommendationHistory) ? base.recommendationHistory : [];
    return base;
  }

  function validateState(candidate) {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return { ok: false, error: "root_not_object" };
    if (Number(candidate.schemaVersion) !== SCHEMA_VERSION) return { ok: false, error: "unsupported_schema" };
    const arrayFields = ["accounts", "workouts", "workoutSessions", "completedSetLogs", "outdoorSessions", "splitRecords", "nutritionMeals", "eventLog", "analyticsQueue"];
    for (const field of arrayFields) if (!Array.isArray(candidate[field])) return { ok: false, error: `${field}_not_array` };
    const objectFields = ["settings", "goals", "profile", "activeViews", "route", "timerPreferences", "notificationState", "storage"];
    for (const field of objectFields) if (!candidate[field] || typeof candidate[field] !== "object" || Array.isArray(candidate[field])) return { ok: false, error: `${field}_not_object` };
    if (candidate.authSession !== null && (typeof candidate.authSession !== "object" || Array.isArray(candidate.authSession))) return { ok: false, error: "authSession_invalid" };
    if (candidate.activeWorkout !== null && (typeof candidate.activeWorkout !== "object" || Array.isArray(candidate.activeWorkout))) return { ok: false, error: "activeWorkout_invalid" };
    if (candidate.activeOutdoorActivity !== null && (typeof candidate.activeOutdoorActivity !== "object" || Array.isArray(candidate.activeOutdoorActivity))) return { ok: false, error: "activeOutdoorActivity_invalid" };
    return { ok: true };
  }

  function readCandidate(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return { ok: false, code: "missing", error: "missing_state" };
      const parsed = JSON.parse(raw);
      const state = normalizeState(parsed);
      const validation = validateState(state);
      if (!validation.ok) return { ok: false, code: "invalid", error: validation.error, raw };
      return { ok: true, state, raw };
    } catch (error) {
      return { ok: false, code: errorCode(error), error: errorCode(error), raw: safeGet(key) };
    }
  }

  function recoverFrom(source, failedKey, recoveredState, errorCategory) {
    const recovered = withRecovery(recoveredState, failedKey, source, errorCategory || "corrupt_state");
    const result = persistTransaction(recovered, { eventName: source === "pending" ? "storage_pending_recovered" : "storage_backup_restored", allowInitial: true });
    notifyStorageWarning(source === "pending" ? "Recovered an interrupted save." : "Recovered local data from backup.");
    return result.state || recovered;
  }

  function withRecovery(state, failedKey, recoverySource, errorCategory) {
    const next = normalizeState(state);
    next.storage.recovery = {
      timestamp: new Date().toISOString(),
      failedKey,
      recoverySource,
      errorCategory: String(errorCategory || "unknown"),
      appBuild: APP_BUILD,
    };
    return next;
  }

  function failure(code, message, state, recovered, error) {
    const safeState = state || defaults();
    markWriteFailure(code, message, error);
    return { ok: false, code, recovered: Boolean(recovered), persisted: false, message, state: safeState };
  }

  function markWriteFailure(code, message, error) {
    const eventName = code === "quota_exceeded" ? "storage_quota_warning" : code === "storage_unavailable" || code === "security_error" ? "storage_unavailable" : "storage_write_failed";
    try {
      const current = readCandidate(KEY);
      if (!current.ok) return;
      const next = current.state;
      next.storage.lastWriteStatus = code;
      next.errorMetadata.lastErrorAt = new Date().toISOString();
      next.errorMetadata.recentErrors = [{ title: eventName, details: devMode() ? String(error?.message || message || code) : "", timestamp: new Date().toISOString() }, ...(next.errorMetadata.recentErrors || [])].slice(0, MAX_ERRORS);
      pushBoundedEvent(next, eventName, { code });
      localStorage.setItem(KEY, JSON.stringify(next));
      notifyStorageWarning(message);
    } catch {}
  }

  function dispatchDataChange(state, eventName, payload = {}) {
    if (eventName) pushBoundedEvent(state, eventName, payload);
    window.dispatchEvent(new CustomEvent("khayubdi:datachange", { detail: state }));
  }

  function pushBoundedEvent(state, name, payload = {}) {
    const safePayload = Object.fromEntries(Object.entries(payload || {}).filter(([key]) => !/password|email|token|secret|hash|salt|note|raw|state/i.test(key)));
    state.eventLog = [{ id: uid("event"), name, payload: safePayload, timestamp: new Date().toISOString() }, ...(state.eventLog || [])].slice(0, MAX_EVENT_LOG);
  }

  function trimState(state) {
    state.eventLog = (state.eventLog || []).slice(0, MAX_EVENT_LOG);
    state.analyticsQueue = (state.analyticsQueue || []).slice(0, MAX_ANALYTICS);
    state.errorMetadata.recentErrors = (state.errorMetadata.recentErrors || []).slice(0, MAX_ERRORS);
    state.recommendationHistory = (state.recommendationHistory || []).slice(0, MAX_RECOMMENDATIONS);
    state.completedSetLogs = (state.completedSetLogs || []).slice(0, 2000);
    state.splitRecords = (state.splitRecords || []).slice(0, 2000);
  }

  function preserveCorruptRaw(key) {
    const raw = safeGet(key);
    if (!raw) return;
    const signature = `${key}:${raw.length}`;
    if (signature === lastRecoverySignature) return;
    lastRecoverySignature = signature;
    try { localStorage.setItem(CORRUPT_KEY, JSON.stringify({ key, bytes: raw.length, capturedAt: new Date().toISOString(), appBuild: APP_BUILD })); } catch {}
  }

  function safeSet(key, value) {
    try {
      if (!storageAvailable()) return { ok: false, code: "storage_unavailable", message: "Browser storage is unavailable." };
      localStorage.setItem(key, value);
      return { ok: true };
    } catch (error) {
      return { ok: false, code: errorCode(error), message: userMessage(error), error };
    }
  }

  function safeGet(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }

  function safeRemove(key) {
    try { localStorage.removeItem(key); } catch {}
  }

  function storageAvailable() {
    try {
      const probe = "__khayubdi_storage_probe__";
      localStorage.setItem(probe, "1");
      localStorage.removeItem(probe);
      return true;
    } catch {
      return false;
    }
  }

  function estimateStorageUsage() {
    try {
      return Object.keys(localStorage).reduce((total, key) => total + key.length + String(localStorage.getItem(key) || "").length, 0);
    } catch {
      return 0;
    }
  }

  function notifyStorageWarning(message) {
    window.dispatchEvent(new CustomEvent("khayubdi:storagewarning", { detail: { message } }));
  }

  function stripDangerousPrototype(value) {
    return JSON.parse(JSON.stringify(value || {}));
  }

  function errorCode(error) {
    const name = String(error?.name || "");
    if (/QuotaExceeded/i.test(name)) return "quota_exceeded";
    if (/Security/i.test(name)) return "security_error";
    if (/circular|serialize|JSON/i.test(String(error?.message || ""))) return "serialization_failed";
    return "storage_error";
  }

  function userMessage(error) {
    const code = errorCode(error);
    if (code === "quota_exceeded") return "Storage is full. Your latest change was not safely saved.";
    if (code === "security_error" || code === "storage_unavailable") return "Browser storage is unavailable. Progress may not be saved.";
    if (code === "serialization_failed") return "This change could not be prepared for saving.";
    return "Local save failed. Previous data was kept safe.";
  }

  function devMode() {
    return new URLSearchParams(location.search).get("dev") === "1";
  }

  function uid(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  window.addEventListener("storage", (event) => {
    if (event.key !== KEY || !event.newValue) return;
    const candidate = readCandidate(KEY);
    if (candidate.ok) {
      window.dispatchEvent(new CustomEvent("khayubdi:externalstate", {
        detail: {
          stateRevision: candidate.state.storage?.stateRevision || 0,
          stateUpdatedAt: candidate.state.storage?.stateUpdatedAt || null,
        },
      }));
    }
  });

  return {
    KEY,
    BACKUP_KEY,
    PENDING_KEY,
    CORRUPT_KEY,
    IMPORT_BACKUP_KEY,
    SCHEMA_VERSION,
    defaults,
    read,
    write,
    update,
    validateState,
    estimateStorageUsage,
    createImportBackup,
    readImportBackup,
    restoreImportBackup,
    addMeal,
    setRoute,
    updateSettings,
    reset,
  };
})();

window.KhayubdiData = KhayubdiData;
