import type { MealLogEntry } from "./mealLogging";
import type { WeeklyLog } from "./mindScore";
import { applyMealLogEntry } from "./mealLogUpdater";
import { buildZeroWeeklyLog } from "./weeklyScoreStorage";

export function rebuildWeeklyLogFromMeals(
  meals: MealLogEntry[]
): WeeklyLog {
  let log = buildZeroWeeklyLog();
  for (const meal of meals) {
    log = applyMealLogEntry(log, meal);
  }
  return log;
}
