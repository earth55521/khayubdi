export type Gender = "" | "female" | "male" | "non_binary" | "self_describe";

export type FitnessGoal = "health" | "fat_loss" | "muscle_gain" | "endurance";

export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "athlete";

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  gender: Gender;
  age: number;
  heightCm: number;
  currentWeight: number;
  targetWeight: number;
  goal: FitnessGoal;
  activityLevel: ActivityLevel;
}

export interface LoginInput {
  usernameOrEmail: string;
  password: string;
  rememberMe: boolean;
}

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  displayName: string;
  authProvider: "password" | "google" | "apple" | "facebook";
  createdAt: string;
}

export interface UserProfile {
  displayName: string;
  gender: Gender;
  age: number;
  heightCm: number;
  goal: FitnessGoal;
  bodyWeight: number;
  targetWeight: number;
  activityLevel: ActivityLevel;
  plan: "free" | "pro";
  weeklyTarget: number;
  onboardingComplete: boolean;
  privacy: PrivacySettings;
  health: HealthSettings;
}

export interface PrivacySettings {
  analytics: boolean;
  marketing: boolean;
  shareForCoaching: boolean;
}

export interface HealthSettings {
  provider: "" | "apple_health" | "google_fit" | "health_connect";
  connectedAt: string;
  status: "connected" | "disconnected";
}

export interface AuthSession {
  token: string;
  userId: string;
  rememberMe: boolean;
  expiresAt?: string;
}

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface FoodEntry {
  id: string;
  name: string;
  meal: MealType;
  mealTime: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  confidence?: number;
  source?: "manual" | "local_ai" | "vision";
  photoIds?: string[];
  createdAt: string;
}

export interface FoodAnalysisEstimate {
  name: string;
  foodName?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  confidence: number;
  reason: string;
  source: "local_ai" | "vision";
}

export type NutritionRating = "ยอดเยี่ยม" | "ดี" | "พอใช้" | "ควรปรับปรุง";

export interface DailyHealthLog {
  date: string;
  waterMl: number;
  weightKg?: number;
  bodyFat?: number;
  waistCm?: number;
  progressPhoto?: { name: string; dataUrl: string };
  sleepTime?: string;
  wakeTime?: string;
  sleepHours?: number;
  sleepQuality?: 1 | 2 | 3 | 4 | 5;
  mood?: "😀" | "😐" | "😔" | "😡" | "😴";
}

export interface DailyMission {
  label: string;
  detail: string;
  done: boolean;
}

export interface HealthScoreBreakdown {
  nutrition: number;
  exercise: number;
  water: number;
  sleep: number;
  habit: number;
  total: number;
}

export type ProgressWindow = "weekly" | "monthly" | "yearly";

export type ProgramGoal = "fat_loss" | "muscle_gain" | "general_health" | "strength" | "beginner";

export interface WorkoutProgramSettings {
  goal: ProgramGoal;
  experience: "beginner" | "intermediate" | "advanced";
  days: number;
  equipment: string;
  minutes: number;
  injuries: string;
}

export interface WorkoutExercisePlan {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes: string;
  checkin?: WorkoutExerciseCheckin;
}

export interface WorkoutExerciseCheckin {
  completed: boolean;
  weight?: number;
  reps?: number;
  rpe?: number;
  cardio?: number;
  notes?: string;
  updatedAt?: string;
}

export interface WorkoutDayPlan {
  title: string;
  cardioTarget: string;
  notes: string;
  exercises: WorkoutExercisePlan[];
}

export interface WorkoutProgram {
  createdAt: string;
  settings: WorkoutProgramSettings;
  days: WorkoutDayPlan[];
}

export interface CoachReviewItem {
  title: string;
  text: string;
}
