export type FoodAnalysis = {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  confidence: number;
};

export function mockAnalyzeFoodPhoto(): FoodAnalysis {
  return {
    foodName: "ข้าวกะเพราไก่ไข่ดาว",
    calories: 720,
    protein: 38,
    carbs: 75,
    fat: 28,
    fiber: 4,
    confidence: 86,
  };
}

export function calculateNutritionScore(data: {
  calories: number;
  calorieTarget: number;
  protein: number;
  proteinTarget: number;
  water: number;
  waterTarget: number;
  mealsLogged: number;
}) {
  let score = 0;

  const calorieDiff = Math.abs(data.calories - data.calorieTarget);
  score += calorieDiff <= 150 ? 30 : calorieDiff <= 300 ? 20 : 10;

  score += data.protein >= data.proteinTarget ? 30 : data.protein >= data.proteinTarget * 0.75 ? 20 : 10;
  score += data.water >= data.waterTarget ? 20 : data.water >= data.waterTarget * 0.7 ? 12 : 5;
  score += data.mealsLogged >= 3 ? 20 : data.mealsLogged >= 2 ? 12 : 5;

  return Math.min(score, 100);
}

export function getNutritionGrade(score: number) {
  if (score >= 85) return "ยอดเยี่ยม";
  if (score >= 70) return "ดี";
  if (score >= 50) return "พอใช้";
  return "ควรปรับปรุง";
}
