import { describe, expect, it } from "vitest";
import { buildUserNudges } from "../src/lib/notifications/nudgeComposer";
import { createMealLogEntry } from "../src/lib/mealLogging";
import { buildZeroWeeklyLog } from "../src/lib/weeklyScoreStorage";
import type { SetupState } from "../src/lib/setupStorage";

describe("nudgeComposer", () => {
  it("builds four daily nudges from user data", () => {
    const setup: SetupState = {
      breakfastRoutine: "Toast",
      dinnerRoutine: "Salad",
      coachPersonality: "Coach"
    };
    const weeklyLog = buildZeroWeeklyLog();
    const entry = createMealLogEntry({
      id: "log-1",
      mealType: "lunch",
      label: "Burger",
      date: "2026-01-20",
      healthyCategories: [],
      limitFoods: ["red_meat"],
      containsBeans: false,
      containsLactose: false
    });

    const nudges = buildUserNudges(setup, weeklyLog, [entry]);
    expect(nudges).toHaveLength(4);
    expect(nudges.map((item) => item.time)).toEqual([
      "morning",
      "pre_lunch",
      "afternoon",
      "evening"
    ]);
    const evening = nudges.find((item) => item.time === "evening");
    expect(evening?.title).toContain("Repair");
  });
});
