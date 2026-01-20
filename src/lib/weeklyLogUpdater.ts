import type { HealthyCategoryId, WeeklyLog } from "./mindScore";
import type { LimitFood } from "./mindRules";

export type MealSelection = {
  healthyCategories: HealthyCategoryId[];
  limitFoods: LimitFood[];
};

export function applyMealSelection(
  log: WeeklyLog,
  selection: MealSelection
): WeeklyLog {
  const updated = log.map((entry) => ({ ...entry }));

  for (const categoryId of selection.healthyCategories) {
    const index = updated.findIndex((entry) => entry.categoryId === categoryId);
    if (index === -1) {
      throw new Error(`Missing weekly log entry for ${categoryId}`);
    }
    updated[index] = {
      ...updated[index],
      servingsPerWeek: updated[index].servingsPerWeek + 1
    };
  }

  for (const limitFood of selection.limitFoods) {
    const categoryId = mapLimitFoodToCategory(limitFood);
    const index = updated.findIndex((entry) => entry.categoryId === categoryId);
    if (index === -1) {
      throw new Error(`Missing weekly log entry for ${categoryId}`);
    }
    updated[index] = {
      ...updated[index],
      servingsPerWeek: updated[index].servingsPerWeek + 1
    };
  }

  return updated;
}

function mapLimitFoodToCategory(limitFood: LimitFood): string {
  switch (limitFood) {
    case "red_meat":
      return "red_meat";
    case "fried_food":
      return "fried_fast_food";
    default: {
      const exhaustiveCheck: never = limitFood;
      throw new Error(`Unsupported limit food: ${exhaustiveCheck}`);
    }
  }
}
