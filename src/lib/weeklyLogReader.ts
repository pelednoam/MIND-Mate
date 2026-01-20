import type { WeeklyLog } from "./mindScore";

export type LimitServings = {
  red_meat: number;
  fried_food: number;
};

export function getLimitServingsFromWeeklyLog(log: WeeklyLog): LimitServings {
  const redMeat = log.find((entry) => entry.categoryId === "red_meat");
  if (!redMeat) {
    throw new Error("Missing red meat entry in weekly log");
  }

  const fried = log.find((entry) => entry.categoryId === "fried_fast_food");
  if (!fried) {
    throw new Error("Missing fried food entry in weekly log");
  }

  return {
    red_meat: redMeat.servingsPerWeek,
    fried_food: fried.servingsPerWeek
  };
}
