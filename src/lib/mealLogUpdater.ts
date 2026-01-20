import type { MealLogEntry } from "./mealLogging";
import type { WeeklyLog } from "./mindScore";
import { applyMealSelection } from "./weeklyLogUpdater";

export function applyMealLogEntry(
  log: WeeklyLog,
  entry: MealLogEntry
): WeeklyLog {
  if (entry.containsBeans) {
    throw new Error("Meal log contains beans and cannot be applied");
  }
  if (entry.containsLactose) {
    throw new Error("Meal log contains lactose and cannot be applied");
  }

  return applyMealSelection(log, {
    healthyCategories: entry.healthyCategories,
    limitFoods: entry.limitFoods
  });
}
