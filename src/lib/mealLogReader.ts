import type { MealLogEntry } from "./mealLogging";

export type LunchLimitSummary = {
  limitFoods: MealLogEntry["limitFoods"];
  hasLunch: boolean;
};

export function getLatestLunchLimitFoods(
  logs: MealLogEntry[]
): LunchLimitSummary {
  const lunches = logs.filter((log) => log.mealType === "lunch");
  if (lunches.length === 0) {
    return {
      limitFoods: [],
      hasLunch: false
    };
  }

  const latest = lunches.reduce((current, next) =>
    next.date > current.date ? next : current
  );

  return {
    limitFoods: latest.limitFoods,
    hasLunch: true
  };
}
