import type { LimitFood } from "./mindRules";
import type { WeeklyLog } from "./mindScore";
import { getLimitServingsFromWeeklyLog } from "./weeklyLogReader";
import {
  evaluateLimitSelection,
  type WarningRepairDecision
} from "./warningRepair";

export function buildMealWarningDecisions(
  log: WeeklyLog,
  limitFoods: LimitFood[]
): WarningRepairDecision[] {
  const limits = getLimitServingsFromWeeklyLog(log);
  return limitFoods.map((limitFood) =>
    evaluateLimitSelection(
      limitFood,
      limitFood === "red_meat" ? limits.red_meat : limits.fried_food
    )
  );
}
