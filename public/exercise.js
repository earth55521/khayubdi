const BASE_STORAGE_KEY = "khayubdi_exercise_entries";
const BASE_FOOD_KEY = "khayubdi_food_entries";
const BASE_PROFILE_KEY = "khayubdi_profile";
const BASE_CLIENT_KEY = "khayubdi_client";
const BASE_HEALTH_KEY = "khayubdi_health_logs";
const BASE_PROGRAM_KEY = "khayubdi_workout_program";
const BASE_PROGRAM_HISTORY_KEY = "khayubdi_program_history";
const BASE_CHAT_KEY = "khayubdi_coach_chat";
const BASE_ADAPTIVE_KEY = "khayubdi_adaptive_recommendations";
const BASE_AI_DRAFT_KEY = "khayubdi_ai_program_draft";
const BASE_NUTRITION_DRAFT_KEY = "khayubdi_ai_nutrition_draft";
const BASE_NUTRITION_PLANS_KEY = "khayubdi_nutrition_plans";
const BASE_NOTIFICATIONS_KEY = "khayubdi_smart_notifications";
const NUTRITION_PLAN_STATUSES = Object.freeze({ DRAFT: "Draft", APPROVED: "Approved", ARCHIVED: "Archived" });
const READINESS_LEVELS = Object.freeze(["Excellent", "Good", "Moderate", "Poor", "Very Poor"]);
const ADHERENCE_LEVELS = Object.freeze(["Excellent", "Good", "Moderate", "Poor", "Critical"]);
const NOTIFICATION_PRIORITIES = Object.freeze(["Critical", "High", "Medium", "Low"]);
const BASE_TRAINER_KEY = "khayubdi_trainer_portal";
const USERS_KEY = "khayubdi_users";
const SESSION_KEY = "khayubdi_session_user";
const TOKEN_KEY = "khayubdi_auth_token";
const REMEMBER_KEY = "khayubdi_remember_login";
const APP_VERSION = "1.0.0 RC";
const APP_BUILD = "59";
const APP_ENVIRONMENT = "Closed Beta";
const APP_RELEASE_CHANNEL = "Release Candidate";
const APP_DEVELOPER = "Sirasit Vichitpap";
const APP_CACHE_VERSION = "khayubdi-exercise-v60";
const BETA_WELCOME_KEY = "khayubdi_beta_welcome_dismissed";
const FEEDBACK_QUEUE_KEY = "khayubdi_feedback_queue";
const USE_BACKEND = location.protocol === "http:" || location.protocol === "https:";
const LOCAL_TRACKING_ONLY = true;
const WATER_GOAL_ML = 3000;
const ADAPTIVE_PLATEAU_SESSIONS = 3;
const AI_CONFIG_KEY = "khayubdi_ai_config";
const DEFAULT_AI_CONFIG = {
  provider: "local",
  model: "gpt-5",
  temperature: 0.3,
  maxTokens: 360,
  endpoint: "https://api.openai.com/v1/responses",
  timeoutMs: 12000,
};
const quickExercises = [
  { name: "Walking", minutes: 30, sets: 0, reps: 0, weight: 0 },
  { name: "Running", minutes: 20, sets: 0, reps: 0, weight: 0 },
  { name: "Push up", minutes: 10, sets: 3, reps: 12, weight: 0 },
  { name: "Squat", minutes: 20, sets: 4, reps: 8, weight: 20 },
];
const MOVEMENT_PATTERNS = ["Squat", "Hinge", "Horizontal Push", "Vertical Push", "Horizontal Pull", "Vertical Pull", "Lunge", "Carry", "Rotation", "Anti-Rotation", "Core", "Cardio", "Mobility"];
const EQUIPMENT_TYPES = ["Bodyweight", "Dumbbell", "Barbell", "Cable", "Machine", "Resistance Band", "Bench", "Cardio Machine", "Minimal Equipment"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
const ANALYTICS_MUSCLES = ["Chest", "Back", "Lats", "Rear Delts", "Side Delts", "Front Delts", "Biceps", "Triceps", "Forearms", "Core", "Lower Back", "Glutes", "Quads", "Hamstrings", "Calves"];
const VOLUME_LANDMARKS = {
  Chest: [8, 20], Back: [10, 22], Lats: [6, 18], "Rear Delts": [6, 18], "Side Delts": [6, 18], "Front Delts": [4, 14],
  Biceps: [6, 16], Triceps: [6, 16], Forearms: [3, 12], Core: [6, 18], "Lower Back": [2, 10],
  Glutes: [8, 22], Quads: [8, 22], Hamstrings: [6, 18], Calves: [6, 18],
};
const EXERCISE_CATALOG = buildExerciseCatalog();
const quickFoods = [
  { name: "Boiled eggs", meal: "breakfast", calories: 140, protein: 12, carbs: 1, fat: 10 },
  { name: "Chicken rice", meal: "lunch", calories: 620, protein: 28, carbs: 72, fat: 22 },
  { name: "Protein shake", meal: "snack", calories: 160, protein: 25, carbs: 6, fat: 3 },
  { name: "Grilled chicken", meal: "dinner", calories: 280, protein: 42, carbs: 0, fat: 10 },
];
const activityMets = {
  walking: 3.5,
  running: 9.8,
  cycling: 7.5,
  squat: 5,
  "push up": 4,
  "bench press": 3.5,
  deadlift: 6,
  "strength training": 5,
  yoga: 2.8,
  hiit: 8,
  swimming: 6,
};
const healthProviderLabels = {
  apple_health: "Apple Health",
  google_fit: "Google Fit",
  health_connect: "Health Connect",
};
const foodKnowledgeBase = [
  { keywords: ["ข้าวมันไก่", "chicken rice"], name: "Chicken rice", calories: 620, protein: 28, carbs: 72, fat: 22 },
  { keywords: ["ข้าวกะเพรา", "กะเพรา", "pad kra pao", "kaprao"], name: "Pad kra pao", calories: 580, protein: 30, carbs: 62, fat: 22 },
  { keywords: ["ข้าวไข่เจียว", "omelette rice"], name: "Omelette rice", calories: 520, protein: 18, carbs: 58, fat: 24 },
  { keywords: ["อกไก่", "chicken breast"], name: "Chicken breast", calories: 165, protein: 31, carbs: 0, fat: 4 },
  { keywords: ["ไก่ย่าง", "grilled chicken"], name: "Grilled chicken", calories: 280, protein: 42, carbs: 0, fat: 10 },
  { keywords: ["ไข่ต้ม", "boiled egg", "egg"], name: "Boiled egg", calories: 70, protein: 6, carbs: 1, fat: 5 },
  { keywords: ["โปรตีนเชค", "protein shake", "whey"], name: "Protein shake", calories: 160, protein: 25, carbs: 6, fat: 3 },
  { keywords: ["ข้าวสวย", "rice"], name: "Cooked rice", calories: 205, protein: 4, carbs: 45, fat: 0 },
  { keywords: ["กล้วย", "banana"], name: "Banana", calories: 105, protein: 1, carbs: 27, fat: 0 },
  { keywords: ["สลัด", "salad"], name: "Salad", calories: 180, protein: 6, carbs: 18, fat: 9 },
  { keywords: ["กาแฟ", "coffee"], name: "Coffee", calories: 80, protein: 2, carbs: 12, fat: 2 },
  { keywords: ["นม", "milk"], name: "Milk", calories: 150, protein: 8, carbs: 12, fat: 8 },
];

let currentUserId = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY) || "";
let authToken = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || "";
let authMode = "login";
let entries = [];
let foods = [];
let healthLogs = {};
let workoutProgram = defaultWorkoutProgram();
let workoutPrograms = [];
let activeProgramId = "";
let programHistory = [];
let profile = { goal: "health", bodyWeight: 70, weeklyTarget: 150 };
let client = defaultClient();
let pendingFoodPhotos = [];
let pendingProgressPhoto = null;
let sessionStartedAt = null;
let sessionTimer = null;
let deferredInstallPrompt = null;
let overloadStatsCache = { signature: "", data: null };
let programSaveTimer = null;
let programDirty = false;
let trainingAnalyticsCache = { signature: "", data: null };
let chatMessages = [];
let coachPersona = "friendly";
let aiProgramDraft = null;
let nutritionPlanDraft = null;
let nutritionPlans = [];
let trainerPortal = defaultTrainerPortal();
let selectedTrainerClientId = "";
let uxCheckinSheetDismissed = false;
const AIProvider = (() => {
  return {
    async generateResponse(promptObject) {
      const config = aiConfiguration();
      const localProvider = createLocalRuleProvider();
      const provider = isOpenAIConfigured(config) ? createOpenAIProvider(config, localProvider) : localProvider;
      try {
        return await provider.generateResponse(promptObject);
      } catch {
        return localProvider.generateResponse(promptObject);
      }
    },
  };
})();

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const fields = {
  splashShell: $("#splashShell"),
  authShell: $("#authShell"),
  onboardingShell: $("#onboardingShell"),
  appShell: $("#appShell"),
  appToast: $("#appToast"),
  landingRegisterButton: $("#landingRegisterButton"),
  landingLoginButton: $("#landingLoginButton"),
  authTitle: $("#authTitle"),
  authCopy: $("#authCopy"),
  authForm: $("#authForm"),
  authId: $("#authId"),
  authPassword: $("#authPassword"),
  authConfirmPassword: $("#authConfirmPassword"),
  registerUsername: $("#registerUsername"),
  registerEmail: $("#registerEmail"),
  registerDisplayName: $("#registerDisplayName"),
  registerGender: $("#registerGender"),
  registerAge: $("#registerAge"),
  registerHeight: $("#registerHeight"),
  registerCurrentWeight: $("#registerCurrentWeight"),
  registerTargetWeight: $("#registerTargetWeight"),
  registerGoal: $("#registerGoal"),
  registerActivityLevel: $("#registerActivityLevel"),
  rememberMe: $("#rememberMe"),
  forgotPassword: $("#forgotPassword"),
  authSubmit: $("#authSubmit"),
  authModeToggle: $("#authModeToggle"),
  authMessage: $("#authMessage"),
  oauthButtons: $$(".oauth-button"),
  onboardingForm: $("#onboardingForm"),
  onboardingDisplayName: $("#onboardingDisplayName"),
  onboardingGender: $("#onboardingGender"),
  onboardingAge: $("#onboardingAge"),
  onboardingHeight: $("#onboardingHeight"),
  onboardingCurrentWeight: $("#onboardingCurrentWeight"),
  onboardingTargetWeight: $("#onboardingTargetWeight"),
  onboardingGoal: $("#onboardingGoal"),
  onboardingActivityLevel: $("#onboardingActivityLevel"),
  currentUser: $("#currentUser"),
  logoutButton: $("#logoutButton"),
  dashboardGreeting: $("#dashboardGreeting"),
  dashboardGoal: $("#dashboardGoal"),
  uxHomeGreeting: $("#uxHomeGreeting"),
  uxTodayWorkout: $("#uxTodayWorkout"),
  uxTodayNutrition: $("#uxTodayNutrition"),
  uxTodayRecovery: $("#uxTodayRecovery"),
  uxHeroMotivation: $("#uxHeroMotivation"),
  uxWorkoutProgress: $("#uxWorkoutProgress"),
  uxNutritionProgress: $("#uxNutritionProgress"),
  uxRecoveryRing: $("#uxRecoveryRing"),
  uxLastWorkout: $("#uxLastWorkout"),
  uxCaloriesToday: $("#uxCaloriesToday"),
  uxCurrentStreak: $("#uxCurrentStreak"),
  uxTodaysProgram: $("#uxTodaysProgram"),
  uxTodaysExercises: $("#uxTodaysExercises"),
  uxStartWorkout: $("#uxStartWorkout"),
  zeroWorkoutTitle: $("#zeroWorkoutTitle"),
  zeroWorkoutDuration: $("#zeroWorkoutDuration"),
  zeroWorkoutExerciseCount: $("#zeroWorkoutExerciseCount"),
  zeroExerciseName: $("#zeroExerciseName"),
  zeroLastPerformance: $("#zeroLastPerformance"),
  zeroSetPreview: $("#zeroSetPreview"),
  zeroWeightPreview: $("#zeroWeightPreview"),
  zeroRepsPreview: $("#zeroRepsPreview"),
  zeroPrevExercise: $("#zeroPrevExercise"),
  zeroNextExercise: $("#zeroNextExercise"),
  zeroCompleteSet: $("#zeroCompleteSet"),
  zeroFinishCard: $("#zeroFinishCard"),
  zeroFinishDuration: $("#zeroFinishDuration"),
  zeroFinishVolume: $("#zeroFinishVolume"),
  zeroFinishSets: $("#zeroFinishSets"),
  zeroFinishCalories: $("#zeroFinishCalories"),
  zeroFinishPr: $("#zeroFinishPr"),
  zeroFinishStreak: $("#zeroFinishStreak"),
  zeroDoneWorkout: $("#zeroDoneWorkout"),
  zeroMealCards: $$(".zero-meal-card"),
  zeroFoodSearch: $("#zeroFoodSearch"),
  zeroFrequentFoods: $("#zeroFrequentFoods"),
  zeroAiEstimate: $("#zeroAiEstimate"),
  zeroBarcode: $("#zeroBarcode"),
  zeroBreakfastCount: $("#zeroBreakfastCount"),
  zeroLunchCount: $("#zeroLunchCount"),
  zeroDinnerCount: $("#zeroDinnerCount"),
  zeroSnackCount: $("#zeroSnackCount"),
  uxCoachGreeting: $("#uxCoachGreeting"),
  uxProfileAvatar: $("#uxProfileAvatar"),
  uxProfileName: $("#uxProfileName"),
  uxProfileGoal: $("#uxProfileGoal"),
  uxProfileStreak: $("#uxProfileStreak"),
  uxProfileWorkoutCount: $("#uxProfileWorkoutCount"),
  uxProfileHours: $("#uxProfileHours"),
  uxProfileAchievement: $("#uxProfileAchievement"),
  uxProfileGoalProgress: $("#uxProfileGoalProgress"),
  uxCheckinSheet: $("#uxCheckinSheet"),
  uxDismissCheckin: $("#uxDismissCheckin"),
  coachPriority: $("#coachPriority"),
  coachRecommendationType: $("#coachRecommendationType"),
  coachMainMessage: $("#coachMainMessage"),
  coachDailySummary: $("#coachDailySummary"),
  coachReminders: $("#coachReminders"),
  coachWeeklyReview: $("#coachWeeklyReview"),
  coachMotivation: $("#coachMotivation"),
  recoveryReadinessBadge: $("#recoveryReadinessBadge"),
  recoveryScoreRing: $("#recoveryScoreRing"),
  recoveryReadinessScore: $("#recoveryReadinessScore"),
  recoveryReadinessLevel: $("#recoveryReadinessLevel"),
  recoveryTrainingRecommendation: $("#recoveryTrainingRecommendation"),
  recoveryTopFactors: $("#recoveryTopFactors"),
  recoveryNutritionRecommendations: $("#recoveryNutritionRecommendations"),
  recoveryAlerts: $("#recoveryAlerts"),
  recoverySevenDayTrend: $("#recoverySevenDayTrend"),
  habitAdherenceBadge: $("#habitAdherenceBadge"),
  habitScoreRing: $("#habitScoreRing"),
  habitAdherenceScore: $("#habitAdherenceScore"),
  habitAdherenceLevel: $("#habitAdherenceLevel"),
  habitTopInsight: $("#habitTopInsight"),
  habitWorkoutPercent: $("#habitWorkoutPercent"),
  habitNutritionPercent: $("#habitNutritionPercent"),
  habitCurrentStreak: $("#habitCurrentStreak"),
  habitLongestStreak: $("#habitLongestStreak"),
  habitRecommendations: $("#habitRecommendations"),
  habitAlerts: $("#habitAlerts"),
  habitTrendSummary: $("#habitTrendSummary"),
  predictionBadge: $("#predictionBadge"),
  predictionScoreRing: $("#predictionScoreRing"),
  predictionScore: $("#predictionScore"),
  predictionGoal: $("#predictionGoal"),
  predictionTimeline: $("#predictionTimeline"),
  predictionProbability: $("#predictionProbability"),
  predictionTopRisk: $("#predictionTopRisk"),
  predictionTopRecommendation: $("#predictionTopRecommendation"),
  predictionTrendSummary: $("#predictionTrendSummary"),
  notificationPriorityBadge: $("#notificationPriorityBadge"),
  notificationUnreadCount: $("#notificationUnreadCount"),
  notificationRecentCount: $("#notificationRecentCount"),
  notificationRecentList: $("#notificationRecentList"),
  notificationWeeklySummary: $("#notificationWeeklySummary"),
  healthScore: $("#healthScore"),
  healthScoreStatus: $("#healthScoreStatus"),
  healthTrendIndicator: $("#healthTrendIndicator"),
  healthScorePreview: $("#healthScorePreview"),
  healthScoreRecommendation: $("#healthScoreRecommendation"),
  healthScoreHistory: $("#healthScoreHistory"),
  dashCurrentWeight: $("#dashCurrentWeight"),
  dashTargetWeight: $("#dashTargetWeight"),
  dashWeightDifference: $("#dashWeightDifference"),
  dashWeightTrend: $("#dashWeightTrend"),
  dashFoodCalories: $("#dashFoodCalories"),
  dashFoodProtein: $("#dashFoodProtein"),
  dashCheckinStatus: $("#dashCheckinStatus"),
  dashCheckinStreak: $("#dashCheckinStreak"),
  dashWaterToday: $("#dashWaterToday"),
  dashWaterRemaining: $("#dashWaterRemaining"),
  dashSleepHours: $("#dashSleepHours"),
  dashSleepQuality: $("#dashSleepQuality"),
  dashSleepGoal: $("#dashSleepGoal"),
  dashSleepPercent: $("#dashSleepPercent"),
  dashLastWorkout: $("#dashLastWorkout"),
  dashWorkoutStreak: $("#dashWorkoutStreak"),
  dashWeeklyVolume: $("#dashWeeklyVolume"),
  dashPrCount: $("#dashPrCount"),
  dashCurrentProgram: $("#dashCurrentProgram"),
  dashTodayWorkout: $("#dashTodayWorkout"),
  dashWeeklyCompletion: $("#dashWeeklyCompletion"),
  dashProgramVersion: $("#dashProgramVersion"),
  dashRecoveryScore: $("#dashRecoveryScore"),
  dashFatigueScore: $("#dashFatigueScore"),
  dashMuscleVolume: $("#dashMuscleVolume"),
  dashTrainingBalance: $("#dashTrainingBalance"),
  dashKcalTarget: $("#dashKcalTarget"),
  dashProteinTarget: $("#dashProteinTarget"),
  dashWaterTarget: $("#dashWaterTarget"),
  dashWaterPercent: $("#dashWaterPercent"),
  dashWaterRing: $("#dashWaterRing"),
  dashWaterRingText: $("#dashWaterRingText"),
  dashWaterSummary: $("#dashWaterSummary"),
  dashWaterHint: $("#dashWaterHint"),
  dailyMissionText: $("#dailyMissionText"),
  missionPercent: $("#missionPercent"),
  missionList: $("#missionList"),
  todayMinutes: $("#todayMinutes"),
  todayWorkouts: $("#todayWorkouts"),
  todayCalories: $("#todayCalories"),
  todayFoodCalories: $("#todayFoodCalories"),
  todayProtein: $("#todayProtein"),
  todayMeals: $("#todayMeals"),
  nutritionTargetStatus: $("#nutritionTargetStatus"),
  targetCalories: $("#targetCalories"),
  remainingCalories: $("#remainingCalories"),
  remainingProtein: $("#remainingProtein"),
  totalCarbs: $("#totalCarbs"),
  totalFat: $("#totalFat"),
  totalFoodItems: $("#totalFoodItems"),
  calorieBar: $("#calorieBar"),
  proteinBar: $("#proteinBar"),
  carbBar: $("#carbBar"),
  fatBar: $("#fatBar"),
  nutritionCoachText: $("#nutritionCoachText"),
  timer: $("#timer"),
  toggleSession: $("#toggleSession"),
  finishSession: $("#finishSession"),
  entryForm: $("#entryForm"),
  exerciseName: $("#exerciseName"),
  sets: $("#sets"),
  reps: $("#reps"),
  weight: $("#weight"),
  minutes: $("#minutes"),
  exerciseCalories: $("#exerciseCalories"),
  calculateExerciseCalories: $("#calculateExerciseCalories"),
  notes: $("#notes"),
  quickAdd: $("#quickAdd"),
  foodForm: $("#foodForm"),
  foodName: $("#foodName"),
  scanFoodPhotosButton: $("#scanFoodPhotosButton"),
  estimateFoodButton: $("#estimateFoodButton"),
  foodEstimateResult: $("#foodEstimateResult"),
  mealType: $("#mealType"),
  mealTime: $("#mealTime"),
  foodCalories: $("#foodCalories"),
  foodProtein: $("#foodProtein"),
  foodCarbs: $("#foodCarbs"),
  foodFat: $("#foodFat"),
  foodFiber: $("#foodFiber"),
  foodNotes: $("#foodNotes"),
  foodPhotos: $("#foodPhotos"),
  foodPhotoPreview: $("#foodPhotoPreview"),
  saveFoodButton: $("#saveFoodButton"),
  foodSaveFeedback: $("#foodSaveFeedback"),
  quickFood: $("#quickFood"),
  foodHistoryList: $("#foodHistoryList"),
  waterTotal: $("#waterTotal"),
  waterBar: $("#waterBar"),
  waterButtons: $$(".water-button"),
  waterAddButtons: $$(".water-add-button"),
  customWaterForm: $("#customWaterForm"),
  customWaterAmount: $("#customWaterAmount"),
  waterGoalForm: $("#waterGoalForm"),
  waterGoalInput: $("#waterGoalInput"),
  waterSaveFeedback: $("#waterSaveFeedback"),
  waterHydrationStatus: $("#waterHydrationStatus"),
  waterProgressRing: $("#waterProgressRing"),
  waterRingPercent: $("#waterRingPercent"),
  waterTodayAmount: $("#waterTodayAmount"),
  waterGoalAmount: $("#waterGoalAmount"),
  waterRemainingAmount: $("#waterRemainingAmount"),
  waterCompletionPercent: $("#waterCompletionPercent"),
  waterDailyGoalView: $("#waterDailyGoalView"),
  waterRemainingView: $("#waterRemainingView"),
  waterStreakStatus: $("#waterStreakStatus"),
  waterCurrentStreak: $("#waterCurrentStreak"),
  waterBestStreak: $("#waterBestStreak"),
  waterAverage: $("#waterAverage"),
  waterHighestDay: $("#waterHighestDay"),
  waterLowestDay: $("#waterLowestDay"),
  waterWeeklyAverage: $("#waterWeeklyAverage"),
  waterMonthlyAverage: $("#waterMonthlyAverage"),
  waterHistoryCount: $("#waterHistoryCount"),
  waterHistoryList: $("#waterHistoryList"),
  waterEditForm: $("#waterEditForm"),
  waterEditDate: $("#waterEditDate"),
  waterEditAmount: $("#waterEditAmount"),
  cancelWaterEdit: $("#cancelWaterEdit"),
  sleepTrackingForm: $("#sleepTrackingForm"),
  sleepRecordId: $("#sleepRecordId"),
  sleepFormTitle: $("#sleepFormTitle"),
  cancelSleepEdit: $("#cancelSleepEdit"),
  sleepDate: $("#sleepDate"),
  sleepStartTime: $("#sleepStartTime"),
  sleepWakeTime: $("#sleepWakeTime"),
  sleepHoursCalculated: $("#sleepHoursCalculated"),
  sleepQualityStars: $$("#sleepQualityStars button"),
  sleepQualityLabel: $("#sleepQualityLabel"),
  sleepQualityValue: $("#sleepQualityValue"),
  sleepNote: $("#sleepNote"),
  saveSleepButton: $("#saveSleepButton"),
  sleepSaveFeedback: $("#sleepSaveFeedback"),
  sleepGoalForm: $("#sleepGoalForm"),
  sleepGoalInput: $("#sleepGoalInput"),
  sleepTodayStatus: $("#sleepTodayStatus"),
  sleepTodayHours: $("#sleepTodayHours"),
  sleepGoalView: $("#sleepGoalView"),
  sleepQualityView: $("#sleepQualityView"),
  sleepCompletionView: $("#sleepCompletionView"),
  sleepWeeklyAverage: $("#sleepWeeklyAverage"),
  sleepMonthlyAverage: $("#sleepMonthlyAverage"),
  sleepBest: $("#sleepBest"),
  sleepWorst: $("#sleepWorst"),
  sleepAverageQuality: $("#sleepAverageQuality"),
  sleepConsistency: $("#sleepConsistency"),
  sleepCurrentStreak: $("#sleepCurrentStreak"),
  sleepBestStreak: $("#sleepBestStreak"),
  sleepHistoryCount: $("#sleepHistoryCount"),
  sleepHistoryList: $("#sleepHistoryList"),
  dailyCheckinForm: $("#dailyCheckinForm"),
  checkinCompletionText: $("#checkinCompletionText"),
  checkinStreakLabel: $("#checkinStreakLabel"),
  checkinWeight: $("#checkinWeight"),
  checkinSleepHours: $("#checkinSleepHours"),
  checkinMoodButtons: $$("#checkinMoodGrid button"),
  energyLevel: $("#energyLevel"),
  energyValue: $("#energyValue"),
  checkinWaterGoal: $("#checkinWaterGoal"),
  checkinTodayGoal: $("#checkinTodayGoal"),
  checkinSaveFeedback: $("#checkinSaveFeedback"),
  checkinHistoryCount: $("#checkinHistoryCount"),
  checkinHistoryList: $("#checkinHistoryList"),
  checkinHydrationStatus: $("#checkinHydrationStatus"),
  checkinHydrationText: $("#checkinHydrationText"),
  weightTrackingForm: $("#weightTrackingForm"),
  weightRecordId: $("#weightRecordId"),
  weightFormTitle: $("#weightFormTitle"),
  cancelWeightEdit: $("#cancelWeightEdit"),
  weightDate: $("#weightDate"),
  weightValue: $("#weightValue"),
  weightBodyFat: $("#weightBodyFat"),
  weightWaist: $("#weightWaist"),
  weightNote: $("#weightNote"),
  saveWeightButton: $("#saveWeightButton"),
  weightSaveFeedback: $("#weightSaveFeedback"),
  weightTrendBadge: $("#weightTrendBadge"),
  latestWeightValue: $("#latestWeightValue"),
  latestGoalWeight: $("#latestGoalWeight"),
  latestWeightDifference: $("#latestWeightDifference"),
  highestWeight: $("#highestWeight"),
  lowestWeight: $("#lowestWeight"),
  averageWeight: $("#averageWeight"),
  currentWeightChange: $("#currentWeightChange"),
  weightStatsCount: $("#weightStatsCount"),
  weightLineChart: $("#weightLineChart"),
  weightHistoryCount: $("#weightHistoryCount"),
  weightHistoryList: $("#weightHistoryList"),
  weightForm: $("#weightForm"),
  dailyWeight: $("#dailyWeight"),
  bodyFat: $("#bodyFat"),
  waist: $("#waist"),
  progressPhoto: $("#progressPhoto"),
  progressPhotoPreview: $("#progressPhotoPreview"),
  sleepForm: $("#sleepForm"),
  sleepTime: $("#sleepTime"),
  wakeTime: $("#wakeTime"),
  sleepQuality: $("#sleepQuality"),
  sleepDuration: $("#sleepDuration"),
  moodToday: $("#moodToday"),
  moodButtons: $$("#moodGrid button"),
  historyList: $("#historyList"),
  previousPerformanceCount: $("#previousPerformanceCount"),
  previousPerformanceList: $("#previousPerformanceList"),
  personalRecordCount: $("#personalRecordCount"),
  personalRecordList: $("#personalRecordList"),
  weeklyWorkoutStats: $("#weeklyWorkoutStats"),
  monthlyWorkoutStats: $("#monthlyWorkoutStats"),
  barChart: $("#barChart"),
  weekTotal: $("#weekTotal"),
  streak: $("#streak"),
  totalSessions: $("#totalSessions"),
  totalVolume: $("#totalVolume"),
  healthTrendGrid: $("#healthTrendGrid"),
  progressEmptyState: $("#progressEmptyState"),
  progressDataDays: $("#progressDataDays"),
  progressTodayScore: $("#progressTodayScore"),
  progressSevenAverage: $("#progressSevenAverage"),
  progressThirtyAverage: $("#progressThirtyAverage"),
  progressTrend: $("#progressTrend"),
  progressHighestScore: $("#progressHighestScore"),
  progressLowestScore: $("#progressLowestScore"),
  healthScoreChart: $("#healthScoreChart"),
  weightProgressChart: $("#weightProgressChart"),
  progressWeightStatus: $("#progressWeightStatus"),
  progressLatestWeight: $("#progressLatestWeight"),
  progressGoalWeight: $("#progressGoalWeight"),
  progressWeightDiff: $("#progressWeightDiff"),
  progressHighestWeight: $("#progressHighestWeight"),
  progressLowestWeight: $("#progressLowestWeight"),
  progressAverageWeight: $("#progressAverageWeight"),
  progressWeeklyWeightChange: $("#progressWeeklyWeightChange"),
  progressMonthlyWeightChange: $("#progressMonthlyWeightChange"),
  progressNutritionDays: $("#progressNutritionDays"),
  progressAverageCalories: $("#progressAverageCalories"),
  progressAverageProtein: $("#progressAverageProtein"),
  progressAverageCarbs: $("#progressAverageCarbs"),
  progressAverageFat: $("#progressAverageFat"),
  progressCaloriesVsTarget: $("#progressCaloriesVsTarget"),
  progressProteinVsTarget: $("#progressProteinVsTarget"),
  progressCaloriesBar: $("#progressCaloriesBar"),
  progressProteinBar: $("#progressProteinBar"),
  waterProgressChart: $("#waterProgressChart"),
  progressWaterAchievement: $("#progressWaterAchievement"),
  progressWaterDailyAverage: $("#progressWaterDailyAverage"),
  progressWaterWeeklyAverage: $("#progressWaterWeeklyAverage"),
  progressWaterMonthlyAverage: $("#progressWaterMonthlyAverage"),
  progressWaterCurrentStreak: $("#progressWaterCurrentStreak"),
  progressWaterBestStreak: $("#progressWaterBestStreak"),
  sleepProgressChart: $("#sleepProgressChart"),
  progressSleepAchievement: $("#progressSleepAchievement"),
  progressSleepAverageHours: $("#progressSleepAverageHours"),
  progressSleepAverageQuality: $("#progressSleepAverageQuality"),
  progressSleepCurrentStreak: $("#progressSleepCurrentStreak"),
  progressSleepBestStreak: $("#progressSleepBestStreak"),
  weeklySummaryGrid: $("#weeklySummaryGrid"),
  monthlySummaryGrid: $("#monthlySummaryGrid"),
  achievementStatus: $("#achievementStatus"),
  achievementGrid: $("#achievementGrid"),
  analyticsStatus: $("#analyticsStatus"),
  analyticsRecoveryScore: $("#analyticsRecoveryScore"),
  analyticsFatigueScore: $("#analyticsFatigueScore"),
  analyticsWeeklySets: $("#analyticsWeeklySets"),
  analyticsDensity: $("#analyticsDensity"),
  analyticsRecommendation: $("#analyticsRecommendation"),
  weeklyMuscleVolumeList: $("#weeklyMuscleVolumeList"),
  monthlyMuscleVolumeList: $("#monthlyMuscleVolumeList"),
  balanceStatus: $("#balanceStatus"),
  trainingBalanceGrid: $("#trainingBalanceGrid"),
  leftRightBalance: $("#leftRightBalance"),
  recoveryFatigueGrid: $("#recoveryFatigueGrid"),
  muscleHeatmap: $("#muscleHeatmap"),
  volumeLandmarkList: $("#volumeLandmarkList"),
  weakPointList: $("#weakPointList"),
  exerciseStatsCount: $("#exerciseStatsCount"),
  exerciseFrequencyList: $("#exerciseFrequencyList"),
  programPremiumGate: $("#programPremiumGate"),
  programProContent: $("#programProContent"),
  coachPremiumGate: $("#coachPremiumGate"),
  coachProContent: $("#coachProContent"),
  upgradeProgramButton: $("#upgradeProgramButton"),
  upgradeCoachButton: $("#upgradeCoachButton"),
  programForm: $("#programForm"),
  aiProgramRequestForm: $("#aiProgramRequestForm"),
  aiProgramGoal: $("#aiProgramGoal"), aiProgramExperience: $("#aiProgramExperience"), aiProgramDays: $("#aiProgramDays"), aiProgramMinutes: $("#aiProgramMinutes"), aiProgramEquipment: $("#aiProgramEquipment"), aiProgramRecovery: $("#aiProgramRecovery"),
  aiProgramTargets: $("#aiProgramTargets"), aiProgramInjuries: $("#aiProgramInjuries"), aiProgramPreferred: $("#aiProgramPreferred"), aiProgramAvoid: $("#aiProgramAvoid"),
  aiProgramDraft: $("#aiProgramDraft"), aiDraftStatus: $("#aiDraftStatus"), aiDraftSummary: $("#aiDraftSummary"), aiDraftValidation: $("#aiDraftValidation"), aiDraftDays: $("#aiDraftDays"), aiDraftExplanation: $("#aiDraftExplanation"),
  acceptAiDraft: $("#acceptAiDraft"), editAiDraft: $("#editAiDraft"), regenerateAiDraft: $("#regenerateAiDraft"), discardAiDraft: $("#discardAiDraft"),
  dashDraftProgramCard: $("#dashDraftProgramCard"), dashDraftStatus: $("#dashDraftStatus"), dashDraftGoal: $("#dashDraftGoal"), dashDraftSplit: $("#dashDraftSplit"), dashDraftCreated: $("#dashDraftCreated"), openDraftProgram: $("#openDraftProgram"),
  nutritionPlannerForm: $("#nutritionPlannerForm"), nutritionPlanGoal: $("#nutritionPlanGoal"), nutritionPlanStrategy: $("#nutritionPlanStrategy"), nutritionPlanWeight: $("#nutritionPlanWeight"), nutritionPlanTargetWeight: $("#nutritionPlanTargetWeight"), nutritionPlanHeight: $("#nutritionPlanHeight"), nutritionPlanAge: $("#nutritionPlanAge"), nutritionPlanBodyFat: $("#nutritionPlanBodyFat"), nutritionPlanSex: $("#nutritionPlanSex"), nutritionPlanActivity: $("#nutritionPlanActivity"), nutritionPlanTrainingDays: $("#nutritionPlanTrainingDays"), nutritionPlanDiet: $("#nutritionPlanDiet"), nutritionPlanBudget: $("#nutritionPlanBudget"), nutritionPlanMeals: $("#nutritionPlanMeals"), nutritionPlanCookingSkill: $("#nutritionPlanCookingSkill"), nutritionPlanAllergies: $("#nutritionPlanAllergies"), nutritionPlanFavorites: $("#nutritionPlanFavorites"), nutritionPlanAvoid: $("#nutritionPlanAvoid"),
  nutritionPlanDraft: $("#nutritionPlanDraft"), nutritionDraftStatus: $("#nutritionDraftStatus"), nutritionDraftSummary: $("#nutritionDraftSummary"), nutritionDraftValidation: $("#nutritionDraftValidation"), nutritionDraftMeals: $("#nutritionDraftMeals"), nutritionShoppingList: $("#nutritionShoppingList"), nutritionDraftExplanation: $("#nutritionDraftExplanation"),
  acceptNutritionDraft: $("#acceptNutritionDraft"), editNutritionDraft: $("#editNutritionDraft"), regenerateNutritionDraft: $("#regenerateNutritionDraft"), discardNutritionDraft: $("#discardNutritionDraft"),
  dashNutritionDraftCard: $("#dashNutritionDraftCard"), dashNutritionDraftStatus: $("#dashNutritionDraftStatus"), dashNutritionDraftGoal: $("#dashNutritionDraftGoal"), dashNutritionDraftCalories: $("#dashNutritionDraftCalories"), dashNutritionDraftMeals: $("#dashNutritionDraftMeals"), openNutritionDraft: $("#openNutritionDraft"),
  programGoal: $("#programGoal"),
  programExperience: $("#programExperience"),
  programDays: $("#programDays"),
  programMinutes: $("#programMinutes"),
  programEquipment: $("#programEquipment"),
  programInjuries: $("#programInjuries"),
  programAdherence: $("#programAdherence"),
  programPlanList: $("#programPlanList"),
  clearProgram: $("#clearProgram"),
  programGeneratedAt: $("#programGeneratedAt"),
  programTrainingDays: $("#programTrainingDays"),
  programWeeklyVolume: $("#programWeeklyVolume"),
  programEstimatedTime: $("#programEstimatedTime"),
  programCalendar: $("#programCalendar"),
  programSafetyWarning: $("#programSafetyWarning"),
  createProgramForm: $("#createProgramForm"),
  newProgramName: $("#newProgramName"),
  newProgramGoal: $("#newProgramGoal"),
  createBlankProgram: $("#createBlankProgram"),
  activeProgramCount: $("#activeProgramCount"),
  archivedProgramCount: $("#archivedProgramCount"),
  activeProgramList: $("#activeProgramList"),
  archivedProgramList: $("#archivedProgramList"),
  programManagerStatus: $("#programManagerStatus"),
  programNameEditor: $("#programNameEditor"),
  programNotesEditor: $("#programNotesEditor"),
  programVersionLabel: $("#programVersionLabel"),
  programScheduleDay: $("#programScheduleDay"),
  programScheduleWorkout: $("#programScheduleWorkout"),
  assignWorkoutToDay: $("#assignWorkoutToDay"),
  duplicateProgram: $("#duplicateProgram"),
  favoriteProgram: $("#favoriteProgram"),
  archiveProgram: $("#archiveProgram"),
  deleteProgram: $("#deleteProgram"),
  programScheduleGrid: $("#programScheduleGrid"),
  workoutSubtabs: $$(".workout-subtab"),
  workoutPanels: $$(".workout-panel"),
  workoutOverloadSummary: $("#workoutOverloadSummary"),
  exerciseTrendList: $("#exerciseTrendList"),
  exerciseSearch: $("#exerciseSearch"),
  exerciseMuscleFilter: $("#exerciseMuscleFilter"),
  exercisePatternFilter: $("#exercisePatternFilter"),
  exerciseEquipmentFilter: $("#exerciseEquipmentFilter"),
  exerciseDifficultyFilter: $("#exerciseDifficultyFilter"),
  clearExerciseFilters: $("#clearExerciseFilters"),
  exerciseLibraryCount: $("#exerciseLibraryCount"),
  exerciseLibraryList: $("#exerciseLibraryList"),
  exerciseDetailCard: $("#exerciseDetailCard"),
  dailyCoachText: $("#dailyCoachText"),
  weeklyCoachText: $("#weeklyCoachText"),
  refreshCoach: $("#refreshCoach"),
  chatStatus: $("#chatStatus"),
  suggestedQuestions: $("#suggestedQuestions"),
  chatHistory: $("#chatHistory"),
  quickReplies: $("#quickReplies"),
  coachChatForm: $("#coachChatForm"),
  coachChatInput: $("#coachChatInput"),
  coachChatSend: $("#coachChatSend"),
  clearCoachChat: $("#clearCoachChat"),
  personaChips: $$(".persona-chip"),
  trainerTotalClients: $("#trainerTotalClients"),
  trainerTodaySessions: $("#trainerTodaySessions"),
  trainerNeedsReview: $("#trainerNeedsReview"),
  trainerPlateauRisk: $("#trainerPlateauRisk"),
  trainerMissedWorkouts: $("#trainerMissedWorkouts"),
  trainerPendingDrafts: $("#trainerPendingDrafts"),
  trainerProfileForm: $("#trainerProfileForm"),
  trainerModeStatus: $("#trainerModeStatus"),
  trainerName: $("#trainerName"),
  trainerGym: $("#trainerGym"),
  trainerSpecialty: $("#trainerSpecialty"),
  trainerCertification: $("#trainerCertification"),
  trainerProfileNotes: $("#trainerProfileNotes"),
  trainerClientCount: $("#trainerClientCount"),
  trainerClientSearch: $("#trainerClientSearch"),
  trainerClientSort: $("#trainerClientSort"),
  trainerClientList: $("#trainerClientList"),
  trainerSelectedName: $("#trainerSelectedName"),
  trainerSelectedStatus: $("#trainerSelectedStatus"),
  trainerOverviewGrid: $("#trainerOverviewGrid"),
  trainerTimeline: $("#trainerTimeline"),
  trainerNoteForm: $("#trainerNoteForm"),
  trainerNoteType: $("#trainerNoteType"),
  trainerNoteClient: $("#trainerNoteClient"),
  trainerNoteText: $("#trainerNoteText"),
  trainerRecommendationForm: $("#trainerRecommendationForm"),
  trainerRecommendationType: $("#trainerRecommendationType"),
  trainerRecommendationClient: $("#trainerRecommendationClient"),
  trainerRecommendationText: $("#trainerRecommendationText"),
  trainerAiForm: $("#trainerAiForm"),
  trainerAiInput: $("#trainerAiInput"),
  trainerAiAnswer: $("#trainerAiAnswer"),
  clientForm: $("#clientForm"),
  clientId: $("#clientId"),
  clientName: $("#clientName"),
  clientPhone: $("#clientPhone"),
  clientEmail: $("#clientEmail"),
  clientBirthday: $("#clientBirthday"),
  clientNote: $("#clientNote"),
  profileForm: $("#profileForm"),
  profileDisplayName: $("#profileDisplayName"),
  profileGender: $("#profileGender"),
  profileAge: $("#profileAge"),
  profileHeight: $("#profileHeight"),
  targetWeight: $("#targetWeight"),
  goal: $("#goal"),
  bodyWeight: $("#bodyWeight"),
  activityLevel: $("#activityLevel"),
  weeklyTarget: $("#weeklyTarget"),
  privacyForm: $("#privacyForm"),
  privacyAnalytics: $("#privacyAnalytics"),
  privacyMarketing: $("#privacyMarketing"),
  privacyCoaching: $("#privacyCoaching"),
  feedbackForm: $("#feedbackForm"),
  feedbackType: $("#feedbackType"),
  feedbackMessage: $("#feedbackMessage"),
  feedbackEmail: $("#feedbackEmail"),
  feedbackScreenshot: $("#feedbackScreenshot"),
  feedbackThanks: $("#feedbackThanks"),
  offlineBanner: $("#offlineBanner"),
  reconnectButton: $("#reconnectButton"),
  reconnectPageButton: $("#reconnectPageButton"),
  offlineStatusText: $("#offlineStatusText"),
  releaseChecklistGrid: $("#releaseChecklistGrid"),
  changelogList: $("#changelogList"),
  diagnosticsGrid: $("#diagnosticsGrid"),
  diagnosticsStatus: $("#diagnosticsStatus"),
  refreshDiagnostics: $("#refreshDiagnostics"),
  exportDiagnostics: $("#exportDiagnostics"),
  betaWelcomeModal: $("#betaWelcomeModal"),
  betaWelcomeContinue: $("#betaWelcomeContinue"),
  appErrorModal: $("#appErrorModal"),
  appErrorRetry: $("#appErrorRetry"),
  appErrorBack: $("#appErrorBack"),
  exportAccount: $("#exportAccount"),
  deleteAccount: $("#deleteAccount"),
  installButton: $("#installButton"),
  quickActions: $$(".quick-action"),
  comingSoonModal: $("#comingSoonModal"),
  comingSoonTitle: $("#comingSoonTitle"),
  comingSoonText: $("#comingSoonText"),
  closeComingSoon: $("#closeComingSoon"),
};

init();

function init() {
  removeDemoUsers();
  bindGlobalErrorHandling();
  bindAuth();
  bindTabs();
  bindSession();
  bindForms();
  bindCoachChat();
  bindTrainerPortal();
  bindAdaptiveRecommendations();
  bindAiProgramGenerator();
  bindAiNutritionPlanner();
  bindBetaOperations();
  bindInstall();
  renderQuickAdd();
  renderQuickFood();
  renderReleaseReadiness();
  renderOfflineStatus();
  setAuthMode("login");
  syncAuthView();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("/service-worker.js");
}

function bindAuth() {
  fields.authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const password = fields.authPassword.value;

    if (authMode === "register") await registerUser(buildRegistrationPayload(), password);
    else await loginUser(normalizeUserId(fields.authId.value), password, fields.rememberMe.checked);
  });

  fields.authModeToggle.addEventListener("click", () => {
    setAuthMode(authMode === "login" ? "register" : "login");
  });

  fields.landingRegisterButton.addEventListener("click", () => {
    setAuthMode("register");
    showLogin();
  });

  fields.landingLoginButton.addEventListener("click", () => {
    setAuthMode("login");
    showLogin();
  });

  fields.forgotPassword.addEventListener("click", () => {
    showAuthMessage("Password reset will be connected in a later sprint.", "success");
  });

  fields.logoutButton.addEventListener("click", async () => {
    pauseSession();
    if (USE_BACKEND && !LOCAL_TRACKING_ONLY && authToken) {
      try { await apiRequest("/api/auth/logout", { method: "POST" }); } catch {}
    }
    currentUserId = "";
    authToken = "";
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    entries = [];
    foods = [];
    healthLogs = {};
    workoutProgram = defaultWorkoutProgram();
    workoutPrograms = [];
    activeProgramId = "";
    programHistory = [];
    chatMessages = [];
    coachPersona = "friendly";
    aiProgramDraft = null;
    nutritionPlanDraft = null;
    nutritionPlans = [];
    trainerPortal = defaultTrainerPortal();
    selectedTrainerClientId = "";
    profile = defaultProfile();
    client = defaultClient();
    fields.authPassword.value = "";
    showLanding();
  });

  fields.oauthButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!USE_BACKEND) {
        showAuthMessage("Social login requires the localhost/server version.", "error");
        return;
      }
      window.location.href = `/api/auth/oauth/${button.dataset.provider}`;
    });
  });

  fields.onboardingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    profile = {
      ...profile,
      displayName: fields.onboardingDisplayName.value.trim(),
      gender: fields.onboardingGender.value,
      age: Number(fields.onboardingAge.value || 0),
      heightCm: Number(fields.onboardingHeight.value || 0),
      bodyWeight: Number(fields.onboardingCurrentWeight.value || 70),
      targetWeight: Number(fields.onboardingTargetWeight.value || 0),
      goal: fields.onboardingGoal.value,
      activityLevel: fields.onboardingActivityLevel.value,
      onboardingComplete: true,
    };
    await persistProfile();
    showApp();
  });
}

function setAuthMode(mode) {
  authMode = mode;
  const isRegister = authMode === "register";
  fields.authTitle.textContent = isRegister ? "Create account" : "Log in";
  fields.authCopy.textContent = isRegister ? "Set up your Khayubdi foundation profile." : "Use your username or email to open your profile on this device.";
  fields.authSubmit.textContent = isRegister ? "Create account" : "Log in";
  fields.authModeToggle.textContent = isRegister ? "I already have an account" : "Create account";
  fields.authId.required = !isRegister;
  fields.registerUsername.required = isRegister;
  fields.registerEmail.required = isRegister;
  fields.authConfirmPassword.required = isRegister;
  fields.authPassword.autocomplete = isRegister ? "new-password" : "current-password";
  $$(".register-only").forEach((item) => item.classList.toggle("hidden", !isRegister));
  $$(".login-only").forEach((item) => item.classList.toggle("hidden", isRegister));
  fields.authMessage.textContent = "";
  fields.authMessage.className = "auth-note";
}

function buildRegistrationPayload() {
  return {
    username: fields.registerUsername.value,
    email: fields.registerEmail.value,
    displayName: fields.registerDisplayName.value,
    gender: fields.registerGender.value,
    age: Number(fields.registerAge.value || 0),
    heightCm: Number(fields.registerHeight.value || 0),
    currentWeight: Number(fields.registerCurrentWeight.value || 0),
    targetWeight: Number(fields.registerTargetWeight.value || 0),
    goal: fields.registerGoal.value,
    activityLevel: fields.registerActivityLevel.value,
    confirmPassword: fields.authConfirmPassword.value,
  };
}

async function registerUser(registration, password) {
  const username = normalizeUserId(registration.username);
  const email = normalizeUserId(registration.email);
  if (!username || !email || !password) {
    showAuthMessage("Enter username, email, and password.", "error");
    return;
  }
  if (password !== registration.confirmPassword) {
    showAuthMessage("Passwords do not match.", "error");
    return;
  }
  if (password.length < 8) {
    showAuthMessage("Password must be at least 8 characters.", "error");
    return;
  }

  if (USE_BACKEND && !LOCAL_TRACKING_ONLY) {
    try {
      const data = await apiRequest("/api/auth/register", { method: "POST", body: { ...registration, username, email, password } });
      authToken = data.token;
      currentUserId = data.user.id;
      rememberSession(true);
      await syncAuthView();
      return;
    } catch (error) {
      showAuthMessage(error.message, "error");
      return;
    }
  }

  const users = loadUsers();
  if (users[username] || Object.values(users).some((user) => normalizeUserId(user.email) === email)) {
    showAuthMessage("This account already exists. Log in instead.", "error");
    return;
  }

  users[username] = {
    username,
    email,
    password,
    displayName: registration.displayName || username,
    createdAt: new Date().toISOString(),
  };
  saveUsers(users);
  currentUserId = username;
  profile = profileFromRegistration({ ...registration, username, password }, true);
  localStorage.setItem(PROFILE_KEY(), JSON.stringify(profile));
  rememberSession(true);
  showAuthMessage("Account created.", "success");
  await syncAuthView();
}

async function loginUser(id, password, remember) {
  if (!id || !password) {
    showAuthMessage("Enter your username/email and password.", "error");
    return;
  }
  if (USE_BACKEND && !LOCAL_TRACKING_ONLY) {
    try {
      const data = await apiRequest("/api/auth/login", { method: "POST", body: { userId: id, password } });
      authToken = data.token;
      currentUserId = data.user.id;
      rememberSession(remember);
      await syncAuthView();
      return;
    } catch (error) {
      showAuthMessage(error.message, "error");
      return;
    }
  }

  const users = loadUsers();
  const userId = resolveLocalUserId(id, users);
  if (!userId || users[userId].password !== password) {
    showAuthMessage("Account not found or password is wrong. Tap Create account first.", "error");
    return;
  }

  currentUserId = userId;
  rememberSession(remember);
  await syncAuthView();
}

async function syncAuthView() {
  if (USE_BACKEND && !LOCAL_TRACKING_ONLY) {
    if (!authToken) {
      showLanding();
      return;
    }

    try {
      const data = await apiRequest("/api/app/me");
      currentUserId = data.user.id;
      entries = loadEntries();
      foods = loadFoods();
      healthLogs = loadHealthLogs();
      workoutProgram = loadWorkoutProgram();
      ensureProgramManager();
      programHistory = loadProgramHistory();
      chatMessages = loadCoachChat();
      aiProgramDraft = loadAiProgramDraft();
      nutritionPlanDraft = loadNutritionPlanDraft();
      nutritionPlans = loadNutritionPlans();
      trainerPortal = loadTrainerPortal();
      selectedTrainerClientId = trainerDirectory()[0]?.id || "";
      profile = { ...defaultProfile(), ...(data.profile || {}) };
      client = { ...defaultClient(), ...(data.client || {}) };
      if (!profile.onboardingComplete) showOnboarding();
      else showApp();
      return;
    } catch {
      authToken = "";
      currentUserId = "";
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      showLogin();
      return;
    }
  }

  if (!currentUserId || !loadUsers()[currentUserId]) {
    showLanding();
    return;
  }

  entries = loadEntries();
  foods = loadFoods();
  healthLogs = loadHealthLogs();
  workoutProgram = loadWorkoutProgram();
  ensureProgramManager();
  programHistory = loadProgramHistory();
  chatMessages = loadCoachChat();
  aiProgramDraft = loadAiProgramDraft();
  nutritionPlanDraft = loadNutritionPlanDraft();
  nutritionPlans = loadNutritionPlans();
  trainerPortal = loadTrainerPortal();
  selectedTrainerClientId = trainerDirectory()[0]?.id || "";
  profile = loadProfile();
  client = loadClient();
  if (!profile.onboardingComplete) {
    showOnboarding();
    return;
  }
  showApp();
}

function showApp() {
  fields.currentUser.textContent = currentUserId;
  fields.splashShell.classList.add("hidden");
  fields.authShell.classList.add("hidden");
  fields.onboardingShell.classList.add("hidden");
  fields.appShell.classList.remove("hidden");
  renderProfile();
  renderClient();
  renderPrivacy();
  render();
  renderDiagnostics();
  showBetaWelcomeIfNeeded();
  renderUxCheckinSheet();
}

function showLanding() {
  fields.splashShell.classList.remove("hidden");
  fields.authShell.classList.add("hidden");
  fields.onboardingShell.classList.add("hidden");
  fields.appShell.classList.add("hidden");
}

function showLogin() {
  fields.splashShell.classList.add("hidden");
  fields.authShell.classList.remove("hidden");
  fields.onboardingShell.classList.add("hidden");
  fields.appShell.classList.add("hidden");
}

function showOnboarding() {
  hydrateOnboardingForm();
  fields.splashShell.classList.add("hidden");
  fields.authShell.classList.add("hidden");
  fields.onboardingShell.classList.remove("hidden");
  fields.appShell.classList.add("hidden");
}

function showAuthMessage(message, type) {
  fields.authMessage.textContent = message;
  fields.authMessage.className = `auth-note ${type}`;
}

function bindTabs() {
  $$(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      switchTab(tab.dataset.tab);
    });
  });

  fields.workoutSubtabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      switchWorkoutPanel(tab.dataset.workoutPanel);
    });
  });

  fields.quickActions.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.tabTarget) {
        switchTab(button.dataset.tabTarget);
        return;
      }
      showComingSoon(button.textContent.trim());
    });
  });
  fields.uxStartWorkout?.addEventListener("click", () => {
    switchTab("track");
    if (!sessionStartedAt) startSession();
    fields.entryForm?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  fields.zeroPrevExercise?.addEventListener("click", () => showToast("Previous exercise"));
  fields.zeroNextExercise?.addEventListener("click", () => {
    fields.entryForm?.scrollIntoView({ behavior: "smooth", block: "center" });
    fields.exerciseName?.focus();
  });
  fields.zeroCompleteSet?.addEventListener("click", () => {
    fields.entryForm?.scrollIntoView({ behavior: "smooth", block: "center" });
    fields.exerciseName?.focus();
    showToast("Set ready to save.");
  });
  fields.zeroDoneWorkout?.addEventListener("click", () => {
    fields.zeroFinishCard?.classList.add("hidden");
    switchTab("dashboard");
  });
  fields.zeroMealCards.forEach((button) => {
    button.addEventListener("click", () => {
      switchTab("nutrition");
      fields.mealType.value = button.dataset.zeroMeal || "snack";
      fields.zeroFoodSearch?.focus();
      fields.foodForm?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
  fields.zeroFoodSearch?.addEventListener("input", () => {
    fields.foodName.value = fields.zeroFoodSearch.value;
  });
  fields.zeroAiEstimate?.addEventListener("click", () => {
    fields.foodName.value = fields.zeroFoodSearch?.value || fields.foodName.value;
    fields.estimateFoodButton?.click();
  });
  fields.zeroBarcode?.addEventListener("click", () => showToast("Barcode capture is not enabled in this beta."));
  fields.uxDismissCheckin?.addEventListener("click", () => {
    uxCheckinSheetDismissed = true;
    renderUxCheckinSheet();
  });
  if (fields.notificationRecentList) {
    fields.notificationRecentList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-notification-action]");
      if (!button) return;
      handleNotificationAction(button.dataset.notificationAction, button.dataset.notificationId);
    });
  }

  fields.closeComingSoon.addEventListener("click", hideComingSoon);
  fields.comingSoonModal.addEventListener("click", (event) => {
    if (event.target === fields.comingSoonModal) hideComingSoon();
  });
}

function bindBetaOperations() {
  if (fields.feedbackForm) {
    fields.feedbackForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await saveFeedbackLocally();
      fields.feedbackMessage.value = "";
      if (fields.feedbackEmail) fields.feedbackEmail.value = "";
      if (fields.feedbackScreenshot) fields.feedbackScreenshot.value = "";
      fields.feedbackThanks.classList.remove("hidden");
      showToast(navigator.onLine ? "Feedback saved for beta review." : "Feedback saved offline.");
      window.setTimeout(() => fields.feedbackThanks.classList.add("hidden"), 3200);
    });
  }
  fields.refreshDiagnostics?.addEventListener("click", renderDiagnostics);
  fields.exportDiagnostics?.addEventListener("click", exportDiagnosticsJson);
  [fields.reconnectButton, fields.reconnectPageButton].filter(Boolean).forEach((button) => button.addEventListener("click", () => {
    renderOfflineStatus();
    renderDiagnostics();
    showToast(navigator.onLine ? "Back online." : "Still offline. Cached mode is active.");
  }));
  fields.betaWelcomeContinue?.addEventListener("click", dismissBetaWelcome);
  fields.appErrorRetry?.addEventListener("click", () => window.location.reload());
  fields.appErrorBack?.addEventListener("click", () => {
    fields.appErrorModal?.classList.add("hidden");
    switchTab("dashboard");
  });
  window.addEventListener("online", () => { renderOfflineStatus(); renderDiagnostics(); });
  window.addEventListener("offline", () => { renderOfflineStatus(); renderDiagnostics(); });
}

function bindGlobalErrorHandling() {
  window.addEventListener("error", (event) => {
    showAppError("Something went wrong", event.message || "Unexpected app error.");
  });
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason?.message || String(event.reason || "Unexpected background error.");
    showAppError("Something went wrong", reason);
  });
}

function showAppError(title = "Something went wrong", message = "Please reload or report the issue.") {
  if (!fields.appErrorModal) return;
  const titleNode = $("#appErrorTitle");
  const textNode = $("#appErrorText");
  if (titleNode) titleNode.textContent = title;
  if (textNode) textNode.textContent = `${message} Your data on this device was not changed by this screen.`;
  fields.appErrorModal.classList.remove("hidden");
}

async function saveFeedbackLocally() {
  const screenshot = fields.feedbackScreenshot?.files?.[0];
  const payload = {
    id: crypto.randomUUID?.() || `feedback-${Date.now()}`,
    category: fields.feedbackType?.value || "other",
    message: fields.feedbackMessage?.value?.trim() || "",
    email: fields.feedbackEmail?.value?.trim() || "",
    screenshot: screenshot ? { name: screenshot.name, type: screenshot.type, size: screenshot.size } : null,
    appVersion: APP_VERSION,
    build: APP_BUILD,
    cacheVersion: APP_CACHE_VERSION,
    networkStatus: navigator.onLine ? "online" : "offline",
    createdAt: new Date().toISOString(),
    status: navigator.onLine ? "ready_for_api" : "saved_offline",
  };
  const queue = loadFeedbackQueue();
  queue.unshift(payload);
  localStorage.setItem(FEEDBACK_QUEUE_KEY, JSON.stringify(queue.slice(0, 25)));
  return payload;
}

function loadFeedbackQueue() {
  try { return JSON.parse(localStorage.getItem(FEEDBACK_QUEUE_KEY) || "[]"); }
  catch { return []; }
}

function bindCoachChat() {
  if (fields.coachChatForm) {
    fields.coachChatForm.addEventListener("submit", (event) => {
      event.preventDefault();
      sendCoachChatMessage(fields.coachChatInput.value);
    });
  }
  if (fields.clearCoachChat) {
    fields.clearCoachChat.addEventListener("click", () => {
      if (!window.confirm("ล้างบทสนทนากับโค้ช? ข้อมูลสุขภาพและ workout จะไม่ถูกลบ")) return;
      chatMessages = [];
      saveCoachChat();
      renderCoachChat();
    });
  }
  fields.personaChips.forEach((button) => {
    button.addEventListener("click", () => {
      coachPersona = button.dataset.persona || "friendly";
      saveCoachChat();
      renderCoachChat();
    });
  });
  if (fields.suggestedQuestions) {
    fields.suggestedQuestions.addEventListener("click", (event) => {
      const button = event.target.closest("[data-question]");
      if (button) sendCoachChatMessage(button.dataset.question);
    });
  }
  if (fields.quickReplies) {
    fields.quickReplies.addEventListener("click", (event) => {
      const button = event.target.closest("[data-reply]");
      if (button) sendCoachChatMessage(button.dataset.reply);
    });
  }
}

function bindTrainerPortal() {
  if (fields.trainerProfileForm) {
    fields.trainerProfileForm.addEventListener("submit", (event) => {
      event.preventDefault();
      trainerPortal.profile = {
        name: fields.trainerName.value.trim(),
        gym: fields.trainerGym.value.trim(),
        specialty: fields.trainerSpecialty.value.trim(),
        certification: fields.trainerCertification.value.trim(),
        notes: fields.trainerProfileNotes.value.trim(),
        updatedAt: new Date().toISOString(),
      };
      saveTrainerPortal();
      renderTrainerPortal();
      showToast("บันทึก Trainer Profile แล้ว");
    });
  }
  if (fields.trainerClientSearch) fields.trainerClientSearch.addEventListener("input", renderTrainerPortal);
  if (fields.trainerClientSort) fields.trainerClientSort.addEventListener("change", renderTrainerPortal);
  if (fields.trainerClientList) {
    fields.trainerClientList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-trainer-client]");
      if (!button) return;
      selectedTrainerClientId = button.dataset.trainerClient;
      renderTrainerPortal();
    });
  }
  if (fields.trainerNoteForm) {
    fields.trainerNoteForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!selectedTrainerClientId) return showToast("เลือก client ก่อน");
      trainerPortal.notes.unshift({
        id: `trainer-note-${crypto.randomUUID()}`,
        clientId: selectedTrainerClientId,
        type: fields.trainerNoteType.value,
        text: fields.trainerNoteText.value.trim(),
        createdAt: new Date().toISOString(),
      });
      fields.trainerNoteText.value = "";
      saveTrainerPortal();
      renderTrainerPortal();
      showToast("บันทึก trainer note แล้ว");
    });
  }
  if (fields.trainerRecommendationForm) {
    fields.trainerRecommendationForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!selectedTrainerClientId) return showToast("เลือก client ก่อน");
      trainerPortal.recommendations.unshift({
        id: `trainer-rec-${crypto.randomUUID()}`,
        clientId: selectedTrainerClientId,
        type: fields.trainerRecommendationType.value,
        text: fields.trainerRecommendationText.value.trim(),
        status: "draft",
        createdAt: new Date().toISOString(),
      });
      fields.trainerRecommendationText.value = "";
      saveTrainerPortal();
      renderTrainerPortal();
      showToast("สร้าง recommendation draft แล้ว");
    });
  }
  if (fields.trainerAiForm) {
    fields.trainerAiForm.addEventListener("submit", (event) => {
      event.preventDefault();
      fields.trainerAiAnswer.innerHTML = trainerAiAnswer(fields.trainerAiInput.value);
    });
  }
}

function bindAdaptiveRecommendations() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-adaptive-action]");
    if (!button) return;
    const action = button.dataset.adaptiveAction;
    const id = button.dataset.adaptiveId;
    if (!id || !["accept", "dismiss", "remind"].includes(action)) return;
    const decisions = loadAdaptiveDecisions();
    decisions[id] = {
      action,
      decidedAt: new Date().toISOString(),
      remindAt: action === "remind" ? nextDateIso(1) : "",
    };
    saveAdaptiveDecisions(decisions);
    showToast(action === "accept" ? "บันทึกว่าเห็นด้วยแล้ว โปรแกรมยังไม่ถูกแก้" : action === "dismiss" ? "ซ่อนคำแนะนำนี้แล้ว" : "เตือนใหม่ภายหลัง");
    renderDashboardAdaptiveRecommendations();
  });
}

function bindAiNutritionPlanner() {
  if (!fields.nutritionPlannerForm) return;
  fields.nutritionPlannerForm.addEventListener("submit", (event) => { event.preventDefault(); generateNutritionDraft(); });
  fields.regenerateNutritionDraft.addEventListener("click", generateNutritionDraft);
  fields.editNutritionDraft.addEventListener("click", () => {
    fields.nutritionDraftMeals.querySelectorAll("input").forEach((input) => { input.disabled = false; });
    fields.nutritionDraftStatus.textContent = "Editing"; fields.nutritionDraftMeals.querySelector("input")?.focus();
  });
  fields.nutritionDraftMeals.addEventListener("input", updateNutritionDraftFromEditor);
  fields.acceptNutritionDraft.addEventListener("click", acceptNutritionDraft);
  fields.discardNutritionDraft.addEventListener("click", () => {
    if (!window.confirm("ทิ้ง Nutrition Draft นี้? Food logs และแผนเดิมจะไม่เปลี่ยนแปลง")) return;
    nutritionPlanDraft = null; saveNutritionPlanDraft(); renderNutritionPlanDraft(); renderDashboardNutritionDraft(); showToast("ทิ้ง Nutrition Draft แล้ว");
  });
  fields.openNutritionDraft.addEventListener("click", () => { switchTab("nutrition"); fields.nutritionPlanDraft.scrollIntoView({ behavior: "smooth", block: "start" }); });
}

function currentNutritionProgramSummary() {
  const program = activeProgram();
  return { id: program?.id || "", name: program?.name || "No active program", goal: program?.settings?.goal || program?.goal || "", days: Number(program?.settings?.days || program?.days?.length || 0), weeklySets: (program?.days || []).flatMap((day) => day.exercises || []).reduce((sum, exercise) => sum + Number(exercise.sets || 0), 0) };
}

function recentNutritionProgressSummary() {
  const records = weightRecords(); const latest = Number(records[0]?.weightKg || profile.bodyWeight || 0); const previous = Number(records[1]?.weightKg || latest || 0); const analytics = trainingAnalyticsEngine();
  return { latestWeight: latest, weightChange: Number((latest - previous).toFixed(1)), recoveryScore: Number(analytics?.recovery?.score || 0), fatigueScore: Number(analytics?.fatigue?.score || 0), weeklyTrainingSets: Number(analytics?.weekly?.totalSets || 0) };
}

function nutritionPlannerProfile(overrides = {}) {
  return {
    goal: fields.nutritionPlanGoal.value, strategy: fields.nutritionPlanStrategy.value, weight: Number(fields.nutritionPlanWeight.value || profile.bodyWeight || 70), targetWeight: Number(fields.nutritionPlanTargetWeight.value || profile.targetWeight || 0), height: Number(fields.nutritionPlanHeight.value || profile.heightCm || 170), age: Number(fields.nutritionPlanAge.value || profile.age || 30), estimatedBodyFat: Number(fields.nutritionPlanBodyFat.value || latestWeightRecord()?.bodyFat || 0),
    sex: fields.nutritionPlanSex.value, activityLevel: fields.nutritionPlanActivity.value, trainingDays: Number(fields.nutritionPlanTrainingDays.value || 0), diet: fields.nutritionPlanDiet.value,
    allergies: fields.nutritionPlanAllergies.value.trim(), budget: fields.nutritionPlanBudget.value, mealsPerDay: Number(fields.nutritionPlanMeals.value || 4), cookingSkill: fields.nutritionPlanCookingSkill.value, favoriteFoods: fields.nutritionPlanFavorites.value.trim(), foodsToAvoid: fields.nutritionPlanAvoid.value.trim(),
    currentProgramSummary: currentNutritionProgramSummary(), recentProgressSummary: recentNutritionProgressSummary(), ...overrides,
  };
}

function estimateNutritionTargets(data) {
  const sexOffset = data.sex === "male" ? 5 : data.sex === "female" ? -161 : -78;
  const bmr = Math.round(10 * data.weight + 6.25 * data.height - 5 * data.age + sexOffset);
  const multiplier = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 }[data.activityLevel] || 1.55;
  const maintenance = Math.round(bmr * multiplier);
  const adjustment = data.strategy === "aggressive_cut" ? -Math.min(750, Math.round(maintenance * .25)) : data.strategy === "fat_loss" ? -Math.min(500, Math.round(maintenance * .18)) : data.strategy === "lean_bulk" ? Math.min(350, Math.round(maintenance * .1)) : 0;
  const calories = Math.max(1200, maintenance + adjustment);
  const protein = Math.round(data.weight * (data.goal === "muscle_gain" ? 2 : data.goal === "fat_loss" ? 1.8 : 1.6));
  const fat = Math.round(data.weight * .8);
  const carbs = Math.max(50, Math.round((calories - protein * 4 - fat * 9) / 4));
  return { bmr, maintenance, calories, protein, carbs, fat, fiber: Math.round(calories / 1000 * 14), water: Math.round((data.weight * 35 + data.trainingDays * 80) / 100) * 100, adjustment };
}

function generateNutritionDraft(requestOverrides = {}) {
  const request = nutritionPlannerProfile(requestOverrides?.preventDefault ? {} : requestOverrides); const targets = estimateNutritionTargets(request);
  const meals = buildNutritionMeals(request, targets); const shoppingList = buildNutritionShoppingList(meals);
  const draftId = `nutrition-draft-${crypto.randomUUID()}`;
  nutritionPlanDraft = { id: draftId, draftId, generator: "Khayubdi AI Nutrition Planner", status: NUTRITION_PLAN_STATUSES.DRAFT, createdAt: new Date().toISOString(), name: `${nutritionStrategyLabel(request.strategy)} Meal Plan`, request, targets, meals, shoppingList };
  nutritionPlanDraft.validation = validateNutritionDraft(nutritionPlanDraft);
  nutritionPlanDraft.explanation = explainNutritionPlan(request, targets);
  saveNutritionPlanDraft(); renderNutritionPlanDraft(); renderDashboardNutritionDraft(); showToast("สร้าง Nutrition Draft แล้ว กรุณาตรวจสอบก่อน Accept");
}

function nutritionFoodLibrary(request) {
  const vegetarian = request.diet === "vegetarian" || request.diet === "vegan";
  const vegan = request.diet === "vegan"; const pescatarian = request.diet === "pescatarian";
  const proteins = vegan ? ["เต้าหู้", "ถั่วเลนทิล", "ถั่วลูกไก่"] : vegetarian ? ["เต้าหู้", "ไข่", "กรีกโยเกิร์ต"] : pescatarian ? ["ปลา", "ไข่", "เต้าหู้"] : request.budget === "low" ? ["ไข่", "อกไก่", "เต้าหู้"] : ["อกไก่", "ปลา", "ไข่"];
  return { proteins, carbs: request.budget === "low" ? ["ข้าวกล้อง", "ข้าวโอ๊ต", "มันหวาน"] : ["ข้าวกล้อง", "ขนมปังโฮลวีต", "มันหวาน"], vegetables: ["ผักใบเขียว", "บรอกโคลี", "แครอท"], fruits: ["กล้วย", "แอปเปิล", "เบอร์รี"], fats: ["อะโวคาโด", "ถั่ว", "น้ำมันมะกอก"], vegan };
}

function buildNutritionMeals(request, targets) {
  const library = nutritionFoodLibrary(request); const allergies = `${request.allergies},${request.foodsToAvoid}`.toLowerCase().split(",").map((item) => item.trim()).filter(Boolean);
  const safe = (items) => items.filter((item) => !containsListedAllergen(item, allergies));
  library.proteins = safe(library.proteins); library.carbs = safe(library.carbs); library.vegetables = safe(library.vegetables); library.fruits = safe(library.fruits); library.fats = safe(library.fats);
  const favorites = safe(String(request.favoriteFoods || "").split(",").map((item) => item.trim()).filter(Boolean)); favorites.reverse().forEach((food) => library.proteins.unshift(food));
  const labels = request.mealsPerDay === 3 ? ["Breakfast", "Lunch", "Dinner"] : ["Breakfast", "Lunch", "Dinner", "Snack", "Pre-workout", "Post-workout"].slice(0, request.mealsPerDay);
  const ratios = request.mealsPerDay === 3 ? [.3,.4,.3] : request.mealsPerDay === 4 ? [.25,.35,.3,.1] : request.mealsPerDay === 5 ? [.22,.3,.27,.1,.11] : [.2,.28,.25,.09,.09,.09];
  return labels.map((label, index) => {
    const ratio = ratios[index] || 1 / labels.length; const protein = library.proteins[index % Math.max(1, library.proteins.length)] || "โปรตีนที่ไม่ก่ออาการแพ้";
    const carb = library.carbs[index % Math.max(1, library.carbs.length)] || "แหล่งคาร์โบไฮเดรตที่เหมาะสม";
    const produce = index === 3 ? (library.fruits[0] || "ผลไม้ที่รับประทานได้") : (library.vegetables[index % Math.max(1, library.vegetables.length)] || "ผักที่รับประทานได้");
    const calories = Math.round(targets.calories * ratio); const p = Math.round(targets.protein * ratio); const f = Math.round(targets.fat * ratio); const c = Math.max(0, Math.round((calories - p * 4 - f * 9) / 4));
    const healthyFat = library.fats[index % Math.max(1, library.fats.length)] || "ไขมันดีที่รับประทานได้";
    const servingSizes = `${protein} ${Math.max(80, Math.round(p / .22 / 10) * 10)}g · ${carb} ${Math.max(80, Math.round(c / .28 / 10) * 10)}g · ${produce} 100g · ${healthyFat} ${Math.max(10, Math.round(f / 5) * 5)}g`;
    return { id: `meal-${index}-${crypto.randomUUID()}`, label, items: `${protein}, ${carb}, ${produce}, ${healthyFat}`, servingSizes, calories, protein: p, carbs: c, fat: f, substitutions: `${protein} → ${library.proteins.filter((item) => item !== protein).slice(0, 3).join(" → ") || "เลือกโปรตีนชนิดอื่นที่ไม่แพ้"}` };
  });
}

function containsListedAllergen(text, allergies) {
  const value = String(text || "").toLowerCase();
  const aliases = { "นม": ["นม", "โยเกิร์ต", "ชีส", "เวย์"], milk: ["milk", "yogurt", "cheese", "whey"], "ถั่ว": ["ถั่ว", "อัลมอนด์", "peanut"], nut: ["nut", "almond", "peanut", "ถั่ว"], peanut: ["peanut", "ถั่วลิสง", "ถั่ว"], "ถั่วลิสง": ["peanut", "ถั่วลิสง", "ถั่ว"], "ไข่": ["ไข่"], egg: ["egg", "ไข่"], "กุ้ง": ["กุ้ง", "shellfish"], shellfish: ["shellfish", "shrimp", "กุ้ง"] };
  return allergies.some((allergy) => (aliases[allergy] || [allergy]).some((word) => value.includes(word)));
}

function buildNutritionShoppingList(meals) {
  const all = meals.flatMap((meal) => meal.items.split(",").map((item) => item.trim()));
  const has = (words) => [...new Set(all.filter((item) => words.some((word) => item.includes(word))))];
  return { Protein: has(["ไก่","ปลา","ไข่","เต้าหู้","ถั่ว","โยเกิร์ต","โปรตีน"]), Carbs: has(["ข้าว","โอ๊ต","ขนมปัง","มัน"]), Vegetables: has(["ผัก","บรอกโคลี","แครอท"]), Fruits: has(["กล้วย","แอปเปิล","เบอร์รี","ผลไม้"]), "Healthy Fats": has(["อะโวคาโด","น้ำมัน","ถั่ว"]), Others: ["เครื่องเทศโซเดียมต่ำ", "น้ำดื่ม"] };
}

function nutritionDraftTotals(draft) { return draft.meals.reduce((total, meal) => ({ calories: total.calories + Number(meal.calories || 0), protein: total.protein + Number(meal.protein || 0), carbs: total.carbs + Number(meal.carbs || 0), fat: total.fat + Number(meal.fat || 0) }), { calories: 0, protein: 0, carbs: 0, fat: 0 }); }

function validateNutritionDraft(draft) {
  const total = nutritionDraftTotals(draft); const target = draft.targets; const allergyWords = draft.request.allergies.toLowerCase().split(",").map((item) => item.trim()).filter(Boolean);
  const allergyHits = draft.meals.filter((meal) => containsListedAllergen(meal.items, allergyWords)).length;
  const avoidWords = String(draft.request.foodsToAvoid || "").toLowerCase().split(",").map((item) => item.trim()).filter(Boolean);
  const avoidHits = draft.meals.filter((meal) => containsListedAllergen(meal.items, avoidWords)).length;
  const dietHits = draft.meals.filter((meal) => !mealMatchesDiet(meal.items, draft.request.diet)).length;
  const distributions = draft.meals.map((meal) => meal.calories / Math.max(1, total.calories));
  return [
    { label: "Calories near target", pass: Math.abs(total.calories - target.calories) <= Math.max(100, target.calories * .08), detail: `${total.calories}/${target.calories} kcal` },
    { label: "Macros near target", pass: Math.abs(total.protein - target.protein) <= 15 && Math.abs(total.carbs - target.carbs) <= 25 && Math.abs(total.fat - target.fat) <= 12, detail: `P ${total.protein}/${target.protein}g · C ${total.carbs}/${target.carbs}g · F ${total.fat}/${target.fat}g` },
    { label: "Meal count", pass: draft.meals.length === draft.request.mealsPerDay, detail: `${draft.meals.length}/${draft.request.mealsPerDay} meals` },
    { label: "Meal distribution", pass: distributions.every((value) => value >= .07 && value <= .45), detail: `${draft.meals.length} meals distributed` },
    { label: "Goal consistency", pass: draft.request.strategy === "maintenance" ? target.adjustment === 0 : ["fat_loss", "aggressive_cut"].includes(draft.request.strategy) ? target.adjustment < 0 : target.adjustment > 0, detail: `${nutritionStrategyLabel(draft.request.strategy)} · ${target.adjustment >= 0 ? "+" : ""}${target.adjustment} kcal vs maintenance` },
    { label: "Allergy avoidance", pass: allergyHits === 0, detail: allergyHits ? `${allergyHits} meal(s) need review` : "no listed allergens found" },
    { label: "Foods to avoid", pass: avoidHits === 0, detail: avoidHits ? `${avoidHits} meal(s) need review` : "excluded foods avoided" },
    { label: "Diet compatibility", pass: dietHits === 0, detail: dietHits ? `${dietHits} incompatible meal(s)` : `${draft.request.diet} compatible` },
  ];
}

function mealMatchesDiet(items, diet) {
  const text = String(items || "").toLowerCase(); const meat = ["ไก่", "ปลา", "turkey", "chicken", "beef", "pork", "fish"]; const animal = [...meat, "ไข่", "โยเกิร์ต", "egg", "yogurt", "milk", "cheese"];
  if (diet === "vegan") return !animal.some((item) => text.includes(item));
  if (diet === "vegetarian") return !meat.some((item) => text.includes(item));
  if (diet === "pescatarian") return !["ไก่", "turkey", "chicken", "beef", "pork"].some((item) => text.includes(item));
  return true;
}

function nutritionStrategyLabel(strategy) {
  return { fat_loss: "Fat Loss", maintenance: "Maintenance", lean_bulk: "Lean Bulk", aggressive_cut: "Aggressive Cut" }[strategy] || "Maintenance";
}

function explainNutritionPlan(request, targets) {
  return `พลังงานเริ่มจาก BMR ${targets.bmr} kcal และคูณกิจกรรมเป็น TDEE ${targets.maintenance} kcal จากนั้นปรับ ${targets.adjustment >= 0 ? "+" : ""}${targets.adjustment} kcal ด้วยกลยุทธ์ ${nutritionStrategyLabel(request.strategy)}. โปรตีนคำนวณตามน้ำหนัก ${request.weight} kg เพื่อรองรับการฝึกและการรักษามวลกล้ามเนื้อ ไขมันอยู่ในระดับใช้งานได้ และคาร์บเป็นพลังงานส่วนที่เหลือ อาหารเลือกตามรูปแบบ ${request.diet}, งบ ${request.budget}, ทักษะทำอาหาร ${request.cookingSkill} และรายการแพ้ที่ระบุ แผนนี้เป็นข้อมูลทั่วไป ไม่ใช่การวินิจฉัยหรือการรักษาโรค.`;
}

function renderNutritionPlanDraft() {
  if (!fields.nutritionPlanDraft) return;
  if (!fields.nutritionPlannerForm.dataset.initialized) {
    fields.nutritionPlanWeight.value = profile.bodyWeight || 70; fields.nutritionPlanTargetWeight.value = profile.targetWeight || ""; fields.nutritionPlanHeight.value = profile.heightCm || 170; fields.nutritionPlanAge.value = profile.age || 30; fields.nutritionPlanBodyFat.value = latestWeightRecord()?.bodyFat || "";
    fields.nutritionPlanGoal.value = profile.goal === "muscle_gain" ? "muscle_gain" : profile.goal === "fat_loss" ? "fat_loss" : "maintenance";
    fields.nutritionPlanStrategy.value = profile.goal === "muscle_gain" ? "lean_bulk" : profile.goal === "fat_loss" ? "fat_loss" : "maintenance";
    fields.nutritionPlanActivity.value = ["sedentary","light","moderate","active","very_active"].includes(profile.activityLevel) ? profile.activityLevel : "moderate";
    fields.nutritionPlanSex.value = profile.gender === "female" ? "female" : profile.gender === "male" ? "male" : "other";
    fields.nutritionPlanTrainingDays.value = String(Math.max(0, Math.min(6, Number(activeProgram()?.settings?.days || 3))));
    fields.nutritionPlannerForm.dataset.initialized = "true";
  }
  fields.nutritionPlanDraft.classList.toggle("hidden", !nutritionPlanDraft); if (!nutritionPlanDraft) return;
  const totals = nutritionDraftTotals(nutritionPlanDraft); const target = nutritionPlanDraft.targets;
  fields.nutritionDraftStatus.textContent = `${nutritionPlanDraft.status || "Draft"} · Review required`;
  fields.nutritionDraftSummary.innerHTML = `<div class="draft-summary-grid"><article><strong>${escapeHtml(nutritionPlanDraft.name || "Draft Meal Plan")}</strong><span>Plan</span></article><article><strong>${escapeHtml(nutritionStrategyLabel(nutritionPlanDraft.request.strategy))}</strong><span>Goal strategy</span></article><article><strong>${target.maintenance} kcal</strong><span>Estimated TDEE</span></article><article><strong>${totals.calories} kcal</strong><span>Target calories</span></article><article><strong>${totals.protein}g</strong><span>Protein</span></article><article><strong>${totals.carbs}g</strong><span>Carbs</span></article><article><strong>${totals.fat}g</strong><span>Fat</span></article><article><strong>${nutritionPlanDraft.meals.length}</strong><span>Meals/day</span></article></div>`;
  fields.nutritionDraftValidation.innerHTML = nutritionPlanDraft.validation.map((item) => `<div class="draft-check ${item.pass ? "pass" : "warn"}">${item.pass ? "✓" : "!"} <strong>${escapeHtml(item.label)}</strong> · ${escapeHtml(item.detail)}</div>`).join("");
  fields.nutritionDraftMeals.innerHTML = nutritionPlanDraft.meals.map((meal, index) => `<article class="nutrition-meal-card"><header><strong>${escapeHtml(meal.label)}</strong><span>${meal.calories} kcal</span></header><div class="nutrition-food-row"><strong>${escapeHtml(meal.items)}</strong><small>${escapeHtml(meal.servingSizes || "Serving sizes require review")}</small><label>Calories<input data-nutrition-meal="${index}" data-nutrition-field="calories" type="number" min="0" value="${meal.calories}" disabled></label><label>Protein<input data-nutrition-meal="${index}" data-nutrition-field="protein" type="number" min="0" value="${meal.protein}" disabled></label><label>Carbs<input data-nutrition-meal="${index}" data-nutrition-field="carbs" type="number" min="0" value="${meal.carbs}" disabled></label><label>Fat<input data-nutrition-meal="${index}" data-nutrition-field="fat" type="number" min="0" value="${meal.fat}" disabled></label></div><p class="food-substitutions">Substitutions: ${escapeHtml(meal.substitutions)}</p></article>`).join("");
  fields.nutritionShoppingList.innerHTML = Object.entries(nutritionPlanDraft.shoppingList).map(([group, items]) => `<article class="shopping-group"><strong>${escapeHtml(group)}</strong><span>${items.length ? items.map(escapeHtml).join(" · ") : "ไม่มีรายการ"}</span></article>`).join("");
  fields.nutritionDraftExplanation.innerHTML = `<strong>เหตุผลของแผน</strong><p>${escapeHtml(nutritionPlanDraft.explanation)}</p>`;
}

function updateNutritionDraftFromEditor(event) {
  const input = event.target; const meal = nutritionPlanDraft?.meals?.[Number(input.dataset.nutritionMeal)]; if (!meal || !input.dataset.nutritionField) return;
  meal[input.dataset.nutritionField] = Number(input.value || 0); nutritionPlanDraft.validation = validateNutritionDraft(nutritionPlanDraft); saveNutritionPlanDraft();
  fields.nutritionDraftStatus.textContent = "Edited draft · ยังไม่บันทึก";
  const totals = nutritionDraftTotals(nutritionPlanDraft); const summaryValues = fields.nutritionDraftSummary.querySelectorAll("article strong"); if (summaryValues[3]) summaryValues[3].textContent = `${totals.calories} kcal`;
  fields.nutritionDraftValidation.innerHTML = nutritionPlanDraft.validation.map((item) => `<div class="draft-check ${item.pass ? "pass" : "warn"}">${item.pass ? "✓" : "!"} <strong>${escapeHtml(item.label)}</strong> · ${escapeHtml(item.detail)}</div>`).join("");
}

function acceptNutritionDraft() {
  if (!nutritionPlanDraft || !window.confirm("ยืนยันบันทึก Nutrition Draft เป็นแผนใหม่? Food logs และแผนเดิมจะไม่ถูกแก้ไข")) return;
  const approvedAt = new Date().toISOString();
  nutritionPlans.unshift({ ...nutritionPlanDraft, id: `nutrition-plan-${crypto.randomUUID()}`, status: NUTRITION_PLAN_STATUSES.APPROVED, generation: { draftId: nutritionPlanDraft.draftId || nutritionPlanDraft.id, createdAt: nutritionPlanDraft.createdAt, generator: nutritionPlanDraft.generator || "Khayubdi AI Nutrition Planner", status: NUTRITION_PLAN_STATUSES.APPROVED, approvedAt, availableStatuses: [NUTRITION_PLAN_STATUSES.APPROVED, NUTRITION_PLAN_STATUSES.ARCHIVED] }, approvedAt }); saveNutritionPlans();
  nutritionPlanDraft = null; saveNutritionPlanDraft(); renderNutritionPlanDraft(); renderDashboardNutritionDraft(); showToast("บันทึก Nutrition Plan ใหม่แล้ว");
}

function nutritionRequestFromChat(message) {
  const text = String(message || "").toLowerCase();
  const relevant = ["lose fat", "lean bulk", "maintenance", "vegetarian", "vegan", "allergy", "แพ้", "meal", "มื้อ", "อาหาร"].some((term) => text.includes(term));
  if (!relevant) return null;
  const request = nutritionPlannerProfile();
  if (text.includes("lose fat") || text.includes("ลดไขมัน")) { request.goal = "fat_loss"; request.strategy = "fat_loss"; }
  if (text.includes("lean bulk") || text.includes("เพิ่มกล้าม")) { request.goal = "muscle_gain"; request.strategy = "lean_bulk"; }
  if (text.includes("maintenance") || text.includes("รักษาน้ำหนัก")) request.strategy = "maintenance";
  if (text.includes("vegetarian") || text.includes("มังสวิรัติ")) request.diet = "vegetarian";
  if (text.includes("vegan")) request.diet = "vegan";
  if (text.includes("peanut") || text.includes("ถั่วลิสง")) request.allergies = [request.allergies, "peanut"].filter(Boolean).join(", ");
  const mealMatch = text.match(/\b(three|four|five|six|3|4|5|6)\s*(?:meal|meals|มื้อ)/); const mealNumbers = { three: 3, four: 4, five: 5, six: 6 };
  if (mealMatch) request.mealsPerDay = mealNumbers[mealMatch[1]] || Number(mealMatch[1]);
  return request;
}

function isNutritionDraftCommand(message) {
  const text = String(message || "").toLowerCase();
  return ["want to", "create", "generate", "plan", "vegetarian", "vegan", "allergy", "แพ้", "meal", "มื้อ", "ลดไขมัน", "เพิ่มกล้าม"].some((term) => text.includes(term));
}

function applyNutritionRequestToForm(request) {
  fields.nutritionPlanGoal.value = request.goal; fields.nutritionPlanStrategy.value = request.strategy; fields.nutritionPlanWeight.value = request.weight; fields.nutritionPlanTargetWeight.value = request.targetWeight || "";
  fields.nutritionPlanHeight.value = request.height; fields.nutritionPlanAge.value = request.age; fields.nutritionPlanBodyFat.value = request.estimatedBodyFat || ""; fields.nutritionPlanSex.value = request.sex;
  fields.nutritionPlanActivity.value = request.activityLevel; fields.nutritionPlanTrainingDays.value = String(request.trainingDays); fields.nutritionPlanDiet.value = request.diet; fields.nutritionPlanBudget.value = request.budget;
  fields.nutritionPlanMeals.value = String(request.mealsPerDay); fields.nutritionPlanCookingSkill.value = request.cookingSkill; fields.nutritionPlanAllergies.value = request.allergies || ""; fields.nutritionPlanFavorites.value = request.favoriteFoods || ""; fields.nutritionPlanAvoid.value = request.foodsToAvoid || "";
}

function renderDashboardNutritionDraft() {
  if (!fields.dashNutritionDraftCard) return;
  fields.dashNutritionDraftCard.classList.toggle("hidden", !nutritionPlanDraft); if (!nutritionPlanDraft) return;
  fields.dashNutritionDraftStatus.textContent = "Draft · Review required"; fields.dashNutritionDraftGoal.textContent = goalLabel(nutritionPlanDraft.request.goal);
  fields.dashNutritionDraftCalories.textContent = `${nutritionPlanDraft.targets.calories} kcal`; fields.dashNutritionDraftMeals.textContent = `${nutritionPlanDraft.meals.length} มื้อ`;
}

function bindAiProgramGenerator() {
  if (!fields.aiProgramRequestForm) return;
  fields.aiProgramRequestForm.addEventListener("submit", (event) => { event.preventDefault(); generateAiProgramDraft(); });
  fields.regenerateAiDraft.addEventListener("click", generateAiProgramDraft);
  fields.discardAiDraft.addEventListener("click", () => {
    if (!window.confirm("ทิ้ง draft นี้? โปรแกรมปัจจุบันจะไม่เปลี่ยนแปลง")) return;
    aiProgramDraft = null; saveAiProgramDraft(); renderAiProgramDraft(); renderDashboardDraftProgram(); showToast("ทิ้ง draft แล้ว");
  });
  fields.editAiDraft.addEventListener("click", () => {
    fields.aiDraftDays.querySelectorAll("input").forEach((input) => { input.disabled = false; });
    fields.aiDraftStatus.textContent = "Editing"; fields.aiDraftDays.querySelector("input")?.focus();
  });
  fields.aiDraftDays.addEventListener("input", updateAiDraftFromEditor);
  fields.acceptAiDraft.addEventListener("click", acceptAiProgramDraft);
  fields.openDraftProgram.addEventListener("click", () => { switchTab("track"); switchWorkoutPanel("builderPanel"); fields.aiProgramDraft.scrollIntoView({ behavior: "smooth", block: "start" }); });
}

function switchTab(tabName) {
  const target = $(`#${tabName}`);
  const tabs = $$(`.tab[data-tab="${tabName}"]`);
  if (!target) return;
  $$(".tab").forEach((item) => item.classList.remove("active"));
  $$(".screen").forEach((screen) => screen.classList.remove("active"));
  tabs.forEach((tab) => tab.classList.add("active"));
  target.classList.add("active");
  if (tabName === "diagnostics") renderDiagnostics();
  if (tabName === "about" || tabName === "releaseChecklist") renderReleaseReadiness();
  if (tabName === "offline") renderOfflineStatus();
  if (tabName === "nutrition") window.setTimeout(() => fields.zeroFoodSearch?.focus(), 180);
  if (tabName === "coachChat") {
    renderCoachChat();
    scrollCoachChatToBottom();
    window.setTimeout(() => fields.coachChatInput?.focus(), 180);
  }
}

function switchWorkoutPanel(panelId) {
  if (!panelId) return;
  fields.workoutPanels.forEach((panel) => panel.classList.toggle("active", panel.id === panelId));
  fields.workoutSubtabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.workoutPanel === panelId));
}

function showToast(message) {
  if (!fields.appToast) return;
  fields.appToast.textContent = message;
  fields.appToast.classList.remove("hidden", "show");
  void fields.appToast.offsetWidth;
  fields.appToast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    fields.appToast.classList.remove("show");
    window.setTimeout(() => fields.appToast.classList.add("hidden"), 220);
  }, 1800);
}

function showBetaWelcomeIfNeeded() {
  if (!fields.betaWelcomeModal || localStorage.getItem(BETA_WELCOME_KEY) === "true") return;
  fields.betaWelcomeModal.classList.remove("hidden");
}

function dismissBetaWelcome() {
  localStorage.setItem(BETA_WELCOME_KEY, "true");
  fields.betaWelcomeModal?.classList.add("hidden");
}

async function diagnosticsSnapshot() {
  const storage = await safeStorageEstimate();
  const standalone = isStandaloneMode();
  return {
    version: APP_VERSION,
    build: APP_BUILD,
    environment: APP_ENVIRONMENT,
    releaseChannel: APP_RELEASE_CHANNEL,
    platform: navigator.platform || "Unknown",
    browser: browserSummary(),
    screenSize: `${window.screen?.width || "-"}x${window.screen?.height || "-"}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    pwaInstalled: standalone,
    standaloneMode: standalone,
    serviceWorkerVersion: APP_CACHE_VERSION,
    cacheVersion: APP_CACHE_VERSION,
    storageUsage: storage.usage,
    storageQuota: storage.quota,
    storageSummary: safeStorageSummary(),
    networkStatus: navigator.onLine ? "Online" : "Offline",
    theme: document.querySelector('meta[name="theme-color"]')?.content || "#050505",
    language: navigator.language || document.documentElement.lang || "Unknown",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
    timestamp: new Date().toISOString(),
  };
}

async function renderDiagnostics() {
  if (!fields.diagnosticsGrid) return;
  const snapshot = await diagnosticsSnapshot();
  fields.diagnosticsStatus.textContent = snapshot.networkStatus;
  const rows = [
    ["Platform", snapshot.platform],
    ["Browser", snapshot.browser],
    ["Screen Size", snapshot.screenSize],
    ["Viewport", snapshot.viewport],
    ["App Version", snapshot.version],
    ["Build Number", snapshot.build],
    ["PWA Installed", snapshot.pwaInstalled ? "Yes" : "No"],
    ["Standalone Mode", snapshot.standaloneMode ? "Yes" : "No"],
    ["Service Worker", snapshot.serviceWorkerVersion],
    ["Cache Version", snapshot.cacheVersion],
    ["Storage Usage", formatBytes(snapshot.storageUsage)],
    ["Network", snapshot.networkStatus],
    ["Theme", snapshot.theme],
    ["Language", snapshot.language],
    ["Timezone", snapshot.timezone],
  ];
  fields.diagnosticsGrid.innerHTML = rows.map(([label, value]) => `<article><strong>${escapeHtml(String(value))}</strong><span>${escapeHtml(label)}</span></article>`).join("");
}

function renderReleaseReadiness() {
  if (fields.releaseChecklistGrid) {
    const checks = [
      ["Navigation", "Ready"],
      ["Workout", "Ready"],
      ["AI", "Ready"],
      ["Nutrition", "Ready"],
      ["Analytics", "Ready"],
      ["Offline", "Ready"],
      ["Install", "Ready"],
      ["Responsive", "Ready"],
      ["Cache", APP_CACHE_VERSION],
      ["Performance", "Ready"],
    ];
    fields.releaseChecklistGrid.innerHTML = checks.map(([label, value]) => `
      <article class="release-check-item">
        <span aria-hidden="true">✓</span>
        <strong>${escapeHtml(label)}</strong>
        <small>${escapeHtml(value)}</small>
      </article>
    `).join("");
  }
  if (fields.changelogList) {
    const items = [
      ["RC1", "Core release candidate systems stabilized for beta testing."],
      ["RC2", "Mobile PWA readiness, diagnostics, privacy, and production hotfixes."],
      ["RC3", "Thai encoding, food search, OAuth visibility, and PWA icon fixes."],
      ["UX Rewrite", "Home, navigation, workout, AI, and profile experience simplified."],
      ["Design System", "Central tokens, typography, buttons, cards, forms, and accessibility polish."],
      ["Premium Polish", "Hero, visual progress, profile header, empty states, and motion refinement."],
      ["Current Build", `${APP_VERSION} · Build ${APP_BUILD} · ${APP_CACHE_VERSION}`],
    ];
    fields.changelogList.innerHTML = items.map(([title, text], index) => `
      <details class="changelog-item" ${index === items.length - 1 ? "open" : ""}>
        <summary>${escapeHtml(title)}</summary>
        <p>${escapeHtml(text)}</p>
      </details>
    `).join("");
  }
}

function renderOfflineStatus() {
  const online = navigator.onLine;
  fields.offlineBanner?.classList.toggle("hidden", online);
  if (fields.offlineStatusText) {
    fields.offlineStatusText.textContent = online
      ? "Online. Latest cached assets are ready."
      : "Offline mode. Cached app shell and local data remain available.";
  }
}

async function exportDiagnosticsJson() {
  const snapshot = await diagnosticsSnapshot();
  const safePayload = {
    version: snapshot.version,
    build: snapshot.build,
    platform: snapshot.platform,
    browser: snapshot.browser,
    viewport: snapshot.viewport,
    language: snapshot.language,
    timezone: snapshot.timezone,
    pwaStatus: {
      installed: snapshot.pwaInstalled,
      standaloneMode: snapshot.standaloneMode,
    },
    serviceWorkerVersion: snapshot.serviceWorkerVersion,
    cacheVersion: snapshot.cacheVersion,
    storageSummary: snapshot.storageSummary,
    timestamp: snapshot.timestamp,
  };
  const blob = new Blob([JSON.stringify(safePayload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `khayubdi-diagnostics-${APP_VERSION}-build-${APP_BUILD}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("Diagnostics JSON exported.");
}

function browserSummary() {
  const ua = navigator.userAgent || "";
  if (ua.includes("Edg/")) return "Microsoft Edge";
  if (ua.includes("Chrome/")) return "Chrome";
  if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "Safari";
  if (ua.includes("Firefox/")) return "Firefox";
  return "Unknown browser";
}

function isStandaloneMode() {
  return window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone === true;
}

async function safeStorageEstimate() {
  try {
    const estimate = await navigator.storage?.estimate?.();
    return { usage: Number(estimate?.usage || 0), quota: Number(estimate?.quota || 0) };
  } catch {
    return { usage: 0, quota: 0 };
  }
}

function safeStorageSummary() {
  const keys = Object.keys(localStorage).filter((key) => key.startsWith("khayubdi"));
  const totalBytes = keys.reduce((sum, key) => sum + key.length + String(localStorage.getItem(key) || "").length, 0);
  return {
    keyCount: keys.length,
    approximateBytes: totalBytes,
    namespaces: [...new Set(keys.map((key) => key.split("_")[0]))],
  };
}

function formatBytes(bytes) {
  const value = Number(bytes || 0);
  if (value < 1024) return `${value} B`;
  if (value < 1048576) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / 1048576).toFixed(1)} MB`;
}

function showComingSoon(title) {
  fields.comingSoonTitle.textContent = title || "Not available in this beta";
  fields.comingSoonText.textContent = "This area is intentionally disabled for the Closed Beta readiness build.";
  fields.comingSoonModal.classList.remove("hidden");
}

function hideComingSoon() {
  fields.comingSoonModal.classList.add("hidden");
}

function bindSession() {
  fields.toggleSession.addEventListener("click", () => {
    if (sessionStartedAt) pauseSession();
    else startSession();
  });
  fields.finishSession.addEventListener("click", () => {
    if (!sessionStartedAt) return;
    fields.minutes.value = Math.max(1, Math.round((Date.now() - sessionStartedAt) / 60000));
    pauseSession();
  });
}

function bindForms() {
  fields.entryForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const caloriesBurned = calculateExerciseCalories(fields.exerciseName.value, Number(fields.minutes.value || 0));
    await addEntry({
      name: fields.exerciseName.value,
      sets: Number(fields.sets.value || 0),
      reps: Number(fields.reps.value || 0),
      weight: Number(fields.weight.value || 0),
      minutes: Number(fields.minutes.value || 0),
      caloriesBurned,
      notes: fields.notes.value,
    });
    fields.entryForm.reset();
    fields.sets.value = 3;
    fields.reps.value = 10;
    fields.weight.value = 0;
    fields.minutes.value = 20;
    updateExerciseCaloriePreview();
  });

  [fields.exerciseName, fields.minutes].forEach((field) => {
    field.addEventListener("input", updateExerciseCaloriePreview);
  });
  fields.calculateExerciseCalories.addEventListener("click", updateExerciseCaloriePreview);

  fields.waterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      addWaterAmount(Number(button.dataset.water || 0));
    });
  });

  fields.waterAddButtons.forEach((button) => {
    button.addEventListener("click", () => {
      addWaterAmount(Number(button.dataset.waterAdd || 0));
    });
  });

  fields.customWaterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addWaterAmount(Number(fields.customWaterAmount.value || 0));
    fields.customWaterAmount.value = "";
  });

  fields.waterGoalForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const goal = Number(fields.waterGoalInput.value || WATER_GOAL_ML);
    profile.waterGoalMl = Math.max(500, goal);
    const log = todayHealthLog();
    log.waterGoalMl = profile.waterGoalMl;
    saveTodayHealthLog(log);
    await persistProfile();
    showWaterSaveFeedback();
    render();
  });

  fields.waterEditForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!fields.waterEditDate.value) return;
    setWaterForDate(fields.waterEditDate.value, Number(fields.waterEditAmount.value || 0));
    resetWaterEditForm();
    showWaterSaveFeedback();
    render();
  });

  fields.cancelWaterEdit.addEventListener("click", () => {
    resetWaterEditForm();
  });

  fields.waterHistoryList.addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit-water]");
    const deleteButton = event.target.closest("[data-delete-water]");
    if (editButton) {
      const record = waterRecordForDate(editButton.dataset.editWater);
      fields.waterEditDate.value = record.date;
      fields.waterEditAmount.value = record.waterMl || "";
      fields.waterEditForm.classList.remove("hidden");
      fields.waterEditAmount.focus();
      return;
    }
    if (deleteButton) {
      if (!window.confirm("ลบข้อมูลน้ำวันนี้?")) return;
      setWaterForDate(deleteButton.dataset.deleteWater, 0);
      resetWaterEditForm();
      render();
    }
  });

  fields.sleepTrackingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const record = upsertSleepRecord({
      id: fields.sleepRecordId.value,
      date: fields.sleepDate.value || dateKey(new Date()),
      sleepTime: fields.sleepStartTime.value,
      wakeTime: fields.sleepWakeTime.value,
      sleepHours: Number(fields.sleepHoursCalculated.value || 0),
      sleepQuality: Number(fields.sleepQualityValue.value || 3),
      note: fields.sleepNote.value,
    });
    if (!record) return;
    await persistProfile();
    resetSleepForm();
    showSleepSaveFeedback();
    render();
  });

  [fields.sleepStartTime, fields.sleepWakeTime].forEach((field) => {
    field.addEventListener("change", updateSleepCalculatedHours);
    field.addEventListener("input", updateSleepCalculatedHours);
  });

  fields.sleepQualityStars.forEach((button) => {
    button.addEventListener("click", () => setSleepQuality(Number(button.dataset.quality || 3)));
  });

  fields.cancelSleepEdit.addEventListener("click", resetSleepForm);

  fields.sleepGoalForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    profile.sleepGoalHours = Math.max(4, Number(fields.sleepGoalInput.value || 8));
    await persistProfile();
    showSleepSaveFeedback();
    render();
  });

  fields.sleepHistoryList.addEventListener("click", async (event) => {
    const editButton = event.target.closest("[data-edit-sleep]");
    const deleteButton = event.target.closest("[data-delete-sleep]");
    if (editButton) {
      startSleepEdit(editButton.dataset.editSleep);
      return;
    }
    if (deleteButton) {
      if (!window.confirm("ลบข้อมูลการนอนนี้?")) return;
      await deleteSleepRecord(deleteButton.dataset.deleteSleep);
    }
  });

  fields.dailyCheckinForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const log = todayHealthLog();
    log.weightKg = fields.checkinWeight.value ? Number(fields.checkinWeight.value) : log.weightKg;
    log.sleepHours = Number(fields.checkinSleepHours.value || 0);
    log.mood = log.mood || "😐";
    log.energyLevel = Number(fields.energyLevel.value || 5);
    log.waterGoalMl = Number(fields.checkinWaterGoal.value || WATER_GOAL_ML);
    profile.waterGoalMl = log.waterGoalMl;
    log.todayGoal = fields.checkinTodayGoal.value || "stay_healthy";
    log.checkinCompleted = true;
    log.checkinAt = new Date().toISOString();
    if (log.weightKg) {
      upsertWeightRecord({
        date: log.date || dateKey(new Date()),
        weightKg: log.weightKg,
        bodyFat: log.bodyFat,
        waistCm: log.waistCm,
        note: "บันทึกจาก Daily Check-in",
        source: "checkin",
      });
    }
    if (log.sleepHours) {
      upsertSleepRecord({
        date: log.date || dateKey(new Date()),
        sleepHours: log.sleepHours,
        sleepQuality: log.sleepQuality || 3,
        note: "บันทึกจาก Daily Check-in",
        source: "checkin",
      });
    }
    saveTodayHealthLog(log);
    if (log.weightKg) {
      profile.bodyWeight = log.weightKg;
      persistProfile();
    }
    showCheckinSaveFeedback();
    render();
  });

  fields.checkinMoodButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const log = todayHealthLog();
      log.mood = button.dataset.mood;
      saveTodayHealthLog(log);
      renderHealth();
    });
  });

  fields.energyLevel.addEventListener("input", () => {
    fields.energyValue.textContent = `${fields.energyLevel.value}/10`;
  });

  fields.weightTrackingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const record = upsertWeightRecord({
      id: fields.weightRecordId.value,
      date: fields.weightDate.value || dateKey(new Date()),
      weightKg: Number(fields.weightValue.value || 0),
      bodyFat: fields.weightBodyFat.value ? Number(fields.weightBodyFat.value) : 0,
      waistCm: fields.weightWaist.value ? Number(fields.weightWaist.value) : 0,
      note: fields.weightNote.value,
    });
    if (!record) return;
    profile.bodyWeight = record.weightKg;
    await persistProfile();
    resetWeightForm();
    showWeightSaveFeedback();
    render();
  });

  fields.cancelWeightEdit.addEventListener("click", () => {
    resetWeightForm();
  });

  fields.weightHistoryList.addEventListener("click", async (event) => {
    const editButton = event.target.closest("[data-edit-weight]");
    const deleteButton = event.target.closest("[data-delete-weight]");
    if (editButton) {
      startWeightEdit(editButton.dataset.editWeight);
      return;
    }
    if (deleteButton) {
      if (!window.confirm("ลบข้อมูลน้ำหนักนี้?")) return;
      await deleteWeightRecord(deleteButton.dataset.deleteWeight);
    }
  });

  fields.weightForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const log = todayHealthLog();
    log.weightKg = Number(fields.dailyWeight.value || log.weightKg || 0);
    log.bodyFat = Number(fields.bodyFat.value || 0);
    log.waistCm = Number(fields.waist.value || 0);
    if (pendingProgressPhoto) log.progressPhoto = pendingProgressPhoto;
    if (log.weightKg) {
      upsertWeightRecord({
        date: log.date || dateKey(new Date()),
        weightKg: log.weightKg,
        bodyFat: log.bodyFat,
        waistCm: log.waistCm,
        note: "บันทึกจาก Check-in เดิม",
        source: "legacy_form",
      });
    }
    saveTodayHealthLog(log);
    if (log.weightKg) {
      profile.bodyWeight = log.weightKg;
      await persistProfile();
    }
    render();
  });

  fields.progressPhoto.addEventListener("change", async () => {
    const file = fields.progressPhoto.files?.[0];
    pendingProgressPhoto = file ? await readImageAsDataUrl(file) : null;
    renderProgressPhotoPreview();
  });

  fields.sleepForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const log = todayHealthLog();
    log.sleepTime = fields.sleepTime.value;
    log.wakeTime = fields.wakeTime.value;
    log.sleepQuality = Number(fields.sleepQuality.value || 3);
    log.sleepHours = calculateSleepHours(log.sleepTime, log.wakeTime);
    if (log.sleepHours) {
      upsertSleepRecord({
        date: log.date || dateKey(new Date()),
        sleepTime: log.sleepTime,
        wakeTime: log.wakeTime,
        sleepHours: log.sleepHours,
        sleepQuality: log.sleepQuality,
        note: "บันทึกจากฟอร์มการนอนเดิม",
        source: "legacy_form",
      });
    }
    saveTodayHealthLog(log);
    render();
  });

  [fields.sleepTime, fields.wakeTime].forEach((field) => {
    field.addEventListener("change", () => {
      fields.sleepDuration.textContent = `${calculateSleepHours(fields.sleepTime.value, fields.wakeTime.value).toFixed(1)} ชม.`;
    });
  });

  fields.moodButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const log = todayHealthLog();
      log.mood = button.dataset.mood;
      saveTodayHealthLog(log);
      render();
    });
  });

  [fields.upgradeProgramButton, fields.upgradeCoachButton].filter(Boolean).forEach((button) => {
    button.addEventListener("click", async () => {
      profile.plan = "pro";
      await persistProfile();
      render();
    });
  });

  fields.programForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const generated = generateWorkoutProgram({
      goal: fields.programGoal.value,
      experience: fields.programExperience.value,
      days: Number(fields.programDays.value || 3),
      minutes: Number(fields.programMinutes.value || 45),
      equipment: fields.programEquipment.value,
      injuries: fields.programInjuries.value,
    });
    const existing = activeProgram();
    workoutProgram = normalizeProgram({ ...generated, id: existing.id, name: existing.name, notes: existing.notes, favorite: existing.favorite, archived: existing.archived, version: Number(existing.version || 1) + 1 }, workoutPrograms.length);
    upsertActiveProgram(workoutProgram, true);
    saveWorkoutProgram();
    showToast("สร้างโปรแกรมแล้ว");
    render();
  });

  fields.clearProgram.addEventListener("click", () => {
    workoutProgram = normalizeProgram({ ...activeProgram(), days: [], version: Number(activeProgram().version || 1) + 1 }, 0);
    upsertActiveProgram(workoutProgram, false);
    saveWorkoutProgram();
    render();
  });

  bindProgramManagement();

  fields.programPlanList.addEventListener("change", (event) => {
    const input = event.target;
    if (!input.dataset.day || !input.dataset.exercise) return;
    updateProgramCheckin(input);
  });
  fields.programPlanList.addEventListener("click", (event) => {
    const workoutMove = event.target.closest("[data-move-workout]");
    const exerciseMove = event.target.closest("[data-move-exercise]");
    if (workoutMove) {
      moveWorkoutDay(Number(workoutMove.dataset.day), workoutMove.dataset.moveWorkout);
      return;
    }
    if (exerciseMove) {
      moveExercise(Number(exerciseMove.dataset.day), Number(exerciseMove.dataset.exercise), exerciseMove.dataset.moveExercise);
    }
  });

  fields.programPlanList.addEventListener("input", (event) => {
    const input = event.target;
    if (!input.dataset.day || !input.dataset.exercise) return;
    updateProgramCheckin(input);
  });

  [fields.exerciseSearch, fields.exerciseMuscleFilter, fields.exercisePatternFilter, fields.exerciseEquipmentFilter, fields.exerciseDifficultyFilter].forEach((control) => {
    control.addEventListener("input", renderExerciseLibrary);
    control.addEventListener("change", renderExerciseLibrary);
  });

  fields.clearExerciseFilters.addEventListener("click", () => {
    fields.exerciseSearch.value = "";
    fields.exerciseMuscleFilter.value = "";
    fields.exercisePatternFilter.value = "";
    fields.exerciseEquipmentFilter.value = "";
    fields.exerciseDifficultyFilter.value = "";
    renderExerciseLibrary();
  });

  fields.exerciseLibraryList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-exercise-id]");
    if (!button) return;
    renderExerciseDetail(button.dataset.exerciseId);
  });

  fields.refreshCoach.addEventListener("click", () => renderCoach());

  $("#clearToday").addEventListener("click", async () => {
    if (USE_BACKEND && !LOCAL_TRACKING_ONLY) {
      try {
        const data = await apiRequest("/api/app/entries/clear-today", { method: "POST" });
        entries = data.entries || [];
        render();
      } catch (error) {
        showAuthMessage(error.message, "error");
      }
      return;
    }

    const today = dateKey(new Date());
    entries = entries.filter((entry) => dateKey(new Date(entry.createdAt)) !== today);
    saveEntries();
    render();
  });

  fields.foodForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await addFood({
      name: fields.foodName.value,
      meal: fields.mealType.value,
      mealTime: fields.mealTime.value || new Date().toTimeString().slice(0, 5),
      calories: Number(fields.foodCalories.value || 0),
      protein: Number(fields.foodProtein.value || 0),
      carbs: Number(fields.foodCarbs.value || 0),
      fat: Number(fields.foodFat.value || 0),
      fiber: Number(fields.foodFiber.value || 0),
      confidence: 0,
      source: "manual",
      notes: fields.foodNotes.value,
      photos: [],
    });
    fields.foodForm.reset();
    pendingFoodPhotos = [];
    renderFoodPhotoPreview();
    fields.foodCalories.value = 0;
    fields.foodProtein.value = 0;
    fields.foodCarbs.value = 0;
    fields.foodFat.value = 0;
    fields.foodFiber.value = 0;
    fields.mealTime.value = "";
    showFoodSaveFeedback();
  });

  fields.estimateFoodButton.addEventListener("click", () => {
    const estimate = estimateFoodMacros(fields.foodName.value, fields.foodNotes.value, fields.mealType.value, pendingFoodPhotos.length);
    applyFoodEstimate(estimate);
  });

  fields.scanFoodPhotosButton.addEventListener("click", async () => {
    await scanFoodPhotos();
  });

  fields.foodPhotos.addEventListener("change", async () => {
    await addFoodPhotos(fields.foodPhotos.files);
    fields.foodPhotos.value = "";
  });

  $("#clearFoodToday").addEventListener("click", async () => {
    if (USE_BACKEND && !LOCAL_TRACKING_ONLY) {
      try {
        const data = await apiRequest("/api/app/foods/clear-today", { method: "POST" });
        foods = data.foods || [];
        render();
      } catch (error) {
        showAuthMessage(error.message, "error");
      }
      return;
    }

    const today = dateKey(new Date());
    foods = foods.filter((food) => dateKey(new Date(food.createdAt)) !== today);
    saveFoods();
    render();
  });

  fields.foodHistoryList.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-delete-food]");
    if (!button) return;
    if (!window.confirm("ลบรายการอาหารนี้?")) return;
    await deleteFood(button.dataset.deleteFood);
  });

  $("#exportData").addEventListener("click", () => {
    downloadJson({ profile, entries, foods, healthLogs }, `khayubdi-exercise-${dateKey(new Date())}.json`);
  });

  fields.profileForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    profile = {
      ...profile,
      displayName: fields.profileDisplayName.value.trim(),
      gender: fields.profileGender.value,
      age: Number(fields.profileAge.value || 0),
      heightCm: Number(fields.profileHeight.value || 0),
      goal: fields.goal.value,
      bodyWeight: Number(fields.bodyWeight.value || 70),
      targetWeight: Number(fields.targetWeight.value || 0),
      activityLevel: fields.activityLevel.value,
      weeklyTarget: Number(fields.weeklyTarget.value || 150),
      privacy: profile.privacy || defaultPrivacy(),
      health: profile.health || defaultHealthSettings(),
      onboardingComplete: true,
    };
    await persistProfile();
    updateExerciseCaloriePreview();
    render();
  });

  fields.clientForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    client = {
      ...client,
      name: fields.clientName.value,
      phone: fields.clientPhone.value,
      email: fields.clientEmail.value,
      birthday: fields.clientBirthday.value,
      note: fields.clientNote.value,
    };

    if (USE_BACKEND && !LOCAL_TRACKING_ONLY) {
      try {
        const data = await apiRequest("/api/app/client", { method: "PUT", body: client });
        client = { ...defaultClient(), ...(data.client || {}) };
      } catch (error) {
        showAuthMessage(error.message, "error");
      }
    } else {
      localStorage.setItem(CLIENT_KEY(), JSON.stringify(client));
    }
    renderClient();
  });

  fields.privacyForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    profile.privacy = {
      analytics: fields.privacyAnalytics.checked,
      marketing: fields.privacyMarketing.checked,
      shareForCoaching: fields.privacyCoaching.checked,
    };

    if (USE_BACKEND && !LOCAL_TRACKING_ONLY) {
      try {
        const data = await apiRequest("/api/app/privacy", { method: "PUT", body: { privacy: profile.privacy } });
        profile = { ...defaultProfile(), ...(data.profile || {}) };
      } catch (error) {
        showAuthMessage(error.message, "error");
      }
    } else {
      localStorage.setItem(PROFILE_KEY(), JSON.stringify(profile));
    }
    renderPrivacy();
  });

  fields.exportAccount.addEventListener("click", async () => {
    if (USE_BACKEND && !LOCAL_TRACKING_ONLY) {
      try {
        const data = await apiRequest("/api/app/export");
        downloadJson(data, `khayubdi-account-${dateKey(new Date())}.json`);
      } catch (error) {
        showAuthMessage(error.message, "error");
      }
      return;
    }
    downloadJson({ exportedAt: new Date().toISOString(), user: currentUserId, client, profile, entries, foods, healthLogs, chatMessages }, `khayubdi-account-${dateKey(new Date())}.json`);
  });

  fields.deleteAccount.addEventListener("click", async () => {
    const confirmed = confirm("Delete this account and all workout data on this device/server?");
    if (!confirmed) return;

    if (USE_BACKEND && !LOCAL_TRACKING_ONLY) {
      try { await apiRequest("/api/app/account", { method: "DELETE" }); } catch (error) { showAuthMessage(error.message, "error"); return; }
      authToken = "";
      localStorage.removeItem(TOKEN_KEY);
    } else {
      const users = loadUsers();
      delete users[currentUserId];
      saveUsers(users);
      localStorage.removeItem(STORAGE_KEY());
      localStorage.removeItem(FOOD_KEY());
      localStorage.removeItem(HEALTH_KEY());
      localStorage.removeItem(PROGRAM_KEY());
      localStorage.removeItem(PROGRAM_HISTORY_KEY());
      localStorage.removeItem(CHAT_KEY());
      localStorage.removeItem(ADAPTIVE_KEY());
      localStorage.removeItem(AI_DRAFT_KEY());
      localStorage.removeItem(NUTRITION_DRAFT_KEY());
      localStorage.removeItem(NUTRITION_PLANS_KEY());
      localStorage.removeItem(PROFILE_KEY());
      localStorage.removeItem(CLIENT_KEY());
    }

    currentUserId = "";
    localStorage.removeItem(SESSION_KEY);
    entries = [];
    foods = [];
    healthLogs = {};
    workoutProgram = defaultWorkoutProgram();
    workoutPrograms = [];
    activeProgramId = "";
    programHistory = [];
    chatMessages = [];
    coachPersona = "friendly";
    profile = defaultProfile();
    client = defaultClient();
    showLogin();
  });
}

function bindInstall() {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    fields.installButton.hidden = false;
  });
  fields.installButton.addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    fields.installButton.hidden = true;
  });
}

function startSession() {
  sessionStartedAt = Date.now();
  fields.toggleSession.textContent = "Pause";
  sessionTimer = setInterval(renderTimer, 1000);
  renderTimer();
}

function pauseSession() {
  clearInterval(sessionTimer);
  sessionTimer = null;
  sessionStartedAt = null;
  fields.toggleSession.textContent = "Start";
  fields.timer.textContent = "00:00";
}

function renderTimer() {
  const totalSeconds = Math.floor((Date.now() - sessionStartedAt) / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  fields.timer.textContent = `${minutes}:${seconds}`;
}

async function addEntry(input) {
  const createdAt = input.createdAt ? new Date(input.createdAt).toISOString() : new Date().toISOString();
  const minutes = Number(input.minutes || 0);
  const entry = {
    id: crypto.randomUUID(),
    name: String(input.name || "").trim(),
    sets: Number(input.sets || 0),
    reps: Number(input.reps || 0),
    weight: Number(input.weight || 0),
    minutes,
    caloriesBurned: Number(input.caloriesBurned || calculateExerciseCalories(input.name, minutes)),
    distanceKm: Number(input.distanceKm || 0),
    steps: Number(input.steps || 0),
    source: String(input.source || "manual").trim(),
    notes: String(input.notes || "").trim(),
    createdAt,
  };
  if (!entry.name || entry.minutes <= 0) return;

  if (USE_BACKEND && !LOCAL_TRACKING_ONLY) {
    try {
      const data = await apiRequest("/api/app/entries", { method: "POST", body: entry });
      entries = data.entries || entries;
      render();
    } catch (error) {
      showAuthMessage(error.message, "error");
    }
    return;
  }

  entries.unshift(entry);
  saveEntries();
  render();
}

function renderQuickAdd() {
  fields.quickAdd.innerHTML = quickExercises
    .map((exercise) => `<button type="button" data-name="${exercise.name}">${exercise.name}<br>${exercise.minutes} min</button>`)
    .join("");
  fields.quickAdd.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => addEntry(quickExercises.find((item) => item.name === button.dataset.name)));
  });
}

function renderQuickFood() {
  if (!fields.quickFood) return;
  fields.quickFood.innerHTML = quickFoods
    .map((food) => `<button type="button" data-quick-food="${escapeHtml(food.name)}">${escapeHtml(food.name)}</button>`)
    .join("");
  fields.quickFood.querySelectorAll("[data-quick-food]").forEach((button) => {
    button.addEventListener("click", async () => {
      const food = quickFoods.find((item) => item.name === button.dataset.quickFood);
      if (!food) return;
      await addFood({ ...food, meal: fields.mealType?.value || food.meal, source: "quick" });
      showFoodSaveFeedback();
    });
  });
}

function showFoodSaveFeedback() {
  fields.saveFoodButton.classList.remove("saved-pop");
  void fields.saveFoodButton.offsetWidth;
  fields.saveFoodButton.classList.add("saved-pop");
  fields.foodSaveFeedback.classList.remove("hidden");
  showToast("บันทึกอาหารแล้ว");
  window.setTimeout(() => fields.foodSaveFeedback.classList.add("hidden"), 1800);
}

function showCheckinSaveFeedback() {
  fields.checkinSaveFeedback.classList.remove("hidden");
  showToast("เช็กอินสำเร็จ");
  window.setTimeout(() => fields.checkinSaveFeedback.classList.add("hidden"), 1800);
}

function renderProfile() {
  fields.profileDisplayName.value = profile.displayName || "";
  fields.profileGender.value = profile.gender || "";
  fields.profileAge.value = profile.age || "";
  fields.profileHeight.value = profile.heightCm || "";
  fields.goal.value = profile.goal;
  fields.bodyWeight.value = profile.bodyWeight;
  fields.targetWeight.value = profile.targetWeight || "";
  fields.activityLevel.value = profile.activityLevel || "moderate";
  fields.weeklyTarget.value = profile.weeklyTarget;
}

function renderClient() {
  fields.clientId.value = client.clientId || "";
  fields.clientName.value = client.name || "";
  fields.clientPhone.value = client.phone || "";
  fields.clientEmail.value = client.email || "";
  fields.clientBirthday.value = client.birthday || "";
  fields.clientNote.value = client.note || "";
}

function renderPrivacy() {
  const privacy = { ...defaultPrivacy(), ...(profile.privacy || {}) };
  fields.privacyAnalytics.checked = privacy.analytics;
  fields.privacyMarketing.checked = privacy.marketing;
  fields.privacyCoaching.checked = privacy.shareForCoaching;
}

function renderTrainerPortal() {
  if (!fields.trainerClientList) return;
  const directory = filteredTrainerDirectory();
  if (!selectedTrainerClientId && directory.length) selectedTrainerClientId = directory[0].id;
  const selected = trainerDirectory().find((item) => item.id === selectedTrainerClientId) || directory[0] || null;
  renderTrainerProfile();
  renderTrainerDashboard(directory);
  renderTrainerClientList(directory);
  renderTrainerClientOverview(selected);
}

function renderTrainerProfile() {
  const trainer = trainerPortal.profile || defaultTrainerPortal().profile;
  fields.trainerName.value = trainer.name || "";
  fields.trainerGym.value = trainer.gym || "";
  fields.trainerSpecialty.value = trainer.specialty || "";
  fields.trainerCertification.value = trainer.certification || "";
  fields.trainerProfileNotes.value = trainer.notes || "";
  fields.trainerModeStatus.textContent = trainer.name ? "Trainer Mode Active" : "Setup required";
}

function filteredTrainerDirectory() {
  const query = String(fields.trainerClientSearch?.value || "").trim().toLowerCase();
  const sort = fields.trainerClientSort?.value || "status";
  const clients = trainerDirectory().filter((clientItem) => !query || `${clientItem.name} ${clientItem.goal} ${clientItem.status}`.toLowerCase().includes(query));
  const statusRank = { "Needs Review": 0, "Missed Workouts": 1, "Pending Draft": 2, "On Track": 3 };
  return clients.sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "compliance") return b.compliance - a.compliance;
    if (sort === "lastWorkout") return String(b.lastWorkout).localeCompare(String(a.lastWorkout));
    return (statusRank[a.status] ?? 9) - (statusRank[b.status] ?? 9) || a.name.localeCompare(b.name);
  });
}

function renderTrainerDashboard(directory) {
  const today = dateKey(new Date());
  const notesToday = trainerPortal.notes.filter((note) => dateKey(new Date(note.createdAt)) === today && note.type === "session").length;
  fields.trainerTotalClients.textContent = directory.length;
  fields.trainerTodaySessions.textContent = notesToday;
  fields.trainerNeedsReview.textContent = directory.filter((clientItem) => clientItem.status === "Needs Review").length;
  fields.trainerPlateauRisk.textContent = directory.filter((clientItem) => trainerPlateauRisk(clientItem)).length;
  fields.trainerMissedWorkouts.textContent = directory.filter((clientItem) => clientItem.status === "Missed Workouts").length;
  fields.trainerPendingDrafts.textContent = trainerPortal.recommendations.filter((item) => item.status === "draft").length;
  fields.trainerClientCount.textContent = `${directory.length} clients`;
}

function renderTrainerClientList(directory) {
  fields.trainerClientList.innerHTML = directory.length ? directory.map((clientItem) => `
    <button class="trainer-client-row ${clientItem.id === selectedTrainerClientId ? "active" : ""}" data-trainer-client="${escapeHtml(clientItem.id)}" type="button">
      <span><strong>${escapeHtml(clientItem.name)}</strong><small>${escapeHtml(clientItem.goal)} · ${escapeHtml(clientItem.currentProgram)}</small></span>
      <span><b>${clientItem.compliance}%</b><small>${escapeHtml(clientItem.status)}</small></span>
    </button>
  `).join("") : `<div class="empty">ยังไม่มี client ในเครื่องนี้ สร้างบัญชีลูกค้าเพิ่มเพื่อให้แสดงใน Trainer Portal</div>`;
}

function renderTrainerClientOverview(clientItem) {
  if (!clientItem) {
    fields.trainerSelectedName.textContent = "Client Overview";
    fields.trainerSelectedStatus.textContent = "No client";
    fields.trainerOverviewGrid.innerHTML = `<div class="empty">ยังไม่มี client ให้ตรวจสอบ</div>`;
    fields.trainerTimeline.innerHTML = "";
    fields.trainerNoteClient.value = "";
    fields.trainerRecommendationClient.value = "";
    return;
  }
  fields.trainerSelectedName.textContent = clientItem.name;
  fields.trainerSelectedStatus.textContent = clientItem.status;
  fields.trainerNoteClient.value = clientItem.name;
  fields.trainerRecommendationClient.value = clientItem.name;
  const analytics = trainerClientAnalytics(clientItem);
  const adaptiveText = trainerPlateauRisk(clientItem) ? "Plateau risk: review volume/progression" : "No major plateau signal";
  fields.trainerOverviewGrid.innerHTML = `
    <article><strong>${escapeHtml(clientItem.goal)}</strong><span>Goal</span></article>
    <article><strong>${escapeHtml(clientItem.currentProgram)}</strong><span>Current Program</span></article>
    <article><strong>${escapeHtml(clientItem.currentNutritionPlan)}</strong><span>Nutrition Plan</span></article>
    <article><strong>${escapeHtml(clientItem.lastWorkout)}</strong><span>Last Workout</span></article>
    <article><strong>${clientItem.compliance}%</strong><span>Compliance Score</span></article>
    <article><strong>${analytics.weeklyWorkouts}</strong><span>Weekly Workouts</span></article>
    <article><strong>${analytics.weeklyFoodDays}</strong><span>Food Log Days</span></article>
    <article><strong>${escapeHtml(adaptiveText)}</strong><span>Adaptive Recommendation</span></article>
    <article><strong>${clientItem.programDraft ? "Available" : "-"}</strong><span>Draft Program</span></article>
    <article><strong>${clientItem.nutritionDraft ? "Available" : "-"}</strong><span>Draft Nutrition</span></article>
  `;
  fields.trainerTimeline.innerHTML = renderTrainerTimeline(clientItem);
}

function trainerClientAnalytics(clientItem) {
  const dates = trailingDateKeys(7);
  return {
    weeklyWorkouts: new Set(clientItem.entries.filter((entry) => dates.includes(dateKey(new Date(entry.createdAt)))).map((entry) => dateKey(new Date(entry.createdAt)))).size,
    weeklyFoodDays: new Set(clientItem.foods.filter((food) => dates.includes(dateKey(new Date(food.createdAt)))).map((food) => dateKey(new Date(food.createdAt)))).size,
  };
}

function trainerPlateauRisk(clientItem) {
  const recent = clientItem.entries.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);
  if (recent.length < 4) return false;
  const newest = recent.slice(0, 3).reduce((total, entry) => total + Number(entry.weight || 0) * Number(entry.reps || 0) * Number(entry.sets || 1), 0);
  const older = recent.slice(3, 6).reduce((total, entry) => total + Number(entry.weight || 0) * Number(entry.reps || 0) * Number(entry.sets || 1), 0);
  return older > 0 && newest <= older * 1.02;
}

function renderTrainerTimeline(clientItem) {
  const notes = trainerPortal.notes.filter((note) => note.clientId === clientItem.id).map((note) => ({ type: note.type, title: "Trainer Note", text: note.text, createdAt: note.createdAt }));
  const recs = trainerPortal.recommendations.filter((rec) => rec.clientId === clientItem.id).map((rec) => ({ type: rec.type, title: "Recommendation Draft", text: rec.text, createdAt: rec.createdAt }));
  const workouts = clientItem.entries.slice(-8).map((entry) => ({ type: "workout", title: "Completed Workout", text: `${entry.name || "Workout"} · ${entry.minutes || 0} min`, createdAt: entry.createdAt }));
  const health = Object.values(clientItem.healthLogs || {}).filter((log) => log.weightKg || log.bodyWeight || log.waterMl || log.sleepHours).map((log) => ({ type: "metric", title: "Body Metric Update", text: `Weight ${log.weightKg || log.bodyWeight || "-"}kg · Sleep ${log.sleepHours || "-"}h`, createdAt: log.date || new Date().toISOString() }));
  const acceptedProgram = clientItem.program?.createdAt ? [{ type: "program", title: "Program Accepted", text: clientItem.currentProgram, createdAt: clientItem.program.createdAt }] : [];
  const acceptedNutrition = clientItem.nutritionPlan?.createdAt ? [{ type: "nutrition", title: "Nutrition Accepted", text: clientItem.currentNutritionPlan, createdAt: clientItem.nutritionPlan.createdAt }] : [];
  const timeline = [...notes, ...recs, ...workouts, ...health, ...acceptedProgram, ...acceptedNutrition].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 18);
  return timeline.length ? timeline.map((item) => `
    <article class="trainer-timeline-item">
      <strong>${escapeHtml(item.title)}</strong>
      <span>${escapeHtml(item.text || "-")}</span>
      <small>${formatShortDate(dateKey(new Date(item.createdAt)))}</small>
    </article>
  `).join("") : `<div class="empty">ยังไม่มี timeline ของ client นี้</div>`;
}

function trainerAiAnswer(question) {
  const text = normalizeExerciseName(question);
  const clients = trainerDirectory();
  let list = clients;
  let title = "Trainer AI";
  if (text.includes("plateau")) {
    title = "Clients with plateau risk";
    list = clients.filter(trainerPlateauRisk);
  } else if (text.includes("miss") || text.includes("พลาด")) {
    title = "Clients who missed workouts";
    list = clients.filter((clientItem) => clientItem.status === "Missed Workouts");
  } else if (text.includes("low") || text.includes("compliance")) {
    title = "Clients with low compliance";
    list = clients.filter((clientItem) => clientItem.compliance < 60);
  } else if (text.includes("draft") || text.includes("pending")) {
    title = "Clients with pending drafts";
    const pendingIds = new Set(trainerPortal.recommendations.filter((item) => item.status === "draft").map((item) => item.clientId));
    list = clients.filter((clientItem) => pendingIds.has(clientItem.id) || clientItem.programDraft || clientItem.nutritionDraft);
  }
  if (!list.length) return `<div class="coach-line"><strong>${escapeHtml(title)}</strong><span>ไม่พบ client ที่ตรงเงื่อนไขจากข้อมูลจริงในเครื่องนี้</span></div>`;
  return `
    <div class="coach-line"><strong>${escapeHtml(title)}</strong><span>${list.length} clients matched</span></div>
    ${list.slice(0, 8).map((clientItem) => `<div class="coach-line"><strong>${escapeHtml(clientItem.name)}</strong><span>${clientItem.compliance}% · ${escapeHtml(clientItem.status)} · Last workout ${escapeHtml(clientItem.lastWorkout)}</span></div>`).join("")}
  `;
}

function trainerPromptSummary() {
  const clients = trainerDirectory();
  return {
    totalClients: clients.length,
    needsReview: clients.filter((clientItem) => clientItem.status === "Needs Review").length,
    plateauRisk: clients.filter(trainerPlateauRisk).length,
    missedWorkouts: clients.filter((clientItem) => clientItem.status === "Missed Workouts").length,
    lowCompliance: clients.filter((clientItem) => clientItem.compliance < 60).map((clientItem) => ({ name: clientItem.name, compliance: clientItem.compliance, status: clientItem.status })).slice(0, 6),
    pendingDrafts: trainerPortal.recommendations.filter((item) => item.status === "draft").length,
  };
}

function trainerLocalRuleResponse(promptObject) {
  const trainer = promptObject.trainer || trainerPromptSummary();
  const low = trainer.lowCompliance?.length ? trainer.lowCompliance.map((item) => `${item.name} ${item.compliance}%`).join(", ") : "ไม่มี";
  return `Trainer summary: มี client ${trainer.totalClients} คน, need review ${trainer.needsReview}, plateau risk ${trainer.plateauRisk}, missed workouts ${trainer.missedWorkouts}, pending drafts ${trainer.pendingDrafts}. Low compliance: ${low}. Trainer mode เป็น read-only สำหรับ client data และสร้างได้เฉพาะ recommendation draft/notes`;
}

function render() {
  renderUxRewrite();
  renderDashboard();
  renderSummary();
  renderFoodSummary();
  renderHistory();
  renderFoodHistory();
  renderHealth();
  renderWeight();
  renderWater();
  renderSleep();
  renderPremiumFeatures();
  renderWorkoutProgram();
  renderExerciseLibrary();
  renderCoach();
  renderCoachChat();
  renderProgress();
  renderTrainingAnalytics();
  renderAiProgramDraft();
  renderNutritionPlanDraft();
  renderTrainerPortal();
}

function renderUxRewrite() {
  const today = dateKey(new Date());
  const displayName = profile.displayName || client.name || currentUserId || "Khayubdi";
  const todayEntries = entries.filter((entry) => dateKey(new Date(entry.createdAt)) === today);
  const todayFoods = foods.filter((food) => dateKey(new Date(food.createdAt)) === today);
  const foodTotals = dailyFoodTotals(todayFoods);
  const targets = nutritionTargets();
  const engine = progressiveOverloadEngine();
  const recovery = recoveryReadinessEngine();
  const program = activeProgram();
  const todayPlan = plannedWorkoutForDate(today, program);
  const exerciseCount = todayPlan?.exercises?.length || 0;
  const firstExercise = todayPlan?.exercises?.[0] || {};
  const workoutMinutes = sum(todayEntries, "minutes");
  const workoutTarget = Number(profile.weeklyTarget || 150) / 3;
  const workoutProgress = clamp(Math.round((workoutMinutes / Math.max(20, workoutTarget)) * 100), 0, 100);
  const nutritionProgress = clamp(Math.round((foodTotals.calories / Math.max(1, Number(targets.calories || 1))) * 100), 0, 100);
  const recoveryProgress = clamp(Number(recovery.score || 0), 0, 100);
  const totalMinutes = sum(entries, "minutes");
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
  const firstInitial = (displayName || "K").trim().charAt(0).toUpperCase() || "K";
  const motivation = engine.streak.current > 0
    ? "🔥 วันนี้เรามาทำลายสถิติของตัวเองกัน"
    : "พร้อมทำให้วันนี้ดีกว่าเมื่อวานไหม?";

  if (fields.uxHomeGreeting) fields.uxHomeGreeting.textContent = `👋 สวัสดี ${displayName}`;
  if (fields.uxHeroMotivation) fields.uxHeroMotivation.textContent = motivation;
  if (fields.uxTodayWorkout) fields.uxTodayWorkout.textContent = `${workoutMinutes} นาที`;
  if (fields.uxTodayNutrition) fields.uxTodayNutrition.textContent = `${foodTotals.calories} kcal`;
  if (fields.uxTodayRecovery) fields.uxTodayRecovery.textContent = `${recovery.score}/100`;
  if (fields.uxWorkoutProgress) fields.uxWorkoutProgress.style.width = `${workoutProgress}%`;
  if (fields.uxNutritionProgress) fields.uxNutritionProgress.style.width = `${nutritionProgress}%`;
  if (fields.uxRecoveryRing) fields.uxRecoveryRing.style.setProperty("--ux-ring", `${recoveryProgress}%`);
  if (fields.uxLastWorkout) fields.uxLastWorkout.textContent = engine.lastWorkout ? formatShortDate(engine.lastWorkout.date) : "ยังไม่มี";
  if (fields.uxCaloriesToday) fields.uxCaloriesToday.textContent = foodTotals.calories;
  if (fields.uxCurrentStreak) fields.uxCurrentStreak.textContent = `${engine.streak.current} วัน`;
  if (fields.uxTodaysProgram) fields.uxTodaysProgram.textContent = program.name || "ยังไม่มีโปรแกรม";
  if (fields.uxTodaysExercises) fields.uxTodaysExercises.textContent = todayPlan ? `${exerciseCount} exercises` : "ยังไม่มีตารางวันนี้";
  if (fields.zeroWorkoutTitle) fields.zeroWorkoutTitle.textContent = todayPlan ? todayPlan.title.replace(/^Day \d+:\s*/, "") : "Create Workout";
  if (fields.zeroWorkoutDuration) fields.zeroWorkoutDuration.textContent = todayPlan ? `${program.sessionMinutes || profile.weeklyTarget || 45} min` : "No plan yet";
  if (fields.zeroWorkoutExerciseCount) fields.zeroWorkoutExerciseCount.textContent = todayPlan ? `${exerciseCount} exercises` : "Tap to build";
  if (fields.uxStartWorkout) fields.uxStartWorkout.textContent = todayPlan ? "START WORKOUT" : "Create Workout";
  if (fields.zeroExerciseName) fields.zeroExerciseName.textContent = firstExercise.name || "Choose first exercise";
  if (fields.zeroRepsPreview) fields.zeroRepsPreview.value = firstExercise.reps || 12;
  if (fields.zeroWeightPreview) fields.zeroWeightPreview.value = `${firstExercise.weight || 0} kg`;
  if (fields.zeroSetPreview) fields.zeroSetPreview.value = firstExercise.sets ? "1" : "1";
  if (fields.zeroLastPerformance) {
    const last = entries.find((entry) => firstExercise.name && entry.name === firstExercise.name);
    fields.zeroLastPerformance.textContent = last ? `Last: ${last.sets || 0} sets · ${last.reps || 0} reps · ${last.weight || 0}kg` : "Last: waiting for data";
  }
  renderZeroNutrition(todayFoods);
  renderZeroFinish(engine);
  if (fields.uxCoachGreeting) fields.uxCoachGreeting.textContent = `สวัสดี ${displayName} อยากให้ช่วยวางแผนอะไรวันนี้?`;
  if (fields.uxProfileAvatar) fields.uxProfileAvatar.textContent = firstInitial;
  if (fields.uxProfileName) fields.uxProfileName.textContent = displayName;
  if (fields.uxProfileGoal) fields.uxProfileGoal.textContent = `Goal: ${goalLabel(profile.goal)}`;
  if (fields.uxProfileStreak) fields.uxProfileStreak.textContent = engine.streak.current;
  if (fields.uxProfileWorkoutCount) fields.uxProfileWorkoutCount.textContent = entries.length;
  if (fields.uxProfileHours) fields.uxProfileHours.textContent = `${totalHours}h`;
  if (fields.uxProfileAchievement) fields.uxProfileAchievement.textContent = engine.streak.current >= 7 ? "7-day streak unlocked" : "Next achievement: 7-day streak";
  if (fields.uxProfileGoalProgress) fields.uxProfileGoalProgress.textContent = entries.length ? `${entries.length} workouts logged. Keep the chain alive.` : "Start your first workout to begin your progress story.";
  renderUxCheckinSheet();
}

function renderZeroNutrition(todayFoods) {
  const mealCounts = todayFoods.reduce((map, food) => {
    const key = normalizeMeal(food.meal);
    map[key] = (map[key] || 0) + 1;
    return map;
  }, {});
  if (fields.zeroBreakfastCount) fields.zeroBreakfastCount.textContent = `${mealCounts.breakfast || 0} items`;
  if (fields.zeroLunchCount) fields.zeroLunchCount.textContent = `${mealCounts.lunch || 0} items`;
  if (fields.zeroDinnerCount) fields.zeroDinnerCount.textContent = `${mealCounts.dinner || 0} items`;
  if (fields.zeroSnackCount) fields.zeroSnackCount.textContent = `${mealCounts.snack || 0} items`;
  if (!fields.zeroFrequentFoods) return;
  const recentNames = [...new Set(foods.map((food) => food.name).filter(Boolean))].slice(0, 5);
  const base = [
    { label: "🍗 Chicken Breast", name: "Chicken breast", meal: "lunch", calories: 165, protein: 31, carbs: 0, fat: 4 },
    { label: "🥚 Eggs", name: "Boiled eggs", meal: "breakfast", calories: 140, protein: 12, carbs: 1, fat: 10 },
    { label: "🍚 Rice", name: "Cooked rice", meal: "lunch", calories: 205, protein: 4, carbs: 45, fat: 0 },
    { label: "🍌 Banana", name: "Banana", meal: "snack", calories: 105, protein: 1, carbs: 27, fat: 0 },
    { label: "🥛 Milk", name: "Milk", meal: "snack", calories: 150, protein: 8, carbs: 12, fat: 8 },
  ];
  const recent = recentNames.map((name) => {
    const food = foods.find((item) => item.name === name) || {};
    return { label: name, name, meal: food.meal || "snack", calories: food.calories || 0, protein: food.protein || 0, carbs: food.carbs || 0, fat: food.fat || 0 };
  });
  const shortcuts = [...recent, ...base].filter((item, index, list) => list.findIndex((match) => match.name === item.name) === index).slice(0, 8);
  fields.zeroFrequentFoods.innerHTML = shortcuts.map((item) => `<button type="button" data-zero-food="${escapeHtml(item.name)}">${escapeHtml(item.label)}</button>`).join("");
  fields.zeroFrequentFoods.querySelectorAll("[data-zero-food]").forEach((button) => {
    button.addEventListener("click", async () => {
      const item = shortcuts.find((food) => food.name === button.dataset.zeroFood);
      if (!item) return;
      await addFood({ ...item, meal: fields.mealType?.value || item.meal, source: "quick" });
      showFoodSaveFeedback();
    });
  });
}

function renderZeroFinish(engine) {
  if (!fields.zeroFinishCard) return;
  const today = dateKey(new Date());
  const todayEntries = entries.filter((entry) => dateKey(new Date(entry.createdAt)) === today);
  const duration = sum(todayEntries, "minutes");
  fields.zeroFinishCard.classList.toggle("hidden", !todayEntries.length);
  if (!todayEntries.length) return;
  if (fields.zeroFinishDuration) fields.zeroFinishDuration.textContent = `${duration} min`;
  if (fields.zeroFinishVolume) fields.zeroFinishVolume.textContent = formatKg(sum(todayEntries, "volume"));
  if (fields.zeroFinishSets) fields.zeroFinishSets.textContent = sum(todayEntries, "sets");
  if (fields.zeroFinishCalories) fields.zeroFinishCalories.textContent = estimateCalories(todayEntries);
  if (fields.zeroFinishPr) fields.zeroFinishPr.textContent = engine.personalRecords?.length || 0;
  if (fields.zeroFinishStreak) fields.zeroFinishStreak.textContent = `${engine.streak.current} days`;
}

function renderUxCheckinSheet() {
  if (!fields.uxCheckinSheet) return;
  const done = Boolean(healthLogs[dateKey(new Date())]?.checkinCompleted);
  fields.uxCheckinSheet.classList.toggle("hidden", done || uxCheckinSheetDismissed);
}

function renderSummary() {
  const today = dateKey(new Date());
  const todayEntries = entries.filter((entry) => dateKey(new Date(entry.createdAt)) === today);
  fields.todayMinutes.textContent = sum(todayEntries, "minutes");
  fields.todayWorkouts.textContent = todayEntries.length;
  fields.todayCalories.textContent = estimateCalories(todayEntries);
}

function renderDashboard() {
  const today = dateKey(new Date());
  const log = todayHealthLog();
  const todayFoods = foods.filter((food) => dateKey(new Date(food.createdAt)) === today);
  const todayEntries = entries.filter((entry) => dateKey(new Date(entry.createdAt)) === today);
  const totals = dailyFoodTotals(todayFoods);
  const healthResult = calculateHealthScoreForDate(today);
  const score = healthResult.total;
  const targets = nutritionTargets();
  const displayName = profile.displayName || currentUserId || "Khayubdi";
  const latestWeight = latestWeightRecord();
  const currentWeight = Number(latestWeight?.weightKg || log.weightKg || profile.bodyWeight || 0);
  const weightDiff = weightGoalDifference(currentWeight);
  const weightTrend = weightTrendLabel();
  const waterGoal = waterGoalForLog(log);
  const waterMl = Number(log.waterMl || 0);
  const waterRemaining = Math.max(0, waterGoal - waterMl);
  const waterPercent = Math.min(100, Math.round((waterMl / Math.max(1, waterGoal)) * 100));
  const sleepGoal = sleepGoalHours();
  const sleepHours = Number(log.sleepHours || 0);
  const sleepPercent = Math.min(100, Math.round((sleepHours / Math.max(1, sleepGoal)) * 100));
  fields.dashboardGreeting.textContent = `สวัสดี, ${displayName}`;
  fields.dashboardGoal.textContent = `เป้าหมาย: ${goalLabel(profile.goal)}`;
  fields.healthScore.textContent = score;
  fields.healthScoreStatus.textContent = healthScoreStatus(score);
  fields.healthTrendIndicator.textContent = healthTrendText(today, score);
  renderDashboardHealthScore(healthResult);
  renderDashboardCoach();
  renderRecoveryReadinessDashboard();
  renderHabitAdherenceDashboard();
  renderProgressPredictionDashboard();
  renderSmartNotificationsDashboard();
  renderDashboardAdaptiveRecommendations();
  renderDashboardDraftProgram();
  renderDashboardNutritionDraft();
  fields.dashCurrentWeight.textContent = currentWeight ? `${currentWeight}kg` : "-";
  fields.dashTargetWeight.textContent = profile.targetWeight ? `${profile.targetWeight}kg` : "-";
  fields.dashWeightDifference.textContent = weightDiff;
  fields.dashWeightTrend.textContent = weightTrend;
  fields.dashFoodCalories.textContent = totals.calories;
  fields.dashFoodProtein.textContent = `${totals.protein}g`;
  fields.dashCheckinStatus.textContent = log.checkinCompleted ? "Completed" : "ยังไม่เช็กอิน";
  fields.dashCheckinStreak.textContent = calculateCheckinStreak();
  fields.dashWaterToday.textContent = `${waterMl} ml`;
  fields.dashWaterRemaining.textContent = `${waterRemaining} ml`;
  fields.dashSleepHours.textContent = `${sleepHours.toFixed(1)} ชม.`;
  fields.dashSleepQuality.textContent = log.sleepQuality ? `${log.sleepQuality}/5` : "-";
  fields.dashSleepGoal.textContent = `${sleepGoal} ชม.`;
  fields.dashSleepPercent.textContent = `${sleepPercent}%`;
  fields.dashKcalTarget.textContent = targets.calories;
  fields.dashProteinTarget.textContent = `${targets.protein}g`;
  fields.dashWaterTarget.textContent = `${(waterGoal / 1000).toFixed(waterGoal % 1000 ? 1 : 0)}L`;
  renderDashboardTrainingStats();
  fields.dashWaterPercent.textContent = `${waterPercent}%`;
  fields.dashWaterRingText.textContent = `${waterPercent}%`;
  setRing(fields.dashWaterRing, waterPercent);
  fields.dashWaterSummary.textContent = `${waterMl} / ${waterGoal} ml`;
  fields.dashWaterHint.textContent = waterMl ? `เหลือ ${waterRemaining} ml` : "วันนี้ยังไม่ได้ดื่มน้ำ";

  const missions = dailyMissions(todayFoods, todayEntries, log);
  const complete = missions.filter((mission) => mission.done).length;
  const percent = Math.round((complete / missions.length) * 100);
  fields.missionPercent.textContent = `${percent}%`;
  fields.dailyMissionText.textContent = `ทำภารกิจแล้ว ${complete}/${missions.length}`;
  fields.missionList.innerHTML = missions.map((mission) => `
    <div class="mission-row ${mission.done ? "done" : ""}">
      <span>${mission.done ? "✓" : "○"}</span>
      <strong>${mission.label}</strong>
      <small>${mission.detail}</small>
    </div>
  `).join("");
}

function renderHealth() {
  const log = todayHealthLog();
  const checkinDone = Boolean(log.checkinCompleted);
  const waterGoal = waterGoalForLog(log);
  const waterStatus = hydrationStatus(Number(log.waterMl || 0), waterGoal);
  fields.checkinCompletionText.textContent = checkinDone ? "Today's Check-in Completed" : "ยังไม่ได้เช็กอินวันนี้";
  fields.checkinStreakLabel.textContent = `${calculateCheckinStreak()} day streak`;
  fields.checkinWeight.value = log.weightKg || "";
  fields.checkinSleepHours.value = log.sleepHours || "";
  fields.energyLevel.value = log.energyLevel || 5;
  fields.energyValue.textContent = `${fields.energyLevel.value}/10`;
  fields.checkinWaterGoal.value = String(log.waterGoalMl || WATER_GOAL_ML);
  fields.checkinTodayGoal.value = log.todayGoal || goalToCheckinGoal(profile.goal);
  fields.checkinMoodButtons.forEach((button) => button.classList.toggle("active-mood", button.dataset.mood === log.mood));
  renderCheckinHistory();
  fields.checkinHydrationStatus.textContent = waterStatus;
  fields.checkinHydrationText.textContent = `${Number(log.waterMl || 0)} / ${waterGoal} ml · ${waterStatus}`;
  fields.waterTotal.textContent = `${(Number(log.waterMl || 0) / 1000).toFixed(1)} / ${(waterGoal / 1000).toFixed(waterGoal % 1000 ? 1 : 0)}L`;
  setBar(fields.waterBar, Number(log.waterMl || 0), waterGoal);
  fields.dailyWeight.value = log.weightKg || "";
  fields.bodyFat.value = log.bodyFat || "";
  fields.waist.value = log.waistCm || "";
  fields.sleepTime.value = log.sleepTime || "";
  fields.wakeTime.value = log.wakeTime || "";
  fields.sleepQuality.value = String(log.sleepQuality || 3);
  fields.sleepDuration.textContent = `${Number(log.sleepHours || calculateSleepHours(log.sleepTime, log.wakeTime) || 0).toFixed(1)} ชม.`;
  fields.moodToday.textContent = log.mood || "-";
  fields.moodButtons.forEach((button) => button.classList.toggle("active-mood", button.dataset.mood === log.mood));
  renderProgressPhotoPreview();
  updateExerciseCaloriePreview();
}

function renderCheckinHistory() {
  const dates = trailingDateKeys(7);
  const completed = dates.filter((date) => healthLogs[date]?.checkinCompleted);
  fields.checkinHistoryCount.textContent = `${completed.length}/7`;
  fields.checkinHistoryList.innerHTML = dates.reverse().map((date) => {
    const log = healthLogs[date] || {};
    const done = Boolean(log.checkinCompleted);
    return `
      <article class="history-item checkin-history-item ${done ? "done" : ""}">
        <header>
          <div><strong>${formatShortDate(date)}</strong><span>${done ? "เช็กอินแล้ว" : "ยังไม่เช็กอิน"}</span></div>
          <span>${done ? "✓" : "○"}</span>
        </header>
        <span>นอน ${Number(log.sleepHours || 0)} ชม. · พลังงาน ${log.energyLevel || "-"}/10 · ${checkinGoalLabel(log.todayGoal)}</span>
        ${log.weightKg ? `<p>น้ำหนัก ${log.weightKg} kg</p>` : ""}
      </article>
    `;
  }).join("");
}

function renderWeight() {
  const records = weightRecords();
  const latest = records[0];
  const goal = Number(profile.targetWeight || 0);
  const current = Number(latest?.weightKg || profile.bodyWeight || 0);
  const diffText = weightGoalDifference(current);
  const trendText = weightTrendLabel(records);

  if (!fields.weightDate.value) fields.weightDate.value = dateKey(new Date());
  fields.latestWeightValue.textContent = latest ? `${latest.weightKg} kg` : "-";
  fields.latestGoalWeight.textContent = goal ? `${goal} kg` : "-";
  fields.latestWeightDifference.textContent = diffText;
  fields.weightTrendBadge.textContent = trendText;

  fields.weightStatsCount.textContent = `${records.length} records`;
  if (!records.length) {
    fields.highestWeight.textContent = "-";
    fields.lowestWeight.textContent = "-";
    fields.averageWeight.textContent = "-";
    fields.currentWeightChange.textContent = "-";
    fields.weightHistoryCount.textContent = "0 รายการ";
    fields.weightHistoryList.innerHTML = `<div class="food-empty"><div class="empty-illustration"></div><strong>ยังไม่มีข้อมูลน้ำหนัก</strong><p>เริ่มบันทึกน้ำหนักครั้งแรกของคุณ</p></div>`;
    renderWeightChart([]);
    return;
  }

  const weights = records.map((record) => Number(record.weightKg || 0)).filter(Boolean);
  fields.highestWeight.textContent = `${Math.max(...weights).toFixed(1)} kg`;
  fields.lowestWeight.textContent = `${Math.min(...weights).toFixed(1)} kg`;
  fields.averageWeight.textContent = `${average(weights).toFixed(1)} kg`;
  fields.currentWeightChange.textContent = weightChangeText(records);
  fields.weightHistoryCount.textContent = `${records.length} รายการ`;
  fields.weightHistoryList.innerHTML = records.map((record) => `
    <article class="history-item weight-history-item">
      <header>
        <div>
          <strong>${record.weightKg} kg</strong>
          <span>${formatShortDate(record.date)}${record.bodyFat ? ` · Body Fat ${record.bodyFat}%` : ""}${record.waistCm ? ` · Waist ${record.waistCm} cm` : ""}</span>
        </div>
        <span>${weightRecordTrend(record)}</span>
      </header>
      ${record.note ? `<p>${escapeHtml(record.note)}</p>` : ""}
      <div class="history-actions">
        ${record.locked ? "" : `<button class="secondary" data-edit-weight="${record.id}" type="button">แก้ไข</button>`}
        ${record.locked ? "" : `<button class="link-button danger-link" data-delete-weight="${record.id}" type="button">ลบ</button>`}
      </div>
    </article>
  `).join("");
  renderWeightChart(records);
}

function renderWater() {
  const today = dateKey(new Date());
  const log = todayHealthLog();
  const goal = waterGoalForLog(log);
  const waterMl = Number(log.waterMl || 0);
  const remaining = Math.max(0, goal - waterMl);
  const percent = Math.min(100, Math.round((waterMl / Math.max(1, goal)) * 100));
  const status = hydrationStatus(waterMl, goal);
  const records = waterRecords(30);
  const values = records.map((record) => Number(record.waterMl || 0));
  const nonZeroValues = values.filter(Boolean);
  const weeklyRecords = waterRecords(7);
  const streak = calculateWaterStreak();
  const bestStreak = calculateBestWaterStreak();

  fields.waterGoalInput.value = goal;
  fields.waterHydrationStatus.textContent = status;
  fields.waterTodayAmount.textContent = `${waterMl} ml`;
  fields.waterGoalAmount.textContent = `Goal ${goal} ml`;
  fields.waterRemainingAmount.textContent = remaining ? `เหลือ ${remaining} ml` : "ถึงเป้าหมายแล้ว";
  fields.waterCompletionPercent.textContent = `${percent}%`;
  fields.waterDailyGoalView.textContent = `${goal} ml`;
  fields.waterRemainingView.textContent = `${remaining} ml`;
  fields.waterRingPercent.textContent = `${percent}%`;
  setRing(fields.waterProgressRing, percent);
  fields.waterCurrentStreak.textContent = streak;
  fields.waterBestStreak.textContent = bestStreak;
  fields.waterStreakStatus.textContent = `${streak} วัน`;

  fields.waterAverage.textContent = `${Math.round(average(values))} ml`;
  fields.waterHighestDay.textContent = nonZeroValues.length ? `${Math.max(...nonZeroValues)} ml` : "-";
  fields.waterLowestDay.textContent = nonZeroValues.length ? `${Math.min(...nonZeroValues)} ml` : "-";
  fields.waterWeeklyAverage.textContent = `${Math.round(average(weeklyRecords.map((record) => record.waterMl)))} ml`;
  fields.waterMonthlyAverage.textContent = `${Math.round(average(values))} ml`;

  const loggedRecords = records.filter((record) => record.waterMl > 0 || record.date === today);
  fields.waterHistoryCount.textContent = `${loggedRecords.filter((record) => record.waterMl > 0).length} รายการ`;
  if (!loggedRecords.some((record) => record.waterMl > 0)) {
    fields.waterHistoryList.innerHTML = `<div class="food-empty"><div class="empty-illustration"></div><strong>วันนี้ยังไม่ได้ดื่มน้ำ</strong><p>เริ่มจาก +250 ml เพื่อสร้าง hydration streak</p></div>`;
    return;
  }

  fields.waterHistoryList.innerHTML = loggedRecords.map((record) => {
    const recordGoal = waterGoalForLog(record);
    const recordPercent = Math.min(100, Math.round((record.waterMl / Math.max(1, recordGoal)) * 100));
    return `
      <article class="history-item water-history-item ${record.waterMl >= recordGoal ? "done" : ""}">
        <header>
          <div>
            <strong>${record.waterMl} ml</strong>
            <span>${formatShortDate(record.date)} · ${recordPercent}% · ${hydrationStatus(record.waterMl, recordGoal)}</span>
          </div>
          <span>${record.waterMl >= recordGoal ? "ถึงเป้า" : `เหลือ ${Math.max(0, recordGoal - record.waterMl)} ml`}</span>
        </header>
        <div class="macro-track"><div class="macro-fill water-fill" style="width:${recordPercent}%"></div></div>
        <div class="history-actions">
          <button class="secondary" data-edit-water="${record.date}" type="button">แก้ไข</button>
          <button class="link-button danger-link" data-delete-water="${record.date}" type="button">ลบ</button>
        </div>
      </article>
    `;
  }).join("");
}

function renderSleep() {
  const today = dateKey(new Date());
  const log = todayHealthLog();
  const goal = sleepGoalHours();
  const todayHours = Number(log.sleepHours || 0);
  const quality = Number(log.sleepQuality || 0);
  const completion = Math.min(100, Math.round((todayHours / Math.max(1, goal)) * 100));
  const records = sleepRecords(30);
  const loggedRecords = records.filter((record) => record.sleepHours > 0 || record.date === today);
  const values = records.map((record) => Number(record.sleepHours || 0)).filter(Boolean);
  const qualities = records.map((record) => Number(record.sleepQuality || 0)).filter(Boolean);
  const weekly = sleepRecords(7).map((record) => Number(record.sleepHours || 0)).filter(Boolean);
  const reachedDays = records.filter((record) => record.sleepHours >= sleepGoalForRecord(record)).length;

  if (!fields.sleepDate.value) fields.sleepDate.value = today;
  updateSleepCalculatedHours();
  fields.sleepGoalInput.value = goal;
  fields.sleepTodayStatus.textContent = todayHours ? sleepStatus(todayHours, goal) : "ยังไม่มีข้อมูล";
  fields.sleepTodayHours.textContent = `${todayHours.toFixed(1)} ชม.`;
  fields.sleepGoalView.textContent = `${goal} ชม.`;
  fields.sleepQualityView.textContent = quality ? `${quality}/5 ${qualityStars(quality)}` : "-";
  fields.sleepCompletionView.textContent = `${completion}%`;
  fields.sleepWeeklyAverage.textContent = weekly.length ? `${averageExact(weekly).toFixed(1)} ชม.` : "-";
  fields.sleepMonthlyAverage.textContent = values.length ? `${averageExact(values).toFixed(1)} ชม.` : "-";
  fields.sleepBest.textContent = values.length ? `${Math.max(...values).toFixed(1)} ชม.` : "-";
  fields.sleepWorst.textContent = values.length ? `${Math.min(...values).toFixed(1)} ชม.` : "-";
  fields.sleepAverageQuality.textContent = qualities.length ? `${averageExact(qualities).toFixed(1)}/5` : "-";
  fields.sleepConsistency.textContent = records.length ? `${Math.round((reachedDays / records.length) * 100)}%` : "-";
  fields.sleepCurrentStreak.textContent = calculateSleepStreak();
  fields.sleepBestStreak.textContent = calculateBestSleepStreak();
  fields.sleepHistoryCount.textContent = `${loggedRecords.filter((record) => record.sleepHours > 0).length} รายการ`;

  if (!loggedRecords.some((record) => record.sleepHours > 0)) {
    fields.sleepHistoryList.innerHTML = `<div class="food-empty"><div class="empty-illustration"></div><strong>ยังไม่มีข้อมูลการนอน</strong><p>เริ่มบันทึกเวลานอนและเวลาตื่นของคุณ</p></div>`;
    return;
  }

  fields.sleepHistoryList.innerHTML = loggedRecords.filter((record) => record.sleepHours > 0).map((record) => {
    const recordGoal = sleepGoalForRecord(record);
    const percent = Math.min(100, Math.round((record.sleepHours / Math.max(1, recordGoal)) * 100));
    return `
      <article class="history-item sleep-history-item ${record.sleepHours >= recordGoal ? "done" : ""}">
        <header>
          <div>
            <strong>${record.sleepHours.toFixed(1)} ชม.</strong>
            <span>${formatShortDate(record.date)} · ${qualityStars(record.sleepQuality)} · ${percent}%</span>
          </div>
          <span>${record.sleepTime && record.wakeTime ? `${record.sleepTime} - ${record.wakeTime}` : sleepStatus(record.sleepHours, recordGoal)}</span>
        </header>
        ${record.note ? `<p>${escapeHtml(record.note)}</p>` : ""}
        <div class="history-actions">
          <button class="secondary" data-edit-sleep="${record.id}" type="button">แก้ไข</button>
          <button class="link-button danger-link" data-delete-sleep="${record.id}" type="button">ลบ</button>
        </div>
      </article>
    `;
  }).join("");
}

function renderWeightChart(records) {
  const dates = trailingDateKeys(7);
  const values = dates.map((date) => {
    const record = records.find((item) => item.date === date);
    return record ? Number(record.weightKg || 0) : 0;
  });
  const visibleValues = values.filter(Boolean);
  if (!visibleValues.length) {
    fields.weightLineChart.innerHTML = `<div class="chart-empty">ยังไม่มีข้อมูลน้ำหนัก</div>`;
    return;
  }
  const min = Math.min(...visibleValues);
  const max = Math.max(...visibleValues);
  const range = Math.max(1, max - min);
  fields.weightLineChart.innerHTML = dates.map((date, index) => {
    const value = values[index];
    const height = value ? Math.max(12, Math.round(((value - min) / range) * 72) + 18) : 6;
    return `
      <div class="weight-chart-point ${value ? "has-value" : ""}">
        <div class="weight-chart-line" style="height:${height}%"></div>
        <strong>${value ? value.toFixed(1) : "-"}</strong>
        <span>${formatShortDate(date)}</span>
      </div>
    `;
  }).join("");
}

function upsertWeightRecord(input) {
  const date = input.date || dateKey(new Date());
  const weightKg = Number(input.weightKg || 0);
  if (!weightKg) return null;
  const now = new Date().toISOString();
  let existing = findWeightRecord(input.id);

  if (!existing && input.source === "checkin") {
    const dayRecords = healthLogs[date]?.weightRecords || [];
    const checkinRecord = dayRecords.find((record) => record.source === "checkin");
    if (checkinRecord) existing = { date, record: checkinRecord };
  }

  if (existing && existing.date !== date) {
    const oldLog = healthLogs[existing.date] || {};
    oldLog.weightRecords = (oldLog.weightRecords || []).filter((record) => record.id !== existing.record.id);
    syncDayWeightFromRecords(existing.date);
  }

  healthLogs[date] = { date, waterMl: 0, sleepQuality: 3, ...(healthLogs[date] || {}) };
  const records = healthLogs[date].weightRecords || [];
  const id = existing?.record.id || input.id || crypto.randomUUID();
  const nextRecord = {
    id,
    date,
    weightKg,
    bodyFat: Number(input.bodyFat || 0),
    waistCm: Number(input.waistCm || 0),
    note: String(input.note || "").trim(),
    source: input.source || existing?.record.source || "manual",
    createdAt: existing?.record.createdAt || now,
    updatedAt: now,
  };
  const index = records.findIndex((record) => record.id === id);
  if (index >= 0) records[index] = nextRecord;
  else records.unshift(nextRecord);
  healthLogs[date].weightRecords = records;
  syncDayWeightFromRecords(date);
  saveHealthLogs();
  return nextRecord;
}

async function deleteWeightRecord(recordId) {
  const found = findWeightRecord(recordId);
  if (!found) return;
  const log = healthLogs[found.date] || {};
  log.weightRecords = (log.weightRecords || []).filter((record) => record.id !== recordId);
  syncDayWeightFromRecords(found.date);
  const latest = latestWeightRecord();
  profile.bodyWeight = latest ? Number(latest.weightKg || profile.bodyWeight || 70) : Number(profile.bodyWeight || 70);
  await persistProfile();
  saveHealthLogs();
  render();
}

function startWeightEdit(recordId) {
  const found = findWeightRecord(recordId);
  if (!found) return;
  const record = found.record;
  fields.weightRecordId.value = record.id;
  fields.weightDate.value = record.date;
  fields.weightValue.value = record.weightKg || "";
  fields.weightBodyFat.value = record.bodyFat || "";
  fields.weightWaist.value = record.waistCm || "";
  fields.weightNote.value = record.note || "";
  fields.weightFormTitle.textContent = "แก้ไขข้อมูลน้ำหนัก";
  fields.saveWeightButton.textContent = "บันทึกการแก้ไข";
  fields.cancelWeightEdit.classList.remove("hidden");
  fields.weightValue.focus();
}

function resetWeightForm() {
  fields.weightTrackingForm.reset();
  fields.weightRecordId.value = "";
  fields.weightDate.value = dateKey(new Date());
  fields.weightFormTitle.textContent = "เพิ่มข้อมูลน้ำหนัก";
  fields.saveWeightButton.textContent = "บันทึกน้ำหนัก";
  fields.cancelWeightEdit.classList.add("hidden");
}

function showWeightSaveFeedback() {
  fields.saveWeightButton.classList.remove("saved-pop");
  void fields.saveWeightButton.offsetWidth;
  fields.saveWeightButton.classList.add("saved-pop");
  fields.weightSaveFeedback.classList.remove("hidden");
  showToast("บันทึกน้ำหนักแล้ว");
  window.setTimeout(() => fields.weightSaveFeedback.classList.add("hidden"), 1800);
}

function weightRecords() {
  return Object.entries(healthLogs).flatMap(([date, log]) => {
    const records = Array.isArray(log.weightRecords) ? log.weightRecords.map((record) => ({ ...record, date: record.date || date })) : [];
    if (records.length || !log.weightKg) return records;
    return [{
      id: `legacy-${date}`,
      date,
      weightKg: Number(log.weightKg || 0),
      bodyFat: Number(log.bodyFat || 0),
      waistCm: Number(log.waistCm || 0),
      note: "ข้อมูลเดิมจาก Check-in",
      source: "legacy",
      createdAt: `${date}T12:00:00.000Z`,
      updatedAt: `${date}T12:00:00.000Z`,
      locked: true,
    }];
  }).filter((record) => Number(record.weightKg || 0) > 0)
    .sort((a, b) => weightSortValue(b) - weightSortValue(a));
}

function latestWeightRecord() {
  return weightRecords()[0] || null;
}

function findWeightRecord(recordId) {
  if (!recordId || recordId.startsWith("legacy-")) return null;
  for (const [date, log] of Object.entries(healthLogs)) {
    const record = (log.weightRecords || []).find((item) => item.id === recordId);
    if (record) return { date, record };
  }
  return null;
}

function syncDayWeightFromRecords(date) {
  const log = healthLogs[date] || {};
  const records = (log.weightRecords || []).slice().sort((a, b) => weightSortValue(b) - weightSortValue(a));
  if (records.length) {
    const latest = records[0];
    log.weightKg = latest.weightKg;
    log.bodyFat = latest.bodyFat || 0;
    log.waistCm = latest.waistCm || 0;
  } else {
    delete log.weightKg;
    delete log.bodyFat;
    delete log.waistCm;
  }
  healthLogs[date] = { date, ...log };
}

function weightGoalDifference(weight) {
  const goal = Number(profile.targetWeight || 0);
  if (!weight || !goal) return "-";
  const diff = Number((weight - goal).toFixed(1));
  if (diff === 0) return "ถึงเป้า";
  return `${diff > 0 ? "+" : ""}${diff} kg`;
}

function weightTrendLabel(records = weightRecords()) {
  if (records.length < 2) return "ยังไม่มีแนวโน้ม";
  const latest = Number(records[0].weightKg || 0);
  const previous = Number(records[1].weightKg || 0);
  const delta = Number((latest - previous).toFixed(1));
  if (delta < 0) return `ลดลง ${Math.abs(delta)} kg`;
  if (delta > 0) return `เพิ่มขึ้น ${delta} kg`;
  return "คงที่";
}

function weightRecordTrend(record) {
  const records = weightRecords();
  const index = records.findIndex((item) => item.id === record.id);
  const next = records[index + 1];
  if (!next) return "ใหม่";
  const delta = Number((record.weightKg - next.weightKg).toFixed(1));
  if (delta < 0) return `-${Math.abs(delta)} kg`;
  if (delta > 0) return `+${delta} kg`;
  return "0 kg";
}

function weightChangeText(records) {
  if (records.length < 2) return "-";
  const latest = Number(records[0].weightKg || 0);
  const oldest = Number(records[records.length - 1].weightKg || 0);
  const delta = Number((latest - oldest).toFixed(1));
  if (delta === 0) return "0 kg";
  return `${delta > 0 ? "+" : ""}${delta} kg`;
}

function weightSortValue(record) {
  return new Date(record.updatedAt || record.createdAt || `${record.date}T12:00:00`).getTime();
}

function addWaterAmount(amount) {
  const value = Number(amount || 0);
  if (value <= 0) return;
  const log = todayHealthLog();
  log.waterMl = Number(log.waterMl || 0) + value;
  log.waterGoalMl = waterGoalForLog(log);
  saveTodayHealthLog(log);
  showWaterSaveFeedback();
  render();
}

function setWaterForDate(date, amount) {
  const value = Math.max(0, Number(amount || 0));
  const log = { date, waterMl: 0, sleepQuality: 3, ...(healthLogs[date] || {}) };
  log.waterMl = value;
  log.waterGoalMl = waterGoalForLog(log);
  log.waterUpdatedAt = new Date().toISOString();
  healthLogs[date] = log;
  saveHealthLogs();
}

function waterRecordForDate(date) {
  const log = healthLogs[date] || {};
  return {
    date,
    waterMl: Number(log.waterMl || 0),
    waterGoalMl: waterGoalForLog(log),
  };
}

function waterRecords(days = 30) {
  return trailingDateKeys(days).reverse().map((date) => waterRecordForDate(date));
}

function waterGoalForLog(log = {}) {
  return Number(log.waterGoalMl || profile.waterGoalMl || WATER_GOAL_ML);
}

function hydrationStatus(waterMl, goal = WATER_GOAL_ML) {
  const percent = Number(waterMl || 0) / Math.max(1, Number(goal || WATER_GOAL_ML));
  if (percent >= 0.85) return "Good";
  if (percent >= 0.45) return "Average";
  return "Low";
}

function calculateWaterStreak() {
  let streak = 0;
  const cursor = new Date();
  for (let index = 0; index < 365; index += 1) {
    const key = dateKey(cursor);
    const log = healthLogs[key] || {};
    if (Number(log.waterMl || 0) < waterGoalForLog(log)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function calculateBestWaterStreak() {
  let best = 0;
  let streak = 0;
  trailingDateKeys(365).forEach((date) => {
    const log = healthLogs[date] || {};
    if (Number(log.waterMl || 0) >= waterGoalForLog(log)) {
      streak += 1;
      best = Math.max(best, streak);
    } else {
      streak = 0;
    }
  });
  return best;
}

function setRing(element, percent) {
  if (!element) return;
  element.style.setProperty("--ring-value", `${Math.min(100, Math.max(0, Number(percent || 0)))}%`);
}

function showWaterSaveFeedback() {
  if (!fields.waterSaveFeedback) return;
  fields.waterSaveFeedback.classList.remove("hidden");
  showToast("อัปเดตน้ำแล้ว");
  window.setTimeout(() => fields.waterSaveFeedback.classList.add("hidden"), 1600);
}

function resetWaterEditForm() {
  fields.waterEditForm.classList.add("hidden");
  fields.waterEditDate.value = "";
  fields.waterEditAmount.value = "";
}

function upsertSleepRecord(input) {
  const date = input.date || dateKey(new Date());
  const sleepHours = Number(input.sleepHours || calculateSleepHours(input.sleepTime, input.wakeTime) || 0);
  if (sleepHours <= 0) return null;
  const now = new Date().toISOString();
  let existing = findSleepRecord(input.id);
  if (!existing && input.source === "checkin") {
    const checkinRecord = (healthLogs[date]?.sleepRecords || []).find((record) => record.source === "checkin");
    if (checkinRecord) existing = { date, record: checkinRecord };
  }
  if (existing && existing.date !== date) {
    const oldLog = healthLogs[existing.date] || {};
    oldLog.sleepRecords = (oldLog.sleepRecords || []).filter((record) => record.id !== existing.record.id);
    syncDaySleepFromRecords(existing.date);
  }
  healthLogs[date] = { date, waterMl: 0, sleepQuality: 3, ...(healthLogs[date] || {}) };
  const records = healthLogs[date].sleepRecords || [];
  const id = existing?.record.id || input.id || crypto.randomUUID();
  const nextRecord = {
    id,
    date,
    sleepTime: input.sleepTime || existing?.record.sleepTime || "",
    wakeTime: input.wakeTime || existing?.record.wakeTime || "",
    sleepHours,
    sleepQuality: Math.min(5, Math.max(1, Number(input.sleepQuality || 3))),
    sleepGoalHours: sleepGoalHours(),
    note: String(input.note || "").trim(),
    source: input.source || existing?.record.source || "manual",
    createdAt: existing?.record.createdAt || now,
    updatedAt: now,
  };
  const index = records.findIndex((record) => record.id === id);
  if (index >= 0) records[index] = nextRecord;
  else records.unshift(nextRecord);
  healthLogs[date].sleepRecords = records;
  syncDaySleepFromRecords(date);
  saveHealthLogs();
  return nextRecord;
}

async function deleteSleepRecord(recordId) {
  const found = findSleepRecord(recordId);
  if (!found) return;
  const log = healthLogs[found.date] || {};
  log.sleepRecords = (log.sleepRecords || []).filter((record) => record.id !== recordId);
  syncDaySleepFromRecords(found.date);
  saveHealthLogs();
  render();
}

function startSleepEdit(recordId) {
  const found = findSleepRecord(recordId);
  if (!found) return;
  const record = found.record;
  fields.sleepRecordId.value = record.id;
  fields.sleepDate.value = record.date;
  fields.sleepStartTime.value = record.sleepTime || "";
  fields.sleepWakeTime.value = record.wakeTime || "";
  fields.sleepHoursCalculated.value = Number(record.sleepHours || 0).toFixed(1);
  setSleepQuality(record.sleepQuality || 3);
  fields.sleepNote.value = record.note || "";
  fields.sleepFormTitle.textContent = "แก้ไขข้อมูลการนอน";
  fields.saveSleepButton.textContent = "บันทึกการแก้ไข";
  fields.cancelSleepEdit.classList.remove("hidden");
  fields.sleepStartTime.focus();
}

function resetSleepForm() {
  fields.sleepTrackingForm.reset();
  fields.sleepRecordId.value = "";
  fields.sleepDate.value = dateKey(new Date());
  fields.sleepHoursCalculated.value = "";
  fields.sleepFormTitle.textContent = "เพิ่มข้อมูลการนอน";
  fields.saveSleepButton.textContent = "บันทึกการนอน";
  fields.cancelSleepEdit.classList.add("hidden");
  setSleepQuality(3);
}

function sleepRecords(days = 30) {
  return trailingDateKeys(days).reverse().flatMap((date) => {
    const log = healthLogs[date] || {};
    const records = Array.isArray(log.sleepRecords) ? log.sleepRecords.map((record) => ({ ...record, date: record.date || date })) : [];
    if (records.length || !log.sleepHours) return records;
    return [{
      id: `legacy-sleep-${date}`,
      date,
      sleepTime: log.sleepTime || "",
      wakeTime: log.wakeTime || "",
      sleepHours: Number(log.sleepHours || 0),
      sleepQuality: Number(log.sleepQuality || 3),
      sleepGoalHours: sleepGoalForRecord(log),
      note: "ข้อมูลเดิมจาก Check-in",
      source: "legacy",
      createdAt: `${date}T12:00:00.000Z`,
      updatedAt: `${date}T12:00:00.000Z`,
    }];
  }).filter((record) => Number(record.sleepHours || 0) > 0)
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || `${b.date}T12:00:00`).getTime() - new Date(a.updatedAt || a.createdAt || `${a.date}T12:00:00`).getTime());
}

function findSleepRecord(recordId) {
  if (!recordId || recordId.startsWith("legacy-sleep-")) return null;
  for (const [date, log] of Object.entries(healthLogs)) {
    const record = (log.sleepRecords || []).find((item) => item.id === recordId);
    if (record) return { date, record };
  }
  return null;
}

function syncDaySleepFromRecords(date) {
  const log = healthLogs[date] || {};
  const records = (log.sleepRecords || []).slice().sort((a, b) => new Date(b.updatedAt || b.createdAt || `${b.date}T12:00:00`).getTime() - new Date(a.updatedAt || a.createdAt || `${a.date}T12:00:00`).getTime());
  if (records.length) {
    const latest = records[0];
    log.sleepTime = latest.sleepTime || "";
    log.wakeTime = latest.wakeTime || "";
    log.sleepHours = latest.sleepHours;
    log.sleepQuality = latest.sleepQuality;
    log.sleepGoalHours = latest.sleepGoalHours || sleepGoalHours();
  } else {
    delete log.sleepTime;
    delete log.wakeTime;
    delete log.sleepHours;
    delete log.sleepQuality;
  }
  healthLogs[date] = { date, ...log };
}

function sleepGoalHours() {
  return Number(profile.sleepGoalHours || 8);
}

function sleepGoalForRecord(record = {}) {
  return Number(record.sleepGoalHours || profile.sleepGoalHours || 8);
}

function calculateSleepStreak() {
  let streak = 0;
  const cursor = new Date();
  for (let index = 0; index < 365; index += 1) {
    const key = dateKey(cursor);
    const log = healthLogs[key] || {};
    if (Number(log.sleepHours || 0) < sleepGoalForRecord(log)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function calculateBestSleepStreak() {
  let best = 0;
  let streak = 0;
  trailingDateKeys(365).forEach((date) => {
    const log = healthLogs[date] || {};
    if (Number(log.sleepHours || 0) >= sleepGoalForRecord(log)) {
      streak += 1;
      best = Math.max(best, streak);
    } else {
      streak = 0;
    }
  });
  return best;
}

function setSleepQuality(value) {
  const quality = Math.min(5, Math.max(1, Number(value || 3)));
  fields.sleepQualityValue.value = quality;
  fields.sleepQualityLabel.textContent = `${quality}/5`;
  fields.sleepQualityStars.forEach((button) => button.classList.toggle("active", Number(button.dataset.quality) <= quality));
}

function updateSleepCalculatedHours() {
  if (!fields.sleepStartTime || !fields.sleepWakeTime || !fields.sleepHoursCalculated) return;
  const hours = calculateSleepHours(fields.sleepStartTime.value, fields.sleepWakeTime.value);
  fields.sleepHoursCalculated.value = hours ? hours.toFixed(1) : "";
}

function showSleepSaveFeedback() {
  fields.saveSleepButton.classList.remove("saved-pop");
  void fields.saveSleepButton.offsetWidth;
  fields.saveSleepButton.classList.add("saved-pop");
  fields.sleepSaveFeedback.classList.remove("hidden");
  showToast("บันทึกการนอนแล้ว");
  window.setTimeout(() => fields.sleepSaveFeedback.classList.add("hidden"), 1600);
}

function sleepStatus(hours, goal) {
  if (!hours) return "ยังไม่มีข้อมูล";
  if (hours >= goal) return "ถึงเป้า";
  if (hours >= goal * 0.75) return "ใกล้เป้า";
  return "ควรพักผ่อนเพิ่ม";
}

function qualityStars(value) {
  const count = Math.min(5, Math.max(0, Number(value || 0)));
  return "★".repeat(count) + "☆".repeat(5 - count);
}

function averageExact(values) {
  if (!values.length) return 0;
  return values.reduce((total, value) => total + Number(value || 0), 0) / values.length;
}

function isTodayCheckinComplete() {
  return Boolean(healthLogs[dateKey(new Date())]?.checkinCompleted);
}

function calculateCheckinStreak() {
  let streak = 0;
  const cursor = new Date();
  for (let index = 0; index < 365; index += 1) {
    const key = dateKey(cursor);
    if (!healthLogs[key]?.checkinCompleted) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function checkinGoalLabel(goal) {
  const labels = {
    lose_fat: "Lose Fat",
    build_muscle: "Build Muscle",
    stay_healthy: "Stay Healthy",
  };
  return labels[goal] || "Stay Healthy";
}

function goalToCheckinGoal(goal) {
  if (goal === "fat_loss") return "lose_fat";
  if (goal === "muscle_gain") return "build_muscle";
  return "stay_healthy";
}

function renderPremiumFeatures() {
  const isPro = profile.plan === "pro";
  if (fields.programPremiumGate) fields.programPremiumGate.classList.add("hidden");
  if (fields.programProContent) fields.programProContent.classList.remove("hidden");
  fields.coachPremiumGate.classList.toggle("hidden", isPro);
  fields.coachProContent.classList.toggle("hidden", !isPro);
}

function renderWorkoutProgram() {
  renderProgramManager();
  const adherence = programAdherence();
  fields.programAdherence.textContent = `${adherence}%`;
  renderWorkoutIntelligence();
  if (!workoutProgram.days.length) {
    fields.programGeneratedAt.textContent = "ยังไม่มีแผน";
    fields.programTrainingDays.textContent = "0";
    fields.programWeeklyVolume.textContent = "0 sets";
    fields.programEstimatedTime.textContent = "0 นาที";
    fields.programSafetyWarning.classList.add("hidden");
    fields.programCalendar.innerHTML = weeklyCalendar([], 0);
    fields.programPlanList.innerHTML = `<div class="empty">เริ่มสร้างโปรแกรมออกกำลังกายของคุณ</div>`;
    return;
  }
  const summary = workoutProgramSummary();
  fields.programGeneratedAt.textContent = workoutProgram.createdAt ? `สร้างเมื่อ ${formatShortDate(dateKey(new Date(workoutProgram.createdAt)))}` : "แผนล่าสุด";
  fields.programTrainingDays.textContent = summary.trainingDays;
  fields.programWeeklyVolume.textContent = `${summary.weeklyVolume} sets`;
  fields.programEstimatedTime.textContent = `${summary.estimatedTime} นาที`;
  fields.programSafetyWarning.classList.toggle("hidden", !hasInjuryText(workoutProgram.settings.injuries));
  fields.programCalendar.innerHTML = weeklyCalendar(workoutProgram.days, Number(workoutProgram.settings.days || workoutProgram.days.length));
  fields.programPlanList.innerHTML = workoutProgram.days.map((day, dayIndex) => `
    <article class="program-day">
      <header>
        <strong>${escapeHtml(day.title)}</strong>
        <span>${escapeHtml(day.weekday || "")} · ${escapeHtml(day.cardioTarget)}</span>
      </header>
      <div class="program-order-actions">
        <button class="secondary" data-move-workout="up" data-day="${dayIndex}" type="button">Move Up</button>
        <button class="secondary" data-move-workout="down" data-day="${dayIndex}" type="button">Move Down</button>
      </div>
      <p>${escapeHtml(day.notes)}</p>
      ${day.exercises.map((exercise, exerciseIndex) => renderProgramExercise(dayIndex, exerciseIndex, exercise)).join("")}
    </article>
  `).join("");
}

function renderProgramExercise(dayIndex, exerciseIndex, exercise) {
  const check = exercise.checkin || {};
  const previous = previousPerformance(exercise.name);
  const suggestion = progressionSuggestion(exercise, previous);
  return `
    <div class="program-exercise">
      <label class="check-row"><input type="checkbox" data-day="${dayIndex}" data-exercise="${exerciseIndex}" data-field="completed" ${check.completed ? "checked" : ""} /> ${escapeHtml(exercise.nameTh || exercise.name)}</label>
      ${exercise.nameTh ? `<small>${escapeHtml(exercise.name)}</small>` : ""}
      <span>${exercise.sets} sets · ${exercise.reps} reps · rest ${exercise.rest} · tempo ${exercise.tempo || "ควบคุม"} · ${escapeHtml(exercise.notes)}</span>
      <small>ครั้งก่อน: ${previous || "ยังไม่มี"} · แนะนำ: ${escapeHtml(suggestion)}</small>
      <div class="program-order-actions">
        <button class="secondary" data-move-exercise="up" data-day="${dayIndex}" data-exercise="${exerciseIndex}" type="button">Move Up</button>
        <button class="secondary" data-move-exercise="down" data-day="${dayIndex}" data-exercise="${exerciseIndex}" type="button">Move Down</button>
      </div>
      <div class="form-grid compact-grid">
        <label>kg<input data-day="${dayIndex}" data-exercise="${exerciseIndex}" data-field="weight" type="number" step="0.5" value="${check.weight || ""}" /></label>
        <label>reps<input data-day="${dayIndex}" data-exercise="${exerciseIndex}" data-field="reps" type="number" step="1" value="${check.reps || ""}" /></label>
        <label>RPE<input data-day="${dayIndex}" data-exercise="${exerciseIndex}" data-field="rpe" type="number" min="1" max="10" step="1" value="${check.rpe || ""}" /></label>
        <label>cardio min<input data-day="${dayIndex}" data-exercise="${exerciseIndex}" data-field="cardio" type="number" step="1" value="${check.cardio || ""}" /></label>
      </div>
      <label>notes<input data-day="${dayIndex}" data-exercise="${exerciseIndex}" data-field="notes" value="${escapeHtml(check.notes || "")}" /></label>
    </div>
  `;
}

function bindProgramManagement() {
  if (!fields.createProgramForm) return;
  fields.createProgramForm.addEventListener("submit", (event) => {
    event.preventDefault();
    createManagedProgram(false);
  });
  fields.createBlankProgram.addEventListener("click", () => createManagedProgram(true));
  fields.activeProgramList.addEventListener("click", handleProgramListAction);
  fields.archivedProgramList.addEventListener("click", handleProgramListAction);
  fields.programNameEditor.addEventListener("input", () => {
    const program = activeProgram();
    program.name = fields.programNameEditor.value.trim() || "Untitled Program";
    touchProgram(program);
    scheduleProgramSave();
    renderProgramListsOnly();
  });
  fields.programNotesEditor.addEventListener("input", () => {
    const program = activeProgram();
    program.notes = fields.programNotesEditor.value;
    touchProgram(program);
    scheduleProgramSave();
  });
  fields.assignWorkoutToDay.addEventListener("click", () => assignWorkoutToSchedule());
  fields.duplicateProgram.addEventListener("click", () => duplicateProgram(activeProgramId));
  fields.favoriteProgram.addEventListener("click", () => toggleFavoriteProgram(activeProgramId));
  fields.archiveProgram.addEventListener("click", () => toggleArchiveProgram(activeProgramId));
  fields.deleteProgram.addEventListener("click", () => deleteProgram(activeProgramId));
  window.addEventListener("beforeunload", (event) => {
    if (!programDirty) return;
    event.preventDefault();
    event.returnValue = "";
  });
}

function renderProgramManager() {
  ensureProgramManager();
  renderProgramListsOnly();
  const program = activeProgram();
  if (fields.programNameEditor && fields.programNameEditor.value !== program.name) fields.programNameEditor.value = program.name || "";
  if (fields.programNotesEditor && fields.programNotesEditor.value !== (program.notes || "")) fields.programNotesEditor.value = program.notes || "";
  if (fields.programVersionLabel) fields.programVersionLabel.textContent = `v${program.version || 1}`;
  if (fields.programScheduleWorkout) {
    fields.programScheduleWorkout.innerHTML = program.days.length ? program.days.map((day) => `<option value="${day.id}">${escapeHtml(day.title.replace(/^Day \d+:\s*/, ""))}</option>`).join("") : `<option value="">No workouts</option>`;
  }
  if (fields.favoriteProgram) fields.favoriteProgram.textContent = program.favorite ? "Unfavorite" : "Favorite";
  if (fields.archiveProgram) fields.archiveProgram.textContent = program.archived ? "Restore" : "Archive";
  renderProgramSchedule();
}

function renderProgramListsOnly() {
  const active = sortedPrograms(false);
  const archived = sortedPrograms(true);
  if (fields.activeProgramCount) fields.activeProgramCount.textContent = active.length;
  if (fields.archivedProgramCount) fields.archivedProgramCount.textContent = archived.length;
  if (fields.activeProgramList) fields.activeProgramList.innerHTML = active.length ? active.map(renderProgramCard).join("") : `<div class="empty">ยังไม่มีโปรแกรม เริ่มสร้างโปรแกรมแรกของคุณ</div>`;
  if (fields.archivedProgramList) fields.archivedProgramList.innerHTML = archived.length ? archived.map(renderProgramCard).join("") : `<div class="empty">ยังไม่มีโปรแกรมที่ archive</div>`;
}

function renderProgramCard(program) {
  const workouts = program.days || [];
  const totalExercises = workouts.reduce((total, day) => total + (day.exercises || []).length, 0);
  return `
    <article class="program-manager-item ${program.id === activeProgramId ? "active" : ""}">
      <header>
        <strong>${program.favorite ? "★ " : ""}${escapeHtml(program.name || "Untitled Program")}</strong>
        <span>v${program.version || 1}</span>
      </header>
      <p>${goalLabel(program.settings?.goal || program.goal)} · ${program.settings?.days || workouts.length || 0} วัน/สัปดาห์ · ${workouts.length} workouts · ${totalExercises} exercises</p>
      <small>Last edited ${program.updatedAt ? formatShortDate(dateKey(new Date(program.updatedAt))) : "-"}</small>
      <div class="program-actions">
        <button class="secondary" data-select-program="${program.id}" type="button">Open</button>
        <button class="secondary" data-duplicate-program="${program.id}" type="button">Duplicate</button>
        <button class="secondary" data-favorite-program="${program.id}" type="button">${program.favorite ? "Unstar" : "Star"}</button>
        <button class="secondary" data-archive-program="${program.id}" type="button">${program.archived ? "Restore" : "Archive"}</button>
      </div>
    </article>
  `;
}

function renderProgramSchedule() {
  if (!fields.programScheduleGrid) return;
  const program = activeProgram();
  const schedule = program.schedule || {};
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  fields.programScheduleGrid.innerHTML = days.map((day) => {
    const workout = program.days.find((item) => item.id === schedule[day]) || program.days.find((item) => item.weekday === day);
    return `<article class="${workout ? "training" : "rest"}"><strong>${day}</strong><span>${workout ? escapeHtml(workout.title.replace(/^Day \d+:\s*/, "")) : "Rest Day"}</span></article>`;
  }).join("");
}

function createManagedProgram(blank) {
  const name = fields.newProgramName.value.trim() || (blank ? "Blank Program" : "New Program");
  const goal = fields.newProgramGoal.value || "general_fitness";
  const program = blank ? blankProgram({ name, goal }) : normalizeProgram(generateWorkoutProgram(programGoalToGeneratorGoal(goal)), workoutPrograms.length);
  program.name = name;
  program.goal = goal;
  program.settings = { ...program.settings, goal };
  workoutPrograms.unshift(program);
  activeProgramId = program.id;
  workoutProgram = program;
  fields.newProgramName.value = "";
  saveWorkoutProgram();
  showToast("สร้างโปรแกรมแล้ว");
  render();
}

function programGoalToGeneratorGoal(goal) {
  const map = {
    hypertrophy: { goal: "muscle_gain", experience: "intermediate", days: 4, minutes: 60, equipment: "gym", injuries: "" },
    strength: { goal: "strength", experience: "intermediate", days: 4, minutes: 60, equipment: "gym", injuries: "" },
    fat_loss: { goal: "fat_loss", experience: "beginner", days: 3, minutes: 45, equipment: "minimal", injuries: "" },
    athletic: { goal: "general_health", experience: "intermediate", days: 4, minutes: 60, equipment: "gym", injuries: "" },
    general_fitness: { goal: "general_health", experience: "beginner", days: 3, minutes: 45, equipment: "home", injuries: "" },
  };
  return map[goal] || map.general_fitness;
}

function blankProgram({ name, goal }) {
  return normalizeProgram({ name, goal, settings: { goal, days: 0, minutes: 0, equipment: "home" }, days: [], notes: "" }, workoutPrograms.length);
}

function handleProgramListAction(event) {
  const select = event.target.closest("[data-select-program]");
  const duplicate = event.target.closest("[data-duplicate-program]");
  const favorite = event.target.closest("[data-favorite-program]");
  const archive = event.target.closest("[data-archive-program]");
  if (select) selectProgram(select.dataset.selectProgram);
  if (duplicate) duplicateProgram(duplicate.dataset.duplicateProgram);
  if (favorite) toggleFavoriteProgram(favorite.dataset.favoriteProgram);
  if (archive) toggleArchiveProgram(archive.dataset.archiveProgram);
}

function selectProgram(id) {
  const program = workoutPrograms.find((item) => item.id === id);
  if (!program) return;
  activeProgramId = id;
  workoutProgram = program;
  saveWorkoutProgram();
  render();
}

function duplicateProgram(id) {
  const source = workoutPrograms.find((program) => program.id === id);
  if (!source) return;
  const copy = normalizeProgram(JSON.parse(JSON.stringify(source)), workoutPrograms.length);
  copy.id = crypto.randomUUID();
  copy.name = `${source.name || "Program"} Copy`;
  copy.archived = false;
  copy.favorite = false;
  copy.version = 1;
  copy.createdAt = new Date().toISOString();
  copy.updatedAt = copy.createdAt;
  workoutPrograms.unshift(copy);
  activeProgramId = copy.id;
  workoutProgram = copy;
  saveWorkoutProgram();
  showToast("Duplicate program แล้ว");
  render();
}

function toggleFavoriteProgram(id) {
  const program = workoutPrograms.find((item) => item.id === id);
  if (!program) return;
  program.favorite = !program.favorite;
  touchProgram(program);
  saveWorkoutProgram();
  render();
}

function toggleArchiveProgram(id) {
  const program = workoutPrograms.find((item) => item.id === id);
  if (!program) return;
  program.archived = !program.archived;
  if (program.generation) program.generation.status = program.archived ? "Archived" : "Approved";
  touchProgram(program);
  if (program.archived && activeProgramId === id) {
    const next = sortedPrograms(false)[0] || program;
    activeProgramId = next.id;
    workoutProgram = next;
  }
  saveWorkoutProgram();
  render();
}

function deleteProgram(id) {
  const program = workoutPrograms.find((item) => item.id === id);
  if (!program || !window.confirm("ลบโปรแกรมนี้? Workout history จะไม่ถูกลบ")) return;
  workoutPrograms = workoutPrograms.filter((item) => item.id !== id);
  if (!workoutPrograms.length) workoutPrograms = [blankProgram({ name: "My Program", goal: "general_fitness" })];
  activeProgramId = sortedPrograms(false)[0]?.id || workoutPrograms[0].id;
  workoutProgram = workoutPrograms.find((item) => item.id === activeProgramId) || workoutPrograms[0];
  saveWorkoutProgram();
  render();
}

function assignWorkoutToSchedule() {
  const program = activeProgram();
  if (!program.days.length) {
    showToast("ยังไม่มี workout ในโปรแกรม");
    return;
  }
  const day = fields.programScheduleDay.value;
  const workout = program.days.find((item) => item.id === fields.programScheduleWorkout.value) || program.days.find((item) => item.weekday === day) || program.days[0];
  program.schedule = { ...(program.schedule || {}), [day]: workout.id };
  touchProgram(program);
  saveWorkoutProgram();
  showToast("อัปเดตตารางแล้ว");
  render();
}

function plannedWorkoutForDate(date, program = activeProgram()) {
  const weekday = weekdayName(date);
  const workoutId = program.schedule?.[weekday];
  return program.days.find((day) => day.id === workoutId) || program.days.find((day) => day.weekday === weekday) || null;
}

function weekdayName(date) {
  const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return names[new Date(`${date}T12:00:00`).getDay()];
}

function programWeeklyCompletion(program = activeProgram()) {
  const scheduled = Object.values(program.schedule || {}).filter(Boolean);
  const total = scheduled.length || program.days.length;
  if (!total) return 0;
  const completed = (program.days || []).filter((day) => (day.exercises || []).length && (day.exercises || []).every((exercise) => exercise.checkin?.completed)).length;
  return Math.min(100, Math.round((completed / total) * 100));
}

function moveWorkoutDay(index, direction) {
  const program = activeProgram();
  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= program.days.length) return;
  [program.days[index], program.days[target]] = [program.days[target], program.days[index]];
  touchProgram(program);
  saveWorkoutProgram();
  render();
}

function moveExercise(dayIndex, exerciseIndex, direction) {
  const program = activeProgram();
  const exercises = program.days[dayIndex]?.exercises || [];
  const target = direction === "up" ? exerciseIndex - 1 : exerciseIndex + 1;
  if (target < 0 || target >= exercises.length) return;
  [exercises[exerciseIndex], exercises[target]] = [exercises[target], exercises[exerciseIndex]];
  touchProgram(program);
  saveWorkoutProgram();
  render();
}

function scheduleProgramSave() {
  programDirty = true;
  if (fields.programManagerStatus) fields.programManagerStatus.textContent = "Saving...";
  window.clearTimeout(programSaveTimer);
  programSaveTimer = window.setTimeout(() => {
    saveWorkoutProgram();
    programDirty = false;
    if (fields.programManagerStatus) fields.programManagerStatus.textContent = "Auto saved";
    renderDashboard();
  }, 650);
}

function touchProgram(program) {
  if (!programDirty) program.version = Number(program.version || 1) + 1;
  program.updatedAt = new Date().toISOString();
  workoutProgram = program;
  upsertActiveProgram(program, false);
}

function activeProgram() {
  ensureProgramManager();
  return workoutPrograms.find((program) => program.id === activeProgramId) || workoutPrograms[0] || defaultWorkoutProgram();
}

function upsertActiveProgram(program, replace) {
  const index = workoutPrograms.findIndex((item) => item.id === program.id);
  if (index >= 0) workoutPrograms[index] = replace ? program : { ...workoutPrograms[index], ...program };
  else workoutPrograms.unshift(program);
  activeProgramId = program.id;
  workoutProgram = program;
}

function sortedPrograms(archived) {
  return workoutPrograms
    .filter((program) => Boolean(program.archived) === archived)
    .sort((a, b) => Number(b.favorite || 0) - Number(a.favorite || 0) || String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
}

function ensureProgramManager() {
  if (!workoutPrograms.length) {
    workoutPrograms = [normalizeProgram(workoutProgram, 0)];
    activeProgramId = workoutPrograms[0].id;
  }
  workoutPrograms = workoutPrograms.map((program, index) => normalizeProgram(program, index));
  if (!activeProgramId || !workoutPrograms.some((program) => program.id === activeProgramId)) activeProgramId = sortedPrograms(false)[0]?.id || workoutPrograms[0].id;
  workoutProgram = workoutPrograms.find((program) => program.id === activeProgramId) || workoutPrograms[0];
}

function normalizeProgram(program = {}, index = 0) {
  const now = new Date().toISOString();
  const days = (program.days || []).map((day, dayIndex) => ({
    id: day.id || `workout-${dayIndex + 1}-${crypto.randomUUID()}`,
    ...day,
    exercises: (day.exercises || []).map((exercise, exerciseIndex) => ({ id: exercise.id || exercise.exerciseId || `exercise-${exerciseIndex + 1}-${crypto.randomUUID()}`, ...exercise })),
  }));
  return {
    id: program.id || `program-${index + 1}-${crypto.randomUUID()}`,
    name: program.name || (days.length ? "Generated Program" : "My Program"),
    goal: program.goal || program.settings?.goal || "general_fitness",
    createdAt: program.createdAt || now,
    updatedAt: program.updatedAt || program.createdAt || now,
    version: Number(program.version || 1),
    archived: Boolean(program.archived),
    favorite: Boolean(program.favorite),
    notes: program.notes || "",
    schedule: program.schedule || Object.fromEntries(days.filter((day) => day.weekday).map((day) => [day.weekday, day.id])),
    settings: program.settings || {},
    days,
  };
}

function renderExerciseLibrary() {
  populateExerciseFilters();
  const query = fields.exerciseSearch.value.trim().toLowerCase();
  const muscle = fields.exerciseMuscleFilter.value;
  const pattern = fields.exercisePatternFilter.value;
  const equipment = fields.exerciseEquipmentFilter.value;
  const difficulty = fields.exerciseDifficultyFilter.value;
  const matches = EXERCISE_CATALOG.filter((exercise) => {
    const nameMatch = !query || `${exercise.nameTh} ${exercise.nameEn}`.toLowerCase().includes(query);
    const muscleMatch = !muscle || exercise.primaryMuscle === muscle || exercise.secondaryMuscles.includes(muscle);
    const patternMatch = !pattern || exercise.movementPattern === pattern;
    const equipmentMatch = !equipment || exercise.equipment.includes(equipment);
    const difficultyMatch = !difficulty || exercise.difficulty === difficulty;
    return nameMatch && muscleMatch && patternMatch && equipmentMatch && difficultyMatch;
  });
  fields.exerciseLibraryCount.textContent = `${matches.length} ท่า`;
  fields.exerciseLibraryList.innerHTML = matches.length ? matches.slice(0, 80).map((exercise) => `
    <button class="exercise-card" data-exercise-id="${exercise.id}" type="button">
      <strong>${escapeHtml(exercise.nameTh)}</strong>
      <span>${escapeHtml(exercise.nameEn)}</span>
      <small>${escapeHtml(exercise.primaryMuscle)} · ${escapeHtml(exercise.movementPattern)} · ${escapeHtml(exercise.difficulty)}</small>
    </button>
  `).join("") : `<div class="empty">ไม่พบท่าที่ตรงกับตัวกรอง</div>`;
}

function populateExerciseFilters() {
  if (fields.exerciseMuscleFilter.dataset.ready) return;
  const muscles = [...new Set(EXERCISE_CATALOG.flatMap((exercise) => [exercise.primaryMuscle, ...exercise.secondaryMuscles]))].sort();
  fillSelect(fields.exerciseMuscleFilter, muscles);
  fillSelect(fields.exercisePatternFilter, MOVEMENT_PATTERNS);
  fillSelect(fields.exerciseEquipmentFilter, EQUIPMENT_TYPES);
  fillSelect(fields.exerciseDifficultyFilter, DIFFICULTIES);
  fields.exerciseMuscleFilter.dataset.ready = "true";
}

function fillSelect(select, values) {
  select.insertAdjacentHTML("beforeend", values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join(""));
}

function renderExerciseDetail(exerciseId) {
  const exercise = EXERCISE_CATALOG.find((item) => item.id === exerciseId);
  if (!exercise) return;
  fields.exerciseDetailCard.classList.remove("hidden");
  fields.exerciseDetailCard.innerHTML = `
    <div class="section-title">
      <h2>${escapeHtml(exercise.nameTh)}</h2>
      <span>${escapeHtml(exercise.nameEn)}</span>
    </div>
    <div class="exercise-detail-grid">
      <article><strong>${escapeHtml(exercise.primaryMuscle)}</strong><span>Primary</span></article>
      <article><strong>${escapeHtml(exercise.movementPattern)}</strong><span>Movement</span></article>
      <article><strong>${escapeHtml(exercise.difficulty)}</strong><span>Difficulty</span></article>
      <article><strong>${exercise.defaultSets} x ${escapeHtml(exercise.defaultReps)}</strong><span>Default</span></article>
    </div>
    <p><strong>Secondary:</strong> ${escapeHtml(exercise.secondaryMuscles.join(", ") || "-")}</p>
    <p><strong>Equipment:</strong> ${escapeHtml(exercise.equipment.join(", "))}</p>
    <p><strong>Instructions:</strong> ${escapeHtml(exercise.instructions)}</p>
    <p><strong>Common mistakes:</strong> ${escapeHtml(exercise.commonMistakes)}</p>
    <p><strong>Safety:</strong> ${escapeHtml(exercise.safetyNote)}</p>
    <p><strong>Rest:</strong> ${exercise.defaultRestSeconds}s${exercise.tempo ? ` · Tempo: ${escapeHtml(exercise.tempo)}` : ""}</p>
  `;
}

function renderCoach() {
  if (profile.plan !== "pro") return;
  const coach = coachEngine();
  if (fields.dailyCoachText) fields.dailyCoachText.textContent = coach.message;
  if (fields.weeklyCoachText) fields.weeklyCoachText.innerHTML = coach.weeklyReview.map((item) => `<div class="coach-line"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.text)}</span></div>`).join("");
}

function renderDashboardCoach() {
  if (!fields.coachMainMessage) return;
  const coach = coachEngine();
  fields.coachPriority.textContent = coach.priority;
  fields.coachRecommendationType.textContent = coach.recommendationType;
  fields.coachMainMessage.textContent = coach.message;
  fields.coachDailySummary.innerHTML = coach.dailySummary.map((item) => `
    <article><strong>${escapeHtml(item.value)}</strong><span>${escapeHtml(item.label)}</span></article>
  `).join("");
  fields.coachReminders.innerHTML = coach.reminders.map((item) => `
    <div class="coach-line"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.text)}</span></div>
  `).join("");
  fields.coachWeeklyReview.innerHTML = coach.weeklyReview.slice(0, 5).map((item) => `
    <div class="coach-mini-review"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.text)}</span></div>
  `).join("");
  fields.coachMotivation.textContent = coach.motivation;
}

function renderDashboardAdaptiveRecommendations() {
  const target = document.querySelector(".coach-dashboard-card");
  if (!target) return;
  let card = document.querySelector("#adaptiveRecommendationCard");
  if (!card) {
    card = document.createElement("section");
    card.id = "adaptiveRecommendationCard";
    card.className = "chart-card adaptive-card";
    target.insertAdjacentElement("afterend", card);
  }
  let analysis;
  try {
    analysis = adaptiveTrainingEngine();
  } catch (error) {
    card.innerHTML = `
      <div class="section-title"><h2>AI Recommendations</h2><span>Adaptive Training</span></div>
      <div class="adaptive-empty">ยังไม่มีข้อมูลเพียงพอสำหรับคำแนะนำปรับโปรแกรม</div>
    `;
    return;
  }
  const recommendation = visibleAdaptiveRecommendation(analysis.recommendations);
  if (!recommendation) {
    card.innerHTML = `
      <div class="section-title"><h2>AI Recommendations</h2><span>Adaptive Training</span></div>
      <div class="adaptive-empty">ยังไม่มีคำแนะนำใหม่ รักษาโปรแกรมปัจจุบันและบันทึก workout ต่อเนื่อง</div>
    `;
    return;
  }
  card.innerHTML = `
    <div class="section-title"><h2>AI Recommendations</h2><span>${escapeHtml(recommendation.priority)}</span></div>
    <article class="adaptive-recommendation">
      <header>
        <strong>${escapeHtml(recommendation.action)}</strong>
        <span>${escapeHtml(recommendation.type)}</span>
      </header>
      <p>${escapeHtml(recommendation.reason)}</p>
      ${renderProgramDiff(recommendation.diff)}
      <div class="adaptive-actions">
        <button data-adaptive-action="accept" data-adaptive-id="${escapeHtml(recommendation.id)}" type="button">Accept</button>
        <button class="secondary" data-adaptive-action="dismiss" data-adaptive-id="${escapeHtml(recommendation.id)}" type="button">Dismiss</button>
        <button class="secondary" data-adaptive-action="remind" data-adaptive-id="${escapeHtml(recommendation.id)}" type="button">Remind Later</button>
      </div>
      <small>Recommendation only. โปรแกรมจะไม่ถูกแก้อัตโนมัติ</small>
    </article>
  `;
}

function adaptiveTrainingEngine() {
  const analytics = trainingAnalyticsEngine();
  const overload = progressiveOverloadEngine();
  const program = activeProgram();
  const analysis = programAnalyzer({ analytics, overload, program });
  const recommendations = adaptiveRecommendations(analysis, program);
  return { ...analysis, recommendations };
}

function programAnalyzer({ analytics, overload, program }) {
  const records = overload.records || [];
  const today = dateKey(new Date());
  const weekDates = lastDateKeysUntil(today, 7);
  const scheduledDays = Object.keys(program.schedule || {}).filter((day) => program.schedule?.[day]);
  const trainingFrequency = {
    completed: overload.weekly.workouts || 0,
    planned: scheduledDays.length || Number(program.settings?.days || program.days?.length || 0),
  };
  const missedWorkouts = missedWorkoutAnalysis(program, records, weekDates);
  const plateau = plateauDetection(overload.exercises, records, ADAPTIVE_PLATEAU_SESSIONS);
  const exerciseProgress = Object.values(overload.exercises || {}).map((item) => ({
    name: item.name,
    suggestion: item.suggestion,
    weightTrend: item.weightTrend,
    volumeTrend: item.volumeTrend,
    frequency: item.frequency,
    plateau: plateau.exercises.find((entry) => normalizeExerciseName(entry.name) === normalizeExerciseName(item.name))?.level || "None",
  })).slice(0, 12);
  return {
    generatedAt: new Date().toISOString(),
    trainingFrequency,
    weeklyVolume: analytics.weekly.totalSets,
    weeklyMuscles: analytics.weekly.muscles,
    recovery: analytics.recovery,
    fatigue: analytics.fatigue,
    exerciseProgress,
    muscleBalance: analytics.balance,
    missedWorkouts,
    plateau,
    weakPoints: analytics.weakPoints,
  };
}

function plateauDetection(exercises, records, sessionLimit = ADAPTIVE_PLATEAU_SESSIONS) {
  const groupedRecords = groupByExercise(records || []);
  const list = Object.values(exercises || {}).map((item) => {
    const records = [...(groupedRecords[normalizeExerciseName(item.name)] || [])]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, sessionLimit);
    if (records.length < sessionLimit) return { name: item.name, level: "None", sessions: records.length, reason: "ยังมีข้อมูลไม่พอ" };
    const newest = records[0];
    const oldest = records[records.length - 1];
    const noWeight = Number(newest.weight || 0) <= Number(oldest.weight || 0);
    const noReps = Number(newest.reps || 0) <= Number(oldest.reps || 0);
    const noVolume = Number(newest.volume || 0) <= Number(oldest.volume || 0) * 1.02;
    const stalled = [noWeight, noReps, noVolume].filter(Boolean).length;
    const level = stalled >= 3 ? "Confirmed" : stalled >= 2 ? "Possible" : "None";
    return { name: item.name, level, sessions: records.length, reason: `${records.length} sessions: weight ${noWeight ? "ไม่เพิ่ม" : "เพิ่ม"}, reps ${noReps ? "ไม่เพิ่ม" : "เพิ่ม"}, volume ${noVolume ? "ไม่เพิ่ม" : "เพิ่ม"}` };
  });
  const confirmed = list.filter((item) => item.level === "Confirmed");
  const possible = list.filter((item) => item.level === "Possible");
  return {
    level: confirmed.length ? "Confirmed" : possible.length ? "Possible" : "None",
    exercises: list.filter((item) => item.level !== "None"),
  };
}

function adaptiveRecommendations(analysis, program) {
  const recommendations = [];
  const firstPlateau = analysis.plateau.exercises.find((item) => item.level === "Confirmed") || analysis.plateau.exercises[0];
  if (analysis.recovery.score < 50 || analysis.fatigue.score >= 80) {
    recommendations.push(adaptiveRecommendation("add-recovery-day", "Add Recovery Day", "High", `Recovery ${analysis.recovery.score}% และ fatigue ${analysis.fatigue.score}/100 สูงเกินไป`, programDiff("Training Day", "Heavy session", "Recovery / mobility day", "ลดความเสี่ยงสะสมความล้า")));
  } else if (analysis.fatigue.score >= 65) {
    recommendations.push(adaptiveRecommendation("add-deload-week", "Add Deload Week", "High", `Fatigue ${analysis.fatigue.score}/100 เข้าโซนสูง ควรลด volume ชั่วคราว`, programDiff("Weekly Volume", `${analysis.weeklyVolume} sets`, `${Math.max(0, Math.round(analysis.weeklyVolume * 0.7))} sets`, "ลด volume ประมาณ 30% หนึ่งสัปดาห์")));
  }
  if (firstPlateau) {
    const target = findProgramExercise(firstPlateau.name, program);
    recommendations.push(adaptiveRecommendation("increase-intensity", "Increase Intensity", firstPlateau.level === "Confirmed" ? "High" : "Medium", `${firstPlateau.name}: ${firstPlateau.reason}`, programDiff(firstPlateau.name, target ? `${target.sets}x${target.reps}` : "Current prescription", target ? `${target.sets}x${increaseRepText(target.reps)}` : "เพิ่ม reps หรือ load เล็กน้อย", `Progress stalled for ${firstPlateau.sessions} sessions`)));
  }
  const chestSets = analysis.weeklyMuscles?.Chest || 0;
  if (analysis.weakPoints.some((point) => point.title.includes("Chest")) || (chestSets > 0 && chestSets < VOLUME_LANDMARKS.Chest[0])) {
    recommendations.push(adaptiveRecommendation("increase-chest-volume", "Increase Chest Volume", "Medium", "Chest volume ต่ำกว่า recommended range", programDiff("Chest work", `${chestSets} sets/week`, `${VOLUME_LANDMARKS.Chest[0]}+ sets/week`, "เพิ่ม chest volume แบบค่อยเป็นค่อยไป")));
  }
  if (analysis.muscleBalance.status === "Needs Attention" && analysis.muscleBalance.raw?.push > analysis.muscleBalance.raw?.pull * 1.25) {
    recommendations.push(adaptiveRecommendation("replace-exercise", "Replace Exercise", "Medium", "Push volume สูงกว่า Pull มาก", programDiff("Push accessory", "Extra push exercise", "Row / pulldown / rear delt", "ปรับ balance โดยไม่เพิ่ม total fatigue มาก")));
  }
  if (analysis.missedWorkouts.count >= 2) {
    recommendations.push(adaptiveRecommendation("reduce-intensity", "Reduce Intensity", "Medium", `Missed workouts ${analysis.missedWorkouts.count} วันในสัปดาห์นี้`, programDiff("Weekly plan", `${analysis.trainingFrequency.planned} planned days`, `${Math.max(2, analysis.trainingFrequency.completed || analysis.trainingFrequency.planned - 1)} realistic days`, "ลดความถี่ให้ทำได้จริงก่อน")));
  }
  if (!recommendations.length) {
    recommendations.push(adaptiveRecommendation("maintain-current-program", "Maintain Current Program", "Ready", "Progress, recovery และ balance ยังอยู่ในช่วงที่รับได้", programDiff("Current Program", "Keep plan", "Maintain current program", "ยังไม่จำเป็นต้องแก้โปรแกรม")));
  }
  return recommendations;
}

function adaptiveRecommendation(type, action, priority, reason, diff) {
  return {
    id: `${type}-${normalizeExerciseName(diff?.exercise || action).replace(/\s+/g, "-")}`,
    type,
    action,
    priority,
    reason,
    suggestedAction: diff?.recommended || action,
    diff,
  };
}

function visibleAdaptiveRecommendation(recommendations) {
  const decisions = loadAdaptiveDecisions();
  const now = new Date();
  return recommendations.find((item) => {
    const decision = decisions[item.id];
    if (!decision) return true;
    if (decision.action === "dismiss") return false;
    if (decision.action === "remind") return decision.remindAt && new Date(decision.remindAt) <= now;
    return true;
  }) || null;
}

function renderProgramDiff(diff) {
  if (!diff) return "";
  return `
    <div class="program-diff">
      <strong>${escapeHtml(diff.exercise)}</strong>
      <span>${escapeHtml(diff.current)}</span>
      <b>↓</b>
      <span>${escapeHtml(diff.recommended)}</span>
      <small>${escapeHtml(diff.reason)}</small>
    </div>
  `;
}

function programDiff(exercise, current, recommended, reason) {
  return { exercise, current, recommended, reason };
}

function missedWorkoutAnalysis(program, records, weekDates) {
  const completed = new Set(records.filter((record) => weekDates.includes(record.date)).map((record) => weekdayName(record.date)));
  const scheduled = Object.keys(program.schedule || {}).filter((day) => program.schedule?.[day]);
  const missed = scheduled.filter((day) => !completed.has(day));
  return { count: missed.length, days: missed };
}

function findProgramExercise(name, program = activeProgram()) {
  const normalized = normalizeExerciseName(name);
  return (program.days || []).flatMap((day) => day.exercises || []).find((exercise) => normalizeExerciseName(exercise.name || exercise.nameTh) === normalized || normalizeExerciseName(exercise.nameTh || "") === normalized) || null;
}

function increaseRepText(reps) {
  const text = String(reps || "");
  const match = text.match(/\d+/g);
  if (!match) return text || "เพิ่ม reps";
  const last = Number(match[match.length - 1]) + 1;
  return match.length > 1 ? `${match[0]}-${last}` : String(last);
}

function coachEngine() {
  const today = dateKey(new Date());
  const analytics = trainingAnalyticsEngine();
  const overload = progressiveOverloadEngine();
  const program = activeProgram();
  const todayPlan = plannedWorkoutForDate(today, program);
  const todayFoods = foods.filter((food) => dateKey(new Date(food.createdAt)) === today);
  const todayEntries = entries.filter((entry) => dateKey(new Date(entry.createdAt)) === today);
  const todayLog = healthLogs[today] || {};
  const targets = nutritionTargets();
  const totals = dailyFoodTotals(todayFoods);
  const waterGoal = waterGoalForLog(todayLog);
  const waterLeft = Math.max(0, waterGoal - Number(todayLog.waterMl || 0));
  const proteinLeft = Math.max(0, targets.protein - totals.protein);
  const sleepHours = Number(todayLog.sleepHours || 0);
  const goal = coachGoal();
  const mostMuscle = topMuscle(analytics.weekly.muscles, "max");
  const leastMuscle = topMuscle(analytics.weekly.muscles, "min");
  const readiness = recoveryReadinessEngine();
  const recommendation = coachRecommendation(analytics, todayPlan, leastMuscle, goal, readiness);
  const emptyWorkout = analytics.records.length === 0;
  const message = emptyWorkout
    ? `เริ่มจากสร้างโปรแกรมและบันทึก workout แรกของคุณ โค้ชจะใช้ข้อมูลจริงเพื่อแนะนำแผนถัดไปสำหรับเป้าหมาย${goal.label}`
    : coachMessage(recommendation, analytics, todayPlan, leastMuscle, goal, readiness);
  const reminders = [
    recoveryNutritionCoachReminder(readiness, totals, targets, waterLeft, waterGoal, sleepHours),
    recoveryCoachReminder(analytics, readiness),
  ];
  const dailySummary = [
    { label: "Recovery", value: emptyWorkout ? "-" : `${analytics.recovery.score}%` },
    { label: "Fatigue", value: emptyWorkout ? "-" : `${analytics.fatigue.score}/100` },
    { label: "Weekly progress", value: `${analytics.weekly.totalSets} sets` },
    { label: "Current streak", value: `${overload.streak.current || analytics.streak.current} วัน` },
    { label: "Muscle balance", value: analytics.balance.status },
    { label: "Today's workout", value: todayPlan ? todayPlan.title.replace(/^Day \d+:\s*/, "") : "Rest / Open" },
  ];
  return {
    state: emptyWorkout ? "onboarding" : "active",
    message,
    recommendationType: recommendation.type,
    priority: recommendation.priority,
    dailySummary,
    reminders,
    weeklyReview: coachWeeklyReview(analytics, overload, mostMuscle, leastMuscle),
    motivation: coachMotivation(goal, analytics, recommendation),
    readiness,
  };
}

function coachGoal() {
  const programGoal = activeProgram()?.settings?.goal || activeProgram()?.goal || "";
  const raw = profile.activityLevel === "athlete" ? "athletic" : (profile.goal || programGoal || "health");
  const map = {
    muscle_gain: { key: "muscle_gain", label: "เพิ่มกล้าม", tone: "เน้น volume คุณภาพและ progressive overload" },
    fat_loss: { key: "fat_loss", label: "ลดไขมัน", tone: "เน้นความสม่ำเสมอ แคลอรี่ และ recovery" },
    strength: { key: "strength", label: "เพิ่มแรง", tone: "เน้นฟอร์ม น้ำหนักหลัก และพักให้พอ" },
    health: { key: "general_fitness", label: "สุขภาพทั่วไป", tone: "เน้นความต่อเนื่องและสมดุลทั้งตัว" },
    general_health: { key: "general_fitness", label: "สุขภาพทั่วไป", tone: "เน้นความต่อเนื่องและสมดุลทั้งตัว" },
    endurance: { key: "athletic", label: "Athletic", tone: "เน้น performance, conditioning และ recovery" },
    athletic: { key: "athletic", label: "Athletic", tone: "เน้น performance, conditioning และ recovery" },
  };
  return map[raw] || map.health;
}

function coachRecommendation(analytics, todayPlan, leastMuscle, goal, readiness = recoveryReadinessEngine()) {
  if (!analytics.records.length) return { type: "เริ่ม Onboarding", priority: "High" };
  if (["Rest Day", "Deload Week", "Recovery Session", "Mobility Session"].includes(readiness.trainingRecommendation.action)) return { type: readiness.trainingRecommendation.action, priority: "High" };
  if (readiness.trainingRecommendation.action === "Reduce Volume" || readiness.trainingRecommendation.action === "Reduce Intensity") return { type: readiness.trainingRecommendation.action, priority: "Medium" };
  if (analytics.recovery.score < 50 || analytics.fatigue.score >= 80) return { type: "Recommend Rest", priority: "High" };
  if (analytics.recovery.score < 70 || analytics.fatigue.score >= 65) return { type: "Reduce Volume", priority: "Medium" };
  if (analytics.balance.raw.push > analytics.balance.raw.pull * 1.35 && analytics.balance.raw.push >= 10) return { type: "Recommend Pull workout", priority: "Medium" };
  if (leastMuscle && leastMuscle.sets > 0 && leastMuscle.sets < (VOLUME_LANDMARKS[leastMuscle.name]?.[0] || 6)) return { type: `${leastMuscle.name} Focus`, priority: "Medium" };
  if (analytics.recovery.score >= 85 && analytics.fatigue.score < 45) return { type: goal.key === "strength" ? "Recommend Heavy Day" : "Progressive Day", priority: "Ready" };
  return { type: todayPlan ? "Follow Today's Program" : "Maintain", priority: "Ready" };
}

function coachMessage(recommendation, analytics, todayPlan, leastMuscle, goal, readiness = recoveryReadinessEngine()) {
  const planText = todayPlan ? todayPlan.title.replace(/^Day \d+:\s*/, "") : "open training day";
  if (["Rest Day", "Deload Week", "Recovery Session", "Mobility Session"].includes(recommendation.type)) return `${readiness.trainingReadiness} readiness (${readiness.recoveryScore}/100): ${readiness.trainingRecommendation.reason}`;
  if (["Reduce Volume", "Reduce Intensity"].includes(recommendation.type)) return `${readiness.trainingReadiness} readiness (${readiness.recoveryScore}/100): ${readiness.trainingRecommendation.reason} ถ้าซ้อมวันนี้ ให้คุม RPE และหยุดก่อนฟอร์มเสีย`;
  if (recommendation.type === "Recommend Rest") return `Recovery ${analytics.recovery.score}% และ fatigue ${analytics.fatigue.score}/100 วันนี้ควรพักหรือทำ mobility เบา ๆ เพื่อให้เป้าหมาย${goal.label}ไปต่อได้ดี`;
  if (recommendation.type === "Reduce Volume") return `Recovery อยู่ระดับ ${analytics.recovery.status} ลด volume ลงเล็กน้อย แล้วโฟกัสฟอร์มและ tempo ใน ${planText}`;
  if (recommendation.type === "Recommend Pull workout") return `Push volume เด่นกว่า Pull วันนี้ควรดึง balance กลับด้วย row, pulldown หรือ rear delt work`;
  if (recommendation.type.includes("Focus")) return `${leastMuscle.name} volume ต่ำกว่า range ตอนนี้ เพิ่มงานเฉพาะจุดแบบคุมฟอร์มจะช่วยให้สมดุลขึ้น`;
  if (recommendation.type === "Recommend Heavy Day") return `Recovery ${analytics.recovery.score}% พร้อมสำหรับ heavy day เลือกท่าหลักใน ${planText} และเก็บฟอร์มให้แน่น`;
  return `Recovery ${analytics.recovery.score}% · fatigue ${analytics.fatigue.score}/100 วันนี้ ${planText} เหมาะกับเป้าหมาย${goal.label}: ${goal.tone}`;
}

function nutritionCoachReminder(totals, targets, waterLeft, waterGoal, sleepHours) {
  const proteinLeft = Math.max(0, targets.protein - totals.protein);
  if (proteinLeft > targets.protein * 0.25) return { title: "Nutrition", text: `โปรตีนยังขาด ${Math.round(proteinLeft)}g จากเป้าหมายวันนี้` };
  if (totals.calories > targets.calories * 1.12) return { title: "Nutrition", text: `แคลอรี่เกินเป้าประมาณ ${Math.round(totals.calories - targets.calories)} kcal มื้อต่อไปเน้นโปรตีนลีน` };
  if (waterLeft > waterGoal * 0.35) return { title: "Hydration", text: `น้ำยังเหลือ ${(waterLeft / 1000).toFixed(1)}L เพื่อถึงเป้าหมายวันนี้` };
  if (sleepHours && sleepHours < 7) return { title: "Sleep", text: `เมื่อคืนได้นอน ${sleepHours.toFixed(1)} ชม. วันนี้เลี่ยง session หนักเกินไป` };
  return { title: "Nutrition", text: "อาหาร น้ำ และการนอนอยู่ในทางที่ดี รักษาจังหวะนี้ต่อ" };
}

function recoveryNutritionCoachReminder(readiness, totals, targets, waterLeft, waterGoal, sleepHours) {
  const recoveryNutrition = readiness.nutritionRecommendations[0];
  if (recoveryNutrition && recoveryNutrition.action !== "Maintain calories") return { title: "Nutrition", text: `${recoveryNutrition.action}: ${recoveryNutrition.reason}` };
  return nutritionCoachReminder(totals, targets, waterLeft, waterGoal, sleepHours);
}

function recoveryCoachReminder(analytics, readiness = recoveryReadinessEngine()) {
  if (!analytics.records.length) return { title: "Recovery", text: "ยังไม่มี workout history ให้ประเมิน เริ่มบันทึก session แรกก่อน" };
  if (readiness.alerts.length) return { title: "Recovery", text: `${readiness.alerts[0].type}: ${readiness.alerts[0].message}` };
  if (readiness.trainingRecommendation.action !== "Train Normally") return { title: "Recovery", text: `${readiness.trainingRecommendation.action}: ${readiness.trainingRecommendation.reason}` };
  const latest = analytics.records.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  const trainedLegs = latest?.muscles?.some((muscle) => ["Glutes", "Quads", "Hamstrings", "Calves"].includes(muscle));
  if (trainedLegs && analytics.recovery.score < 70) return { title: "Recovery", text: "คุณเพิ่งซ้อมขาและ recovery ยังปานกลาง วันนี้เลี่ยง heavy leg session" };
  if (analytics.recovery.score >= 85) return { title: "Recovery", text: "Recovery สูง เหมาะกับ session ที่ต้องการคุณภาพและ focus สูง" };
  return { title: "Recovery", text: `Recovery ${analytics.recovery.status} ใช้ warm-up ให้พอและคุม RPE` };
}

function coachWeeklyReview(analytics, overload, mostMuscle, leastMuscle) {
  const consistency = analytics.records.length ? `${overload.weekly.workouts || 0} workouts ใน 7 วัน` : "ยังไม่มี workout สัปดาห์นี้";
  const weak = analytics.weakPoints[0]?.title || (leastMuscle ? `${leastMuscle.name} volume ต่ำ` : "ยังไม่มีข้อมูลพอ");
  const improvement = overload.summary?.improved ? `${overload.summary.improved} exercises improved` : `${analytics.weekly.totalSets} sets สะสม`;
  return [
    { title: "Best improvement", text: improvement },
    { title: "Weak point", text: weak },
    { title: "Most trained muscle", text: mostMuscle ? `${mostMuscle.name} ${mostMuscle.sets} sets` : "ยังไม่มีข้อมูล" },
    { title: "Least trained muscle", text: leastMuscle ? `${leastMuscle.name} ${leastMuscle.sets} sets` : "ยังไม่มีข้อมูล" },
    { title: "Training consistency", text: consistency },
  ];
}

function coachMotivation(goal, analytics, recommendation) {
  if (!analytics.records.length) return `เริ่มจาก session แรก แล้ว Khayubdi จะช่วยอ่านทิศทางให้ชัดขึ้นทีละวัน`;
  if (recommendation.type === "Recommend Rest") return `พักให้ดีคือส่วนหนึ่งของการพัฒนา วันนี้ซ่อมร่างกายเพื่อกลับมาแรงกว่าเดิม`;
  if (goal.key === "muscle_gain") return `เก็บ set คุณภาพอีกนิด กล้ามโตจากความสม่ำเสมอที่วัดได้จริง`;
  if (goal.key === "fat_loss") return `วันนี้ชนะด้วยการทำสิ่งพื้นฐานให้ครบ: ขยับ กินถึงโปรตีน และดื่มน้ำ`;
  if (goal.key === "strength") return `แรงขึ้นจาก reps ที่ซื่อสัตย์ ฟอร์มแน่น และพักพอ`;
  return `ทำวันนี้ให้ดีกว่าเมื่อวานเล็กน้อย พอสะสมแล้วผลลัพธ์จะชัดเอง`;
}

function topMuscle(muscles, mode) {
  const list = Object.entries(muscles || {}).filter(([, sets]) => Number(sets) > 0).map(([name, sets]) => ({ name, sets: Number(sets) }));
  if (!list.length) return null;
  return list.sort((a, b) => mode === "min" ? a.sets - b.sets : b.sets - a.sets)[0];
}

function renderCoachChat() {
  if (!fields.chatHistory) return;
  const suggestions = suggestedCoachQuestions();
  fields.chatStatus.textContent = `${chatMessages.length} messages`;
  fields.personaChips.forEach((button) => button.classList.toggle("active", button.dataset.persona === coachPersona));
  fields.suggestedQuestions.innerHTML = suggestions.map((question) => `<button class="suggestion-chip" data-question="${escapeHtml(question)}" type="button">${escapeHtml(question)}</button>`).join("");
  if (!chatMessages.length) {
    fields.chatHistory.innerHTML = `
      <div class="chat-empty-state">
        <strong>เริ่มคุยกับโค้ชได้เลย</strong>
        <span>ถามเรื่อง recovery, workout วันนี้, โปรตีน, น้ำ, การนอน หรือ progress ได้ โค้ชจะใช้ข้อมูลจริงใน Khayubdi เท่านั้น</span>
      </div>
    `;
    fields.quickReplies.innerHTML = suggestions.slice(0, 3).map((question) => `<button class="quick-reply" data-reply="${escapeHtml(question)}" type="button">${escapeHtml(question)}</button>`).join("");
    return;
  }
  fields.chatHistory.innerHTML = chatMessages.map((message) => `
    <article class="chat-message ${message.role} ${message.pending ? "thinking" : ""}">
      <div>${escapeHtml(message.text)}</div>
      <time>${formatChatTime(message.createdAt)}</time>
    </article>
  `).join("");
  const replies = chatMessages.slice().reverse().find((message) => message.role === "coach")?.quickReplies || suggestions.slice(0, 3);
  fields.quickReplies.innerHTML = replies.map((reply) => `<button class="quick-reply" data-reply="${escapeHtml(reply)}" type="button">${escapeHtml(reply)}</button>`).join("");
  scrollCoachChatToBottom();
}

async function sendCoachChatMessage(text) {
  const clean = String(text || "").trim();
  if (!clean) return;
  const now = new Date().toISOString();
  const pendingId = `thinking-${Date.now()}`;
  chatMessages.push({ role: "user", text: clean, createdAt: now });
  chatMessages.push({ id: pendingId, role: "coach", text: "Thinking...", intent: "thinking", quickReplies: [], pending: true, createdAt: new Date().toISOString() });
  saveCoachChat();
  if (fields.coachChatInput) fields.coachChatInput.value = "";
  renderCoachChat();
  const reply = await conversationEngine(clean);
  chatMessages = chatMessages.filter((message) => message.id !== pendingId);
  chatMessages.push({ role: "coach", text: reply.text, intent: reply.intent, quickReplies: reply.quickReplies, provider: reply.provider, fallback: reply.fallback, createdAt: new Date().toISOString() });
  chatMessages = chatMessages.slice(-80);
  saveCoachChat();
  renderCoachChat();
}

async function conversationEngine(message) {
  const intent = detectCoachIntent(message);
  const parsedProgramRequest = programRequestFromChat(message);
  if (parsedProgramRequest && isProgramDraftCommand(message)) {
    applyProgramRequestToForm(parsedProgramRequest);
    generateAiProgramDraft(parsedProgramRequest);
    return {
      provider: "ProgramRequestParser",
      intent: "program",
      text: `สร้าง Draft Program ${goalLabel(parsedProgramRequest.goal)} ${parsedProgramRequest.days} วัน/สัปดาห์ สำหรับ ${equipmentLabel(parsedProgramRequest.equipment)} แล้ว กรุณาเปิด Workout > Program Builder เพื่อตรวจสอบคำเตือนและกด Approve Draft โปรแกรมปัจจุบันยังไม่ถูกเปลี่ยน`,
      quickReplies: ["เปิด Draft Program", "Regenerate Draft", "โปรแกรมนี้คำนึงถึงอาการบาดเจ็บอย่างไร?"],
    };
  }
  const parsedNutritionRequest = nutritionRequestFromChat(message);
  if (parsedNutritionRequest && isNutritionDraftCommand(message)) {
    applyNutritionRequestToForm(parsedNutritionRequest);
    generateNutritionDraft(parsedNutritionRequest);
    return {
      provider: "NutritionRequestParser",
      intent: "nutrition",
      text: `สร้าง Draft Meal Plan ${nutritionStrategyLabel(parsedNutritionRequest.strategy)} ${parsedNutritionRequest.mealsPerDay} มื้อ/วันแล้ว กรุณาเปิด Food > AI Nutrition Planner เพื่อตรวจสอบคำเตือนและกด Approve Draft บันทึกอาหารและแผนเดิมยังไม่ถูกเปลี่ยน`,
      quickReplies: ["เปิด Nutrition Draft", "Regenerate Draft", "แผนนี้คำนึงถึงอาหารที่แพ้อย่างไร?"],
    };
  }
  const coachState = coachEngine();
  const promptObject = promptBuilder(message, intent, coachState);
  return await AIProvider.generateResponse(promptObject);
}

function promptBuilder(question, intent = "general", coachState = coachEngine()) {
  const analytics = trainingAnalyticsEngine();
  const today = dateKey(new Date());
  const todayPlan = plannedWorkoutForDate(today, activeProgram());
  const todayFoods = foods.filter((food) => dateKey(new Date(food.createdAt)) === today);
  const foodTotals = dailyFoodTotals(todayFoods);
  const targets = nutritionTargets();
  const log = healthLogs[today] || {};
  const waterGoal = waterGoalForLog(log);
  const sleepHours = Number(log.sleepHours || 0);
  const adaptive = adaptiveTrainingEngine();
  const adaptiveRecommendation = visibleAdaptiveRecommendation(adaptive.recommendations) || adaptive.recommendations[0] || null;
  const readiness = recoveryReadinessEngine(recoveryOverridesFromMessage(question));
  const habit = habitAdherenceEngine();
  const prediction = progressPredictionEngine(predictionContextFromMessage(question));
  const notifications = smartNotificationEngine();
  return {
    intent,
    persona: coachPersona,
    question: String(question || ""),
    goal: coachGoal(),
    recovery: analytics.recovery,
    readiness,
    habit,
    prediction,
    notifications,
    fatigue: analytics.fatigue,
    weeklyVolume: analytics.weekly.totalSets,
    todayWorkout: todayPlan ? todayPlan.title.replace(/^Day \d+:\s*/, "") : "ยังไม่มี workout ที่ตั้งไว้วันนี้",
    coachRecommendation: coachState.recommendationType,
    nutrition: {
      calories: foodTotals.calories,
      protein: foodTotals.protein,
      proteinTarget: targets.protein,
      water: Number(log.waterMl || 0),
      waterTarget: waterGoal,
      waterRemaining: Math.max(0, waterGoal - Number(log.waterMl || 0)),
      sleep: sleepHours,
    },
    coach: {
      state: coachState.state,
      message: coachState.message,
      recommendationType: coachState.recommendationType,
      priority: coachState.priority,
      motivation: coachState.motivation,
      reminders: coachState.reminders,
    },
    proteinLeft: Math.max(0, targets.protein - foodTotals.protein),
    waterLeft: Math.max(0, waterGoal - Number(log.waterMl || 0)),
    sleepHours,
    weeklySets: analytics.weekly.totalSets,
    balance: analytics.balance.status,
    topWeakPoint: analytics.weakPoints[0],
    adaptive: {
      plateau: adaptive.plateau,
      missedWorkouts: adaptive.missedWorkouts,
      trainingFrequency: adaptive.trainingFrequency,
      recommendation: adaptiveRecommendation,
    },
    trainer: trainerPromptSummary(),
  };
}

function coachConversationContext(question = "", intent = "general") {
  return promptBuilder(question, intent, coachEngine());
}

function detectCoachIntent(message) {
  const text = normalizeExerciseName(message);
  const rules = [
    { intent: "trainer", words: ["trainer", "client", "clients", "ลูกค้า", "plateauing", "missed workouts", "low compliance", "compliance"] },
    { intent: "habit", words: ["keep missing", "missing workouts", "miss workouts", "skipping workouts", "skip leg", "skip leg day", "don't have time", "dont have time", "no time", "lose motivation", "habit", "adherence", "consistency", "ไม่ค่อยมีเวลา", "ขาดซ้อม", "ข้าม", "ไม่มีเวลา", "หมดไฟ"] },
    { intent: "prediction", words: ["when will i reach my goal", "reach my goal", "lose 5 kg", "two months", "gain muscle", "how long until", "prediction", "predict", "forecast", "projection", "timeline", "goal probability", "จะถึงเป้า", "อีกนานไหม"] },
    { intent: "notifications", words: ["what should i do today", "anything important", "any notifications", "notifications", "notification", "แจ้งเตือน", "มีอะไรสำคัญ", "วันนี้ควรทำอะไร"] },
    { intent: "adaptive", words: ["why", "recommend", "recommendation", "แนะนำ", "ทำไม", "เพราะอะไร", "ปรับโปรแกรม", "adaptive"] },
    { intent: "nutrition", words: ["protein", "โปรตีน", "calorie", "kcal", "แคล", "อาหาร", "กิน", "water", "น้ำ"] },
    { intent: "recovery", words: ["can i train today", "train today", "ready to train", "readiness", "recovery", "ฟื้น", "พัก", "sleep", "slept", "นอน", "sore", "เจ็บ", "ล้า", "exhausted"] },
    { intent: "fatigue", words: ["fatigue", "เหนื่อย", "ล้า", "deload", "หนักไป", "เพลีย", "exhausted"] },
    { intent: "workout", words: ["train", "workout", "ซ้อม", "ออกกำลัง", "เล่นอะไร", "วันนี้ควร"] },
    { intent: "program", words: ["program", "โปรแกรม", "แผน", "ตาราง", "push", "pull", "legs", "hypertrophy", "strength", "dumbbell", "ดัมเบล", "train 3", "train 4", "train 5"] },
    { intent: "progress", words: ["progress", "พัฒนา", "คืบหน้า", "น้ำหนัก", "สถิติ", "trend"] },
    { intent: "motivation", words: ["motivation", "กำลังใจ", "ขี้เกียจ", "ไม่อยาก", "ฮึด", "ท้อ"] },
  ];
  return rules.find((rule) => rule.words.some((word) => text.includes(normalizeExerciseName(word))))?.intent || "general";
}

function createLocalRuleProvider() {
  return {
    name: "LocalRuleProvider",
    generateResponse(promptObject) {
      const text = applyCoachPersona(localRuleResponseText(promptObject.intent, promptObject), promptObject.persona);
      return {
        provider: this.name,
        intent: promptObject.intent,
        text,
        quickReplies: localRuleQuickReplies(promptObject.intent, promptObject),
      };
    },
  };
}

function createOpenAIProvider(config, fallbackProvider = createLocalRuleProvider()) {
  return {
    name: "OpenAIProvider",
    async generateResponse(promptObject) {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), Number(config.timeoutMs || DEFAULT_AI_CONFIG.timeoutMs));
      try {
        const response = await fetch(config.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${config.apiKey}`,
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: config.model,
            input: openAIPromptInput(promptObject),
            temperature: Number(config.temperature ?? DEFAULT_AI_CONFIG.temperature),
            max_output_tokens: Number(config.maxTokens || DEFAULT_AI_CONFIG.maxTokens),
            store: false,
          }),
        });
        if (!response.ok) throw new Error(`OpenAI ${response.status}`);
        const data = await response.json();
        const text = extractOpenAIText(data);
        if (!text) throw new Error("OpenAI empty response");
        return {
          provider: this.name,
          intent: promptObject.intent,
          text,
          quickReplies: localRuleQuickReplies(promptObject.intent, promptObject),
        };
      } catch (error) {
        const fallback = fallbackProvider.generateResponse(promptObject);
        return { ...fallback, fallback: this.name, errorType: openAIErrorType(error) };
      } finally {
        window.clearTimeout(timer);
      }
    },
  };
}

function aiConfiguration() {
  const runtimeConfig = window.KHAYUBDI_AI_CONFIG || {};
  let savedConfig = {};
  try { savedConfig = JSON.parse(localStorage.getItem(AI_CONFIG_KEY) || "{}"); } catch {}
  return { ...DEFAULT_AI_CONFIG, ...savedConfig, ...runtimeConfig };
}

function isOpenAIConfigured(config) {
  return String(config.provider || "").toLowerCase() === "openai" && Boolean(String(config.apiKey || "").trim());
}

function openAIPromptInput(promptObject) {
  const safePrompt = sanitizePromptForProvider(promptObject);
  return [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: "You are Khayubdi, a concise Thai fitness coach. Use only the provided fitness context. Do not invent workout history, medical claims, or analytics. Return a plain Thai response with practical next steps.",
        },
      ],
    },
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: JSON.stringify(safePrompt),
        },
      ],
    },
  ];
}

function sanitizePromptForProvider(promptObject) {
  return {
    intent: promptObject.intent,
    persona: promptObject.persona,
    goal: promptObject.goal,
    recovery: promptObject.recovery,
    readiness: promptObject.readiness,
    habit: promptObject.habit,
    prediction: promptObject.prediction,
    notifications: promptObject.notifications,
    fatigue: promptObject.fatigue,
    weeklyVolume: promptObject.weeklyVolume,
    todayWorkout: promptObject.todayWorkout,
    coachRecommendation: promptObject.coachRecommendation,
    nutrition: promptObject.nutrition,
    adaptive: promptObject.adaptive,
    trainer: promptObject.trainer,
    balance: promptObject.balance,
    topWeakPoint: promptObject.topWeakPoint,
    question: promptObject.question,
  };
}

function extractOpenAIText(data) {
  if (data?.output_text) return String(data.output_text).trim();
  const text = (data?.output || [])
    .flatMap((item) => item.content || [])
    .map((part) => part.text || "")
    .join(" ")
    .trim();
  return text;
}

function openAIErrorType(error) {
  if (error?.name === "AbortError") return "timeout";
  const message = String(error?.message || "");
  if (message.includes("401")) return "unauthorized";
  if (message.includes("403")) return "forbidden";
  if (message.includes("429")) return "rate_limited";
  if (message.includes("500")) return "server_error";
  return "network_or_provider_error";
}

function localRuleResponseText(intent, promptObject) {
  const weak = promptObject.topWeakPoint ? `${promptObject.topWeakPoint.title}: ${promptObject.topWeakPoint.suggestion}` : "ยังไม่มี weak point ชัดเจน";
  const adaptive = promptObject.adaptive?.recommendation;
  const adaptiveDiff = adaptive?.diff ? ` ปรับจาก ${adaptive.diff.current} เป็น ${adaptive.diff.recommended} เพราะ ${adaptive.diff.reason}.` : "";
  const base = {
    trainer: trainerLocalRuleResponse(promptObject),
    habit: habitResponseText(promptObject),
    prediction: predictionResponseText(promptObject),
    notifications: notificationResponseText(promptObject),
    adaptive: adaptive ? `คำแนะนำคือ ${adaptive.action}. เหตุผล: ${adaptive.reason}.${adaptiveDiff} ระบบนี้เป็น recommendation only ต้องให้คุณกด Accept ก่อน และจะไม่แก้โปรแกรมอัตโนมัติ` : "ตอนนี้ยังไม่มีคำแนะนำปรับโปรแกรมใหม่ เพราะข้อมูลยังไม่ชี้ว่าต้องเปลี่ยนแผน ให้บันทึก workout ต่อเนื่องเพื่อให้ระบบอ่านแนวโน้มได้แม่นขึ้น",
    workout: `วันนี้แผนคือ ${promptObject.todayWorkout}. Recovery ${promptObject.recovery.score}% และ fatigue ${promptObject.fatigue.score}/100. คำแนะนำตอนนี้คือ ${promptObject.coachRecommendation}.`,
    nutrition: `วันนี้กินไป ${promptObject.nutrition.calories} kcal และโปรตีน ${promptObject.nutrition.protein}g จากเป้า ${promptObject.nutrition.proteinTarget}g. ${promptObject.proteinLeft > 0 ? `ยังขาดโปรตีน ${promptObject.proteinLeft}g` : "โปรตีนถึงเป้าแล้ว"} และน้ำยังเหลือ ${(promptObject.nutrition.waterRemaining / 1000).toFixed(1)}L.`,
    recovery: readinessResponseText(promptObject),
    fatigue: readinessResponseText(promptObject),
    progress: `สัปดาห์นี้สะสม ${promptObject.weeklyVolume} muscle sets, balance คือ ${promptObject.balance}. ${weak}`,
    program: `โปรแกรมปัจจุบันแนะนำให้ตาม ${promptObject.todayWorkout}. ถ้า balance เป็น Needs Attention ให้เลือก session ที่เสริมฝั่งอ่อนก่อน เช่น Pull หรือ muscle focus.`,
    motivation: promptObject.coach.motivation,
    general: `${promptObject.coach.message} ถามต่อได้เรื่อง workout, recovery, nutrition, progress หรือ program.`,
  };
  return base[intent] || base.general;
}

function applyCoachPersona(text, persona) {
  if (persona === "professional") return `สรุปแบบโค้ช: ${text} โฟกัสข้อมูลจริงและทำตามแผนที่เหมาะกับ recovery วันนี้`;
  if (persona === "motivational") return `${text} วันนี้ไม่ต้องสมบูรณ์แบบ แค่ทำสิ่งสำคัญให้ครบหนึ่งอย่างก็ชนะแล้ว`;
  return `โอเคครับ ${text}`;
}

function localRuleQuickReplies(intent, promptObject) {
  const common = ["วันนี้ควรซ้อมอะไรดี?", "Recovery เป็นยังไง?", "โปรตีนพอไหม?"];
  const map = {
    workout: ["ควรลด volume ไหม?", "วันนี้เล่น Push/Pull/Legs ดี?", "ดู weak point ให้หน่อย"],
    nutrition: ["โปรตีนพอไหม?", "น้ำวันนี้เหลือเท่าไหร่?", "แคลวันนี้โอเคไหม?"],
    recovery: ["ควรพักไหม?", "Fatigue สูงไหม?", "นอนมีผลยังไง?"],
    fatigue: ["ควร deload ไหม?", "วันนี้ซ้อมเบาแค่ไหน?", "Recovery เป็นยังไง?"],
    progress: ["Weak point คืออะไร?", "สัปดาห์นี้ดีขึ้นไหม?", "Muscle balance เป็นไง?"],
    program: ["วันนี้ควรซ้อมอะไรดี?", "โปรแกรมเหมาะกับเป้าหมายไหม?", "ควรเล่น Pull ไหม?"],
    adaptive: ["ทำไมถึงแนะนำแบบนี้?", "ควร Accept ไหม?", "มี plateau ตรงไหน?"],
    trainer: ["Which clients are plateauing?", "Who missed workouts this week?", "Show low compliance clients"],
    habit: ["ทำยังไงให้ไม่พลาด workout?", "ควรลดวันซ้อมไหม?", "เวลาไหนเหมาะสุด?"],
    prediction: ["เมื่อไหร่จะถึงเป้า?", "เสี่ยงพลาดเป้าตรงไหน?", "ควรปรับอะไรให้ถึงเป้า?"],
    notifications: ["มีอะไรสำคัญไหม?", "เปิด Recovery", "ถามโค้ชต่อ"],
    motivation: ["ขอกำลังใจอีกนิด", "เริ่มแบบง่ายสุดคืออะไร?", "วันนี้ทำอะไรให้ชนะ?"],
  };
  const replies = map[intent] || common;
  if (promptObject.readiness?.recoveryScore < 60) return ["ควรพักไหม?", "วันนี้ซ้อมเบาแค่ไหน?", "ทำ recovery ยังไงดี?"];
  return replies.slice(0, 4);
}

function readinessResponseText(promptObject) {
  const readiness = promptObject.readiness || recoveryReadinessEngine();
  const nutrition = readiness.nutritionRecommendations.map((item) => item.action).slice(0, 2).join(", ");
  const alerts = readiness.alerts.length ? ` Alerts: ${readiness.alerts.map((alert) => alert.type).join(", ")}.` : "";
  return `Readiness ${readiness.recoveryScore}/100 (${readiness.trainingReadiness}). Recommendation: ${readiness.trainingRecommendation.action}. Reason: ${readiness.trainingRecommendation.reason} Nutrition: ${nutrition}.${alerts} This is fitness guidance only and nothing is changed automatically.`;
}

function habitResponseText(promptObject) {
  const habit = promptObject.habit || habitAdherenceEngine();
  const insight = habit.behaviorInsights[0];
  const recommendation = habit.recommendations[0];
  const alerts = habit.alerts.length ? ` Alert: ${habit.alerts[0].type}.` : "";
  return `Habit adherence ${habit.adherenceScore}/100 (${habit.category}). Workout ${habit.profile.workoutAdherence}% and nutrition ${habit.profile.mealAdherence}%. Top insight: ${insight.type}: ${insight.message} Recommendation: ${recommendation.action} because ${recommendation.reason}.${alerts} This is behavior coaching only and nothing is changed automatically.`;
}

function predictionResponseText(promptObject) {
  const prediction = promptObject.prediction || progressPredictionEngine(predictionContextFromMessage(promptObject.question));
  const week8 = prediction.projections.ranges.find((range) => range.weeks === 8);
  const week12 = prediction.projections.ranges.find((range) => range.weeks === 12);
  const range8 = week8?.weightKgRange ? `${week8.weightKgRange[0]}-${week8.weightKgRange[1]}kg in 8 weeks` : "not enough weight data for an 8-week weight range";
  const range12 = week12?.weightKgRange ? `${week12.weightKgRange[0]}-${week12.weightKgRange[1]}kg in 12 weeks` : "not enough weight data for a 12-week weight range";
  const question = prediction.projections.questionEstimate ? ` Requested target looks ${prediction.projections.questionEstimate.feasibility.toLowerCase()} based on a needed ${prediction.projections.questionEstimate.requiredWeeklyRateKg}kg/week change.` : "";
  const risk = prediction.risks[0];
  const recommendation = prediction.recommendations[0];
  return `Progress prediction for ${goalLabel(prediction.profile.currentGoal)}: ${range8}; ${range12}. Goal success probability is ${prediction.goalProbability.label} (${prediction.goalProbability.score}/100) because ${prediction.goalProbability.reasons.join(", ")}. Top risk: ${risk.type} - ${risk.reason}. Recommendation: ${recommendation.action} because ${recommendation.reason}.${question} These are estimates only, not guarantees, and nothing is changed automatically.`;
}

function notificationResponseText(promptObject) {
  const center = promptObject.notifications || smartNotificationEngine();
  const top = center.notifications[0];
  if (!top) return "No urgent notifications right now. Keep logging workouts, meals, recovery, and weight so I can coach from real data. Nothing is changed automatically.";
  return `You have ${center.unreadCount} unread notification${center.unreadCount === 1 ? "" : "s"}. Most important: ${top.title} - ${top.message} Suggested action: ${top.action.label}. Weekly summary: ${center.weeklySummary.recommendation}. These are supportive recommendations only; no workouts, nutrition plans, or user data are changed automatically.`;
}

function recoveryOverridesFromMessage(message) {
  const text = normalizeExerciseName(message);
  const overrides = {};
  const numberWords = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9 };
  const digitSleep = text.match(/(?:slept|sleep|นอน)[^\d]*(\d+(?:\.\d+)?)/);
  const wordSleep = Object.entries(numberWords).find(([word]) => text.includes(`${word} hour`) || text.includes(`${word} hours`));
  if (digitSleep) overrides.sleepHours = Number(digitSleep[1]);
  else if (wordSleep) overrides.sleepHours = wordSleep[1];
  if (text.includes("very sore") || text.includes("so sore") || text.includes("เจ็บมาก")) overrides.muscleSoreness = 5;
  else if (text.includes("sore") || text.includes("เจ็บ")) overrides.muscleSoreness = 4;
  if (text.includes("exhausted") || text.includes("very tired") || text.includes("เพลียมาก")) overrides.fatigue = 5;
  else if (text.includes("fatigue") || text.includes("tired") || text.includes("ล้า") || text.includes("เพลีย")) overrides.fatigue = 4;
  if (text.includes("stress") || text.includes("เครียด")) overrides.stress = 4;
  return overrides;
}

function suggestedCoachQuestions() {
  return ["How is my recovery?", "What should I train today?", "Am I eating enough protein?", "Which clients need review?"];
}

function scrollCoachChatToBottom() {
  if (!fields.chatHistory) return;
  fields.chatHistory.scrollTop = fields.chatHistory.scrollHeight;
}

function formatChatTime(value) {
  const date = value ? new Date(value) : new Date();
  return date.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
}

function renderFoodSummary() {
  const today = dateKey(new Date());
  const todayFoods = foods.filter((food) => dateKey(new Date(food.createdAt)) === today);
  const totals = dailyFoodTotals(todayFoods);
  fields.todayFoodCalories.textContent = totals.calories;
  fields.todayProtein.textContent = `${totals.protein}g`;
  fields.todayMeals.textContent = todayFoods.length;
  renderNutritionSummary(todayFoods);
}

function dailyFoodTotals(items) {
  return {
    calories: sum(items, "calories"),
    protein: sum(items, "protein"),
    carbs: sum(items, "carbs"),
    fat: sum(items, "fat"),
    fiber: sum(items, "fiber"),
  };
}

function makeExercise(id, nameTh, nameEn, primaryMuscle, secondaryMuscles, movementPattern, equipment, difficulty, goals, sets, reps, rest, instructions, commonMistakes, safetyNote, tempo = "2-0-2") {
  return {
    id,
    nameTh,
    nameEn,
    primaryMuscle,
    secondaryMuscles,
    movementPattern,
    equipment,
    difficulty,
    suitableGoals: goals,
    instructions,
    commonMistakes,
    safetyNote,
    defaultSets: sets,
    defaultReps: reps,
    defaultRestSeconds: rest,
    tempo,
  };
}

function buildExerciseCatalog() {
  const all = ["fat_loss", "muscle_gain", "strength", "general_health", "beginner"];
  const fit = (list) => list;
  const cue = "ตั้งลำตัวให้มั่นคง เคลื่อนไหวเต็มช่วงที่ควบคุมได้ และหายใจสม่ำเสมอ";
  const mistakes = "รีบเกินไป ใช้แรงเหวี่ยง หรือปล่อยให้ข้อต่อเสียแนว";
  const safe = "หยุดทันทีถ้ามีอาการเจ็บแปลบ และลดน้ำหนักหรือช่วงการเคลื่อนไหวเมื่อฟอร์มเสีย";
  return [
    makeExercise("bodyweight-squat", "สควอตน้ำหนักตัว", "Bodyweight Squat", "Quadriceps", ["Glutes", "Core"], "Squat", ["Bodyweight"], "Beginner", all, 2, "10-15", 60, cue, mistakes, safe),
    makeExercise("goblet-squat", "กอบเล็ตสควอต", "Goblet Squat", "Quadriceps", ["Glutes", "Core"], "Squat", ["Dumbbell", "Minimal Equipment"], "Beginner", all, 3, "8-12", 75, cue, mistakes, safe),
    makeExercise("back-squat", "บาร์เบลแบ็กสควอต", "Back Squat", "Quadriceps", ["Glutes", "Hamstrings", "Core"], "Squat", ["Barbell"], "Intermediate", fit(["muscle_gain", "strength"]), 4, "4-8", 120, cue, mistakes, safe),
    makeExercise("front-squat", "ฟรอนต์สควอต", "Front Squat", "Quadriceps", ["Core", "Glutes"], "Squat", ["Barbell"], "Advanced", fit(["muscle_gain", "strength"]), 4, "4-8", 120, cue, mistakes, safe),
    makeExercise("leg-press", "เลกเพรส", "Leg Press", "Quadriceps", ["Glutes"], "Squat", ["Machine"], "Beginner", fit(["muscle_gain", "strength", "beginner"]), 3, "10-12", 90, cue, mistakes, safe),
    makeExercise("tempo-squat", "เทมโปสควอต", "Tempo Squat", "Quadriceps", ["Glutes", "Core"], "Squat", ["Bodyweight"], "Beginner", fit(["fat_loss", "general_health", "beginner"]), 3, "8-12", 60, cue, mistakes, safe, "3-1-2"),
    makeExercise("romanian-deadlift", "โรมาเนียนเดดลิฟต์", "Romanian Deadlift", "Hamstrings", ["Glutes", "Back"], "Hinge", ["Barbell", "Dumbbell"], "Intermediate", fit(["muscle_gain", "strength"]), 3, "6-10", 90, cue, mistakes, safe),
    makeExercise("db-rdl", "ดัมเบลโรมาเนียนเดดลิฟต์", "Dumbbell Romanian Deadlift", "Hamstrings", ["Glutes", "Back"], "Hinge", ["Dumbbell", "Minimal Equipment"], "Beginner", all, 3, "8-12", 75, cue, mistakes, safe),
    makeExercise("hip-hinge", "ฮิปฮินจ์", "Hip Hinge", "Hamstrings", ["Glutes", "Core"], "Hinge", ["Bodyweight"], "Beginner", fit(["general_health", "beginner", "fat_loss"]), 2, "10-12", 60, cue, mistakes, safe),
    makeExercise("hip-thrust", "ฮิปทรัสต์", "Hip Thrust", "Glutes", ["Hamstrings", "Core"], "Hinge", ["Barbell", "Bench"], "Intermediate", fit(["muscle_gain", "strength"]), 3, "8-12", 90, cue, mistakes, safe),
    makeExercise("glute-bridge", "กลูตบริดจ์", "Glute Bridge", "Glutes", ["Hamstrings", "Core"], "Hinge", ["Bodyweight"], "Beginner", all, 3, "12-15", 60, cue, mistakes, safe),
    makeExercise("deadlift", "เดดลิฟต์", "Deadlift", "Hamstrings", ["Glutes", "Back", "Core"], "Hinge", ["Barbell"], "Advanced", fit(["strength"]), 3, "3-5", 150, cue, mistakes, "ไม่เหมาะกับผู้เริ่มต้นที่ยังควบคุมหลังไม่ได้"),
    makeExercise("bench-press", "เบนช์เพรส", "Bench Press", "Chest", ["Triceps", "Shoulders"], "Horizontal Push", ["Barbell", "Bench"], "Intermediate", fit(["muscle_gain", "strength"]), 4, "5-10", 120, cue, mistakes, safe),
    makeExercise("db-bench-press", "ดัมเบลเบนช์เพรส", "Dumbbell Bench Press", "Chest", ["Triceps", "Shoulders"], "Horizontal Push", ["Dumbbell", "Bench"], "Beginner", all, 3, "8-12", 90, cue, mistakes, safe),
    makeExercise("push-up", "วิดพื้น", "Push up", "Chest", ["Triceps", "Core"], "Horizontal Push", ["Bodyweight"], "Beginner", all, 3, "8-15", 60, cue, mistakes, safe),
    makeExercise("incline-push-up", "วิดพื้นพิงม้านั่ง", "Incline Push up", "Chest", ["Triceps"], "Horizontal Push", ["Bodyweight", "Bench"], "Beginner", fit(["beginner", "general_health", "fat_loss"]), 2, "8-12", 60, cue, mistakes, safe),
    makeExercise("machine-chest-press", "แมชชีนเชสต์เพรส", "Machine Chest Press", "Chest", ["Triceps"], "Horizontal Push", ["Machine"], "Beginner", fit(["beginner", "muscle_gain"]), 3, "10-12", 75, cue, mistakes, safe),
    makeExercise("cable-fly", "เคเบิลฟลาย", "Cable Fly", "Chest", ["Shoulders"], "Horizontal Push", ["Cable"], "Intermediate", fit(["muscle_gain"]), 3, "12-15", 60, cue, mistakes, safe),
    makeExercise("overhead-press", "โอเวอร์เฮดเพรส", "Overhead Press", "Shoulders", ["Triceps", "Core"], "Vertical Push", ["Barbell", "Dumbbell"], "Intermediate", fit(["muscle_gain", "strength"]), 3, "5-10", 120, cue, mistakes, safe),
    makeExercise("db-shoulder-press", "ดัมเบลชอลเดอร์เพรส", "Dumbbell Shoulder Press", "Shoulders", ["Triceps"], "Vertical Push", ["Dumbbell"], "Beginner", all, 3, "8-12", 75, cue, mistakes, safe),
    makeExercise("pike-push-up", "ไพค์พุชอัพ", "Pike Push up", "Shoulders", ["Triceps", "Core"], "Vertical Push", ["Bodyweight"], "Intermediate", fit(["general_health", "fat_loss"]), 3, "6-10", 75, cue, mistakes, safe),
    makeExercise("lateral-raise", "แลทเทอรัลเรส", "Lateral Raise", "Shoulders", [], "Vertical Push", ["Dumbbell", "Cable"], "Beginner", fit(["muscle_gain", "general_health"]), 3, "12-15", 45, cue, mistakes, safe),
    makeExercise("lat-pulldown", "แลทพูลดาวน์", "Lat Pulldown", "Back", ["Biceps"], "Vertical Pull", ["Machine", "Cable"], "Beginner", all, 3, "8-12", 75, cue, mistakes, safe),
    makeExercise("pull-up", "พูลอัพ", "Pull up", "Back", ["Biceps", "Core"], "Vertical Pull", ["Bodyweight"], "Advanced", fit(["strength", "muscle_gain"]), 3, "4-8", 120, cue, mistakes, safe),
    makeExercise("band-pulldown", "แบนด์พูลดาวน์", "Band Pulldown", "Back", ["Biceps"], "Vertical Pull", ["Resistance Band", "Minimal Equipment"], "Beginner", all, 3, "10-15", 60, cue, mistakes, safe),
    makeExercise("seated-cable-row", "ซีเต็ดเคเบิลโรว์", "Seated Cable Row", "Back", ["Biceps"], "Horizontal Pull", ["Cable", "Machine"], "Beginner", all, 3, "8-12", 75, cue, mistakes, safe),
    makeExercise("one-arm-db-row", "ดัมเบลโรว์ข้างเดียว", "One-arm Dumbbell Row", "Back", ["Biceps", "Core"], "Horizontal Pull", ["Dumbbell", "Bench"], "Beginner", all, 3, "8-12", 75, cue, mistakes, safe),
    makeExercise("backpack-row", "แบ็กแพ็กโรว์", "Backpack Row", "Back", ["Biceps"], "Horizontal Pull", ["Minimal Equipment"], "Beginner", fit(["home", "beginner", "general_health", "fat_loss"]), 3, "10-15", 60, cue, mistakes, safe),
    makeExercise("band-row", "แบนด์โรว์", "Band Row", "Back", ["Biceps"], "Horizontal Pull", ["Resistance Band", "Minimal Equipment"], "Beginner", all, 3, "12-15", 60, cue, mistakes, safe),
    makeExercise("rear-delt-fly", "เรียร์เดลต์ฟลาย", "Rear Delt Fly", "Shoulders", ["Back"], "Horizontal Pull", ["Dumbbell", "Cable"], "Intermediate", fit(["muscle_gain", "general_health"]), 3, "12-15", 45, cue, mistakes, safe),
    makeExercise("reverse-lunge", "รีเวิร์สลันจ์", "Reverse Lunge", "Quadriceps", ["Glutes", "Hamstrings"], "Lunge", ["Bodyweight", "Dumbbell"], "Beginner", all, 3, "8-12/ข้าง", 60, cue, mistakes, safe),
    makeExercise("walking-lunge", "วอล์กกิ้งลันจ์", "Walking Lunge", "Quadriceps", ["Glutes"], "Lunge", ["Bodyweight", "Dumbbell"], "Intermediate", fit(["fat_loss", "muscle_gain"]), 3, "10/ข้าง", 60, cue, mistakes, safe),
    makeExercise("split-squat", "สปลิตสควอต", "Split Squat", "Quadriceps", ["Glutes"], "Lunge", ["Bodyweight", "Dumbbell"], "Intermediate", all, 3, "8-10/ข้าง", 75, cue, mistakes, safe),
    makeExercise("step-up", "สเต็ปอัพ", "Step up", "Quadriceps", ["Glutes", "Calves"], "Lunge", ["Bench", "Dumbbell"], "Beginner", all, 3, "10/ข้าง", 60, cue, mistakes, safe),
    makeExercise("calf-raise", "คาล์ฟเรส", "Calf Raise", "Calves", [], "Squat", ["Bodyweight", "Machine", "Dumbbell"], "Beginner", all, 3, "12-20", 45, cue, mistakes, safe),
    makeExercise("farmer-carry", "ฟาร์เมอร์แครี่", "Farmer Carry", "Full Body", ["Core", "Grip"], "Carry", ["Dumbbell", "Minimal Equipment"], "Beginner", all, 4, "30-45s", 60, cue, mistakes, safe),
    makeExercise("suitcase-carry", "ซูทเคสแครี่", "Suitcase Carry", "Core", ["Grip", "Shoulders"], "Anti-Rotation", ["Dumbbell"], "Intermediate", fit(["general_health", "strength"]), 3, "30s/ข้าง", 60, cue, mistakes, safe),
    makeExercise("plank", "แพลงก์", "Plank", "Core", ["Shoulders"], "Core", ["Bodyweight"], "Beginner", all, 3, "30-60s", 45, cue, mistakes, safe),
    makeExercise("side-plank", "ไซด์แพลงก์", "Side Plank", "Core", ["Shoulders", "Glutes"], "Anti-Rotation", ["Bodyweight"], "Beginner", all, 2, "20-45s/ข้าง", 45, cue, mistakes, safe),
    makeExercise("dead-bug", "เดดบัก", "Dead Bug", "Core", [], "Core", ["Bodyweight"], "Beginner", all, 3, "8-10/ข้าง", 45, cue, mistakes, safe),
    makeExercise("bird-dog", "เบิร์ดด็อก", "Bird Dog", "Core", ["Glutes", "Back"], "Anti-Rotation", ["Bodyweight"], "Beginner", all, 3, "8/ข้าง", 45, cue, mistakes, safe),
    makeExercise("pallof-press", "พัลลอฟเพรส", "Pallof Press", "Core", ["Shoulders"], "Anti-Rotation", ["Cable", "Resistance Band"], "Beginner", all, 3, "10/ข้าง", 45, cue, mistakes, safe),
    makeExercise("russian-twist", "รัสเซียนทวิสต์", "Russian Twist", "Core", [], "Rotation", ["Bodyweight", "Dumbbell"], "Intermediate", fit(["fat_loss", "general_health"]), 3, "12/ข้าง", 45, cue, mistakes, safe),
    makeExercise("mountain-climber", "เมาน์เทนไคลม์เบอร์", "Mountain Climber", "Full Body", ["Core", "Shoulders"], "Cardio", ["Bodyweight"], "Beginner", fit(["fat_loss", "general_health"]), 3, "30-45s", 45, cue, mistakes, safe),
    makeExercise("burpee", "เบอร์พี", "Burpee", "Full Body", ["Chest", "Legs"], "Cardio", ["Bodyweight"], "Advanced", fit(["fat_loss"]), 3, "8-12", 60, cue, mistakes, "หลีกเลี่ยงถ้ามีอาการเจ็บข้อมือ ไหล่ หรือหลัง"),
    makeExercise("walking", "เดินเร็ว", "Brisk Walk", "Full Body", ["Calves"], "Cardio", ["Bodyweight"], "Beginner", all, 1, "20-40 นาที", 0, "เดินให้หายใจเร็วขึ้นแต่ยังพูดเป็นประโยคได้", "ก้าวยาวเกินไปหรือเกร็งไหล่", safe, ""),
    makeExercise("treadmill-walk", "เดินลู่วิ่ง", "Treadmill Walk", "Full Body", ["Calves"], "Cardio", ["Cardio Machine"], "Beginner", all, 1, "15-30 นาที", 0, cue, mistakes, safe, ""),
    makeExercise("cycling", "ปั่นจักรยาน", "Cycling", "Quadriceps", ["Calves", "Glutes"], "Cardio", ["Cardio Machine"], "Beginner", all, 1, "15-30 นาที", 0, cue, mistakes, safe, ""),
    makeExercise("rowing-machine", "เครื่องกรรเชียง", "Rowing Machine", "Full Body", ["Back", "Legs"], "Cardio", ["Cardio Machine"], "Intermediate", fit(["fat_loss", "general_health"]), 1, "8-20 นาที", 0, cue, mistakes, safe, ""),
    makeExercise("jump-rope", "กระโดดเชือก", "Jump Rope", "Calves", ["Full Body"], "Cardio", ["Minimal Equipment"], "Intermediate", fit(["fat_loss"]), 3, "45-60s", 45, cue, mistakes, "หลีกเลี่ยงเมื่อมีอาการเจ็บเข่าหรือข้อเท้า"),
    makeExercise("hip-mobility", "เปิดสะโพก", "Hip Mobility", "Mobility", ["Glutes"], "Mobility", ["Bodyweight"], "Beginner", all, 2, "45s", 30, cue, mistakes, safe, ""),
    makeExercise("thoracic-rotation", "หมุนอก", "Thoracic Rotation", "Mobility", ["Back"], "Rotation", ["Bodyweight"], "Beginner", all, 2, "8/ข้าง", 30, cue, mistakes, safe, ""),
    makeExercise("child-pose", "ท่าเด็ก", "Child Pose", "Mobility", ["Back", "Hips"], "Mobility", ["Bodyweight"], "Beginner", all, 2, "45s", 30, cue, mistakes, safe, ""),
    makeExercise("band-pull-apart", "แบนด์พูลอะพาร์ต", "Band Pull Apart", "Shoulders", ["Back"], "Horizontal Pull", ["Resistance Band"], "Beginner", all, 3, "12-20", 45, cue, mistakes, safe),
    makeExercise("face-pull", "เฟซพูล", "Face Pull", "Shoulders", ["Back"], "Horizontal Pull", ["Cable", "Resistance Band"], "Beginner", fit(["muscle_gain", "general_health"]), 3, "12-15", 45, cue, mistakes, safe),
    makeExercise("db-curl", "ดัมเบลเคิร์ล", "Dumbbell Curl", "Biceps", [], "Horizontal Pull", ["Dumbbell"], "Beginner", fit(["muscle_gain"]), 3, "10-15", 45, cue, mistakes, safe),
    makeExercise("cable-curl", "เคเบิลเคิร์ล", "Cable Curl", "Biceps", [], "Horizontal Pull", ["Cable"], "Beginner", fit(["muscle_gain"]), 3, "10-15", 45, cue, mistakes, safe),
    makeExercise("triceps-pressdown", "ไทรเซปส์เพรสดาวน์", "Triceps Pressdown", "Triceps", [], "Horizontal Push", ["Cable"], "Beginner", fit(["muscle_gain"]), 3, "10-15", 45, cue, mistakes, safe),
    makeExercise("band-triceps-extension", "แบนด์ไทรเซปส์เอ็กซ์เทนชัน", "Band Triceps Extension", "Triceps", [], "Horizontal Push", ["Resistance Band"], "Beginner", fit(["muscle_gain", "general_health"]), 3, "12-15", 45, cue, mistakes, safe),
    makeExercise("close-grip-push-up", "วิดพื้นแคบ", "Close-grip Push up", "Triceps", ["Chest"], "Horizontal Push", ["Bodyweight"], "Intermediate", fit(["muscle_gain", "general_health"]), 3, "6-12", 60, cue, mistakes, safe),
    makeExercise("leg-curl", "เลกเคิร์ล", "Leg Curl", "Hamstrings", [], "Hinge", ["Machine"], "Beginner", fit(["muscle_gain", "beginner"]), 3, "10-15", 60, cue, mistakes, safe),
    makeExercise("leg-extension", "เลกเอ็กซ์เทนชัน", "Leg Extension", "Quadriceps", [], "Squat", ["Machine"], "Beginner", fit(["muscle_gain", "beginner"]), 3, "10-15", 60, cue, mistakes, safe),
    makeExercise("cable-woodchop", "เคเบิลวูดช็อป", "Cable Woodchop", "Core", ["Shoulders"], "Rotation", ["Cable"], "Intermediate", fit(["general_health", "muscle_gain"]), 3, "10/ข้าง", 60, cue, mistakes, safe),
    makeExercise("y-t-w-raise", "วายทีดับเบิลยูเรส", "Y-T-W Raise", "Shoulders", ["Back"], "Mobility", ["Bodyweight", "Bench"], "Beginner", all, 2, "8-10", 45, cue, mistakes, safe),
    makeExercise("single-leg-hinge", "ฮิปฮินจ์ขาเดียว", "Single-leg Hip Hinge", "Hamstrings", ["Glutes", "Core"], "Hinge", ["Bodyweight", "Dumbbell"], "Intermediate", fit(["general_health", "muscle_gain"]), 3, "8/ข้าง", 60, cue, mistakes, safe),
  ];
}

function renderNutritionSummary(todayFoods) {
  const target = nutritionTargets();
  const actual = {
    calories: sum(todayFoods, "calories"),
    protein: sum(todayFoods, "protein"),
    carbs: sum(todayFoods, "carbs"),
    fat: sum(todayFoods, "fat"),
    fiber: sum(todayFoods, "fiber"),
  };
  const remainingCalories = Math.max(0, target.calories - actual.calories);
  const remainingProtein = Math.max(0, target.protein - actual.protein);
  const hasTarget = Number(profile.bodyWeight || 0) > 0;

  fields.nutritionTargetStatus.textContent = hasTarget ? "เป้าหมายจากโปรไฟล์" : "ยังไม่มีเป้าหมายโภชนาการ";
  fields.targetCalories.textContent = target.calories;
  fields.remainingCalories.textContent = hasTarget ? remainingCalories : "-";
  fields.remainingProtein.textContent = hasTarget ? `${remainingProtein}g` : "-";
  fields.totalCarbs.textContent = `${actual.carbs}g`;
  fields.totalFat.textContent = `${actual.fat}g`;
  fields.totalFoodItems.textContent = todayFoods.length;
  setBar(fields.calorieBar, actual.calories, target.calories);
  setBar(fields.proteinBar, actual.protein, target.protein);
  setBar(fields.carbBar, actual.carbs, target.carbs);
  setBar(fields.fatBar, actual.fat, target.fat);
  if (!hasTarget) {
    fields.nutritionCoachText.textContent = "ตั้งค่าน้ำหนักและเป้าหมายในโปรไฟล์เพื่อดูเป้าหมาย kcal/protein";
  } else if (!todayFoods.length) {
    fields.nutritionCoachText.textContent = "ยังไม่มีอาหารวันนี้ เริ่มบันทึกมื้อแรกของคุณ";
  } else {
    fields.nutritionCoachText.textContent = `รวมวันนี้ ${actual.calories} kcal · โปรตีน ${actual.protein}g · คาร์บ ${actual.carbs}g · ไขมัน ${actual.fat}g`;
  }
}

function nutritionTargets() {
  const weight = Number(profile.bodyWeight || 70);
  const goal = profile.goal || "health";
  const caloriesByGoal = {
    fat_loss: weight * 26,
    muscle_gain: weight * 34,
    endurance: weight * 36,
    health: weight * 30,
  };
  const proteinByGoal = {
    fat_loss: weight * 2.0,
    muscle_gain: weight * 2.2,
    endurance: weight * 1.7,
    health: weight * 1.6,
  };
  const calories = Math.round(caloriesByGoal[goal] || caloriesByGoal.health);
  const protein = Math.round(proteinByGoal[goal] || proteinByGoal.health);
  const fat = Math.round((calories * 0.27) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
  return { calories, protein, carbs, fat };
}

function nutritionScore(actual, target) {
  const today = dateKey(new Date());
  const todayFoods = foods.filter((food) => dateKey(new Date(food.createdAt)) === today);
  const log = healthLogs[today] || {};
  const mealsLogged = new Set(todayFoods.map((food) => food.meal)).size;
  let score = 0;
  const calorieDiff = Math.abs(actual.calories - target.calories);
  score += calorieDiff <= 150 ? 30 : calorieDiff <= 300 ? 20 : 10;
  score += actual.protein >= target.protein ? 30 : actual.protein >= target.protein * 0.75 ? 20 : 10;
  score += Number(log.waterMl || 0) >= WATER_GOAL_ML ? 20 : Number(log.waterMl || 0) >= WATER_GOAL_ML * 0.7 ? 12 : 5;
  score += mealsLogged >= 3 ? 20 : mealsLogged >= 2 ? 12 : 5;
  return Math.min(score, 100);
}

function nutritionRating(score) {
  if (score >= 85) return "ยอดเยี่ยม";
  if (score >= 70) return "ดี";
  if (score >= 50) return "พอใช้";
  return "ควรปรับปรุง";
}

function healthScoreStatus(score) {
  if (score >= 85) return "ยอดเยี่ยม";
  if (score >= 70) return "ดี";
  if (score >= 50) return "พอใช้";
  return "ต้องปรับ";
}

function goalLabel(goal) {
  const labels = {
    fat_loss: "ลดไขมัน",
    muscle_gain: "เพิ่มกล้าม",
    endurance: "เพิ่มความอึด",
    health: "สุขภาพทั่วไป",
    general_health: "สุขภาพทั่วไป",
    maintenance: "รักษาน้ำหนัก",
  };
  return labels[goal] || "สุขภาพทั่วไป";
}

function nutritionAdvice(actual, target, meals) {
  if (!meals) return "เริ่มจากบันทึกอาหารมื้อแรก หรือใช้ AI estimate เพื่อประเมิน kcal/P/C/F แบบเร็ว";
  if (actual.protein < target.protein * 0.55) return "วันนี้โปรตีนยังต่ำ ลองเพิ่มอกไก่ ไข่ ปลา เต้าหู้ หรือโปรตีนเชคในมื้อต่อไป";
  if (actual.calories > target.calories * 1.15) return "แคลอรีเกินเป้าแล้ว มื้อต่อไปเน้นโปรตีนลีน ผัก และลดของทอด/น้ำหวาน";
  if (actual.calories < target.calories * 0.65) return "แคลอรียังต่ำ ถ้ายังมีมื้อเหลือให้เพิ่มคาร์บคุณภาพดี เช่น ข้าว มันหวาน หรือผลไม้";
  return "ภาพรวมดีขึ้นแล้ว รักษาโปรตีนให้ถึงเป้าและกระจายมื้ออาหารให้สม่ำเสมอ";
}

function setBar(element, value, target) {
  const percent = Math.min(125, Math.round((Number(value || 0) / Math.max(1, target)) * 100));
  element.style.width = `${percent}%`;
}

function renderDashboardTrainingStats() {
  const engine = progressiveOverloadEngine();
  if (fields.dashLastWorkout) fields.dashLastWorkout.textContent = engine.lastWorkout ? formatShortDate(engine.lastWorkout.date) : "-";
  if (fields.dashWorkoutStreak) fields.dashWorkoutStreak.textContent = `${engine.streak.current} วัน`;
  if (fields.dashWeeklyVolume) fields.dashWeeklyVolume.textContent = formatKg(engine.weekly.volume);
  if (fields.dashPrCount) fields.dashPrCount.textContent = engine.personalRecords.length;
  const program = activeProgram();
  const todayPlan = plannedWorkoutForDate(dateKey(new Date()), program);
  if (fields.dashCurrentProgram) fields.dashCurrentProgram.textContent = program.name || "-";
  if (fields.dashTodayWorkout) fields.dashTodayWorkout.textContent = todayPlan ? todayPlan.title.replace(/^Day \d+:\s*/, "") : "-";
  if (fields.dashWeeklyCompletion) fields.dashWeeklyCompletion.textContent = `${programWeeklyCompletion(program)}%`;
  if (fields.dashProgramVersion) fields.dashProgramVersion.textContent = `v${program.version || 1}`;
  const analytics = trainingAnalyticsEngine();
  if (fields.dashRecoveryScore) fields.dashRecoveryScore.textContent = analytics.recovery.score;
  if (fields.dashFatigueScore) fields.dashFatigueScore.textContent = analytics.fatigue.score;
  if (fields.dashMuscleVolume) fields.dashMuscleVolume.textContent = `${analytics.weekly.totalSets} sets`;
  if (fields.dashTrainingBalance) fields.dashTrainingBalance.textContent = analytics.balance.status;
}

function recoveryReadinessEngine(overrides = {}) {
  const analytics = trainingAnalyticsEngine();
  const today = dateKey(new Date());
  const log = { ...(healthLogs[today] || {}), ...overrides };
  const profileData = recoveryProfile(log, analytics);
  const factors = recoveryScoreFactors(profileData, analytics);
  const score = clamp(Math.round(76 + factors.reduce((total, factor) => total + factor.impact, 0)), 0, 100);
  const readiness = readinessLevel(score);
  const trainingRecommendation = recoveryTrainingRecommendation(score, profileData, analytics, factors);
  const nutritionRecommendations = recoveryNutritionRecommendations(profileData, score);
  const trend = recoverySevenDayTrend(analytics);
  const alerts = recoveryAlerts(profileData, trend, analytics);
  return {
    profile: profileData,
    recoveryScore: score,
    trainingReadiness: readiness,
    trainingRecommendation,
    nutritionRecommendations,
    topFactors: factors.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact)).slice(0, 5),
    trend,
    alerts,
    dataSafety: "Fitness guidance only. Not medical advice.",
  };
}

function recoveryProfile(log, analytics) {
  const sleepDuration = Number(log.sleepHours || 0);
  const sleepQuality = log.sleepQuality ? Number(log.sleepQuality) : null;
  const mood = log.mood || log.moodToday || "";
  const energy = Number(log.energy || log.energyLevel || 0);
  const previousWorkoutLoad = analytics.weekly.totalSets;
  const restDays = analytics.recovery.daysSinceLast === "-" ? 7 : Number(analytics.recovery.daysSinceLast || 0);
  const fatigue = inferRecoveryScale(log.fatigue, analytics.fatigue.score >= 75 ? 5 : analytics.fatigue.score >= 55 ? 4 : analytics.fatigue.score >= 35 ? 3 : 2);
  const soreness = inferRecoveryScale(log.soreness || log.muscleSoreness, analytics.recovery.score < 55 ? 4 : analytics.recovery.score < 70 ? 3 : 2);
  const stress = inferRecoveryScale(log.stress, sleepDuration && sleepDuration < 6 ? 4 : 2);
  return {
    sleepDuration,
    sleepQuality,
    muscleSoreness: soreness,
    fatigue,
    stress,
    mood,
    energy,
    previousWorkoutLoad,
    restDays,
    heartRate: log.heartRate ? Number(log.heartRate) : null,
    hrv: log.hrv ? Number(log.hrv) : null,
    manualReadinessScore: log.manualReadinessScore ? Number(log.manualReadinessScore) : null,
  };
}

function inferRecoveryScale(value, fallback) {
  const parsed = Number(value || 0);
  if (parsed) return clamp(parsed, 1, 5);
  return clamp(Number(fallback || 3), 1, 5);
}

function recoveryScoreFactors(profileData, analytics) {
  const factors = [];
  if (profileData.sleepDuration) {
    if (profileData.sleepDuration < 5) factors.push({ label: "Sleep duration", value: `${profileData.sleepDuration.toFixed(1)}h`, impact: -24, reason: "Sleep below 5 hours limits training readiness." });
    else if (profileData.sleepDuration < 6.5) factors.push({ label: "Sleep duration", value: `${profileData.sleepDuration.toFixed(1)}h`, impact: -14, reason: "Sleep is below the recovery target." });
    else if (profileData.sleepDuration >= 7.5) factors.push({ label: "Sleep duration", value: `${profileData.sleepDuration.toFixed(1)}h`, impact: 8, reason: "Sleep supports normal training." });
  } else {
    factors.push({ label: "Sleep duration", value: "Missing", impact: -6, reason: "No sleep log today." });
  }
  if (profileData.sleepQuality && profileData.sleepQuality <= 2) factors.push({ label: "Sleep quality", value: `${profileData.sleepQuality}/5`, impact: -10, reason: "Low sleep quality reduces readiness." });
  if (profileData.muscleSoreness >= 5) factors.push({ label: "Muscle soreness", value: "Very high", impact: -18, reason: "High soreness calls for lower load." });
  else if (profileData.muscleSoreness >= 4) factors.push({ label: "Muscle soreness", value: "High", impact: -12, reason: "Soreness suggests reducing volume or intensity." });
  if (profileData.fatigue >= 5) factors.push({ label: "Fatigue", value: "Very high", impact: -20, reason: "High fatigue raises rest-day priority." });
  else if (profileData.fatigue >= 4) factors.push({ label: "Fatigue", value: "High", impact: -12, reason: "Fatigue is elevated." });
  if (profileData.stress >= 4) factors.push({ label: "Stress", value: "High", impact: -8, reason: "Stress increases recovery demand." });
  if (profileData.energy >= 4) factors.push({ label: "Energy", value: `${profileData.energy}/5`, impact: 8, reason: "Energy is supportive." });
  if (profileData.energy > 0 && profileData.energy <= 2) factors.push({ label: "Energy", value: `${profileData.energy}/5`, impact: -10, reason: "Low energy suggests a lighter day." });
  if (profileData.previousWorkoutLoad > 130) factors.push({ label: "Previous workout load", value: `${profileData.previousWorkoutLoad} sets`, impact: -16, reason: "Weekly load is very high." });
  else if (profileData.previousWorkoutLoad > 90) factors.push({ label: "Previous workout load", value: `${profileData.previousWorkoutLoad} sets`, impact: -10, reason: "Weekly load is elevated." });
  if (profileData.restDays >= 2 && profileData.restDays < 7) factors.push({ label: "Rest days", value: `${profileData.restDays}`, impact: 8, reason: "Recent rest supports readiness." });
  if (analytics.fatigue.score >= 80) factors.push({ label: "Analytics fatigue", value: `${analytics.fatigue.score}/100`, impact: -14, reason: "Training analytics show high fatigue." });
  if (profileData.manualReadinessScore !== null) factors.push({ label: "Manual readiness", value: `${profileData.manualReadinessScore}/100`, impact: Math.round((profileData.manualReadinessScore - 70) * 0.35), reason: "Manual readiness is included as user input." });
  return factors;
}

function readinessLevel(score) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 55) return "Moderate";
  if (score >= 35) return "Poor";
  return "Very Poor";
}

function recoveryTrainingRecommendation(score, profileData, analytics, factors) {
  const highFatigue = profileData.fatigue >= 5 || analytics.fatigue.score >= 80;
  const poorSleep = profileData.sleepDuration > 0 && profileData.sleepDuration < 5;
  const highSoreness = profileData.muscleSoreness >= 5;
  const reasons = factors.filter((factor) => factor.impact < 0).slice(0, 3).map((factor) => factor.reason);
  if (analytics.fatigue.score >= 85 && profileData.previousWorkoutLoad > 120) return { action: "Deload Week", reason: "Fatigue and weekly load are both high. Keep training optional, lighter, and technique-focused." };
  if (highFatigue || poorSleep) return { action: "Rest Day", reason: reasons[0] || "Recovery is too low for productive training today." };
  if (score < 45 || highSoreness) return { action: "Recovery Session", reason: reasons[0] || "Recovery score is poor; prioritize circulation and easy movement." };
  if (score < 55) return { action: "Mobility Session", reason: reasons[0] || "Readiness is limited; keep stress low." };
  if (score < 70) return { action: "Reduce Volume", reason: reasons[0] || "Moderate readiness supports training with fewer hard sets." };
  if (score < 85 || analytics.fatigue.score >= 60) return { action: "Reduce Intensity", reason: "Readiness is good enough to train, but leave more reps in reserve." };
  return { action: "Train Normally", reason: "Recovery indicators support normal planned training." };
}

function recoveryNutritionRecommendations(profileData, score) {
  const recommendations = [];
  if (profileData.muscleSoreness >= 4 || profileData.previousWorkoutLoad > 90) recommendations.push({ action: "Increase protein", reason: "Higher soreness or load benefits from hitting protein targets." });
  if (score < 70 || profileData.sleepDuration < 6.5) recommendations.push({ action: "Hydration reminder", reason: "Hydration supports recovery and training quality." });
  if (profileData.fatigue >= 4) recommendations.push({ action: "Increase carbohydrates", reason: "Fatigue may improve with more training fuel around sessions." });
  if (score < 55 && coachGoal().key === "fat_loss") recommendations.push({ action: "Reduce deficit", reason: "Poor recovery is a reason to avoid aggressive dieting today." });
  if (!recommendations.length) recommendations.push({ action: "Maintain calories", reason: "Readiness is stable; no nutrition change is needed." });
  return recommendations;
}

function recoverySevenDayTrend(analytics) {
  const days = lastDateKeysUntil(dateKey(new Date()), 7);
  const values = days.map((day) => {
    const log = healthLogs[day] || {};
    const sleep = Number(log.sleepHours || 0);
    const workoutLoad = analytics.records.filter((record) => record.date === day).reduce((total, record) => total + Math.max(1, Number(record.sets || 0)), 0);
    let score = 74;
    if (sleep && sleep < 5) score -= 22;
    else if (sleep && sleep < 6.5) score -= 12;
    else if (sleep >= 7.5) score += 8;
    if (Number(log.sleepQuality || 0) <= 2 && log.sleepQuality) score -= 8;
    if (Number(log.energy || log.energyLevel || 0) <= 2 && (log.energy || log.energyLevel)) score -= 8;
    if (workoutLoad > 24) score -= 10;
    if (!sleep && !workoutLoad) score -= 4;
    return clamp(Math.round(score), 0, 100);
  });
  const averageScore = Math.round(average(values));
  const direction = values[values.length - 1] - values[0];
  return {
    days,
    scores: values,
    averageScore,
    direction: direction > 5 ? "Improving" : direction < -5 ? "Declining" : "Stable",
    poorDays: values.filter((score) => score < 55).length,
  };
}

function recoveryAlerts(profileData, trend, analytics) {
  const alerts = [];
  if (profileData.fatigue >= 5 || analytics.fatigue.score >= 80) alerts.push({ type: "High fatigue", message: "Fatigue is high; avoid forcing a hard session." });
  if (trend.poorDays >= 3) alerts.push({ type: "Multiple poor recovery days", message: `${trend.poorDays} low-readiness days in the last 7 days.` });
  if (profileData.muscleSoreness >= 4 && analytics.recovery.score < 70) alerts.push({ type: "Repeated soreness", message: "Soreness and analytics recovery both suggest lighter training." });
  if (profileData.restDays === 0 && analytics.streak.current >= 4) alerts.push({ type: "Consecutive missed recovery", message: "Several training days in a row without a rest day." });
  return alerts;
}

function renderRecoveryReadinessDashboard() {
  if (!fields.recoveryReadinessScore) return;
  const result = recoveryReadinessEngine();
  fields.recoveryReadinessScore.textContent = result.recoveryScore;
  fields.recoveryReadinessLevel.textContent = result.trainingReadiness;
  fields.recoveryReadinessBadge.textContent = result.trainingRecommendation.action;
  fields.recoveryTrainingRecommendation.textContent = result.trainingRecommendation.reason;
  setRing(fields.recoveryScoreRing, result.recoveryScore);
  fields.recoveryTopFactors.innerHTML = result.topFactors.length ? result.topFactors.map((factor) => `
    <article><strong>${escapeHtml(factor.label)}</strong><span>${escapeHtml(factor.value)} · ${factor.impact > 0 ? "+" : ""}${factor.impact}</span></article>
  `).join("") : `<div class="empty">No readiness factors yet.</div>`;
  fields.recoveryNutritionRecommendations.innerHTML = result.nutritionRecommendations.map((item) => `
    <article><strong>${escapeHtml(item.action)}</strong><span>${escapeHtml(item.reason)}</span></article>
  `).join("");
  fields.recoveryAlerts.innerHTML = result.alerts.length ? result.alerts.map((alert) => `
    <article><strong>${escapeHtml(alert.type)}</strong><span>${escapeHtml(alert.message)}</span></article>
  `).join("") : `<article><strong>No alerts</strong><span>Recovery guidance is advisory only.</span></article>`;
  fields.recoverySevenDayTrend.textContent = `7-day trend: ${result.trend.direction} · avg ${result.trend.averageScore}/100`;
}

function habitAdherenceEngine() {
  const analytics = trainingAnalyticsEngine();
  const recovery = recoveryReadinessEngine();
  const profileData = habitProfile(analytics);
  const behaviorInsights = habitBehaviorInsights(profileData, analytics);
  const trends = habitConsistencyTrends();
  const score = adherenceScore(profileData, trends);
  const category = adherenceCategory(score);
  const recommendations = habitCoachingRecommendations(profileData, behaviorInsights, recovery);
  const alerts = habitAlerts(profileData, trends, analytics);
  return {
    profile: profileData,
    adherenceScore: score,
    category,
    behaviorInsights,
    recommendations,
    trends,
    alerts,
    dataSafety: "Behavior coaching only. Not mental-health diagnosis.",
  };
}

function habitProfile(analytics = trainingAnalyticsEngine()) {
  const today = dateKey(new Date());
  const weekDates = lastDateKeysUntil(today, 7);
  const monthDates = lastDateKeysUntil(today, 30);
  const scheduledDays = scheduledTrainingWeekdays(activeProgram());
  const workoutDates = new Set(analytics.records.map((record) => record.date));
  const weeklyTrainingDays = weekDates.filter((date) => scheduledDays.includes(weekdayName(date)));
  const missedWorkouts = weeklyTrainingDays.filter((date) => !workoutDates.has(date));
  const workoutAdherence = weeklyTrainingDays.length ? Math.round((weeklyTrainingDays.length - missedWorkouts.length) / weeklyTrainingDays.length * 100) : Math.min(100, analytics.weekly.totalSets ? 100 : 0);
  const mealStats = mealAdherenceStats(weekDates);
  const consistency7 = consistencyForDates(weekDates);
  const consistency30 = consistencyForDates(monthDates);
  const activeDates = [...new Set([...analytics.records.map((record) => record.date), ...foods.map((food) => dateKey(new Date(food.createdAt)))])];
  const longestStreak = longestDateStreak(activeDates);
  return {
    workoutAdherence,
    mealAdherence: mealStats.adherence,
    workoutStreak: analytics.streak.current || workoutDateStreak(workoutDates),
    nutritionStreak: nutritionDateStreak(),
    longestStreak,
    missedWorkouts: missedWorkouts.map((date) => ({ date, day: weekdayName(date) })),
    missedMealTargets: mealStats.missed,
    weeklyConsistency: consistency7,
    monthlyConsistency: consistency30,
    preferredWorkoutTime: preferredWorkoutTime(analytics.records),
    preferredTrainingDays: preferredTrainingDays(analytics.records),
    scheduledTrainingDays: scheduledDays,
  };
}

function scheduledTrainingWeekdays(program = activeProgram()) {
  const scheduled = Object.keys(program.schedule || {}).filter((day) => program.schedule?.[day]);
  if (scheduled.length) return scheduled;
  return trainingWeekdays(Number(program.settings?.days || program.days?.length || 3));
}

function mealAdherenceStats(dates) {
  const target = nutritionTargets();
  const missed = [];
  const completed = dates.filter((date) => {
    const totals = dailyFoodTotals(foods.filter((food) => dateKey(new Date(food.createdAt)) === date));
    const hasMeal = foods.some((food) => dateKey(new Date(food.createdAt)) === date);
    const hitProtein = target.protein ? totals.protein >= target.protein * 0.75 : hasMeal;
    const hitCalories = target.calories ? totals.calories >= target.calories * 0.65 : hasMeal;
    if (!hasMeal || !hitProtein || !hitCalories) missed.push({ date, calories: totals.calories, protein: totals.protein });
    return hasMeal && hitProtein && hitCalories;
  }).length;
  return { adherence: Math.round(completed / Math.max(1, dates.length) * 100), missed };
}

function consistencyForDates(dates) {
  const workoutDates = new Set(normalizeWorkoutRecords().map((record) => record.date));
  const foodDates = new Set(foods.map((food) => dateKey(new Date(food.createdAt))));
  const checkinDates = new Set(Object.entries(healthLogs).filter(([, log]) => log?.checkinCompleted).map(([date]) => date));
  const values = dates.map((date) => {
    let score = 0;
    if (workoutDates.has(date)) score += 40;
    if (foodDates.has(date)) score += 35;
    if (checkinDates.has(date)) score += 25;
    return score;
  });
  return { score: Math.round(average(values)), activeDays: values.filter((value) => value > 0).length, totalDays: dates.length };
}

function habitConsistencyTrends() {
  const today = dateKey(new Date());
  const seven = consistencyForDates(lastDateKeysUntil(today, 7));
  const thirty = consistencyForDates(lastDateKeysUntil(today, 30));
  const ninety = consistencyForDates(lastDateKeysUntil(today, 90));
  const previousSeven = consistencyForDateRange(14, 8);
  return {
    sevenDay: seven,
    thirtyDay: thirty,
    ninetyDay: ninety,
    direction: seven.score > previousSeven.score + 8 ? "Improving" : seven.score < previousSeven.score - 8 ? "Declining" : "Stable",
    sevenDayDelta: seven.score - previousSeven.score,
  };
}

function consistencyForDateRange(fromDaysAgo, toDaysAgo) {
  const dates = [];
  for (let offset = fromDaysAgo; offset >= toDaysAgo; offset -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    dates.push(dateKey(date));
  }
  return consistencyForDates(dates);
}

function adherenceScore(profileData, trends) {
  return clamp(Math.round(
    profileData.workoutAdherence * 0.28 +
    profileData.mealAdherence * 0.28 +
    profileData.weeklyConsistency.score * 0.22 +
    profileData.monthlyConsistency.score * 0.12 +
    Math.min(100, Math.max(profileData.workoutStreak, profileData.nutritionStreak) * 12) * 0.1 +
    (trends.direction === "Improving" ? 4 : trends.direction === "Declining" ? -6 : 0)
  ), 0, 100);
}

function adherenceCategory(score) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Moderate";
  if (score >= 30) return "Poor";
  return "Critical";
}

function habitBehaviorInsights(profileData, analytics) {
  const insights = [];
  const skipped = frequentSkippedDays(profileData.missedWorkouts);
  if (skipped) insights.push({ type: "Frequently skipped days", message: `${skipped} is frequently missed.`, severity: "Medium" });
  const late = analytics.records.filter((record) => new Date(record.createdAt).getHours() >= 21).length;
  if (late >= Math.max(2, analytics.records.length * 0.35)) insights.push({ type: "Late-night workouts", message: "Many workouts happen after 9 PM.", severity: "Low" });
  const weekendRecords = analytics.records.filter((record) => ["Saturday", "Sunday"].includes(weekdayName(record.date))).length;
  if (analytics.records.length >= 3 && weekendRecords / analytics.records.length >= 0.7) insights.push({ type: "Weekend-only training", message: "Most training is clustered on weekends.", severity: "Medium" });
  if (profileData.mealAdherence < 55) insights.push({ type: "Meal inconsistency", message: "Nutrition logs or meal targets are missed often.", severity: "Medium" });
  if (profileData.missedWorkouts.length >= 2) insights.push({ type: "Repeated missed sessions", message: `${profileData.missedWorkouts.length} scheduled workouts were missed this week.`, severity: "High" });
  const daysSinceLast = analytics.recovery.daysSinceLast === "-" ? 99 : Number(analytics.recovery.daysSinceLast || 0);
  if (daysSinceLast >= 7) insights.push({ type: "Long inactivity", message: `${daysSinceLast} days since the last workout.`, severity: "High" });
  return insights.length ? insights : [{ type: "Stable routine", message: "No major habit risk detected.", severity: "Low" }];
}

function habitCoachingRecommendations(profileData, insights, recovery) {
  const recs = [];
  if (profileData.missedWorkouts.length >= 2 || profileData.workoutAdherence < 50) recs.push({ action: "Reduce weekly frequency", reason: "Current scheduled volume is being missed; make the baseline easier to complete." });
  if (insights.some((item) => item.type === "Late-night workouts")) recs.push({ action: "Move workout time", reason: "Late sessions may be harder to repeat and may affect sleep." });
  if (insights.some((item) => item.type === "Long inactivity")) recs.push({ action: "Shorten sessions", reason: "After inactivity, a short session lowers the restart barrier." });
  if (profileData.weeklyConsistency.score < 45) recs.push({ action: "Split workouts", reason: "Shorter split sessions can protect consistency on busy days." });
  if (recovery.trainingRecommendation.action !== "Train Normally") recs.push({ action: "Schedule recovery", reason: `Recovery engine recommends ${recovery.trainingRecommendation.action}.` });
  if (profileData.mealAdherence < 60) recs.push({ action: "Adjust nutrition timing", reason: "Meal targets are missed often; planning earlier meals may improve adherence." });
  if (!recs.length) recs.push({ action: "Maintain routine", reason: "Adherence is stable; keep the current schedule." });
  return recs.slice(0, 5);
}

function habitAlerts(profileData, trends, analytics) {
  const alerts = [];
  const daysSinceLast = analytics.recovery.daysSinceLast === "-" ? 99 : Number(analytics.recovery.daysSinceLast || 0);
  if (daysSinceLast >= 7) alerts.push({ type: "7 days inactive", message: `${daysSinceLast} days since the last workout.` });
  if (trends.sevenDayDelta <= -20) alerts.push({ type: "Rapid adherence drop", message: `7-day consistency dropped ${Math.abs(trends.sevenDayDelta)} points.` });
  if (profileData.longestStreak >= 3 && Math.max(profileData.workoutStreak, profileData.nutritionStreak) === 0) alerts.push({ type: "Broken streak", message: "Current habit streak is broken." });
  if (profileData.missedWorkouts.length >= 2) alerts.push({ type: "Repeated missed workouts", message: `${profileData.missedWorkouts.length} scheduled workouts missed this week.` });
  if (profileData.weeklyConsistency.score < 35) alerts.push({ type: "Low consistency", message: "Weekly consistency is below 35%." });
  return alerts;
}

function renderHabitAdherenceDashboard() {
  if (!fields.habitAdherenceScore) return;
  const result = habitAdherenceEngine();
  const topInsight = result.behaviorInsights[0];
  fields.habitAdherenceScore.textContent = result.adherenceScore;
  fields.habitAdherenceLevel.textContent = result.category;
  fields.habitAdherenceBadge.textContent = result.category;
  fields.habitTopInsight.textContent = `${topInsight.type}: ${topInsight.message}`;
  fields.habitWorkoutPercent.textContent = `${result.profile.workoutAdherence}%`;
  fields.habitNutritionPercent.textContent = `${result.profile.mealAdherence}%`;
  fields.habitCurrentStreak.textContent = Math.max(result.profile.workoutStreak, result.profile.nutritionStreak);
  fields.habitLongestStreak.textContent = result.profile.longestStreak;
  setRing(fields.habitScoreRing, result.adherenceScore);
  fields.habitRecommendations.innerHTML = result.recommendations.map((item) => `
    <article><strong>${escapeHtml(item.action)}</strong><span>${escapeHtml(item.reason)}</span></article>
  `).join("");
  fields.habitAlerts.innerHTML = result.alerts.length ? result.alerts.map((alert) => `
    <article><strong>${escapeHtml(alert.type)}</strong><span>${escapeHtml(alert.message)}</span></article>
  `).join("") : `<article><strong>No alerts</strong><span>Habit coaching is advisory only.</span></article>`;
  fields.habitTrendSummary.textContent = `Trends: 7d ${result.trends.sevenDay.score}% · 30d ${result.trends.thirtyDay.score}% · 90d ${result.trends.ninetyDay.score}% · ${result.trends.direction}`;
}

function progressPredictionEngine(request = {}) {
  const profileData = predictionProfile();
  const projections = predictionOutcomes(profileData, request);
  const probability = goalProbability(profileData, projections);
  const risks = predictionRisks(profileData, projections, probability);
  const recommendations = predictionRecommendations(profileData, risks, probability);
  return {
    profile: profileData,
    projections,
    goalProbability: probability,
    risks,
    recommendations,
    dataSafety: "Predictions are estimates only. They are not medical advice and never guarantee outcomes.",
  };
}

function predictionProfile() {
  const analytics = trainingAnalyticsEngine();
  const habit = habitAdherenceEngine();
  const recovery = recoveryReadinessEngine();
  const weights = weightRecords();
  const latestWeight = weights[0] || {};
  const olderWeight = weights.find((record) => daysBetween(record.date, latestWeight.date || dateKey(new Date())) >= 21) || weights[weights.length - 1] || {};
  const currentWeight = Number(latestWeight.weightKg || todayHealthLog().weightKg || profile.bodyWeight || 0);
  const currentBodyFat = Number(latestWeight.bodyFat || todayHealthLog().bodyFat || profile.bodyFat || 0);
  const recentDelta = currentWeight && Number(olderWeight.weightKg || 0) ? Number((currentWeight - Number(olderWeight.weightKg)).toFixed(1)) : 0;
  const weeksMeasured = olderWeight.date && latestWeight.date ? Math.max(1, Math.abs(daysBetween(olderWeight.date, latestWeight.date)) / 7) : 4;
  const weeklyRate = recentDelta ? recentDelta / weeksMeasured : 0;
  const monthlyRecords = analytics.records.filter((record) => lastDateKeysUntil(dateKey(new Date()), 30).includes(record.date));
  return {
    currentWeight,
    currentBodyFat: currentBodyFat || null,
    trainingFrequency: Number((new Set(monthlyRecords.map((record) => record.date)).size / 4.3).toFixed(1)),
    workoutAdherence: habit.profile.workoutAdherence,
    nutritionAdherence: habit.profile.mealAdherence,
    recoveryScore: recovery.recoveryScore,
    averageWeeklyVolume: Math.round(monthlyRecords.reduce((sum, record) => sum + Number(record.sets || 0), 0) / 4.3),
    recentProgress: {
      weightDeltaKg: recentDelta,
      weeklyWeightRateKg: Number(weeklyRate.toFixed(2)),
      strengthTrend: progressiveOverloadEngine().summary?.improved > 0 ? "Improving" : "Stable or insufficient data",
    },
    currentGoal: coachGoal(),
  };
}

function predictionOutcomes(profileData, request = {}) {
  const goal = normalizeExerciseName(profileData.currentGoal || profile.goal || "health");
  const adherenceFactor = clamp((profileData.workoutAdherence + profileData.nutritionAdherence + profileData.recoveryScore) / 300, 0.35, 1);
  let weeklyMin = -0.1;
  let weeklyMax = 0.1;
  if (goal.includes("fat") || goal.includes("loss") || goal.includes("ลด")) {
    weeklyMin = -0.75 * adherenceFactor;
    weeklyMax = -0.2 * adherenceFactor;
  } else if (goal.includes("muscle") || goal.includes("bulk") || goal.includes("hypertrophy") || goal.includes("gain")) {
    weeklyMin = 0.05 * adherenceFactor;
    weeklyMax = 0.25 * adherenceFactor;
  } else if (Math.abs(profileData.recentProgress.weeklyWeightRateKg) > 0.05) {
    weeklyMin = profileData.recentProgress.weeklyWeightRateKg - 0.18;
    weeklyMax = profileData.recentProgress.weeklyWeightRateKg + 0.18;
  }
  const ranges = [4, 8, 12].map((weeks) => ({
    weeks,
    weightKgRange: profileData.currentWeight ? [
      Number((profileData.currentWeight + weeklyMin * weeks).toFixed(1)),
      Number((profileData.currentWeight + weeklyMax * weeks).toFixed(1)),
    ].sort((a, b) => a - b) : null,
  }));
  const bodyFatTrend = profileData.currentBodyFat
    ? (weeklyMax < -0.05 ? "Likely decreasing" : weeklyMin > 0.05 ? "May increase slightly during gain phase" : "Likely stable")
    : "Insufficient body-fat data";
  const muscleGainTrend = profileData.averageWeeklyVolume >= 8 && profileData.recoveryScore >= 60 ? "Likely improving with consistent training" : "Limited unless volume and recovery improve";
  const strengthTrend = profileData.trainingFrequency >= 2 && profileData.recoveryScore >= 55 ? profileData.recentProgress.strengthTrend : "Limited by frequency or recovery";
  const questionEstimate = request.targetWeightChangeKg && request.timeWeeks ? {
    requestedChangeKg: request.targetWeightChangeKg,
    requestedWeeks: request.timeWeeks,
    requiredWeeklyRateKg: Number((request.targetWeightChangeKg / request.timeWeeks).toFixed(2)),
    feasibility: Math.abs(request.targetWeightChangeKg / request.timeWeeks) <= 0.75 && adherenceFactor >= 0.55 ? "Plausible" : "Challenging",
  } : null;
  return { ranges, bodyFatTrend, muscleGainTrend, strengthTrend, questionEstimate };
}

function goalProbability(profileData) {
  const score = clamp(Math.round(
    profileData.workoutAdherence * 0.24 +
    profileData.nutritionAdherence * 0.28 +
    profileData.recoveryScore * 0.24 +
    Math.min(100, profileData.trainingFrequency * 25) * 0.16 +
    Math.min(100, profileData.averageWeeklyVolume * 5) * 0.08
  ), 0, 100);
  return {
    score,
    label: score >= 70 ? "High" : score >= 45 ? "Medium" : "Low",
    reasons: [
      `Workout adherence ${profileData.workoutAdherence}%`,
      `Nutrition adherence ${profileData.nutritionAdherence}%`,
      `Recovery score ${profileData.recoveryScore}/100`,
      `${profileData.trainingFrequency} training days/week`,
    ],
  };
}

function predictionRisks(profileData, projections, probability) {
  const risks = [];
  const nearFlat = Math.abs(profileData.recentProgress.weeklyWeightRateKg) < 0.08;
  if (nearFlat && probability.score < 70) risks.push({ type: "Plateau Risk", level: "Medium", reason: "Recent weight trend is flat while adherence or recovery leaves room to improve." });
  if (profileData.recoveryScore < 55 && profileData.trainingFrequency >= 4) risks.push({ type: "Burnout Risk", level: "High", reason: "Training frequency is high while recovery is below the good range." });
  if (profileData.recoveryScore < 45 && profileData.averageWeeklyVolume > 18) risks.push({ type: "Overtraining Risk", level: "High", reason: "Low recovery combined with high weekly volume increases training stress." });
  if (profileData.workoutAdherence < 55 || profileData.nutritionAdherence < 55) risks.push({ type: "Low Adherence Risk", level: "High", reason: "Consistency is the strongest limiter in the current data." });
  if (probability.score < 45 || projections.questionEstimate?.feasibility === "Challenging") risks.push({ type: "Missed Goal Risk", level: "High", reason: "The requested timeline or current consistency may not support the goal." });
  return risks.length ? risks : [{ type: "Low Risk", level: "Low", reason: "No major prediction risk detected from current data." }];
}

function predictionRecommendations(profileData, risks, probability) {
  const recs = [];
  if (profileData.workoutAdherence < 70) recs.push({ action: "Increase adherence", reason: "Completing more planned sessions improves the reliability of the projection." });
  if (profileData.recoveryScore < 65) recs.push({ action: "Improve recovery", reason: "Better readiness supports strength progress and lowers burnout risk." });
  if (profileData.nutritionAdherence < 70) recs.push({ action: "Increase protein", reason: "More consistent protein and meal targets improve fat-loss and muscle-gain projections." });
  if (risks.some((risk) => ["Burnout Risk", "Overtraining Risk", "Low Adherence Risk"].includes(risk.type))) recs.push({ action: "Adjust training frequency", reason: "A sustainable schedule is more predictive than an aggressive one that gets missed." });
  if (!recs.length || probability.label === "High") recs.push({ action: "Maintain current plan", reason: "The current adherence, recovery, and training frequency support the goal estimate." });
  return recs.slice(0, 5);
}

function renderProgressPredictionDashboard() {
  if (!fields.predictionScore) return;
  const result = progressPredictionEngine();
  const topRisk = result.risks[0];
  const topRecommendation = result.recommendations[0];
  const week12 = result.projections.ranges.find((range) => range.weeks === 12);
  const rangeText = week12?.weightKgRange ? `${week12.weightKgRange[0]}-${week12.weightKgRange[1]}kg in 12 weeks` : "Add weight logs for a 12-week range";
  fields.predictionScore.textContent = result.goalProbability.score;
  fields.predictionBadge.textContent = result.goalProbability.label;
  fields.predictionGoal.textContent = `Goal: ${goalLabel(result.profile.currentGoal)}`;
  fields.predictionTimeline.textContent = `Estimated timeline: ${rangeText}. Estimates only.`;
  fields.predictionProbability.textContent = result.goalProbability.label;
  fields.predictionTopRisk.textContent = topRisk.type;
  fields.predictionTopRecommendation.innerHTML = `<article><strong>${escapeHtml(topRecommendation.action)}</strong><span>${escapeHtml(topRecommendation.reason)}</span></article>`;
  fields.predictionTrendSummary.textContent = `${result.projections.bodyFatTrend} · ${result.projections.muscleGainTrend} · ${result.projections.strengthTrend}`;
  setRing(fields.predictionScoreRing, result.goalProbability.score);
}

function smartNotificationEngine() {
  const analytics = trainingAnalyticsEngine();
  const readiness = recoveryReadinessEngine();
  const habit = habitAdherenceEngine();
  const prediction = progressPredictionEngine();
  const stored = loadNotificationState();
  const generated = notificationTriggers({ analytics, readiness, habit, prediction });
  const notifications = collapseNotifications(generated).map((item) => ({
    ...item,
    read: Boolean(stored.read?.[item.id]),
    dismissed: Boolean(stored.dismissed?.[item.id]),
  })).filter((item) => !item.dismissed)
    .sort((a, b) => notificationPriorityRank(a.priority) - notificationPriorityRank(b.priority) || new Date(b.timestamp) - new Date(a.timestamp));
  return {
    notifications,
    unreadCount: notifications.filter((item) => !item.read).length,
    priorityBadge: notifications[0]?.priority || "Low",
    weeklySummary: weeklyNotificationSummary({ analytics, readiness, habit, prediction }),
    dataSafety: "Notifications are recommendation-only. They never modify workouts, nutrition plans, workout history, recovery, or user data automatically.",
  };
}

function notificationTriggers({ analytics, readiness, habit, prediction }) {
  const now = new Date().toISOString();
  const today = dateKey(new Date());
  const todayPlan = plannedWorkoutForDate(today, activeProgram());
  const targets = nutritionTargets();
  const todayFoods = foods.filter((food) => dateKey(new Date(food.createdAt)) === today);
  const totals = dailyFoodTotals(todayFoods);
  const list = [];
  if (todayPlan) list.push(notificationItem("workout-reminder-today", now, "Medium", "Workout Reminder", "Workout on deck", `Today is scheduled for ${todayPlan.title.replace(/^Day \d+:\s*/, "")}. Start when you have a good window.`, "Start Workout", "track"));
  if (readiness.recoveryScore > 80) list.push(notificationItem("recovery-ready", now, "Medium", "Recovery Ready", "You look well recovered", "Great day to train normally if your schedule allows.", "Start Workout", "track"));
  if (readiness.recoveryScore < 40) list.push(notificationItem("recovery-warning", now, "High", "Recovery Warning", "Prioritize recovery today", "Your readiness is low. Consider a recovery session, mobility, or rest.", "View Recovery", "trainingAnalytics"));
  if (habit.profile.missedWorkouts.length >= 2) list.push(notificationItem("habit-missed-workouts", now, "High", "Habit Reminder", "Two workouts were missed", "Consider reducing weekly frequency or shortening sessions this week.", "Open Analytics", "trainingAnalytics"));
  if (habit.trends.direction === "Improving") list.push(notificationItem("habit-improving", now, "Low", "Streak Achievement", "Consistency is improving", "Nice work — your 7-day consistency is trending upward.", "Ask AI Coach", "coachChat"));
  if (Math.max(habit.profile.workoutStreak, habit.profile.nutritionStreak) >= 7) list.push(notificationItem("streak-7-day", now, "Low", "Streak Achievement", "7-day streak", "Congratulations — you have a strong weekly streak going.", "View Progress", "progress"));
  if (totals.protein < targets.protein * 0.7) list.push(notificationItem("nutrition-protein-reminder", now, "Medium", "Nutrition Reminder", "Protein is behind target", `You have ${Math.max(0, targets.protein - totals.protein)}g protein left today.`, "Open Nutrition", "nutrition"));
  if (prediction.risks.some((risk) => risk.type === "Plateau Risk")) list.push(notificationItem("plateau-risk", now, "High", "Prediction Update", "Plateau risk detected", "Progress may slow unless adherence, recovery, or plan fit improves.", "Open Analytics", "trainingAnalytics"));
  if (prediction.risks.some((risk) => risk.type === "Missed Goal Risk")) list.push(notificationItem("goal-timeline-delayed", now, "Medium", "Goal Progress", "Goal timeline may be delayed", "Your projection suggests the timeline may need more consistency or recovery.", "Ask AI Coach", "coachChat"));
  list.push(notificationItem("weekly-summary", now, "Low", "Weekly Summary", "Weekly coach summary is ready", "Review workouts, recovery, adherence, prediction, and the next best opportunity.", "View Progress", "progress"));
  if (!list.length) list.push(notificationItem("system-ready", now, "Low", "System Notification", "Coach notifications are active", "Keep logging your routine and I will surface important coaching cues here.", "Ask AI Coach", "coachChat"));
  return list;
}

function notificationItem(id, timestamp, priority, category, title, message, actionLabel, tabTarget) {
  return { id, timestamp, priority, category, title, message, action: { label: actionLabel, tabTarget }, read: false, dismissed: false };
}

function collapseNotifications(items) {
  return Object.values(items.reduce((acc, item) => {
    const key = item.id || `${item.category}-${item.title}`;
    const existing = acc[key];
    if (!existing || notificationPriorityRank(item.priority) < notificationPriorityRank(existing.priority)) acc[key] = item;
    return acc;
  }, {}));
}

function notificationPriorityRank(priority) {
  const index = NOTIFICATION_PRIORITIES.indexOf(priority);
  return index === -1 ? NOTIFICATION_PRIORITIES.length : index;
}

function weeklyNotificationSummary({ analytics, readiness, habit, prediction }) {
  const workouts = new Set(analytics.records.filter((record) => lastDateKeysUntil(dateKey(new Date()), 7).includes(record.date)).map((record) => record.date)).size;
  const topAchievement = Math.max(habit.profile.workoutStreak, habit.profile.nutritionStreak) >= 7 ? "7-day streak" : habit.trends.direction === "Improving" ? "Consistency improved" : "Routine logged";
  const opportunity = prediction.risks[0]?.type || habit.behaviorInsights[0]?.type || "Keep building data";
  const recommendation = prediction.recommendations[0]?.action || readiness.trainingRecommendation.action;
  return {
    workouts,
    recovery: `${readiness.recoveryScore}/100 ${readiness.trainingReadiness}`,
    adherence: `${habit.adherenceScore}/100 ${habit.category}`,
    prediction: `${prediction.goalProbability.label} success probability`,
    recommendation,
    highlight: readiness.recoveryScore >= 80 ? "Recovery is strong" : habit.trends.direction === "Improving" ? "Adherence is improving" : "Small consistent actions matter most",
    topAchievement,
    biggestOpportunity: opportunity,
  };
}

function renderSmartNotificationsDashboard() {
  if (!fields.notificationRecentList) return;
  const center = smartNotificationEngine();
  fields.notificationUnreadCount.textContent = center.unreadCount;
  fields.notificationRecentCount.textContent = center.notifications.length;
  fields.notificationPriorityBadge.textContent = center.priorityBadge;
  fields.notificationRecentList.innerHTML = center.notifications.slice(0, 4).map((item) => `
    <article data-priority="${escapeHtml(item.priority)}">
      <strong>${escapeHtml(item.title)}</strong>
      <span>${escapeHtml(item.category)} · ${escapeHtml(item.priority)} · ${item.read ? "Read" : "Unread"}</span>
      <p>${escapeHtml(item.message)}</p>
      <div class="notification-actions">
        <button class="secondary notification-action" data-notification-action="open" data-notification-id="${escapeHtml(item.id)}" type="button">${escapeHtml(item.action.label)}</button>
        <button class="secondary notification-action" data-notification-action="read" data-notification-id="${escapeHtml(item.id)}" type="button">Mark read</button>
        <button class="secondary notification-action" data-notification-action="dismiss" data-notification-id="${escapeHtml(item.id)}" type="button">Dismiss</button>
      </div>
    </article>
  `).join("");
  const summary = center.weeklySummary;
  fields.notificationWeeklySummary.textContent = `Weekly summary: ${summary.workouts} workouts · Recovery ${summary.recovery} · Adherence ${summary.adherence} · ${summary.prediction}. Highlight: ${summary.highlight}. Opportunity: ${summary.biggestOpportunity}. Recommendation: ${summary.recommendation}.`;
}

function handleNotificationAction(action, id) {
  const center = smartNotificationEngine();
  const notification = center.notifications.find((item) => item.id === id);
  if (!notification) return;
  const state = loadNotificationState();
  if (action === "read" || action === "open") state.read[id] = true;
  if (action === "dismiss") state.dismissed[id] = true;
  saveNotificationState(state);
  if (action === "open" && notification.action.tabTarget) switchTab(notification.action.tabTarget);
  renderSmartNotificationsDashboard();
}

function loadNotificationState() {
  try {
    return { read: {}, dismissed: {}, ...JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY()) || "{}") };
  } catch {
    return { read: {}, dismissed: {} };
  }
}

function saveNotificationState(state) {
  localStorage.setItem(NOTIFICATIONS_KEY(), JSON.stringify({ read: state.read || {}, dismissed: state.dismissed || {} }));
}

function predictionContextFromMessage(message) {
  const text = normalizeExerciseName(message);
  const kgMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilo|kilogram)/);
  const months = text.match(/(\d+)\s*(?:month|months)/);
  const weeks = text.match(/(\d+)\s*(?:week|weeks)/);
  const numberWords = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, twelve: 12 };
  const wordMonth = Object.entries(numberWords).find(([word]) => text.includes(`${word} month`));
  const targetWeightChangeKg = kgMatch ? Number(kgMatch[1]) : 0;
  const timeWeeks = weeks ? Number(weeks[1]) : months ? Number(months[1]) * 4 : wordMonth ? Number(wordMonth[1]) * 4 : 0;
  return { targetWeightChangeKg, timeWeeks };
}

function frequentSkippedDays(missedWorkouts) {
  const counts = {};
  missedWorkouts.forEach((item) => { counts[item.day] = (counts[item.day] || 0) + 1; });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return top && top[1] >= 1 ? top[0] : "";
}

function preferredWorkoutTime(records) {
  if (!records.length) return "Not enough data";
  const buckets = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
  records.forEach((record) => {
    const hour = new Date(record.createdAt).getHours();
    if (hour < 11) buckets.Morning += 1;
    else if (hour < 17) buckets.Afternoon += 1;
    else if (hour < 21) buckets.Evening += 1;
    else buckets.Night += 1;
  });
  return Object.entries(buckets).sort((a, b) => b[1] - a[1])[0][0];
}

function preferredTrainingDays(records) {
  const counts = {};
  records.forEach((record) => { counts[weekdayName(record.date)] = (counts[weekdayName(record.date)] || 0) + 1; });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([day]) => day);
}

function workoutDateStreak(workoutDates) {
  let streak = 0;
  const cursor = new Date();
  for (let index = 0; index < 365; index += 1) {
    const key = dateKey(cursor);
    if (!workoutDates.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function nutritionDateStreak() {
  let streak = 0;
  const cursor = new Date();
  for (let index = 0; index < 365; index += 1) {
    const key = dateKey(cursor);
    const stats = mealAdherenceStats([key]);
    if (stats.adherence < 100) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function longestDateStreak(dates) {
  const sorted = [...new Set(dates)].sort();
  let best = 0;
  let streak = 0;
  let previous = "";
  sorted.forEach((date) => {
    streak = previous && daysBetween(previous, date) === 1 ? streak + 1 : 1;
    best = Math.max(best, streak);
    previous = date;
  });
  return best;
}

function renderTrainingAnalytics() {
  const analytics = trainingAnalyticsEngine();
  if (!fields.analyticsRecoveryScore) return;
  fields.analyticsStatus.textContent = analytics.records.length ? `${analytics.records.length} records` : "No workout data";
  fields.analyticsRecoveryScore.textContent = analytics.recovery.score;
  fields.analyticsFatigueScore.textContent = analytics.fatigue.score;
  fields.analyticsWeeklySets.textContent = analytics.weekly.totalSets;
  fields.analyticsDensity.textContent = analytics.density.setsPerMinute.toFixed(2);
  fields.analyticsRecommendation.textContent = `${analytics.recovery.status} · ${analytics.fatigue.recommendation}`;
  fields.weeklyMuscleVolumeList.innerHTML = renderMuscleVolumeList(analytics.weekly.muscles);
  fields.monthlyMuscleVolumeList.innerHTML = renderMuscleVolumeList(analytics.monthly.muscles);
  fields.balanceStatus.textContent = analytics.balance.status;
  fields.trainingBalanceGrid.innerHTML = `
    <article><strong>${analytics.balance.push}%</strong><span>Push</span></article>
    <article><strong>${analytics.balance.pull}%</strong><span>Pull</span></article>
    <article><strong>${analytics.balance.legs}%</strong><span>Legs</span></article>
    <article><strong>${analytics.balance.upperLower.upper}%</strong><span>Upper</span></article>
    <article><strong>${analytics.balance.upperLower.lower}%</strong><span>Lower</span></article>
    <article><strong>${analytics.balance.upperLower.ratio}</strong><span>Upper / Lower</span></article>
  `;
  fields.leftRightBalance.innerHTML = analytics.leftRight.available
    ? renderBalanceRow("Left / Right", analytics.leftRight.left, analytics.leftRight.right, analytics.leftRight.status)
    : `<div class="empty">Not enough data สำหรับ unilateral left/right balance</div>`;
  fields.recoveryFatigueGrid.innerHTML = `
    <article><strong>${analytics.recovery.score}</strong><span>${analytics.recovery.status}</span></article>
    <article><strong>${analytics.fatigue.score}</strong><span>Fatigue</span></article>
    <article><strong>${analytics.recovery.daysSinceLast}</strong><span>Days since last workout</span></article>
    <article><strong>${analytics.density.averageSessionLength} นาที</strong><span>Avg session length</span></article>
    <article><strong>${analytics.density.volumePerMinute}</strong><span>Volume / min</span></article>
    <article><strong>${analytics.streak.current} วัน</strong><span>Consecutive days</span></article>
  `;
  fields.muscleHeatmap.innerHTML = ANALYTICS_MUSCLES.map((muscle) => {
    const sets = analytics.weekly.muscles[muscle] || 0;
    const level = heatLevel(sets);
    return `<article class="heat-${level.key}"><strong>${muscle}</strong><span>${sets} sets</span><small>${level.label}</small></article>`;
  }).join("");
  fields.volumeLandmarkList.innerHTML = ANALYTICS_MUSCLES.map((muscle) => renderLandmarkRow(muscle, analytics.weekly.muscles[muscle] || 0)).join("");
  fields.weakPointList.innerHTML = analytics.weakPoints.length ? analytics.weakPoints.map((point) => `
    <article class="overload-item"><header><strong>${escapeHtml(point.title)}</strong><span>${point.severity}</span></header><p>${escapeHtml(point.detail)}</p><small>${escapeHtml(point.suggestion)}</small></article>
  `).join("") : `<div class="empty">ยังไม่พบ weak point ชัดเจน รักษาความสม่ำเสมอได้เลย</div>`;
  fields.exerciseStatsCount.textContent = `${analytics.exerciseFrequency.length} exercises`;
  fields.exerciseFrequencyList.innerHTML = analytics.exerciseFrequency.length ? analytics.exerciseFrequency.slice(0, 30).map((item) => `
    <article class="overload-item"><header><strong>${escapeHtml(item.name)}</strong><span>${item.sessions} sessions</span></header><p>Last trained ${item.lastTrained} · Avg interval ${item.averageInterval} วัน</p><small>Weekly frequency ${item.weeklyFrequency}x</small></article>
  `).join("") : `<div class="empty">ยังไม่มี exercise statistics</div>`;
}

function trainingAnalyticsEngine() {
  const signature = [
    entries.length,
    programHistory.length,
    entries[0]?.id || "",
    entries[0]?.createdAt || "",
    programHistory[0]?.date || "",
    programHistory[0]?.name || "",
    programHistory[0]?.weight || "",
    programHistory[0]?.reps || "",
  ].join("|");
  if (trainingAnalyticsCache.signature === signature && trainingAnalyticsCache.data) return trainingAnalyticsCache.data;
  const records = normalizeWorkoutRecords().map(enrichAnalyticsRecord).filter((record) => record.name);
  const today = dateKey(new Date());
  const weeklyDates = lastDateKeysUntil(today, 7);
  const monthlyDates = lastDateKeysUntil(today, 30);
  const weeklyRecords = records.filter((record) => weeklyDates.includes(record.date));
  const monthlyRecords = records.filter((record) => monthlyDates.includes(record.date));
  const weekly = muscleVolumeSummary(weeklyRecords);
  const monthly = muscleVolumeSummary(monthlyRecords);
  const density = trainingDensity(weeklyRecords);
  const streak = workoutStreakStats(records);
  const balance = trainingBalance(weekly.muscles);
  const leftRight = leftRightBalance(weeklyRecords);
  const recovery = recoveryScore(records, weekly, density, streak);
  const fatigue = fatigueScore(records, weekly, density, streak);
  const exerciseFrequency = exerciseFrequencyStats(records);
  const weakPoints = weakPointDetection(weekly.muscles, balance, exerciseFrequency);
  const data = { records, weekly, monthly, density, streak, balance, leftRight, recovery, fatigue, exerciseFrequency, weakPoints };
  trainingAnalyticsCache = { signature, data };
  return data;
}

function enrichAnalyticsRecord(record) {
  const catalog = findExerciseMetadata(record.name);
  const muscles = mapExerciseMuscles(record.name, catalog);
  return { ...record, catalog, muscles, movementPattern: catalog?.movementPattern || inferMovementPattern(record.name), unilateral: isUnilateral(record.name, catalog) };
}

function findExerciseMetadata(name) {
  const normalized = normalizeExerciseName(name);
  return EXERCISE_CATALOG.find((exercise) => normalizeExerciseName(exercise.nameEn) === normalized || normalizeExerciseName(exercise.nameTh) === normalized) || null;
}

function mapExerciseMuscles(name, catalog) {
  const mapped = new Set();
  const primary = normalizeAnalyticsMuscle(catalog?.primaryMuscle || inferPrimaryMuscle(name));
  if (primary) mapped.add(primary);
  (catalog?.secondaryMuscles || []).forEach((muscle) => {
    const normalized = normalizeAnalyticsMuscle(muscle);
    if (normalized) mapped.add(normalized);
  });
  if (!mapped.size) mapped.add("Core");
  return [...mapped];
}

function normalizeAnalyticsMuscle(muscle) {
  const map = {
    Chest: "Chest", Back: "Back", Lats: "Lats", Shoulders: "Side Delts", "Rear Delts": "Rear Delts", "Side Delts": "Side Delts", "Front Delts": "Front Delts",
    Biceps: "Biceps", Triceps: "Triceps", Forearms: "Forearms", Core: "Core", Abs: "Core", "Lower Back": "Lower Back",
    Glutes: "Glutes", Quadriceps: "Quads", Quads: "Quads", Hamstrings: "Hamstrings", Calves: "Calves",
  };
  return map[muscle] || "";
}

function inferPrimaryMuscle(name) {
  const text = normalizeExerciseName(name);
  if (text.includes("bench") || text.includes("push up") || text.includes("press")) return text.includes("overhead") ? "Front Delts" : "Chest";
  if (text.includes("row") || text.includes("pull")) return text.includes("pull") ? "Lats" : "Back";
  if (text.includes("curl")) return "Biceps";
  if (text.includes("triceps")) return "Triceps";
  if (text.includes("squat") || text.includes("lunge")) return "Quads";
  if (text.includes("deadlift") || text.includes("hinge")) return "Hamstrings";
  if (text.includes("hip thrust") || text.includes("glute")) return "Glutes";
  if (text.includes("calf")) return "Calves";
  return "Core";
}

function inferMovementPattern(name) {
  const text = normalizeExerciseName(name);
  if (text.includes("push") || text.includes("press")) return "Horizontal Push";
  if (text.includes("pull")) return "Vertical Pull";
  if (text.includes("row")) return "Horizontal Pull";
  if (text.includes("squat")) return "Squat";
  if (text.includes("lunge")) return "Lunge";
  if (text.includes("deadlift") || text.includes("hinge")) return "Hinge";
  return "Core";
}

function muscleVolumeSummary(records) {
  const muscles = Object.fromEntries(ANALYTICS_MUSCLES.map((muscle) => [muscle, 0]));
  records.forEach((record) => {
    const sets = Math.max(1, Number(record.sets || 0));
    record.muscles.forEach((muscle, index) => {
      muscles[muscle] = Math.round((muscles[muscle] || 0) + sets * (index === 0 ? 1 : 0.5));
    });
  });
  const totalSets = Math.round(Object.values(muscles).reduce((total, value) => total + value, 0));
  return { muscles, totalSets };
}

function trainingBalance(muscles) {
  const push = (muscles.Chest || 0) + (muscles["Front Delts"] || 0) + (muscles["Side Delts"] || 0) + (muscles.Triceps || 0);
  const pull = (muscles.Back || 0) + (muscles.Lats || 0) + (muscles["Rear Delts"] || 0) + (muscles.Biceps || 0) + (muscles.Forearms || 0);
  const legs = (muscles.Glutes || 0) + (muscles.Quads || 0) + (muscles.Hamstrings || 0) + (muscles.Calves || 0);
  const total = Math.max(1, push + pull + legs);
  const upper = push + pull + (muscles.Core || 0);
  const lower = legs + (muscles["Lower Back"] || 0);
  const upperLowerTotal = Math.max(1, upper + lower);
  const status = Math.max(push, pull, legs) - Math.min(push, pull, legs) <= total * 0.25 ? "Balanced" : "Needs Attention";
  return { push: Math.round(push / total * 100), pull: Math.round(pull / total * 100), legs: Math.round(legs / total * 100), upperLower: { upper: Math.round(upper / upperLowerTotal * 100), lower: Math.round(lower / upperLowerTotal * 100), ratio: lower ? `${(upper / lower).toFixed(1)}:1` : "Upper only" }, status, raw: { push, pull, legs, upper, lower } };
}

function leftRightBalance(records) {
  const unilateral = records.filter((record) => record.unilateral);
  if (unilateral.length < 2) return { available: false, left: 0, right: 0, status: "Not enough data" };
  const left = Math.round(unilateral.reduce((total, record) => total + record.volume / 2, 0));
  const right = Math.round(unilateral.reduce((total, record) => total + record.volume / 2, 0));
  return { available: true, left, right, status: "Estimated balanced" };
}

function isUnilateral(name, catalog) {
  const text = normalizeExerciseName(`${name} ${catalog?.instructions || ""}`);
  return ["single", "one arm", "one leg", "split", "lunge", "/ข้าง", "ข้าง"].some((word) => text.includes(word));
}

function trainingDensity(records) {
  const minutes = Math.max(1, sum(records, "minutes"));
  const sets = sum(records, "sets");
  const volume = sum(records, "volume");
  const workoutDays = new Set(records.map((record) => record.date)).size;
  return { setsPerMinute: sets / minutes, volumePerMinute: Math.round(volume / minutes), averageSessionLength: workoutDays ? Math.round(minutes / workoutDays) : 0 };
}

function recoveryScore(records, weekly, density, streak) {
  const latest = records.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  const daysSinceLast = latest ? Math.max(0, daysBetween(latest.date, dateKey(new Date()))) : 99;
  const rpe = Number(averageRpe(records.filter((record) => lastDateKeysUntil(dateKey(new Date()), 7).includes(record.date))) || 0);
  let score = 72;
  if (daysSinceLast >= 1) score += 12;
  if (daysSinceLast >= 3) score += 8;
  if (weekly.totalSets > 90) score -= 18;
  if (weekly.totalSets > 130) score -= 16;
  if (density.averageSessionLength > 75) score -= 10;
  if (rpe >= 8.5) score -= 14;
  if (streak.current >= 4) score -= 12;
  score = Math.max(0, Math.min(100, Math.round(score)));
  return { score, daysSinceLast: latest ? daysSinceLast : "-", status: score >= 85 ? "Excellent" : score >= 70 ? "Good" : score >= 50 ? "Moderate" : "Poor" };
}

function fatigueScore(records, weekly, density, streak) {
  const rpe = Number(averageRpe(records.filter((record) => lastDateKeysUntil(dateKey(new Date()), 7).includes(record.date))) || 0);
  let score = 18 + Math.min(38, weekly.totalSets * 0.35) + Math.min(18, density.averageSessionLength * 0.18);
  if (rpe >= 7) score += (rpe - 6) * 8;
  if (streak.current >= 3) score += streak.current * 3;
  score = Math.max(0, Math.min(100, Math.round(score)));
  const recommendation = score >= 80 ? "Rest Day" : score >= 65 ? "Deload" : score >= 50 ? "Reduce Volume" : "Maintain";
  return { score, recommendation };
}

function exerciseFrequencyStats(records) {
  return Object.values(groupByExercise(records)).map((list) => {
    const sorted = [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const dates = [...new Set(sorted.map((record) => record.date))];
    const intervals = dates.slice(1).map((date, index) => daysBetween(dates[index], date));
    const weeklyDates = new Set(lastDateKeysUntil(dateKey(new Date()), 7));
    return { name: sorted[sorted.length - 1]?.name || "", sessions: dates.length, lastTrained: dates.length ? formatShortDate(dates[dates.length - 1]) : "-", averageInterval: intervals.length ? average(intervals) : "-", weeklyFrequency: dates.filter((date) => weeklyDates.has(date)).length };
  }).sort((a, b) => b.sessions - a.sessions);
}

function weakPointDetection(muscles, balance, frequency) {
  const points = [];
  ANALYTICS_MUSCLES.forEach((muscle) => {
    const [min] = VOLUME_LANDMARKS[muscle];
    if ((muscles[muscle] || 0) > 0 && muscles[muscle] < min) points.push({ title: `${muscle} volume below target`, severity: "Medium", detail: `${muscle} ตอนนี้ ${muscles[muscle]} sets ต่ำกว่า maintenance ${min} sets`, suggestion: `เพิ่ม ${muscle} อีก ${min - muscles[muscle]} sets ในสัปดาห์นี้` });
  });
  if ((muscles.Hamstrings || 0) < (muscles.Quads || 0) * 0.55 && (muscles.Quads || 0) >= 8) points.push({ title: "Hamstrings trained less than Quads", severity: "High", detail: "hamstrings ต่ำกว่า quads มาก อาจทำให้ lower-body balance ไม่ดี", suggestion: "เพิ่ม hinge, leg curl หรือ RDL แบบคุมฟอร์ม" });
  const backFreq = frequency.filter((item) => ["row", "pull", "lat"].some((word) => normalizeExerciseName(item.name).includes(word))).reduce((total, item) => total + item.weeklyFrequency, 0);
  if (backFreq < 2 && ((muscles.Chest || 0) + (muscles.Triceps || 0)) >= 10) points.push({ title: "Back frequency low", severity: "Medium", detail: "pulling frequency ต่ำเมื่อเทียบกับ push volume", suggestion: "เพิ่ม row/pulldown อย่างน้อย 2 ครั้งต่อสัปดาห์" });
  if (balance.status === "Needs Attention") points.push({ title: "Push / Pull / Legs imbalance", severity: "Medium", detail: `Push ${balance.push}% · Pull ${balance.pull}% · Legs ${balance.legs}%`, suggestion: "กระจาย volume ให้ใกล้กันขึ้นในสัปดาห์ถัดไป" });
  return points.slice(0, 8);
}

function renderMuscleVolumeList(muscles) {
  const max = Math.max(1, ...Object.values(muscles));
  return ANALYTICS_MUSCLES.map((muscle) => {
    const sets = muscles[muscle] || 0;
    return `<article class="analytics-volume-row"><div><strong>${muscle}</strong><span>${sets} Sets</span></div><div class="macro-track"><div class="macro-fill" style="width:${Math.round(sets / max * 100)}%"></div></div></article>`;
  }).join("");
}

function renderBalanceRow(label, left, right, status) {
  const total = Math.max(1, left + right);
  return `<article class="analytics-volume-row"><div><strong>${label}</strong><span>${status} · L ${left} / R ${right}</span></div><div class="macro-track"><div class="macro-fill" style="width:${Math.round(left / total * 100)}%"></div></div></article>`;
}

function renderLandmarkRow(muscle, sets) {
  const [min, max] = VOLUME_LANDMARKS[muscle];
  const status = sets < min ? "Below Range" : sets <= max ? "Optimal" : "Above Range";
  return `<article class="analytics-volume-row landmark-${status.toLowerCase().replace(/\s+/g, "-")}"><div><strong>${muscle}</strong><span>Maintenance ${min} · Current ${sets} · Range ${min}-${max} sets</span></div><small>${status}</small></article>`;
}

function heatLevel(sets) {
  if (sets >= 20) return { key: "very-high", label: "Very High" };
  if (sets >= 14) return { key: "high", label: "High" };
  if (sets >= 8) return { key: "medium", label: "Medium" };
  if (sets > 0) return { key: "low", label: "Low" };
  return { key: "none", label: "No Training" };
}

function renderWorkoutIntelligence() {
  const engine = progressiveOverloadEngine();
  if (fields.workoutOverloadSummary) {
    fields.workoutOverloadSummary.innerHTML = `
      <article><strong>${engine.summary.newPr}</strong><span>New PR achieved</span></article>
      <article><strong>${engine.summary.improved}</strong><span>Exercises improved</span></article>
      <article><strong>${engine.summary.maintained}</strong><span>Exercises maintained</span></article>
      <article><strong>${engine.summary.declined}</strong><span>Exercises declined</span></article>
      <article><strong>${engine.streak.current} วัน</strong><span>Workout streak</span></article>
      <article><strong>${formatKg(engine.weekly.volume)}</strong><span>Weekly volume</span></article>
    `;
  }
  if (!fields.exerciseTrendList) return;
  const trends = Object.values(engine.exercises).slice(0, 8);
  fields.exerciseTrendList.innerHTML = trends.length ? trends.map(renderExerciseTrendCard).join("") : `<div class="empty">เริ่มบันทึก workout เพื่อดูแนวโน้มการฝึก</div>`;
}

function renderProgressiveOverload() {
  const engine = progressiveOverloadEngine();
  if (fields.previousPerformanceCount) fields.previousPerformanceCount.textContent = `${Object.keys(engine.exercises).length} ท่า`;
  if (fields.previousPerformanceList) {
    const items = Object.values(engine.exercises).slice(0, 12);
    fields.previousPerformanceList.innerHTML = items.length ? items.map((item) => `
      <article class="overload-item">
        <header><strong>${escapeHtml(item.name)}</strong><span>${item.last ? formatShortDate(item.last.date) : "-"}</span></header>
        <p>Previous: ${performanceLabel(item.last)} · Current Target: ${performanceLabel(item.target || item.last)}</p>
        <small>${escapeHtml(item.suggestion)}</small>
      </article>
    `).join("") : `<div class="empty">ยังไม่มี previous performance</div>`;
  }
  if (fields.personalRecordCount) fields.personalRecordCount.textContent = `${engine.personalRecords.length} PR`;
  if (fields.personalRecordList) {
    fields.personalRecordList.innerHTML = engine.personalRecords.length ? engine.personalRecords.slice(0, 12).map((record) => `
      <article class="overload-item pr-item">
        <header><strong><span class="pr-badge">PR</span> ${escapeHtml(record.name)}</strong><span>${record.type}</span></header>
        <p>${escapeHtml(record.label)}</p>
        <small>${record.date ? formatShortDate(record.date) : "จากประวัติทั้งหมด"}</small>
      </article>
    `).join("") : `<div class="empty">ยังไม่มี Personal Record</div>`;
  }
  if (fields.weeklyWorkoutStats) fields.weeklyWorkoutStats.innerHTML = renderWorkoutStatGrid(engine.weekly);
  if (fields.monthlyWorkoutStats) fields.monthlyWorkoutStats.innerHTML = renderWorkoutStatGrid(engine.monthly);
}

function renderExerciseTrendCard(item) {
  return `
    <article class="overload-item">
      <header><strong>${escapeHtml(item.name)}</strong>${item.hasPr ? `<span class="pr-badge">PR</span>` : `<span>${item.frequency}x</span>`}</header>
      <p>Weight: ${item.weightTrend} · Volume: ${item.volumeTrend} · 1RM ${item.currentOneRm} / best ${item.bestOneRm} kg</p>
      <small>Frequency ${item.frequency} ครั้ง · Avg RPE ${item.averageRpe || "-"} · ${escapeHtml(item.suggestion)}</small>
    </article>
  `;
}

function renderWorkoutStatGrid(stats) {
  return `
    <article><strong>${stats.workouts}</strong><span>Total workouts</span></article>
    <article><strong>${stats.sets}</strong><span>Total sets</span></article>
    <article><strong>${stats.reps}</strong><span>Total reps</span></article>
    <article><strong>${formatKg(stats.volume)}</strong><span>Total volume</span></article>
    <article><strong>${stats.averageMinutes} นาที</strong><span>Avg duration</span></article>
    <article><strong>${stats.averageRpe || "-"}</strong><span>Avg RPE</span></article>
  `;
}

function progressiveOverloadEngine() {
  const signature = [
    entries.length,
    programHistory.length,
    entries[0]?.id || "",
    entries[0]?.createdAt || "",
    programHistory[0]?.date || "",
    programHistory[0]?.name || "",
    programHistory[0]?.weight || "",
    programHistory[0]?.reps || "",
  ].join("|");
  if (overloadStatsCache.signature === signature && overloadStatsCache.data) return overloadStatsCache.data;
  const records = normalizeWorkoutRecords();
  const sorted = [...records].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const grouped = groupByExercise(sorted);
  const exercises = {};
  Object.entries(grouped).forEach(([key, list]) => {
    const chronological = [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const latest = chronological[chronological.length - 1] || null;
    const previous = chronological[chronological.length - 2] || null;
    const bestWeight = maxRecord(chronological, "weight");
    const bestReps = maxRecord(chronological, "reps");
    const bestOneRmRecord = maxRecord(chronological, "oneRm");
    const bestVolume = maxRecord(chronological, "volume");
    const hasPr = Boolean(latest && [bestWeight, bestReps, bestOneRmRecord, bestVolume].some((record) => record?.id === latest.id));
    exercises[key] = {
      name: latest?.name || key,
      last: latest,
      previous,
      target: previous || latest,
      bestWeight,
      bestReps,
      bestOneRmRecord,
      bestOneRm: Math.round(bestOneRmRecord?.oneRm || 0),
      currentOneRm: Math.round(latest?.oneRm || 0),
      bestVolume,
      frequency: chronological.length,
      averageRpe: averageRpe(chronological),
      weightTrend: trendLabel(latest?.weight, previous?.weight, "kg"),
      volumeTrend: trendLabel(latest?.volume, previous?.volume, "kg"),
      suggestion: overloadSuggestion(latest, previous),
      hasPr,
    };
  });
  const today = dateKey(new Date());
  const weekDates = lastDateKeysUntil(today, 7);
  const monthDates = lastDateKeysUntil(today, 30);
  const data = {
    records: sorted,
    exercises,
    personalRecords: personalRecordsFromExercises(exercises),
    weekly: workoutStatsForDates(records, weekDates),
    monthly: workoutStatsForDates(records, monthDates),
    streak: workoutStreakStats(records),
    summary: workoutImprovementSummary(exercises),
    lastWorkout: sorted[0] || null,
  };
  overloadStatsCache = { signature, data };
  return data;
}

function normalizeWorkoutRecords() {
  const manual = entries.map((entry) => {
    const createdAt = validIso(entry.createdAt) || new Date().toISOString();
    const sets = Number(entry.sets || 0);
    const reps = Number(entry.reps || 0);
    const weight = Number(entry.weight || 0);
    const rpe = Number(entry.rpe || 0);
    const minutes = Number(entry.minutes || 0);
    return workoutRecord({
      id: entry.id || `entry-${createdAt}-${entry.name}`,
      source: entry.source || "manual",
      name: entry.name,
      sets,
      reps,
      weight,
      rpe,
      minutes,
      createdAt,
      notes: entry.notes || "",
    });
  });
  const program = programHistory.map((record, index) => {
    const date = record.date || dateKey(new Date(record.createdAt || Date.now()));
    const createdAt = validIso(record.createdAt) || `${date}T12:00:00.000Z`;
    const reps = Number(record.reps || 0);
    const weight = Number(record.weight || 0);
    const sets = Number(record.sets || 1);
    return workoutRecord({
      id: record.id || `program-${date}-${record.name}-${index}`,
      source: "program",
      name: record.name,
      sets,
      reps,
      weight,
      rpe: Number(record.rpe || 0),
      minutes: Number(record.cardio || 0),
      createdAt,
      notes: record.notes || "",
    });
  });
  return manual.concat(program).filter((record) => record.name && record.date);
}

function workoutRecord(input) {
  const sets = Math.max(0, Number(input.sets || 0));
  const reps = Math.max(0, Number(input.reps || 0));
  const weight = Math.max(0, Number(input.weight || 0));
  const volume = Math.round(sets * reps * weight);
  const oneRm = weight && reps ? estimatedOneRm(weight, reps) : 0;
  return {
    ...input,
    name: String(input.name || "").trim(),
    date: dateKey(new Date(input.createdAt)),
    sets,
    reps,
    weight,
    volume,
    oneRm,
  };
}

function groupByExercise(records) {
  return records.reduce((groups, record) => {
    const key = normalizeExerciseName(record.name);
    groups[key] = groups[key] || [];
    groups[key].push(record);
    return groups;
  }, {});
}

function normalizeExerciseName(name) {
  return String(name || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function maxRecord(records, field) {
  return records.reduce((best, record) => Number(record[field] || 0) > Number(best?.[field] || 0) ? record : best, null);
}

function estimatedOneRm(weight, reps) {
  return Math.round(Number(weight || 0) * (1 + Number(reps || 0) / 30) * 10) / 10;
}

function overloadSuggestion(latest, previous) {
  if (!latest) return "เริ่มเก็บข้อมูลก่อน";
  if (!previous) return "Maintain: สร้าง baseline ครั้งแรก";
  if (latest.rpe >= 9 || latest.volume < previous.volume * 0.85) return "Deload: ลดโหลดเล็กน้อยและคุมฟอร์ม";
  if (latest.weight > previous.weight || latest.reps > previous.reps || latest.volume > previous.volume * 1.03) return "Maintain: ทำได้ดี รักษาฟอร์ม";
  if (latest.rpe && latest.rpe <= 7 && latest.weight) return "Increase weight: เพิ่ม 2.5 kg ครั้งหน้า";
  if (latest.rpe && latest.rpe <= 8) return "Increase reps: เพิ่ม 1 rep ครั้งหน้า";
  if (latest.sets <= previous.sets) return "Add one set: เพิ่มอีก 1 set ถ้าฟอร์มยังดี";
  return "Maintain: ใช้น้ำหนักเดิมและคุม tempo";
}

function personalRecordsFromExercises(exercises) {
  return Object.values(exercises).flatMap((item) => {
    const records = [];
    if (item.bestWeight?.weight) records.push({ name: item.name, type: "Heaviest", label: `${item.bestWeight.weight} kg`, date: item.bestWeight.date });
    if (item.bestReps?.reps) records.push({ name: item.name, type: "Most Reps", label: `${item.bestReps.reps} reps`, date: item.bestReps.date });
    if (item.bestOneRm) records.push({ name: item.name, type: "1RM", label: `${item.bestOneRm} kg estimated 1RM`, date: item.bestOneRmRecord?.date });
    if (item.bestVolume?.volume) records.push({ name: item.name, type: "Volume", label: `${formatKg(item.bestVolume.volume)} training volume`, date: item.bestVolume.date });
    return records;
  }).sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
}

function workoutStatsForDates(records, dates) {
  const set = new Set(dates);
  const scoped = records.filter((record) => set.has(record.date));
  const workoutDates = new Set(scoped.map((record) => record.date));
  const rpeValues = scoped.map((record) => Number(record.rpe || 0)).filter(Boolean);
  return {
    workouts: workoutDates.size,
    sets: sum(scoped, "sets"),
    reps: sum(scoped, "reps"),
    volume: sum(scoped, "volume"),
    averageMinutes: workoutDates.size ? Math.round(sum(scoped, "minutes") / workoutDates.size) : 0,
    averageRpe: rpeValues.length ? (rpeValues.reduce((total, value) => total + value, 0) / rpeValues.length).toFixed(1) : "",
  };
}

function workoutStreakStats(records) {
  const dates = [...new Set(records.map((record) => record.date))].sort();
  const dateSet = new Set(dates);
  let current = 0;
  const cursor = new Date();
  for (let index = 0; index < 365; index += 1) {
    const key = dateKey(cursor);
    if (!dateSet.has(key)) break;
    current += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  let best = 0;
  let run = 0;
  let previous = "";
  dates.forEach((date) => {
    if (!previous || daysBetween(previous, date) === 1) run += 1;
    else run = 1;
    best = Math.max(best, run);
    previous = date;
  });
  const today = dateKey(new Date());
  const weekDates = lastDateKeysUntil(today, 7);
  const monthDates = lastDateKeysUntil(today, 30);
  return {
    current,
    best,
    weeklyConsistency: Math.round(weekDates.filter((date) => dateSet.has(date)).length / 7 * 100),
    monthlyConsistency: Math.round(monthDates.filter((date) => dateSet.has(date)).length / 30 * 100),
  };
}

function workoutImprovementSummary(exercises) {
  return Object.values(exercises).reduce((summary, item) => {
    if (item.hasPr) summary.newPr += 1;
    if (!item.previous || !item.last) return summary;
    if (item.last.volume > item.previous.volume * 1.03 || item.last.oneRm > item.previous.oneRm) summary.improved += 1;
    else if (item.last.volume < item.previous.volume * 0.9) summary.declined += 1;
    else summary.maintained += 1;
    return summary;
  }, { newPr: 0, improved: 0, maintained: 0, declined: 0 });
}

function performanceLabel(record) {
  if (!record) return "ยังไม่มี";
  return `${record.weight || 0} kg × ${record.reps || 0} reps${record.sets ? ` × ${record.sets} sets` : ""}`;
}

function trendLabel(current, previous, unit = "") {
  const now = Number(current || 0);
  const before = Number(previous || 0);
  if (!before && now) return `เริ่มที่ ${now}${unit}`;
  if (!now && !before) return "ยังไม่มี";
  const diff = Math.round((now - before) * 10) / 10;
  if (diff > 0) return `ดีขึ้น +${diff}${unit}`;
  if (diff < 0) return `ลดลง ${Math.abs(diff)}${unit}`;
  return "ทรงตัว";
}

function averageRpe(records) {
  const values = records.map((record) => Number(record.rpe || 0)).filter(Boolean);
  return values.length ? (values.reduce((total, value) => total + value, 0) / values.length).toFixed(1) : "";
}

function formatKg(value) {
  return `${Math.round(Number(value || 0)).toLocaleString()} kg`;
}

function validIso(value) {
  const time = Date.parse(value);
  return Number.isNaN(time) ? "" : new Date(time).toISOString();
}

function daysBetween(start, end) {
  return Math.round((new Date(`${end}T12:00:00`) - new Date(`${start}T12:00:00`)) / 86400000);
}

function renderHistory() {
  renderProgressiveOverload();
  if (!entries.length) {
    fields.historyList.innerHTML = `<div class="empty">ยังไม่มี workout ที่บันทึก</div>`;
    return;
  }
  fields.historyList.innerHTML = entries.slice(0, 40).map(renderHistoryItem).join("");
}

function renderHistoryItem(entry) {
  const volume = entry.sets * entry.reps * entry.weight;
  const calories = entryCalories(entry);
  const engineItem = progressiveOverloadEngine().exercises[normalizeExerciseName(entry.name)];
  const record = progressiveOverloadEngine().records.find((item) => item.id === entry.id);
  const isPr = Boolean(record && [engineItem?.bestWeight, engineItem?.bestReps, engineItem?.bestVolume, engineItem?.bestOneRmRecord].some((item) => item?.id === record.id));
  const suggestion = overloadSuggestion(record, engineItem?.previous);
  const details = [
    `${entry.sets} sets`,
    `${entry.reps} reps`,
    `${entry.weight} kg`,
    `${volume} kg volume`,
    record?.oneRm ? `${record.oneRm} kg e1RM` : "",
    entry.distanceKm ? `${entry.distanceKm} km` : "",
    entry.steps ? `${entry.steps} steps` : "",
    entry.source && entry.source !== "manual" ? `source: ${healthProviderLabels[entry.source] || entry.source}` : "",
  ].filter(Boolean).join(" · ");
  return `
    <article class="history-item">
      <header>
        <div><strong>${isPr ? `<span class="pr-badge">PR</span> ` : ""}${escapeHtml(entry.name)}</strong><span>${formatDate(entry.createdAt)}</span></div>
        <span>${entry.minutes} min · ${calories} kcal</span>
      </header>
      <span>${entry.sets} sets · ${entry.reps} reps · ${entry.weight} kg · ${volume} kg volume</span>
      <span>${escapeHtml(details)}</span>
      <small class="overload-suggestion">${escapeHtml(suggestion)}</small>
      ${entry.notes ? `<p>${escapeHtml(entry.notes)}</p>` : ""}
    </article>
  `;
}

function renderFoodHistory() {
  const today = dateKey(new Date());
  const todayFoods = foods.filter((food) => dateKey(new Date(food.createdAt)) === today);
  if (!todayFoods.length) {
    fields.foodHistoryList.innerHTML = `
      <div class="empty food-empty">
        <span class="empty-illustration" aria-hidden="true"></span>
        <strong>ยังไม่มีอาหารวันนี้</strong>
        <p>เริ่มบันทึกมื้อแรกของคุณ</p>
      </div>
    `;
    return;
  }
  const mealOrder = ["breakfast", "lunch", "dinner", "snack"];
  fields.foodHistoryList.innerHTML = mealOrder.map((meal) => {
    const items = todayFoods.filter((food) => normalizeMeal(food.meal) === meal);
    if (!items.length) return "";
    const totals = dailyFoodTotals(items);
    return `
      <section class="meal-group">
        <div class="meal-group-header">
          <strong>${mealLabel(meal)}</strong>
          <span>${totals.calories} kcal · P ${totals.protein}g · C ${totals.carbs}g · F ${totals.fat}g</span>
        </div>
        ${items.map(renderFoodItem).join("")}
      </section>
    `;
  }).join("");
}

function renderFoodItem(food) {
  return `
    <article class="history-item">
      <header>
        <div><strong>${escapeHtml(food.name)}</strong><span>${escapeHtml(mealLabel(food.meal))} · ${formatDate(food.createdAt)}</span></div>
        <button class="link-button danger-link" data-delete-food="${food.id}" type="button">ลบ</button>
      </header>
      <span>${food.calories} kcal · โปรตีน ${food.protein}g · คาร์บ ${food.carbs}g · ไขมัน ${food.fat}g</span>
      ${food.notes ? `<p>${escapeHtml(food.notes)}</p>` : ""}
    </article>
  `;
}

function applyFoodEstimate(estimate) {
  fields.foodCalories.value = estimate.calories;
  fields.foodProtein.value = estimate.protein;
  fields.foodCarbs.value = estimate.carbs;
  fields.foodFat.value = estimate.fat;
  fields.foodFiber.value = estimate.fiber || 0;
  if (!fields.foodName.value.trim()) fields.foodName.value = estimate.name;
  fields.foodEstimateResult.dataset.confidence = estimate.confidence || 0;
  fields.foodEstimateResult.dataset.source = estimate.source || "local_ai";
  const photo = pendingFoodPhotos[0]?.dataUrl;
  fields.foodEstimateResult.innerHTML = `
    <div class="ai-estimate-card">
      ${photo ? `<img src="${photo}" alt="Food preview">` : ""}
      <div>
        <span class="ai-badge">AI MVP</span>
        <strong>${escapeHtml(estimate.name)}</strong>
        <p>${estimate.calories} kcal · P ${estimate.protein}g · C ${estimate.carbs}g · F ${estimate.fat}g · Fiber ${estimate.fiber || 0}g</p>
        <small>Confidence ${estimate.confidence}% · ${escapeHtml(estimate.reason)}</small>
      </div>
    </div>
  `;
}

async function scanFoodPhotos() {
  if (!pendingFoodPhotos.length) {
    fields.foodEstimateResult.innerHTML = `<strong>ยังไม่มีรูป</strong><br>ถ่ายหรืออัปโหลดรูปอาหารก่อน สูงสุด 3 รูป`;
    return;
  }

  if (!USE_BACKEND || LOCAL_TRACKING_ONLY) {
    const fallback = estimateFoodMacros(fields.foodName.value, fields.foodNotes.value, fields.mealType.value, pendingFoodPhotos.length);
    fallback.reason = "เปิดจากไฟล์เดี่ยว จึงใช้ local estimate จากชื่ออาหาร/มื้อ/จำนวนรูป";
    applyFoodEstimate(fallback);
    return;
  }

  fields.foodEstimateResult.innerHTML = `<strong>Scanning photos...</strong><br>กำลังส่งรูปให้ Vision AI ประเมินอาหาร`;
  try {
    const data = await apiRequest("/api/app/foods/vision-estimate", {
      method: "POST",
      body: {
        name: fields.foodName.value,
        meal: fields.mealType.value,
        notes: fields.foodNotes.value,
        photos: pendingFoodPhotos,
      },
    });
    applyFoodEstimate(data.estimate);
    if (data.estimate.name && !fields.foodName.value.trim()) fields.foodName.value = data.estimate.name;
  } catch (error) {
    const fallback = estimateFoodMacros(fields.foodName.value, fields.foodNotes.value, fields.mealType.value, pendingFoodPhotos.length);
    fallback.reason = `${error.message} Fallback local estimate used.`;
    applyFoodEstimate(fallback);
  }
}

async function addFoodPhotos(fileList) {
  const files = Array.from(fileList || []).slice(0, Math.max(0, 3 - pendingFoodPhotos.length));
  const encoded = await Promise.all(files.map(readImageAsDataUrl));
  pendingFoodPhotos = [...pendingFoodPhotos, ...encoded].slice(0, 3);
  renderFoodPhotoPreview();
  if (pendingFoodPhotos.length >= 3) {
    fields.foodEstimateResult.innerHTML = `<strong>รูปครบ 3 รูปแล้ว</strong><br>หากต้องการเปลี่ยนรูป ให้กด x ที่รูปเดิมก่อน`;
  }
}

function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => compressImageDataUrl(reader.result, file.name).then(resolve).catch(reject);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function compressImageDataUrl(dataUrl, name) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const maxSize = 900;
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve({ name, dataUrl: canvas.toDataURL("image/jpeg", 0.78) });
    };
    image.onerror = () => resolve({ name, dataUrl });
    image.src = dataUrl;
  });
}

function renderFoodPhotoPreview() {
  fields.foodPhotoPreview.innerHTML = pendingFoodPhotos.map((photo, index) => `
    <figure>
      <img src="${photo.dataUrl}" alt="Food photo ${index + 1}">
      <button type="button" data-index="${index}" aria-label="Remove photo">x</button>
    </figure>
  `).join("");
  fields.foodPhotoPreview.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      pendingFoodPhotos.splice(Number(button.dataset.index), 1);
      renderFoodPhotoPreview();
    });
  });
}

function estimateFoodMacros(name, notes = "", meal = "meal", photoCount = 0) {
  const text = `${name} ${notes}`.toLowerCase();
  const matched = foodKnowledgeBase.find((item) => item.keywords.some((keyword) => text.includes(keyword.toLowerCase())));
  const base = matched || inferGenericFood(text, meal);
  const multiplier = portionMultiplier(text);

  return {
    name: matched ? base.name : mealLabel(meal),
    calories: Math.max(0, Math.round(base.calories * multiplier)),
    protein: Math.max(0, Math.round(base.protein * multiplier)),
    carbs: Math.max(0, Math.round(base.carbs * multiplier)),
    fat: Math.max(0, Math.round(base.fat * multiplier)),
    fiber: Math.max(0, Math.round((base.fiber || 4) * multiplier)),
    confidence: matched ? Math.min(94, Math.round(78 + Math.min(multiplier, 2) * 5 + photoCount * 2)) : Math.min(60, 42 + photoCount * 6),
    reason: matched
      ? `matched "${base.name}", adjusted for portion${photoCount ? `, ${photoCount} photo(s) attached` : ""}`
      : `estimated from ${mealLabel(meal)} context${photoCount ? ` with ${photoCount} photo(s) attached` : ""}`,
    source: "local_ai",
  };
}

function inferGenericFood(text, meal) {
  if (text.includes("ทอด") || text.includes("fried")) {
    return { calories: 520, protein: 22, carbs: 45, fat: 26, fiber: 4 };
  }
  if (text.includes("ต้ม") || text.includes("soup")) {
    return { calories: 260, protein: 22, carbs: 18, fat: 10, fiber: 3 };
  }
  if (text.includes("ย่าง") || text.includes("grill")) {
    return { calories: 330, protein: 35, carbs: 12, fat: 14, fiber: 2 };
  }
  if (text.includes("หวาน") || text.includes("dessert")) {
    return { calories: 360, protein: 5, carbs: 58, fat: 12, fiber: 2 };
  }
  if (meal === "breakfast") return { calories: 380, protein: 20, carbs: 42, fat: 14, fiber: 5 };
  if (meal === "night") return { calories: 300, protein: 22, carbs: 28, fat: 10, fiber: 4 };
  return { calories: 450, protein: 22, carbs: 50, fat: 16, fiber: 5 };
}

function normalizeMeal(meal) {
  return meal === "night" ? "snack" : String(meal || "snack");
}

function mealLabel(meal) {
  const labels = {
    breakfast: "เช้า",
    lunch: "กลางวัน",
    dinner: "เย็น",
    snack: "ของว่าง",
  };
  return labels[normalizeMeal(meal)] || "ของว่าง";
}

function portionMultiplier(text) {
  const number = Number((text.match(/(\d+(?:\.\d+)?)/) || [])[1] || 1);
  let multiplier = Number.isFinite(number) && number > 0 ? number : 1;

  if (text.includes("ครึ่ง") || text.includes("half")) multiplier *= 0.5;
  if (text.includes("เล็ก") || text.includes("small")) multiplier *= 0.75;
  if (text.includes("ใหญ่") || text.includes("large") || text.includes("พิเศษ")) multiplier *= 1.35;
  if (text.includes("ช้อน") || text.includes("spoon")) multiplier *= 0.18;
  if (text.includes("กรัม") || text.includes("gram") || text.includes("g ")) multiplier = Math.max(0.1, number / 100);
  if (text.includes("ฟอง") && number > 0) multiplier = number;
  if (text.includes("แก้ว") && number > 0) multiplier = number;

  return Math.min(Math.max(multiplier, 0.1), 5);
}

async function addFood(input) {
  const food = {
    id: crypto.randomUUID(),
    name: String(input.name || "").trim(),
    meal: normalizeMeal(input.meal),
    mealTime: String(input.mealTime || new Date().toTimeString().slice(0, 5)),
    calories: Number(input.calories || 0),
    protein: Number(input.protein || 0),
    carbs: Number(input.carbs || 0),
    fat: Number(input.fat || 0),
    fiber: Number(input.fiber || 0),
    confidence: Number(input.confidence || 0),
    source: String(input.source || "manual"),
    notes: String(input.notes || "").trim(),
    photos: Array.isArray(input.photos) ? input.photos.slice(0, 3) : [],
    createdAt: new Date().toISOString(),
  };
  if (!food.name) return;

  if (USE_BACKEND && !LOCAL_TRACKING_ONLY) {
    try {
      const data = await apiRequest("/api/app/foods", { method: "POST", body: food });
      foods = data.foods || foods;
      render();
    } catch (error) {
      showAuthMessage(error.message, "error");
    }
    return;
  }

  foods.unshift(food);
  saveFoods();
  render();
}

async function deleteFood(foodId) {
  if (!foodId) return;
  if (USE_BACKEND && !LOCAL_TRACKING_ONLY) {
    try {
      const data = await apiRequest(`/api/app/foods/${encodeURIComponent(foodId)}`, { method: "DELETE" });
      foods = data.foods || foods.filter((food) => food.id !== foodId);
      render();
    } catch (error) {
      showAuthMessage(error.message, "error");
    }
    return;
  }

  foods = foods.filter((food) => food.id !== foodId);
  saveFoods();
  render();
}

function renderProgress() {
  const today = dateKey(new Date());
  const dates30 = lastDateKeysUntil(today, 30);
  const dates7 = dates30.slice(-7);
  const dataDays = dates30.filter((date) => hasProgressDataForDate(date)).length;
  const scores30 = dates30.map((date) => healthScoreForDate(date));
  const scores7 = scores30.slice(-7);
  const previous7 = scores30.slice(-14, -7);
  const scoreTrend = average(scores7) - average(previous7);
  const scoreValues = scores30.filter((score) => score > 0);

  fields.progressEmptyState.classList.toggle("hidden", dataDays > 0);
  fields.progressDataDays.textContent = `${dataDays} วัน`;
  fields.progressTodayScore.textContent = healthScoreForDate(today);
  fields.progressSevenAverage.textContent = average(scores7);
  fields.progressThirtyAverage.textContent = average(scores30);
  fields.progressTrend.textContent = scoreTrend > 0 ? `ดีขึ้น +${scoreTrend}` : scoreTrend < 0 ? `ลดลง ${Math.abs(scoreTrend)}` : "ทรงตัว";
  fields.progressHighestScore.textContent = scoreValues.length ? Math.max(...scoreValues) : 0;
  fields.progressLowestScore.textContent = scoreValues.length ? Math.min(...scoreValues) : 0;
  fields.healthScoreChart.innerHTML = progressLineChart(scores30, 100, "Health Score");

  renderWeightProgress(dates30, dates7);
  renderNutritionProgress(dates30);
  renderWaterProgress(dates30, dates7);
  renderSleepProgress(dates30);
  renderProgressSummaries(dates7, dates30);
  renderAchievements(dates30);
}

function renderWeightProgress(dates30, dates7) {
  const records = weightRecords().filter((record) => dates30.includes(record.date)).sort((a, b) => a.date.localeCompare(b.date));
  const weights = records.map((record) => Number(record.weightKg || 0)).filter(Boolean);
  const latest = records[records.length - 1] || latestWeightRecord();
  const latestWeight = Number(latest?.weightKg || 0);
  const goal = Number(profile.targetWeight || 0);
  const weeklyRecords = records.filter((record) => dates7.includes(record.date));
  const weeklyChange = changeBetweenFirstLast(weeklyRecords.map((record) => Number(record.weightKg || 0)).filter(Boolean));
  const monthlyChange = changeBetweenFirstLast(weights);

  fields.progressWeightStatus.textContent = weights.length ? `${weights.length} รายการ` : "ยังไม่มีข้อมูล";
  fields.weightProgressChart.innerHTML = weights.length ? progressLineChart(weights, Math.max(...weights, goal || 0), "Weight") : emptyProgressText("ยังไม่มีข้อมูลน้ำหนัก");
  fields.progressLatestWeight.textContent = latestWeight ? `${latestWeight}kg` : "-";
  fields.progressGoalWeight.textContent = goal ? `${goal}kg` : "-";
  fields.progressWeightDiff.textContent = latestWeight && goal ? `${(latestWeight - goal).toFixed(1)}kg` : "-";
  fields.progressHighestWeight.textContent = weights.length ? `${Math.max(...weights).toFixed(1)}kg` : "-";
  fields.progressLowestWeight.textContent = weights.length ? `${Math.min(...weights).toFixed(1)}kg` : "-";
  fields.progressAverageWeight.textContent = weights.length ? `${averageExact(weights).toFixed(1)}kg` : "-";
  fields.progressWeeklyWeightChange.textContent = formatSignedKg(weeklyChange);
  fields.progressMonthlyWeightChange.textContent = formatSignedKg(monthlyChange);
}

function renderNutritionProgress(dates30) {
  const target = nutritionTargets();
  const days = dates30.map((date) => {
    const dayFoods = foods.filter((food) => dateKey(new Date(food.createdAt)) === date);
    return { date, totals: dailyFoodTotals(dayFoods), count: dayFoods.length };
  });
  const loggedDays = days.filter((day) => day.count > 0);
  const base = loggedDays.length ? loggedDays : days;
  const avgCalories = average(base.map((day) => day.totals.calories));
  const avgProtein = average(base.map((day) => day.totals.protein));
  const avgCarbs = average(base.map((day) => day.totals.carbs));
  const avgFat = average(base.map((day) => day.totals.fat));
  const caloriePercent = Math.round((avgCalories / Math.max(1, target.calories)) * 100);
  const proteinPercent = Math.round((avgProtein / Math.max(1, target.protein)) * 100);

  fields.progressNutritionDays.textContent = `${loggedDays.length} วัน`;
  fields.progressAverageCalories.textContent = avgCalories;
  fields.progressAverageProtein.textContent = `${avgProtein}g`;
  fields.progressAverageCarbs.textContent = `${avgCarbs}g`;
  fields.progressAverageFat.textContent = `${avgFat}g`;
  fields.progressCaloriesVsTarget.textContent = `${caloriePercent}%`;
  fields.progressProteinVsTarget.textContent = `${proteinPercent}%`;
  setBar(fields.progressCaloriesBar, avgCalories, target.calories);
  setBar(fields.progressProteinBar, avgProtein, target.protein);
}

function renderWaterProgress(dates30, dates7) {
  const records = dates30.map((date) => {
    const log = healthLogs[date] || {};
    return { date, waterMl: Number(log.waterMl || 0), goal: waterGoalForLog(log) };
  });
  const weeklyRecords = records.filter((record) => dates7.includes(record.date));
  const dailyAverage = average(records.map((record) => record.waterMl));
  const weeklyAverage = average(weeklyRecords.map((record) => record.waterMl));
  const monthlyAverage = average(records.map((record) => record.waterMl));
  const achievement = Math.round((records.filter((record) => record.waterMl >= record.goal).length / Math.max(1, records.length)) * 100);

  fields.waterProgressChart.innerHTML = progressBarChart(records.map((record) => record.waterMl), Math.max(WATER_GOAL_ML, ...records.map((record) => record.goal)), "Water");
  fields.progressWaterAchievement.textContent = `${achievement}%`;
  fields.progressWaterDailyAverage.textContent = `${dailyAverage} ml`;
  fields.progressWaterWeeklyAverage.textContent = `${weeklyAverage} ml`;
  fields.progressWaterMonthlyAverage.textContent = `${monthlyAverage} ml`;
  fields.progressWaterCurrentStreak.textContent = calculateWaterStreak();
  fields.progressWaterBestStreak.textContent = calculateBestWaterStreak();
}

function renderSleepProgress(dates30) {
  const records = dates30.map((date) => {
    const log = healthLogs[date] || {};
    return {
      date,
      sleepHours: Number(log.sleepHours || 0),
      sleepQuality: Number(log.sleepQuality || 0),
      goal: sleepGoalForRecord(log),
    };
  });
  const sleepDays = records.filter((record) => record.sleepHours > 0);
  const achievement = Math.round((records.filter((record) => record.sleepHours >= record.goal).length / Math.max(1, records.length)) * 100);
  fields.sleepProgressChart.innerHTML = progressBarChart(records.map((record) => record.sleepHours), Math.max(8, ...records.map((record) => record.goal)), "Sleep");
  fields.progressSleepAchievement.textContent = `${achievement}%`;
  fields.progressSleepAverageHours.textContent = sleepDays.length ? `${averageExact(sleepDays.map((record) => record.sleepHours)).toFixed(1)} ชม.` : "0 ชม.";
  fields.progressSleepAverageQuality.textContent = sleepDays.length ? `${averageExact(sleepDays.map((record) => record.sleepQuality)).toFixed(1)}/5` : "0/5";
  fields.progressSleepCurrentStreak.textContent = calculateSleepStreak();
  fields.progressSleepBestStreak.textContent = calculateBestSleepStreak();
}

function renderProgressSummaries(dates7, dates30) {
  fields.weeklySummaryGrid.innerHTML = progressSummary(dates7, "สัปดาห์นี้");
  fields.monthlySummaryGrid.innerHTML = progressSummary(dates30, "เดือนนี้");
}

function renderAchievements(dates30) {
  const earned = progressAchievements(dates30);
  fields.achievementStatus.textContent = `${earned.filter((badge) => badge.earned).length}/${earned.length} earned`;
  fields.achievementGrid.innerHTML = earned.map((badge) => `
    <article class="${badge.earned ? "earned" : "locked"}">
      <strong>${badge.icon}</strong>
      <span>${badge.title}</span>
      <small>${badge.description}</small>
    </article>
  `).join("");
}

function hasProgressDataForDate(date) {
  const log = healthLogs[date] || {};
  return Boolean(
    log.checkinCompleted ||
    log.weightKg ||
    log.waterMl ||
    log.sleepHours ||
    foods.some((food) => dateKey(new Date(food.createdAt)) === date)
  );
}

function progressLineChart(values, maxValue, label) {
  const safeValues = values.map((value) => Number(value || 0));
  const max = Math.max(1, Number(maxValue || 0), ...safeValues);
  const width = 320;
  const height = 130;
  const points = safeValues.map((value, index) => {
    const x = safeValues.length <= 1 ? width / 2 : (index / (safeValues.length - 1)) * width;
    const y = height - ((value / max) * (height - 18)) - 9;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const latest = safeValues[safeValues.length - 1] || 0;
  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${label} chart">
      <polyline class="progress-grid-line" points="0,${height - 10} ${width},${height - 10}"></polyline>
      <polyline class="progress-line" points="${points}"></polyline>
      ${safeValues.map((value, index) => {
        const x = safeValues.length <= 1 ? width / 2 : (index / (safeValues.length - 1)) * width;
        const y = height - ((value / max) * (height - 18)) - 9;
        return `<circle class="progress-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3"></circle>`;
      }).join("")}
    </svg>
    <span>${label}: ${latest}</span>
  `;
}

function progressBarChart(values, maxValue, label) {
  const max = Math.max(1, Number(maxValue || 0), ...values.map(Number));
  return `
    <div class="progress-mini-bars" aria-label="${label} chart">
      ${values.map((value) => {
        const height = Math.max(4, Math.round((Number(value || 0) / max) * 100));
        return `<i style="height:${height}%"></i>`;
      }).join("")}
    </div>
  `;
}

function emptyProgressText(text) {
  return `<div class="empty">${text}</div>`;
}

function latestValueForDate(records, date, key) {
  const record = records.filter((item) => item.date === date).slice(-1)[0];
  return Number(record?.[key] || 0);
}

function changeBetweenFirstLast(values) {
  const clean = values.map(Number).filter(Boolean);
  if (clean.length < 2) return 0;
  return clean[clean.length - 1] - clean[0];
}

function formatSignedKg(value) {
  if (!value) return "0kg";
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}kg`;
}

function progressSummary(dates, label) {
  const scoreAverage = average(dates.map((date) => healthScoreForDate(date)));
  const windowFoods = foods.filter((food) => dates.includes(dateKey(new Date(food.createdAt))));
  const foodTotals = dailyFoodTotals(windowFoods);
  const waterAverage = average(dates.map((date) => Number(healthLogs[date]?.waterMl || 0)));
  const sleepValues = dates.map((date) => Number(healthLogs[date]?.sleepHours || 0)).filter(Boolean);
  const weightValues = dates.map((date) => Number(healthLogs[date]?.weightKg || 0)).filter(Boolean);
  const target = nutritionTargets();
  const strengths = [];
  const improvements = [];
  const proteinAverage = Math.round(foodTotals.protein / Math.max(1, dates.length));
  const calorieAverage = Math.round(foodTotals.calories / Math.max(1, dates.length));
  const sleepAverage = sleepValues.length ? averageExact(sleepValues) : 0;
  const waterGoal = waterGoalForLog(healthLogs[dates[dates.length - 1]] || {});

  if (scoreAverage >= 70) strengths.push("คะแนนสุขภาพดี");
  else improvements.push("เพิ่มความสม่ำเสมอในอาหาร น้ำ และการนอน");
  if (proteinAverage >= target.protein * 0.75) strengths.push("โปรตีนใกล้เป้า");
  else improvements.push("เพิ่มโปรตีนเฉลี่ยต่อวัน");
  if (waterAverage >= waterGoal * 0.8) strengths.push("ดื่มน้ำดี");
  else improvements.push("ดื่มน้ำให้ใกล้เป้า");
  if (sleepAverage >= sleepGoalHours() * 0.85) strengths.push("นอนค่อนข้างดี");
  else improvements.push("เพิ่มชั่วโมงนอน");

  const weightText = weightValues.length >= 2 ? `${formatSignedKg(weightValues[weightValues.length - 1] - weightValues[0])}` : "ยังไม่มีแนวโน้มน้ำหนัก";
  return `
    <article>
      <strong>${label}</strong>
      <span>Health Score เฉลี่ย ${scoreAverage}/100</span>
      <span>Weight: ${weightText}</span>
      <span>Food: ${calorieAverage} kcal · P ${proteinAverage}g</span>
      <span>Water: ${waterAverage} ml · Sleep ${sleepAverage ? sleepAverage.toFixed(1) : 0} ชม.</span>
    </article>
    <article>
      <strong>Strengths</strong>
      <span>${strengths.length ? strengths.join(" · ") : "เริ่มเก็บข้อมูลได้แล้ว"}</span>
    </article>
    <article>
      <strong>Needs Improvement</strong>
      <span>${improvements.length ? improvements.join(" · ") : "รักษาความสม่ำเสมอ"}</span>
    </article>
  `;
}

function progressAchievements(dates30) {
  const checkinDays = Object.values(healthLogs).filter((log) => log.checkinCompleted).length;
  const activeDays = Object.keys(healthLogs).filter((date) => hasProgressDataForDate(date)).length;
  const target = nutritionTargets();
  const proteinGoalDays = dates30.filter((date) => {
    const dayFoods = foods.filter((food) => dateKey(new Date(food.createdAt)) === date);
    return dailyFoodTotals(dayFoods).protein >= target.protein;
  }).length;
  const waterGoalDays = dates30.filter((date) => {
    const log = healthLogs[date] || {};
    return Number(log.waterMl || 0) >= waterGoalForLog(log);
  }).length;
  const sleepGoalDays = dates30.filter((date) => {
    const log = healthLogs[date] || {};
    return Number(log.sleepHours || 0) >= sleepGoalForRecord(log);
  }).length;
  const highScoreDays = dates30.filter((date) => healthScoreForDate(date) > 85).length;
  return [
    { icon: "✓", title: "First Check-in", description: "เช็กอินครั้งแรก", earned: checkinDays >= 1 },
    { icon: "7", title: "7 Days Active", description: "มีข้อมูลสุขภาพ 7 วัน", earned: activeDays >= 7 },
    { icon: "30", title: "30 Days Active", description: "มีข้อมูลสุขภาพ 30 วัน", earned: activeDays >= 30 },
    { icon: "P", title: "Protein Goal", description: "โปรตีนถึงเป้าอย่างน้อย 1 วัน", earned: proteinGoalDays >= 1 },
    { icon: "H2O", title: "Water Goal", description: "น้ำถึงเป้าอย่างน้อย 1 วัน", earned: waterGoalDays >= 1 },
    { icon: "Z", title: "Sleep Goal", description: "นอนถึงเป้าอย่างน้อย 1 วัน", earned: sleepGoalDays >= 1 },
    { icon: "85", title: "Health Score >85", description: "คะแนนสุขภาพยอดเยี่ยม", earned: highScoreDays >= 1 },
  ];
}

function renderHealthTrends() {
  const windows = [
    { label: "สัปดาห์", days: 7 },
    { label: "เดือน", days: 30 },
    { label: "ปี", days: 365 },
  ];
  const metrics = windows.map((window) => {
    const dates = trailingDateKeys(window.days);
    const windowFoods = foods.filter((food) => dates.includes(dateKey(new Date(food.createdAt))));
    const windowEntries = entries.filter((entry) => dates.includes(dateKey(new Date(entry.createdAt))));
    const scores = dates.map((date) => healthScoreForDate(date));
    const weightValues = dates.map((date) => Number(healthLogs[date]?.weightKg || 0)).filter(Boolean);
    return {
      label: window.label,
      score: average(scores),
      calories: Math.round(sum(windowFoods, "calories") / window.days),
      protein: Math.round(sum(windowFoods, "protein") / window.days),
      water: Math.round(dates.reduce((total, date) => total + Number(healthLogs[date]?.waterMl || 0), 0) / window.days),
      workoutDays: new Set(windowEntries.map((entry) => dateKey(new Date(entry.createdAt)))).size,
      weight: weightValues.length ? weightValues[weightValues.length - 1] : 0,
    };
  });
  fields.healthTrendGrid.innerHTML = metrics.map((item) => `
    <article>
      <strong>${item.label}</strong>
      <span>Score ${item.score}/100</span>
      <span>Cal ${item.calories} · P ${item.protein}g</span>
      <span>Water ${(item.water / 1000).toFixed(1)}L · Workout ${item.workoutDays}d</span>
      <span>Weight ${item.weight ? `${item.weight}kg` : "-"}</span>
    </article>
  `).join("");
}

async function apiRequest(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const response = await fetch(path, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.ok === false) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

function loadEntries() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY()) || "[]"); }
  catch { return []; }
}

function loadFoods() {
  try { return JSON.parse(localStorage.getItem(FOOD_KEY()) || "[]"); }
  catch { return []; }
}

function loadHealthLogs() {
  try { return JSON.parse(localStorage.getItem(HEALTH_KEY()) || "{}"); }
  catch { return {}; }
}

function loadProfile() {
  try {
    return { ...defaultProfile(), ...JSON.parse(localStorage.getItem(PROFILE_KEY()) || "{}") };
  } catch {
    return defaultProfile();
  }
}

function loadClient() {
  try {
    return { ...defaultClient(), ...JSON.parse(localStorage.getItem(CLIENT_KEY()) || "{}") };
  } catch {
    return defaultClient();
  }
}

function saveEntries() { localStorage.setItem(STORAGE_KEY(), JSON.stringify(entries)); }
function saveFoods() { localStorage.setItem(FOOD_KEY(), JSON.stringify(foods)); }
function saveHealthLogs() { localStorage.setItem(HEALTH_KEY(), JSON.stringify(healthLogs)); }
function saveCoachChat() { localStorage.setItem(CHAT_KEY(), JSON.stringify({ persona: coachPersona, messages: chatMessages })); }
function saveAdaptiveDecisions(decisions) { localStorage.setItem(ADAPTIVE_KEY(), JSON.stringify(decisions || {})); }
function saveAiProgramDraft() {
  if (aiProgramDraft) localStorage.setItem(AI_DRAFT_KEY(), JSON.stringify(aiProgramDraft));
  else localStorage.removeItem(AI_DRAFT_KEY());
}
function saveNutritionPlanDraft() {
  if (nutritionPlanDraft) localStorage.setItem(NUTRITION_DRAFT_KEY(), JSON.stringify(nutritionPlanDraft));
  else localStorage.removeItem(NUTRITION_DRAFT_KEY());
}
function saveNutritionPlans() { localStorage.setItem(NUTRITION_PLANS_KEY(), JSON.stringify(nutritionPlans)); }
function saveWorkoutProgram() {
  ensureProgramManager();
  localStorage.setItem(PROGRAM_KEY(), JSON.stringify({ activeProgramId, programs: workoutPrograms }));
}
function saveProgramHistory() { localStorage.setItem(PROGRAM_HISTORY_KEY(), JSON.stringify(programHistory)); }

function loadWorkoutProgram() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRAM_KEY()) || "{}");
    if (Array.isArray(saved.programs)) {
      workoutPrograms = saved.programs.map((program, index) => normalizeProgram(program, index));
      activeProgramId = saved.activeProgramId || workoutPrograms[0]?.id || "";
      return workoutPrograms.find((program) => program.id === activeProgramId) || workoutPrograms[0] || defaultWorkoutProgram();
    }
    const legacy = normalizeProgram({ ...defaultWorkoutProgram(), ...saved }, 0);
    workoutPrograms = [legacy];
    activeProgramId = legacy.id;
    return legacy;
  }
  catch {
    workoutPrograms = [];
    activeProgramId = "";
    return defaultWorkoutProgram();
  }
}

function loadProgramHistory() {
  try { return JSON.parse(localStorage.getItem(PROGRAM_HISTORY_KEY()) || "[]"); }
  catch { return []; }
}

function loadCoachChat() {
  try {
    const saved = JSON.parse(localStorage.getItem(CHAT_KEY()) || "{}");
    coachPersona = saved.persona || "friendly";
    return Array.isArray(saved.messages) ? saved.messages : [];
  } catch {
    coachPersona = "friendly";
    return [];
  }
}

function loadAdaptiveDecisions() {
  try { return JSON.parse(localStorage.getItem(ADAPTIVE_KEY()) || "{}"); }
  catch { return {}; }
}

function loadAiProgramDraft() {
  try { return JSON.parse(localStorage.getItem(AI_DRAFT_KEY()) || "null"); }
  catch { return null; }
}
function loadNutritionPlanDraft() {
  try { return JSON.parse(localStorage.getItem(NUTRITION_DRAFT_KEY()) || "null"); }
  catch { return null; }
}
function loadNutritionPlans() {
  try { const saved = JSON.parse(localStorage.getItem(NUTRITION_PLANS_KEY()) || "[]"); return Array.isArray(saved) ? saved : []; }
  catch { return []; }
}

function loadTrainerPortal() {
  try { return { ...defaultTrainerPortal(), ...JSON.parse(localStorage.getItem(TRAINER_KEY()) || "{}") }; }
  catch { return defaultTrainerPortal(); }
}

function saveTrainerPortal() {
  localStorage.setItem(TRAINER_KEY(), JSON.stringify({
    profile: trainerPortal.profile || defaultTrainerPortal().profile,
    notes: Array.isArray(trainerPortal.notes) ? trainerPortal.notes.slice(0, 300) : [],
    recommendations: Array.isArray(trainerPortal.recommendations) ? trainerPortal.recommendations.slice(0, 300) : [],
  }));
}

function defaultTrainerPortal() {
  return {
    profile: { name: "", gym: "", specialty: "", certification: "", notes: "", updatedAt: "" },
    notes: [],
    recommendations: [],
  };
}

function trainerDirectory() {
  const users = loadUsers();
  return Object.keys(users).filter((id) => id !== currentUserId).map((id) => trainerClientSnapshot(id, users[id]));
}

function trainerClientSnapshot(clientId, user = {}) {
  const clientProfile = readUserObject(BASE_PROFILE_KEY, clientId, defaultProfile());
  const clientPrograms = readUserObject(BASE_PROGRAM_KEY, clientId, {});
  const clientNutritionPlans = readUserArray(BASE_NUTRITION_PLANS_KEY, clientId);
  const clientNutritionDraft = readUserObject(BASE_NUTRITION_DRAFT_KEY, clientId, null);
  const clientProgramDraft = readUserObject(BASE_AI_DRAFT_KEY, clientId, null);
  const clientEntries = readUserArray(BASE_STORAGE_KEY, clientId);
  const clientHealth = readUserObject(BASE_HEALTH_KEY, clientId, {});
  const clientFoods = readUserArray(BASE_FOOD_KEY, clientId);
  const lastWorkout = clientEntries.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  const lastWorkoutDate = lastWorkout ? dateKey(new Date(lastWorkout.createdAt)) : "";
  const compliance = trainerComplianceScore(clientEntries, clientFoods, clientHealth);
  const programList = Array.isArray(clientPrograms.programs) ? clientPrograms.programs : [];
  const activeProgram = programList.find((program) => program.id === clientPrograms.activeProgramId) || programList[0] || {};
  const status = trainerClientStatus(compliance, lastWorkoutDate, clientProgramDraft, clientNutritionDraft);
  return {
    id: clientId,
    name: clientProfile.displayName || user.displayName || clientId,
    goal: goalLabel(clientProfile.goal || "health"),
    currentProgram: activeProgram.name || "-",
    currentNutritionPlan: clientNutritionPlans[0]?.goal || clientNutritionPlans[0]?.request?.goal || "-",
    lastWorkout: lastWorkoutDate || "-",
    compliance,
    status,
    profile: clientProfile,
    program: activeProgram,
    programDraft: clientProgramDraft,
    nutritionPlan: clientNutritionPlans[0] || null,
    nutritionDraft: clientNutritionDraft,
    entries: clientEntries,
    foods: clientFoods,
    healthLogs: clientHealth,
  };
}

function trainerComplianceScore(clientEntries, clientFoods, clientHealth) {
  const dates = trailingDateKeys(7);
  const workoutDays = new Set(clientEntries.filter((entry) => dates.includes(dateKey(new Date(entry.createdAt)))).map((entry) => dateKey(new Date(entry.createdAt)))).size;
  const foodDays = new Set(clientFoods.filter((food) => dates.includes(dateKey(new Date(food.createdAt)))).map((food) => dateKey(new Date(food.createdAt)))).size;
  const checkinDays = dates.filter((date) => clientHealth[date]?.checkinCompleted).length;
  return Math.min(100, Math.round((workoutDays / 3) * 35 + (foodDays / 5) * 35 + (checkinDays / 7) * 30));
}

function trainerClientStatus(compliance, lastWorkoutDate, programDraft, nutritionDraft) {
  const daysSince = lastWorkoutDate && lastWorkoutDate !== "-" ? daysBetween(lastWorkoutDate, dateKey(new Date())) : 99;
  if (programDraft || nutritionDraft) return "Pending Draft";
  if (daysSince >= 7) return "Missed Workouts";
  if (compliance < 45) return "Needs Review";
  return "On Track";
}

function readUserObject(baseKey, userId, fallback) {
  try {
    const value = localStorage.getItem(`${baseKey}_${userId}`);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function readUserArray(baseKey, userId) {
  const value = readUserObject(baseKey, userId, []);
  return Array.isArray(value) ? value : [];
}

function defaultWorkoutProgram() {
  return { id: "", name: "My Program", createdAt: "", updatedAt: "", version: 1, favorite: false, archived: false, notes: "", schedule: {}, settings: {}, days: [] };
}

function todayHealthLog() {
  const today = dateKey(new Date());
  healthLogs[today] = { date: today, waterMl: 0, sleepQuality: 3, ...healthLogs[today] };
  return healthLogs[today];
}

function saveTodayHealthLog(log) {
  const today = dateKey(new Date());
  healthLogs[today] = { ...(healthLogs[today] || {}), ...log, date: today };
  saveHealthLogs();
}

function calculateSleepHours(sleepTime, wakeTime) {
  if (!sleepTime || !wakeTime) return 0;
  const [sleepHour, sleepMinute] = sleepTime.split(":").map(Number);
  const [wakeHour, wakeMinute] = wakeTime.split(":").map(Number);
  let sleep = sleepHour + sleepMinute / 60;
  let wake = wakeHour + wakeMinute / 60;
  if (wake <= sleep) wake += 24;
  return Math.max(0, Math.min(24, wake - sleep));
}

function dailyMissions(todayFoods, todayEntries, log) {
  const target = nutritionTargets();
  const totals = dailyFoodTotals(todayFoods);
  const waterGoal = waterGoalForLog(log);
  return [
    { label: "ดื่มน้ำ", detail: `${Number(log.waterMl || 0)} / ${waterGoal} ml`, done: Number(log.waterMl || 0) >= waterGoal },
    { label: "โปรตีนถึงเป้า", detail: `${totals.protein} / ${target.protein}g`, done: totals.protein >= target.protein },
    { label: "เช็กอินน้ำหนัก", detail: log.weightKg ? `${log.weightKg} kg` : "ยังไม่ได้เช็กอิน", done: Boolean(log.weightKg) },
    { label: "ออกกำลังกาย", detail: `${sum(todayEntries, "minutes")} นาที`, done: sum(todayEntries, "minutes") >= 20 },
  ];
}

function healthScoreForDate(date) {
  return calculateHealthScoreForDate(date).total;
}

function calculateHealthScoreForDate(date) {
  const categories = [
    nutritionHealthScore(date),
    waterHealthScore(date),
    sleepHealthScore(date),
    checkinHealthScore(date),
    weightConsistencyHealthScore(date),
  ];
  const total = Math.min(100, Math.round(categories.reduce((sumPoints, category) => sumPoints + category.points, 0)));
  return {
    date,
    total,
    status: healthScoreStatus(total),
    categories,
    recommendation: highestImpactRecommendation(categories),
  };
}

function nutritionHealthScore(date) {
  const target = nutritionTargets();
  const dayFoods = foods.filter((food) => dateKey(new Date(food.createdAt)) === date);
  const totals = dailyFoodTotals(dayFoods);
  const hasTargets = Number(target.calories || 0) > 0 && Number(target.protein || 0) > 0;
  if (!hasTargets) {
    return scoreCategory("Nutrition", 15, 30, "ยังไม่มีเป้าหมาย kcal/protein ที่ชัดเจน", "เติมน้ำหนักและเป้าหมายในโปรไฟล์เพื่อคำนวณแม่นยำขึ้น");
  }

  const calorieRatio = totals.calories / Math.max(1, target.calories);
  const calorieDiff = Math.abs(1 - calorieRatio);
  const caloriePoints = calorieDiff <= 0.1 ? 12 : calorieDiff <= 0.2 ? 8 : 4;
  const proteinPoints = totals.protein >= target.protein ? 12 : totals.protein >= target.protein * 0.75 ? 8 : 4;
  const loggingPoints = dayFoods.length >= 3 ? 6 : dayFoods.length >= 1 ? 3 : 0;
  const points = caloriePoints + proteinPoints + loggingPoints;
  const explanation = `${totals.calories}/${target.calories} kcal, โปรตีน ${totals.protein}/${target.protein}g, บันทึก ${dayFoods.length} รายการ`;
  let suggestion = "รักษาการบันทึกอาหารให้ครบอย่างน้อย 3 รายการ";
  if (!dayFoods.length) suggestion = "เริ่มบันทึกอาหารมื้อแรกของวันนี้";
  else if (proteinPoints < 12) suggestion = "เพิ่มโปรตีนลีนอีกหนึ่งมื้อเพื่อเข้าใกล้เป้า";
  else if (caloriePoints < 12) suggestion = "ปรับแคลอรี่ให้อยู่ใกล้เป้า ±10%";
  return scoreCategory("Nutrition", points, 30, explanation, suggestion);
}

function waterHealthScore(date) {
  const log = healthLogs[date] || {};
  const waterMl = Number(log.waterMl || 0);
  const goal = waterGoalForLog(log);
  const percent = waterMl / Math.max(1, goal);
  const points = percent >= 1 ? 20 : percent >= 0.8 ? 16 : percent >= 0.6 ? 12 : percent >= 0.3 ? 6 : 0;
  const explanation = `${waterMl}/${goal} ml (${Math.round(percent * 100)}%)`;
  const suggestion = points >= 20 ? "ถึงเป้าน้ำแล้ว รักษาความสม่ำเสมอ" : `ดื่มน้ำเพิ่มอีก ${Math.max(0, goal - waterMl)} ml`;
  return scoreCategory("Water", points, 20, explanation, suggestion);
}

function sleepHealthScore(date) {
  const log = healthLogs[date] || {};
  const hours = Number(log.sleepHours || 0);
  const goal = sleepGoalForRecord(log);
  const quality = Math.max(0, Math.min(5, Number(log.sleepQuality || 0)));
  const durationPoints = Math.min(14, Math.round((hours / Math.max(1, goal)) * 14));
  const qualityPoints = Math.round((quality / 5) * 6);
  const points = Math.min(20, durationPoints + qualityPoints);
  const explanation = `${hours.toFixed(1)} / ${goal} ชม., คุณภาพ ${quality || "-"}/5`;
  let suggestion = "รักษาเวลานอนและเวลาตื่นให้ใกล้เคียงกัน";
  if (!hours) suggestion = "บันทึกการนอนวันนี้เพื่อให้คะแนนแม่นยำขึ้น";
  else if (hours < goal) suggestion = `เพิ่มเวลานอนอีก ${(goal - hours).toFixed(1)} ชม.`;
  else if (quality < 4) suggestion = "ลดสิ่งรบกวนก่อนนอนเพื่อเพิ่มคุณภาพการนอน";
  return scoreCategory("Sleep", points, 20, explanation, suggestion);
}

function checkinHealthScore(date) {
  const log = healthLogs[date] || {};
  const completedPoints = log.checkinCompleted ? 10 : 0;
  const energy = Number(log.energyLevel || 0);
  const energyPoints = energy >= 4 && energy <= 8 ? 3 : energy ? 1 : 0;
  const moodPoints = log.mood ? 2 : 0;
  const points = completedPoints + energyPoints + moodPoints;
  const explanation = log.checkinCompleted ? `เช็กอินแล้ว, พลังงาน ${energy || "-"}/10, mood ${log.mood || "-"}` : "ยังไม่ได้เช็กอินวันนี้";
  const suggestion = log.checkinCompleted ? "ใช้ check-in ตอนเช้าเพื่อกำหนดจังหวะของวัน" : "เช็กอินวันนี้เพื่อปลดล็อกคะแนนหมวดนิสัย";
  return scoreCategory("Daily Check-in", points, 15, explanation, suggestion);
}

function weightConsistencyHealthScore(date) {
  const records = weightRecords();
  const todayLogged = records.some((record) => record.date === date && Number(record.weightKg || 0) > 0);
  const last7 = lastDateKeysUntil(date, 7);
  const weeklyDates = new Set(records.filter((record) => last7.includes(record.date) && Number(record.weightKg || 0) > 0).map((record) => record.date));
  const todayPoints = todayLogged ? 10 : 0;
  const weeklyPoints = weeklyDates.size >= 3 ? 5 : weeklyDates.size >= 1 ? 2 : 0;
  const points = todayPoints + weeklyPoints;
  const explanation = todayLogged ? `บันทึกวันนี้แล้ว, 7 วันล่าสุด ${weeklyDates.size} วัน` : `ยังไม่บันทึกวันนี้, 7 วันล่าสุด ${weeklyDates.size} วัน`;
  const suggestion = todayLogged ? "ติดตามแนวโน้มแบบสม่ำเสมอ ไม่เน้นลดเร็ว" : "บันทึกน้ำหนักวันนี้เพื่อดูแนวโน้มระยะยาว";
  return scoreCategory("Weight Consistency", points, 15, explanation, suggestion);
}

function scoreCategory(label, points, max, explanation, suggestion) {
  return {
    label,
    points: Math.max(0, Math.min(max, Math.round(points))),
    max,
    explanation,
    suggestion,
  };
}

function highestImpactRecommendation(categories) {
  const sorted = categories.slice().sort((a, b) => (b.max - b.points) - (a.max - a.points));
  return sorted[0]?.suggestion || "บันทึกอาหาร น้ำ และการนอนเพื่อให้คะแนนแม่นยำขึ้น";
}

function lastDateKeysUntil(date, count) {
  const end = new Date(`${date}T12:00:00`);
  return [...Array(count)].map((_, index) => {
    const cursor = new Date(end);
    cursor.setDate(end.getDate() - (count - 1 - index));
    return dateKey(cursor);
  });
}

function nextDateIso(days = 1) {
  const date = new Date();
  date.setDate(date.getDate() + Number(days || 1));
  return date.toISOString();
}

function healthScoreHistoryStats(today) {
  const last30 = lastDateKeysUntil(today, 30);
  const scores = last30.map((date) => calculateHealthScoreForDate(date).total);
  const last7 = scores.slice(-7);
  const previous7 = scores.slice(-14, -7);
  const latest = scores[scores.length - 1] || 0;
  const sevenAverage = average(last7);
  const previousAverage = average(previous7);
  return {
    latest,
    sevenAverage,
    best: Math.max(0, ...scores),
    trend: Math.round(sevenAverage - previousAverage),
  };
}

function renderDashboardHealthScore(result) {
  if (!fields.healthScorePreview || !fields.healthScoreRecommendation || !fields.healthScoreHistory) return;
  fields.healthScorePreview.innerHTML = result.categories.map((category) => `
    <article>
      <strong>${category.points}/${category.max}</strong>
      <span>${category.label}</span>
      <small>${category.explanation}</small>
      <em>${category.suggestion}</em>
    </article>
  `).join("");
  fields.healthScoreRecommendation.textContent = `คำแนะนำหลัก: ${result.recommendation}`;
  const stats = healthScoreHistoryStats(result.date);
  const trendLabel = stats.trend > 0 ? `ดีขึ้น +${stats.trend}` : stats.trend < 0 ? `ลดลง ${Math.abs(stats.trend)}` : "ทรงตัว";
  fields.healthScoreHistory.innerHTML = `
    <span>ล่าสุด ${stats.latest}</span>
    <span>เฉลี่ย 7 วัน ${stats.sevenAverage}</span>
    <span>ดีที่สุด ${stats.best}</span>
    <span>${trendLabel}</span>
  `;
}

function healthTrendText(today, score) {
  const previousDate = new Date(`${today}T12:00:00`);
  previousDate.setDate(previousDate.getDate() - 1);
  const previousKey = dateKey(previousDate);
  const hasPreviousData =
    Boolean(healthLogs[previousKey]) ||
    foods.some((food) => dateKey(new Date(food.createdAt)) === previousKey) ||
    entries.some((entry) => dateKey(new Date(entry.createdAt)) === previousKey);
  if (!hasPreviousData) return "แนวโน้ม: เริ่มเก็บ baseline วันนี้";
  const delta = score - healthScoreForDate(previousKey);
  if (delta >= 5) return `แนวโน้ม: ดีขึ้น +${delta} จากเมื่อวาน`;
  if (delta <= -5) return `แนวโน้ม: ลดลง ${Math.abs(delta)} จุด เน้นน้ำ โปรตีน และนอนคืนนี้`;
  return "แนวโน้ม: ทรงตัวจากเมื่อวาน รักษาความสม่ำเสมอ";
}

function renderProgressPhotoPreview() {
  const photo = pendingProgressPhoto || todayHealthLog().progressPhoto;
  fields.progressPhotoPreview.innerHTML = photo ? `<figure><img src="${photo.dataUrl}" alt="Progress photo"></figure>` : "";
}

function trailingDateKeys(count) {
  return [...Array(count)].map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (count - 1 - index));
    return dateKey(date);
  });
}

function average(values) {
  if (!values.length) return 0;
  return Math.round(values.reduce((total, value) => total + Number(value || 0), 0) / values.length);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Number(value || 0)));
}

function recentProgramAnalyticsSummary() {
  const analytics = trainingAnalyticsEngine();
  return {
    recoveryScore: Number(analytics?.recovery?.score || 0),
    recoveryStatus: analytics?.recovery?.status || "Insufficient data",
    fatigueScore: Number(analytics?.fatigue?.score || 0),
    weeklySets: Number(analytics?.weekly?.totalSets || 0),
    balanceStatus: analytics?.balance?.status || "Insufficient data",
    priorityMuscle: analytics?.weakPoints?.[0]?.title || "",
  };
}

function aiProgramRequest(overrides = {}) {
  const analytics = recentProgramAnalyticsSummary();
  const selectedRecovery = fields.aiProgramRecovery?.value || "auto";
  return {
    goal: fields.aiProgramGoal.value, experience: fields.aiProgramExperience.value,
    days: Number(fields.aiProgramDays.value || 3), minutes: Number(fields.aiProgramMinutes.value || 45), equipment: fields.aiProgramEquipment.value,
    targetMuscles: fields.aiProgramTargets.value.trim(), injuries: fields.aiProgramInjuries.value.trim(),
    preferredExercises: fields.aiProgramPreferred.value.trim(), avoidExercises: fields.aiProgramAvoid.value.trim(),
    recoveryLevel: selectedRecovery === "auto" ? analytics.recoveryStatus : selectedRecovery,
    recentAnalyticsSummary: analytics,
    ...overrides,
  };
}

function generateAiProgramDraft(requestOverrides = {}) {
  const request = aiProgramRequest(requestOverrides?.preventDefault ? {} : requestOverrides);
  const generated = generateWorkoutProgram(request);
  const avoid = request.avoidExercises.toLowerCase().split(",").map((item) => item.trim()).filter(Boolean);
  generated.days.forEach((day) => {
    day.warmup = "Dynamic warm-up 5-8 นาที และ warm-up sets ก่อนท่าหลัก";
    day.cooldown = "เดินเบาและยืดกล้ามเนื้อ 5 นาที";
    day.exercises = day.exercises.filter((exercise) => !avoid.some((name) => `${exercise.name} ${exercise.nameTh || ""}`.toLowerCase().includes(name))).map((exercise) => ({
      ...exercise, intensity: request.goal === "strength" ? "หนักแบบควบคุม" : "ปานกลาง", rpe: request.experience === "beginner" ? 7 : 8,
      progression: request.goal === "strength" ? "เมื่อครบ reps ทุก set ให้เพิ่มน้ำหนักเล็กน้อย" : "เพิ่ม 1 rep ก่อน แล้วค่อยเพิ่มน้ำหนัก",
    }));
  });
  applyProgramExercisePreferences(generated, request);
  const analytics = trainingAnalyticsEngine();
  const draftId = `draft-${crypto.randomUUID()}`;
  aiProgramDraft = {
    id: draftId, draftId, generator: "Khayubdi AI Program Generator", status: "Draft", createdAt: new Date().toISOString(), request,
    name: `AI ${goalLabel(request.goal)} ${request.days} Days`, settings: request, days: generated.days,
    explanation: aiProgramExplanation(request, generated, analytics), validation: validateAiProgram(generated, request),
  };
  saveAiProgramDraft(); renderAiProgramDraft(); renderDashboardDraftProgram(); showToast("สร้าง draft แล้ว กรุณาตรวจสอบก่อน Accept");
}

function validateAiProgram(program, request) {
  const exercises = program.days.flatMap((day) => day.exercises || []);
  const sets = exercises.reduce((total, exercise) => total + Number(exercise.sets || 0), 0);
  const patterns = exercises.map((exercise) => exercise.movementPattern || "");
  const push = patterns.filter((item) => item.includes("Push")).length;
  const pull = patterns.filter((item) => item.includes("Pull")).length;
  const lower = patterns.filter((item) => ["Squat", "Hinge", "Lunge"].includes(item)).length;
  const duplicateDays = program.days.filter((day) => new Set(day.exercises.map((exercise) => normalizeExerciseName(exercise.name))).size !== day.exercises.length).length;
  const allowed = allowedEquipmentForProgram(request.equipment);
  const unavailable = exercises.filter((exercise) => { const item = EXERCISE_CATALOG.find((entry) => entry.id === exercise.exerciseId); return item && !item.equipment.some((equipment) => allowed.includes(equipment)); }).length;
  const injuryConflicts = exercises.filter((exercise) => exerciseConflictsWithInjury(exercise, request.injuries)).length;
  const requiredCoverage = requiredMuscleCoverage(exercises, request.targetMuscles);
  const estimatedMinutes = program.days.map(estimateDraftSessionMinutes);
  const durationOutsideRange = estimatedMinutes.filter((minutes) => Math.abs(minutes - request.minutes) > Math.max(15, request.minutes * .35)).length;
  return [
    { label: "Training volume", pass: sets >= request.days * 8 && sets <= request.days * 35, detail: `${sets} sets/week` },
    { label: "Recovery balance", pass: request.days <= 5 || program.days.some((day) => day.weekday === "Saturday"), detail: `${7 - request.days} rest days` },
    { label: "Push / Pull balance", pass: Math.abs(push - pull) <= Math.max(2, Math.round((push + pull) * .4)), detail: `${push} push / ${pull} pull` },
    { label: "Upper / Lower balance", pass: lower > 0 && (push + pull) > 0, detail: `${push + pull} upper / ${lower} lower movements` },
    { label: "Weekly frequency", pass: program.days.length === request.days, detail: `${program.days.length} sessions` },
    { label: "Equipment", pass: unavailable === 0, detail: unavailable ? `${unavailable} unavailable` : "available" },
    { label: "Duplicate exercises", pass: duplicateDays === 0, detail: duplicateDays ? `${duplicateDays} day(s) need review` : "none on same day" },
    { label: "Injury limitations", pass: injuryConflicts === 0, detail: injuryConflicts ? `${injuryConflicts} conflict(s) need review` : request.injuries ? "no known conflicts" : "no limitations supplied" },
    { label: "Required muscle coverage", pass: requiredCoverage.missing.length === 0, detail: requiredCoverage.missing.length ? `Missing: ${requiredCoverage.missing.join(", ")}` : requiredCoverage.requested.length ? `Covered: ${requiredCoverage.requested.join(", ")}` : "major movement groups covered" },
    { label: "Session duration", pass: durationOutsideRange === 0, detail: `${estimatedMinutes.join(" / ")} min estimated vs ${request.minutes} min requested` },
  ];
}

function applyProgramExercisePreferences(program, request) {
  const preferred = String(request.preferredExercises || "").split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
  if (!preferred.length) return;
  const allowed = allowedEquipmentForProgram(request.equipment);
  preferred.forEach((name) => {
    const item = EXERCISE_CATALOG.find((exercise) => `${exercise.nameEn} ${exercise.nameTh || ""}`.toLowerCase().includes(name));
    if (!item || !item.equipment.some((equipment) => allowed.includes(equipment)) || exerciseConflictsWithInjury(item, request.injuries)) return;
    const day = program.days.find((entry) => !(entry.exercises || []).some((exercise) => exercise.exerciseId === item.id));
    if (!day?.exercises?.length) return;
    day.exercises[day.exercises.length - 1] = ex(item, item.defaultSets, item.defaultReps, `${item.defaultRestSeconds}s`, "Preferred exercise");
  });
}

function exerciseConflictsWithInjury(exercise, injuries = "") {
  const text = String(injuries).toLowerCase();
  const name = String(exercise.nameEn || exercise.name || "").toLowerCase();
  const conflicts = {
    knee: ["burpee", "jump rope", "walking lunge", "back squat"], เข่า: ["burpee", "jump rope", "walking lunge", "back squat"],
    back: ["deadlift", "back squat", "romanian deadlift"], หลัง: ["deadlift", "back squat", "romanian deadlift"],
    shoulder: ["overhead press", "pike push up", "pull up"], ไหล่: ["overhead press", "pike push up", "pull up"],
    wrist: ["push up", "burpee", "close-grip push up"], ข้อมือ: ["push up", "burpee", "close-grip push up"],
  };
  return Object.entries(conflicts).some(([injury, names]) => text.includes(injury) && names.includes(name));
}

function requiredMuscleCoverage(exercises, targetText = "") {
  const aliases = { chest: "Chest", อก: "Chest", back: "Back", หลัง: "Back", legs: "Quadriceps", leg: "Quadriceps", ขา: "Quadriceps", shoulders: "Shoulders", shoulder: "Shoulders", ไหล่: "Shoulders", glutes: "Glutes", ก้น: "Glutes", arms: "Biceps", แขน: "Biceps" };
  const selected = String(targetText).toLowerCase().split(",").map((item) => item.trim()).filter(Boolean).map((item) => aliases[item] || item);
  const requested = selected.length ? selected : ["Chest", "Back", "Quadriceps"];
  const covered = new Set(exercises.flatMap((exercise) => [exercise.primaryMuscle, ...(exercise.secondaryMuscles || [])]).filter(Boolean));
  return { requested, missing: requested.filter((muscle) => !covered.has(muscle)) };
}

function estimateDraftSessionMinutes(day) {
  return Math.round(10 + (day.exercises || []).reduce((total, exercise) => total + Number(exercise.sets || 0) * 2.5, 0));
}

function aiProgramExplanation(request, program, analytics) {
  const split = program.days.map((day) => day.title.replace(/^Day \d+:\s*/, "")).join(" / ");
  const recovery = analytics?.recovery?.score ?? 0;
  const balance = analytics?.balance?.status || "ยังมีข้อมูลไม่พอ";
  return `เลือก ${split} ให้เหมาะกับ ${request.days} วันและเป้าหมาย ${goalLabel(request.goal)} โดยกระจายวันพักเพื่อการฟื้นตัว ใช้ท่าที่รองรับอุปกรณ์ ${equipmentLabel(request.equipment)} และ volume ตามระดับ ${request.experience}. ข้อมูลปัจจุบัน: recovery ${recovery}% และ training balance ${balance}.${request.targetMuscles ? ` เน้น ${request.targetMuscles}.` : ""}${request.injuries ? ` ปรับหลีกเลี่ยงข้อจำกัด: ${request.injuries}.` : ""}`;
}

function renderAiProgramDraft() {
  if (!fields.aiProgramDraft) return;
  fields.aiProgramDraft.classList.toggle("hidden", !aiProgramDraft);
  if (!aiProgramDraft) return;
  const sets = aiProgramDraft.days.flatMap((day) => day.exercises).reduce((sum, exercise) => sum + Number(exercise.sets || 0), 0);
  const split = aiProgramDraft.days.map((day) => day.title.replace(/^Day \d+:\s*/, "")).join(" / ");
  fields.aiDraftStatus.textContent = `${aiProgramDraft.status || "Draft"} · Review required`;
  fields.aiDraftSummary.innerHTML = `<div class="draft-summary-grid"><article><strong>${escapeHtml(goalLabel(aiProgramDraft.request.goal))}</strong><span>Goal</span></article><article><strong>${escapeHtml(split)}</strong><span>Split</span></article><article><strong>${aiProgramDraft.request.days} วัน</strong><span>Weekly schedule</span></article><article><strong>${aiProgramDraft.request.minutes * aiProgramDraft.request.days} นาที</strong><span>Estimated weekly time</span></article><article><strong>${sets} sets</strong><span>Training volume</span></article><article><strong>${escapeHtml(aiProgramDraft.request.experience)}</strong><span>Difficulty</span></article></div>`;
  fields.aiDraftValidation.innerHTML = aiProgramDraft.validation.map((item) => `<div class="draft-check ${item.pass ? "pass" : "warn"}">${item.pass ? "✓" : "!"} <strong>${escapeHtml(item.label)}</strong> · ${escapeHtml(item.detail)}</div>`).join("");
  fields.aiDraftDays.innerHTML = aiProgramDraft.days.map((day, dayIndex) => `<article class="draft-day"><header><strong>${escapeHtml(day.title)}</strong><span>${escapeHtml(day.weekday)} · ${aiProgramDraft.request.minutes} นาที</span></header><p>${escapeHtml(day.warmup)}</p>${day.exercises.map((exercise, exerciseIndex) => `<div class="draft-exercise-row"><strong>${escapeHtml(exercise.nameTh || exercise.name)}</strong><label>Sets<input data-draft-day="${dayIndex}" data-draft-exercise="${exerciseIndex}" data-draft-field="sets" type="number" min="1" value="${Number(exercise.sets || 0)}" disabled></label><label>Reps<input data-draft-day="${dayIndex}" data-draft-exercise="${exerciseIndex}" data-draft-field="reps" value="${escapeHtml(String(exercise.reps || ""))}" disabled></label><label>Rest<input data-draft-day="${dayIndex}" data-draft-exercise="${exerciseIndex}" data-draft-field="rest" value="${escapeHtml(String(exercise.rest || ""))}" disabled></label><label>RPE<input data-draft-day="${dayIndex}" data-draft-exercise="${exerciseIndex}" data-draft-field="rpe" type="number" min="1" max="10" value="${Number(exercise.rpe || 7)}" disabled></label></div>`).join("")}<p>${escapeHtml(day.cooldown)}</p></article>`).join("");
  fields.aiDraftExplanation.innerHTML = `<strong>เหตุผลของโปรแกรม</strong><p>${escapeHtml(aiProgramDraft.explanation)}</p>`;
}

function updateAiDraftFromEditor(event) {
  const input = event.target; const exercise = aiProgramDraft?.days?.[Number(input.dataset.draftDay)]?.exercises?.[Number(input.dataset.draftExercise)];
  if (!exercise || !input.dataset.draftField) return;
  exercise[input.dataset.draftField] = ["sets", "rpe"].includes(input.dataset.draftField) ? Number(input.value || 0) : input.value;
  aiProgramDraft.validation = validateAiProgram(aiProgramDraft, aiProgramDraft.request); saveAiProgramDraft(); fields.aiDraftStatus.textContent = "Edited draft · ยังไม่บันทึก";
}

function acceptAiProgramDraft() {
  if (!aiProgramDraft || !window.confirm("ยืนยันบันทึก draft เป็นโปรแกรมใหม่? โปรแกรมเดิมจะยังอยู่")) return;
  const approvedAt = new Date().toISOString();
  const accepted = normalizeProgram({ ...aiProgramDraft, id: `program-${crypto.randomUUID()}`, status: undefined, generation: { draftId: aiProgramDraft.draftId || aiProgramDraft.id, createdAt: aiProgramDraft.createdAt, generator: aiProgramDraft.generator || "Khayubdi AI Program Generator", status: "Approved", approvedAt }, name: aiProgramDraft.name, createdAt: approvedAt, updatedAt: approvedAt, version: 1, schedule: null }, workoutPrograms.length);
  workoutPrograms.unshift(accepted); activeProgramId = accepted.id; workoutProgram = accepted; saveWorkoutProgram();
  aiProgramDraft = null; saveAiProgramDraft(); render(); switchWorkoutPanel("myProgramPanel"); showToast("บันทึกเป็นโปรแกรมใหม่แล้ว");
}

function programRequestFromChat(message) {
  const text = String(message || "").toLowerCase();
  const relevant = ["program", "programme", "โปรแกรม", "hypertrophy", "strength", "fat loss", "dumbbell", "ดัมเบล", "train ", "days", "วัน", "knee", "เข่า"].some((term) => text.includes(term));
  if (!relevant) return null;
  const request = aiProgramRequest();
  if (text.includes("hypertrophy") || text.includes("muscle")) request.goal = "muscle_gain";
  if (text.includes("fat loss") || text.includes("ลดไขมัน")) request.goal = "fat_loss";
  if (text.includes("strength") || text.includes("เพิ่มแรง")) request.goal = "strength";
  const dayMatch = text.match(/\b([2-6])\s*(?:day|days|วัน)/);
  if (dayMatch) request.days = Number(dayMatch[1]);
  if (text.includes("dumbbell") || text.includes("ดัมเบล")) request.equipment = "minimal";
  if (text.includes("knee") || text.includes("เข่า")) request.injuries = [request.injuries, "knee"].filter(Boolean).join(", ");
  return request;
}

function isProgramDraftCommand(message) {
  const text = String(message || "").toLowerCase();
  return ["create", "generate", "build", "make", "สร้าง", "จัดโปรแกรม", "dumbbell", "ดัมเบล", "train ", "knee", "เข่า"].some((term) => text.includes(term));
}

function applyProgramRequestToForm(request) {
  fields.aiProgramGoal.value = request.goal;
  fields.aiProgramExperience.value = request.experience;
  fields.aiProgramDays.value = String(request.days);
  fields.aiProgramMinutes.value = String(request.minutes);
  fields.aiProgramEquipment.value = request.equipment;
  fields.aiProgramTargets.value = request.targetMuscles || "";
  fields.aiProgramInjuries.value = request.injuries || "";
  fields.aiProgramPreferred.value = request.preferredExercises || "";
  fields.aiProgramAvoid.value = request.avoidExercises || "";
}

function renderDashboardDraftProgram() {
  if (!fields.dashDraftProgramCard) return;
  fields.dashDraftProgramCard.classList.toggle("hidden", !aiProgramDraft); if (!aiProgramDraft) return;
  fields.dashDraftStatus.textContent = "Draft · Review required"; fields.dashDraftGoal.textContent = goalLabel(aiProgramDraft.request.goal);
  fields.dashDraftSplit.textContent = aiProgramDraft.days.map((day) => day.title.replace(/^Day \d+:\s*/, "")).join(" / ");
  fields.dashDraftCreated.textContent = formatShortDate(dateKey(new Date(aiProgramDraft.createdAt)));
}

function generateWorkoutProgram(settings) {
  const days = Math.max(2, Math.min(6, Number(settings.days || 3)));
  const template = workoutTemplate(settings.goal, settings.experience, settings.equipment, settings.injuries, days);
  const weekdays = trainingWeekdays(days);
  return {
    createdAt: new Date().toISOString(),
    settings,
    days: [...Array(days)].map((_, index) => {
      const focus = template[index % template.length];
      const exercises = completeWorkoutExercises(focus.exercises, settings, focus.title);
      return {
        title: `Day ${index + 1}: ${focus.title}`,
        weekday: weekdays[index],
        cardioTarget: focus.cardio,
        notes: `${settings.minutes} นาที · อุปกรณ์: ${equipmentLabel(settings.equipment)}${settings.injuries ? ` · ระวัง: ${settings.injuries}` : ""}`,
        exercises: exercises.map((exercise) => ({ ...exercise, checkin: {} })),
      };
    }),
  };
}

function completeWorkoutExercises(baseExercises, settings, title) {
  const target = exerciseCountForDuration(Number(settings.minutes || 45));
  const used = new Set(baseExercises.map((exercise) => exercise.exerciseId).filter(Boolean));
  const extras = ["Core", "Carry", "Mobility", "Cardio", "Horizontal Pull", "Vertical Push", "Lunge", "Hinge"];
  const completed = [...baseExercises];
  extras.forEach((pattern) => {
    if (completed.length >= target) return;
    const item = pickCatalogExercise({
      movementPattern: pattern,
      equipment: settings.equipment,
      goal: settings.goal,
      experience: settings.experience,
      injuries: settings.injuries,
      used,
    });
    const isConditioning = item.movementPattern === "Cardio";
    completed.push(ex(item, isConditioning ? 1 : item.defaultSets, item.defaultReps, `${item.defaultRestSeconds}s`, `${title} accessory`));
  });
  return completed.slice(0, target);
}

function exerciseCountForDuration(minutes) {
  if (minutes <= 30) return 4;
  if (minutes <= 45) return 6;
  if (minutes <= 60) return 7;
  return 9;
}

function workoutTemplate(goal, experience, equipment, injuries, days = 3) {
  const beginner = experience === "beginner" || goal === "beginner";
  const advanced = experience === "advanced";
  const baseSets = beginner ? 2 : advanced ? 4 : 3;
  const strengthSets = beginner ? 3 : advanced ? 5 : 4;
  const library = exerciseLibrary(equipment, goal, experience, injuries);
  const fullBody = [
    { title: "Full Body", cardio: goal === "fat_loss" ? "Zone 2 20 นาที" : "เดินเร็ว 10-15 นาที", exercises: [
      ex(library.squat, baseSets, beginner ? "10-12" : "8-12", "60-90s", "คุมฟอร์มให้มั่นคง"),
      ex(library.push, baseSets, "8-12", "60-90s", "เหลือแรง 1-2 reps"),
      ex(library.pull, baseSets, "10-12", "60-90s", "บีบสะบัก"),
      ex(library.hinge, baseSets, "10-12", "75s", "หลังตรง"),
    ] },
  ];
  if (days === 2 || beginner) return fullBody.concat([
    { title: "Full Body B", cardio: "Zone 2 15-20 นาที", exercises: [
      ex(library.lunge, baseSets, "10/ข้าง", "60s", "เข่านิ่ง"),
      ex(library.press, baseSets, "8-10", "75s", "คุมแกนกลาง"),
      ex(library.row, baseSets, "10-12", "60s", "ดึงศอกไปด้านหลัง"),
      ex("Plank", 3, "30-45s", "45s", "เกร็งลำตัว"),
    ] },
  ]);
  if (days === 4) {
    return [
      { title: "Upper", cardio: "Zone 2 10 นาที", exercises: [ex(library.push, baseSets, "8-12", "75s", "ดันนิ่ง"), ex(library.pull, baseSets, "10-12", "75s", "เต็มช่วง"), ex(library.press, baseSets, "8-10", "90s", "ไม่แอ่นหลัง"), ex(library.curl, 2, "12-15", "45s", "ควบคุม")] },
      { title: "Lower", cardio: "เดินชัน 10 นาที", exercises: [ex(library.squat, baseSets, "8-12", "90s", "ลงช้า"), ex(library.hinge, baseSets, "8-10", "90s", "สะโพกถอย"), ex(library.lunge, 3, "10/ข้าง", "60s", "ก้าวมั่นคง"), ex("Calf Raise", 3, "12-15", "45s", "ค้างบน")] },
      { title: "Upper Volume", cardio: "Zone 2 8-12 นาที", exercises: [ex(library.row, baseSets, "10-12", "75s", "หลังทำงาน"), ex(library.inclinePush, baseSets, "10-12", "75s", "คุมไหล่"), ex(library.raise, 3, "12-15", "45s", "ไม่เหวี่ยง"), ex(library.triceps, 2, "12-15", "45s", "ศอกนิ่ง")] },
      { title: "Lower + Core", cardio: "จักรยาน 10 นาที", exercises: [ex(library.hinge, baseSets, "8-12", "90s", "หลังตรง"), ex(library.squatAlt, baseSets, "10-12", "75s", "คุมจังหวะ"), ex("Dead Bug", 3, "8/ข้าง", "45s", "แกนกลางนิ่ง"), ex("Side Plank", 2, "20-30s/ข้าง", "45s", "สะโพกไม่ตก")] },
    ];
  }
  if ((days >= 5 && goal !== "strength") || goal === "muscle_gain") {
    const ppl = [
      { title: "Push", cardio: "Zone 2 8-10 นาที", exercises: [ex(library.push, baseSets, "8-12", "90s", "คุม tempo"), ex(library.press, baseSets, "8-10", "90s", "แกนกลางนิ่ง"), ex(library.raise, 3, "12-15", "45s", "ไม่เหวี่ยง"), ex(library.triceps, 3, "10-15", "45s", "ศอกนิ่ง")] },
      { title: "Pull", cardio: "เดินเร็ว 10 นาที", exercises: [ex(library.pull, baseSets, "8-12", "90s", "ดึงเต็มช่วง"), ex(library.row, baseSets, "10-12", "75s", "บีบสะบัก"), ex(library.rearDelt, 3, "12-15", "45s", "ไหล่หลัง"), ex(library.curl, 3, "10-15", "45s", "คุมลงช้า")] },
      { title: "Legs", cardio: "Zone 2 10 นาที", exercises: [ex(library.squat, baseSets, "8-12", "90s", "ลงลึกพอดี"), ex(library.hinge, baseSets, "8-10", "90s", "หลังตรง"), ex(library.lunge, 3, "10/ข้าง", "60s", "เข่านิ่ง"), ex("Calf Raise", 3, "12-15", "45s", "ค้างบน")] },
      { title: "Upper", cardio: "Zone 2 8 นาที", exercises: [ex(library.inclinePush, baseSets, "10-12", "75s", "อกทำงาน"), ex(library.row, baseSets, "10-12", "75s", "คุมไหล่"), ex(library.raise, 3, "12-15", "45s", "เบาแต่ชัด"), ex("Plank", 3, "30-45s", "45s", "นิ่ง")] },
      { title: "Lower", cardio: "เดินชัน 10 นาที", exercises: [ex(library.squatAlt, baseSets, "10-12", "75s", "คุมจังหวะ"), ex(library.hingeAlt, baseSets, "10-12", "75s", "สะโพกถอย"), ex("Glute Bridge", 3, "12-15", "45s", "บีบก้น"), ex("Dead Bug", 3, "8/ข้าง", "45s", "แกนกลาง")] },
      { title: "Conditioning", cardio: "Intervals 8 x 30s", exercises: [ex("Farmer Carry", 4, "30-45s", "60s", "ลำตัวตรง"), ex("Step up", 3, "10/ข้าง", "60s", "ก้าวมั่นคง"), ex("Mountain Climber", 3, "30s", "45s", "คุมหายใจ")] },
    ];
    return ppl.slice(0, days);
  }
  if (goal === "strength") {
    return [
      { title: "Strength Lower", cardio: "Zone 2 10 นาที", exercises: [
        ex(library.squat, strengthSets, "4-6", "120s", "คุมฟอร์มลึกพอดี"),
        ex(library.hinge, 3, "6-8", "120s", "หลังตรง"),
        ex("Plank", 3, "30-45s", "60s", "เกร็งลำตัว"),
      ] },
      { title: "Strength Upper", cardio: "เดินชัน 10 นาที", exercises: [
        ex(library.push, strengthSets, "4-6", "120s", "หยุดนิ่งที่อก"),
        ex(library.row, 3, "6-8", "90s", "บีบสะบัก"),
        ex(library.press, 3, "5-8", "120s", "ไม่แอ่นหลัง"),
      ] },
      ...fullBody,
    ];
  }
  if (goal === "fat_loss") {
    return [
      { title: "Full Body Burn", cardio: "Zone 2 20 นาที", exercises: [
        ex(library.squat, baseSets + 1, "10-12", "60s", "จังหวะต่อเนื่อง"),
        ex(library.push, baseSets + 1, "8-12", "60s", "เหลือแรง 2 reps"),
        ex(library.row, baseSets + 1, "10-12", "60s", "คุมไหล่"),
      ] },
      { title: "Conditioning", cardio: "Intervals 8 x 30s", exercises: [
        ex(library.lunge, baseSets, "10/ข้าง", "60s", "เข่านิ่ง"),
        ex(library.hinge, baseSets, "12", "60s", "หลังตรง"),
        ex("Mountain Climber", baseSets, "30s", "45s", "คุมหายใจ"),
      ] },
      ...fullBody,
    ];
  }
  return fullBody.concat([
    { title: "General Health B", cardio: "Zone 2 20-30 นาที", exercises: [
      ex(library.lunge, baseSets, "10/ข้าง", "60s", "ก้าวมั่นคง"),
      ex(library.row, baseSets, "12", "60s", "หลังทำงาน"),
      ex("Dead Bug", baseSets, "8/ข้าง", "45s", "แกนกลางนิ่ง"),
    ] },
    { title: "Mobility + Core", cardio: "เดินเร็ว 20 นาที", exercises: [
      ex("Hip Mobility", 2, "45s", "30s", "ไม่ฝืนช่วงเจ็บ"),
      ex("Bird Dog", 3, "8/ข้าง", "45s", "ลำตัวนิ่ง"),
      ex("Side Plank", 2, "20-30s/ข้าง", "45s", "คุมสะโพก"),
    ] },
  ]);
}

function ex(item, sets, reps, rest, notes) {
  const exercise = typeof item === "string" ? findCatalogByEnglish(item) : item;
  if (exercise) {
    return {
      exerciseId: exercise.id,
      name: exercise.nameEn,
      nameTh: exercise.nameTh,
      sets,
      reps,
      rest,
      notes,
      tempo: exercise.tempo || "placeholder",
      movementPattern: exercise.movementPattern,
      primaryMuscle: exercise.primaryMuscle,
    };
  }
  return { name: String(item), sets, reps, rest, notes, tempo: "placeholder" };
}

function equipmentLabel(value) {
  const labels = {
    home: "Home",
    gym: "Gym",
    minimal: "Minimal Equipment",
  };
  return labels[value] || "Home";
}

function exerciseLibrary(equipment, goal = "general_health", experience = "beginner", injuries = "") {
  const used = new Set();
  const pick = (criteria) => pickCatalogExercise({ ...criteria, equipment, goal, experience, injuries, used });
  return {
    squat: pick({ movementPattern: "Squat", muscle: "Quadriceps" }),
    squatAlt: pick({ movementPattern: "Squat", muscle: "Quadriceps" }),
    hinge: pick({ movementPattern: "Hinge", muscle: "Hamstrings" }),
    hingeAlt: pick({ movementPattern: "Hinge", muscle: "Glutes" }),
    lunge: pick({ movementPattern: "Lunge" }),
    push: pick({ movementPattern: "Horizontal Push", muscle: "Chest" }),
    inclinePush: pick({ movementPattern: "Horizontal Push", muscle: "Chest" }),
    pull: pick({ movementPattern: "Vertical Pull", muscle: "Back" }),
    row: pick({ movementPattern: "Horizontal Pull", muscle: "Back" }),
    press: pick({ movementPattern: "Vertical Push", muscle: "Shoulders" }),
    raise: pick({ primaryMuscle: "Shoulders" }),
    rearDelt: pick({ primaryMuscle: "Shoulders", movementPattern: "Horizontal Pull" }),
    curl: pick({ primaryMuscle: "Biceps" }),
    triceps: pick({ primaryMuscle: "Triceps" }),
  };
}

function pickCatalogExercise({ movementPattern = "", muscle = "", primaryMuscle = "", equipment = "home", goal = "general_health", experience = "beginner", injuries = "", used = new Set() }) {
  const allowed = allowedEquipmentForProgram(equipment);
  const lowerInjury = String(injuries || "").toLowerCase();
  const candidates = EXERCISE_CATALOG.filter((exercise) => {
    if (used.has(exercise.id)) return false;
    if (movementPattern && exercise.movementPattern !== movementPattern) return false;
    if (primaryMuscle && exercise.primaryMuscle !== primaryMuscle) return false;
    if (muscle && exercise.primaryMuscle !== muscle && !exercise.secondaryMuscles.includes(muscle)) return false;
    if (!exercise.equipment.some((item) => allowed.includes(item))) return false;
    if (!exercise.suitableGoals.includes(goal) && !exercise.suitableGoals.includes("general_health")) return false;
    if (experience === "beginner" && exercise.difficulty === "Advanced") return false;
    if (lowerInjury.includes("knee") || lowerInjury.includes("เข่า")) {
      if (["Burpee", "Jump Rope", "Walking Lunge", "Back Squat"].includes(exercise.nameEn)) return false;
    }
    if (lowerInjury.includes("back") || lowerInjury.includes("หลัง")) {
      if (["Deadlift", "Back Squat", "Romanian Deadlift"].includes(exercise.nameEn)) return false;
    }
    if (lowerInjury.includes("shoulder") || lowerInjury.includes("ไหล่")) {
      if (["Overhead Press", "Pike Push up", "Pull up"].includes(exercise.nameEn)) return false;
    }
    if (lowerInjury.includes("wrist") || lowerInjury.includes("ข้อมือ")) {
      if (["Push up", "Burpee", "Close-grip Push up"].includes(exercise.nameEn)) return false;
    }
    return true;
  });
  const sorted = candidates.sort((a, b) => difficultyRank(a.difficulty) - difficultyRank(b.difficulty));
  const safeFallback = EXERCISE_CATALOG.find((exercise) => !used.has(exercise.id) && exercise.equipment.some((item) => allowed.includes(item)) && (experience !== "beginner" || exercise.difficulty !== "Advanced"));
  const choice = sorted[0] || safeFallback || EXERCISE_CATALOG.find((exercise) => exercise.equipment.includes("Bodyweight")) || EXERCISE_CATALOG[0];
  used.add(choice.id);
  return choice;
}

function allowedEquipmentForProgram(equipment) {
  if (equipment === "gym") return EQUIPMENT_TYPES;
  if (equipment === "minimal") return ["Bodyweight", "Dumbbell", "Resistance Band", "Bench", "Minimal Equipment"];
  return ["Bodyweight", "Resistance Band", "Bench", "Minimal Equipment"];
}

function difficultyRank(value) {
  return { Beginner: 1, Intermediate: 2, Advanced: 3 }[value] || 2;
}

function findCatalogByEnglish(name) {
  return EXERCISE_CATALOG.find((exercise) => exercise.nameEn === name) || null;
}

function trainingWeekdays(days) {
  const plans = {
    2: ["Monday", "Thursday"],
    3: ["Monday", "Wednesday", "Friday"],
    4: ["Monday", "Tuesday", "Thursday", "Friday"],
    5: ["Monday", "Tuesday", "Wednesday", "Friday", "Saturday"],
    6: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  };
  return plans[days] || plans[3];
}

function weeklyCalendar(days, trainingDays) {
  const week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const byDay = Object.fromEntries((days || []).map((day) => [day.weekday, day]));
  return week.map((weekday) => {
    const item = byDay[weekday];
    return `
      <article class="${item ? "training" : "rest"}">
        <strong>${weekday}</strong>
        <span>${item ? escapeHtml(item.title.replace(/^Day \d+:\s*/, "")) : "Rest Day"}</span>
      </article>
    `;
  }).join("");
}

function workoutProgramSummary() {
  const trainingDays = workoutProgram.days.length;
  const weeklyVolume = workoutProgram.days.reduce((total, day) => total + (day.exercises || []).reduce((sets, exercise) => sets + Number(exercise.sets || 0), 0), 0);
  const estimatedTime = trainingDays * Number(workoutProgram.settings.minutes || 0);
  return { trainingDays, weeklyVolume, estimatedTime };
}

function hasInjuryText(value = "") {
  const text = String(value).toLowerCase();
  return ["knee", "back", "shoulder", "wrist", "เข่า", "หลัง", "ไหล่", "ข้อมือ"].some((word) => text.includes(word));
}

function updateProgramCheckin(input) {
  const day = workoutProgram.days[Number(input.dataset.day)];
  const exercise = day?.exercises?.[Number(input.dataset.exercise)];
  if (!exercise) return;
  exercise.checkin = exercise.checkin || {};
  const field = input.dataset.field;
  exercise.checkin[field] = input.type === "checkbox" ? input.checked : input.value;
  exercise.checkin.updatedAt = new Date().toISOString();
  saveWorkoutProgram();
  syncProgramHistory(exercise.name, exercise.checkin);
  renderDashboard();
  fields.programAdherence.textContent = `${programAdherence()}%`;
}

function syncProgramHistory(name, checkin) {
  if (!checkin.completed) return;
  const today = dateKey(new Date());
  const existing = programHistory.find((item) => item.date === today && item.name === name);
  const record = { date: today, name, weight: Number(checkin.weight || 0), reps: Number(checkin.reps || 0), rpe: Number(checkin.rpe || 0), cardio: Number(checkin.cardio || 0), notes: checkin.notes || "" };
  if (existing) Object.assign(existing, record);
  else programHistory.unshift(record);
  saveProgramHistory();
}

function programAdherence() {
  const exercises = workoutProgram.days.flatMap((day) => day.exercises || []);
  if (!exercises.length) return 0;
  return Math.round(exercises.filter((exercise) => exercise.checkin?.completed).length / exercises.length * 100);
}

function previousPerformance(name) {
  const exercise = progressiveOverloadEngine().exercises[normalizeExerciseName(name)];
  const item = exercise?.previous || exercise?.last;
  return item ? `${performanceLabel(item)} · ${formatShortDate(item.date)}` : "";
}

function progressionSuggestion(exercise, previous) {
  const item = progressiveOverloadEngine().exercises[normalizeExerciseName(exercise.name)];
  if (item) return item.suggestion;
  if (!previous) return "Maintain: สร้าง baseline ครั้งแรก";
  const latest = programHistory.find((record) => record.name === exercise.name);
  if (!latest) return "Maintain: คุม tempo และฟอร์ม";
  if (latest.rpe && latest.rpe <= 7) return latest.weight ? "+2.5 kg" : "+1 rep";
  if (latest.rpe && latest.rpe >= 9) return "ใช้น้ำหนักเดิมและคุมฟอร์ม";
  return "+1 rep หรือ tempo ช้าลง";
}

function dailyCoachFeedback() {
  const today = dateKey(new Date());
  const score = healthScoreForDate(today);
  const log = healthLogs[today] || {};
  const foodTotals = dailyFoodTotals(foods.filter((food) => dateKey(new Date(food.createdAt)) === today));
  const workoutMinutes = sum(entries.filter((entry) => dateKey(new Date(entry.createdAt)) === today), "minutes");
  const target = nutritionTargets();
  const proteinLeft = Math.max(0, target.protein - foodTotals.protein);
  const waterGoal = waterGoalForLog(log);
  const waterLeft = Math.max(0, waterGoal - Number(log.waterMl || 0));
  const calorieBalance = foodTotals.calories - target.calories;
  const sleepHours = Number(log.sleepHours || 0);
  const messages = [`คะแนนวันนี้ ${score}/100 (${nutritionRating(score)})`];
  messages.push(proteinLeft > 0 ? `เหลือโปรตีน ${proteinLeft}g ลองเพิ่มไข่/อกไก่/เวย์ 1 มื้อ` : "โปรตีนถึงเป้าแล้ว ดีต่อ recovery");
  messages.push(waterLeft > 0 ? `ดื่มน้ำเพิ่มอีก ${(waterLeft / 1000).toFixed(1)}L` : `น้ำถึงเป้า ${(waterGoal / 1000).toFixed(1)}L แล้ว`);
  messages.push(workoutMinutes < 20 ? "วันนี้ยังไม่มี workout พอ ลองเดินเร็วหรือทำโปรแกรม 20 นาที" : `ออกกำลังแล้ว ${workoutMinutes} นาที`);
  messages.push(sleepHours < 7 ? "คืนนี้ตั้งเป้านอนให้ได้ 7+ ชั่วโมง" : "การนอนดี รักษาเวลานอนให้คงที่");
  messages.push(calorieBalance > 250 ? `แคลเกินประมาณ ${calorieBalance} kcal มื้อต่อไปเน้นโปรตีนลีน` : calorieBalance < -450 ? `แคลยังต่ำ ${Math.abs(calorieBalance)} kcal ระวังพลังงานไม่พอ` : "สมดุลแคลอรี่วันนี้อยู่ในช่วงดี");
  return messages.join(" · ");
}

function weeklyCoachReview() {
  const dates = trailingDateKeys(7);
  const weekFoods = foods.filter((food) => dates.includes(dateKey(new Date(food.createdAt))));
  const weekEntries = entries.filter((entry) => dates.includes(dateKey(new Date(entry.createdAt))));
  const waterAvg = Math.round(dates.reduce((total, date) => total + Number(healthLogs[date]?.waterMl || 0), 0) / 7);
  const sleepValues = dates.map((date) => Number(healthLogs[date]?.sleepHours || 0)).filter(Boolean);
  const sleepAvg = sleepValues.length ? average(sleepValues) : 0;
  const weights = dates.map((date) => Number(healthLogs[date]?.weightKg || 0)).filter(Boolean);
  const nutritionAvg = Math.round(sum(weekFoods, "calories") / 7);
  const proteinAvg = Math.round(sum(weekFoods, "protein") / 7);
  const workoutDays = new Set(weekEntries.map((entry) => dateKey(new Date(entry.createdAt)))).size;
  const weightText = weights.length >= 2 ? `${weights[0]} → ${weights[weights.length - 1]} kg` : "ยังไม่มีข้อมูลพอ";
  const achievements = [];
  if (proteinAvg >= nutritionTargets().protein * 0.8) achievements.push("โปรตีนเฉลี่ยใกล้เป้า");
  if (waterAvg >= waterGoalForLog(healthLogs[dateKey(new Date())] || {}) * 0.8) achievements.push("ดื่มน้ำสม่ำเสมอ");
  if (workoutDays >= 3) achievements.push("ออกกำลังสม่ำเสมอ");
  if (sleepAvg >= 7) achievements.push("นอนถึง 7 ชั่วโมง");
  const improvements = [];
  if (proteinAvg < nutritionTargets().protein * 0.8) improvements.push("เพิ่มโปรตีนต่อวัน");
  if (waterAvg < waterGoalForLog(healthLogs[dateKey(new Date())] || {})) improvements.push("เพิ่มน้ำให้ถึงเป้าหมาย");
  if (workoutDays < 3) improvements.push("เพิ่ม workout อย่างน้อย 3 วัน");
  if (sleepAvg < 7) improvements.push("นอนให้ครบ 7 ชั่วโมง");
  const focus = improvements[0] || "รักษาความสม่ำเสมอและเพิ่มคุณภาพอาหาร";
  return [
    { title: "Weight trend", text: weightText },
    { title: "Nutrition trend", text: `เฉลี่ย ${nutritionAvg} kcal · ${proteinAvg}g protein/วัน` },
    { title: "Workout consistency", text: `${workoutDays}/7 วัน · adherence ${programAdherence()}%` },
    { title: "Sleep consistency", text: sleepAvg ? `เฉลี่ย ${sleepAvg.toFixed ? sleepAvg.toFixed(1) : sleepAvg} ชม./คืน` : "ยังไม่มีข้อมูลนอน" },
    { title: "Water consistency", text: `เฉลี่ย ${(waterAvg / 1000).toFixed(1)}L/วัน` },
    { title: "Top achievements", text: achievements.length ? achievements.join(" · ") : "เริ่มบันทึกข้อมูลได้ดีแล้ว" },
    { title: "Top improvements", text: improvements.length ? improvements.join(" · ") : "ไม่มีจุดเร่งด่วน" },
    { title: "Next week's focus", text: focus },
  ];
}

async function persistProfile() {
  profile = { ...defaultProfile(), ...profile };
  if (USE_BACKEND && !LOCAL_TRACKING_ONLY) {
    try {
      const data = await apiRequest("/api/app/profile", { method: "PUT", body: profile });
      profile = { ...defaultProfile(), ...(data.profile || {}) };
    } catch (error) {
      showAuthMessage(error.message, "error");
    }
  } else {
    localStorage.setItem(PROFILE_KEY(), JSON.stringify(profile));
  }
}

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "{}"); }
  catch { return {}; }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function resolveLocalUserId(login, users) {
  const normalized = normalizeUserId(login);
  if (users[normalized]) return normalized;
  const match = Object.entries(users).find(([, user]) => normalizeUserId(user.email) === normalized);
  return match ? match[0] : "";
}

function rememberSession(remember) {
  const storage = remember ? localStorage : sessionStorage;
  const otherStorage = remember ? sessionStorage : localStorage;
  storage.setItem(SESSION_KEY, currentUserId);
  if (authToken) storage.setItem(TOKEN_KEY, authToken);
  otherStorage.removeItem(SESSION_KEY);
  otherStorage.removeItem(TOKEN_KEY);
  localStorage.setItem(REMEMBER_KEY, remember ? "true" : "false");
}

function removeDemoUsers() {
  const users = loadUsers();
  const demoIds = Object.keys(users).filter((id) => id.startsWith("demo") || id.endsWith("@khayubdi.local"));
  if (!demoIds.length) return;
  demoIds.forEach((id) => {
    delete users[id];
    localStorage.removeItem(`${BASE_STORAGE_KEY}_${id}`);
    localStorage.removeItem(`${BASE_FOOD_KEY}_${id}`);
    localStorage.removeItem(`${BASE_HEALTH_KEY}_${id}`);
    localStorage.removeItem(`${BASE_PROGRAM_KEY}_${id}`);
    localStorage.removeItem(`${BASE_PROGRAM_HISTORY_KEY}_${id}`);
    localStorage.removeItem(`${BASE_CHAT_KEY}_${id}`);
    localStorage.removeItem(`${BASE_ADAPTIVE_KEY}_${id}`);
    localStorage.removeItem(`${BASE_AI_DRAFT_KEY}_${id}`);
    localStorage.removeItem(`${BASE_NUTRITION_DRAFT_KEY}_${id}`);
    localStorage.removeItem(`${BASE_NUTRITION_PLANS_KEY}_${id}`);
    localStorage.removeItem(`${BASE_NOTIFICATIONS_KEY}_${id}`);
    localStorage.removeItem(`${BASE_TRAINER_KEY}_${id}`);
    localStorage.removeItem(`${BASE_PROFILE_KEY}_${id}`);
    localStorage.removeItem(`${BASE_CLIENT_KEY}_${id}`);
  });
  saveUsers(users);
  if (demoIds.includes(currentUserId)) {
    currentUserId = "";
    authToken = "";
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  }
}

function normalizeUserId(value) {
  return String(value || "").trim().toLowerCase();
}

function userStorageKey(baseKey) {
  return `${baseKey}_${currentUserId}`;
}

function defaultProfile() {
  return {
    username: "",
    password: "",
    displayName: "",
    gender: "",
    age: 0,
    heightCm: 0,
    goal: "health",
    bodyWeight: 70,
    targetWeight: 0,
    waterGoalMl: WATER_GOAL_ML,
    sleepGoalHours: 8,
    activityLevel: "moderate",
    plan: "free",
    weeklyTarget: 150,
    onboardingComplete: false,
    privacy: defaultPrivacy(),
    health: defaultHealthSettings(),
  };
}

function profileFromRegistration(registration, onboardingComplete) {
  const currentWeight = Number(registration.currentWeight || registration.bodyWeight || 70);
  return {
    ...defaultProfile(),
    username: normalizeUserId(registration.username),
    password: String(registration.password || ""),
    displayName: String(registration.displayName || registration.username || "").trim(),
    gender: registration.gender || "",
    age: Number(registration.age || 0),
    heightCm: Number(registration.heightCm || 0),
    bodyWeight: currentWeight || 70,
    targetWeight: Number(registration.targetWeight || 0),
    goal: registration.goal || "health",
    activityLevel: registration.activityLevel || "moderate",
    onboardingComplete,
  };
}

function hydrateOnboardingForm() {
  fields.onboardingDisplayName.value = profile.displayName || "";
  fields.onboardingGender.value = profile.gender || "";
  fields.onboardingAge.value = profile.age || "";
  fields.onboardingHeight.value = profile.heightCm || "";
  fields.onboardingCurrentWeight.value = profile.bodyWeight || "";
  fields.onboardingTargetWeight.value = profile.targetWeight || "";
  fields.onboardingGoal.value = profile.goal || "health";
  fields.onboardingActivityLevel.value = profile.activityLevel || "moderate";
}

function defaultHealthSettings() {
  return { provider: "", connectedAt: "", status: "disconnected" };
}

function defaultClient() {
  return {
    clientId: localClientId(),
    name: "",
    email: currentUserId && currentUserId.includes("@") ? currentUserId : "",
    phone: "",
    birthday: "",
    note: "",
  };
}

function localClientId() {
  const key = `${BASE_CLIENT_KEY}_id_${currentUserId || "guest"}`;
  let id = localStorage.getItem(key);
  if (!id) {
    const random = Math.random().toString(16).slice(2, 8).toUpperCase();
    id = `KHD-${new Date().getFullYear()}-${random}`;
    localStorage.setItem(key, id);
  }
  return id;
}

function defaultPrivacy() {
  return { analytics: false, marketing: false, shareForCoaching: false };
}

function STORAGE_KEY() {
  return userStorageKey(BASE_STORAGE_KEY);
}

function FOOD_KEY() {
  return userStorageKey(BASE_FOOD_KEY);
}

function HEALTH_KEY() {
  return userStorageKey(BASE_HEALTH_KEY);
}

function PROGRAM_KEY() {
  return userStorageKey(BASE_PROGRAM_KEY);
}

function PROGRAM_HISTORY_KEY() {
  return userStorageKey(BASE_PROGRAM_HISTORY_KEY);
}

function CHAT_KEY() {
  return userStorageKey(BASE_CHAT_KEY);
}

function ADAPTIVE_KEY() {
  return userStorageKey(BASE_ADAPTIVE_KEY);
}

function AI_DRAFT_KEY() {
  return userStorageKey(BASE_AI_DRAFT_KEY);
}

function NUTRITION_DRAFT_KEY() { return userStorageKey(BASE_NUTRITION_DRAFT_KEY); }
function NUTRITION_PLANS_KEY() { return userStorageKey(BASE_NUTRITION_PLANS_KEY); }
function NOTIFICATIONS_KEY() { return userStorageKey(BASE_NOTIFICATIONS_KEY); }
function TRAINER_KEY() { return userStorageKey(BASE_TRAINER_KEY); }

function PROFILE_KEY() {
  return userStorageKey(BASE_PROFILE_KEY);
}

function CLIENT_KEY() {
  return userStorageKey(BASE_CLIENT_KEY);
}

function calculateStreak() {
  let streak = 0;
  for (let offset = 0; offset < 365; offset += 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    const hasEntry = entries.some((entry) => dateKey(new Date(entry.createdAt)) === dateKey(date));
    if (!hasEntry) break;
    streak += 1;
  }
  return streak;
}

function estimateCalories(items) {
  return Math.round(items.reduce((total, entry) => total + entryCalories(entry), 0));
}

function entryCalories(entry) {
  return Math.round(Number(entry.caloriesBurned || calculateExerciseCalories(entry.name, entry.minutes)));
}

function calculateExerciseCalories(activityName, minutes) {
  const met = inferActivityMet(activityName);
  const weightKg = Number(profile.bodyWeight || 70);
  const duration = Number(minutes || 0);
  return Math.max(0, Math.round((met * 3.5 * weightKg / 200) * duration));
}

function inferActivityMet(activityName) {
  const text = String(activityName || "").trim().toLowerCase();
  const match = Object.entries(activityMets).find(([name]) => text.includes(name));
  return match ? match[1] : 4.5;
}

function updateExerciseCaloriePreview() {
  fields.exerciseCalories.textContent = `${calculateExerciseCalories(fields.exerciseName.value, fields.minutes.value)} kcal`;
}

function updateHealthImportPreview() {
  fields.healthImportCalories.textContent = `${calculateExerciseCalories(fields.healthActivity.value, fields.healthMinutes.value)} kcal`;
}

function setDefaultHealthStartTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  fields.healthStartedAt.value = now.toISOString().slice(0, 16);
}
function sum(items, key) { return items.reduce((total, item) => total + Number(item[key] || 0), 0); }
function dateKey(date) { return date.toISOString().slice(0, 10); }
function formatShortDate(value) { return new Date(`${value}T12:00:00`).toLocaleDateString("th-TH", { day: "numeric", month: "short" }); }
function formatDate(value) { return new Date(value).toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" }); }
function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}



