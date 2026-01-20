import { RoutineAnchors } from "../coachContext";
import { buildWeeklyScoreSummary } from "../mindScore";
import { getLatestLunchLimitFoods } from "../mealLogReader";
import { buildDailyNudges, type NudgeMessage } from "../proactiveNudges";
import type { MealLogEntry } from "../mealLogging";
import type { WeeklyLog } from "../mindScore";
import type { SetupState } from "../setupStorage";

export function buildUserNudges(
  setup: SetupState,
  weeklyLog: WeeklyLog,
  mealLogs: MealLogEntry[]
): NudgeMessage[] {
  const routine = new RoutineAnchors(
    setup.breakfastRoutine,
    setup.dinnerRoutine
  );
  const weeklyGap = buildWeeklyScoreSummary(weeklyLog);
  const lunchSummary = getLatestLunchLimitFoods(mealLogs);

  return buildDailyNudges({
    routine,
    weeklyGap,
    lunchLimitFoods: lunchSummary.limitFoods
  });
}
