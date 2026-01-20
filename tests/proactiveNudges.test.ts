import { describe, expect, it } from "vitest";
import { RoutineAnchors } from "../src/lib/coachContext";
import { buildDailyNudges } from "../src/lib/proactiveNudges";
import { buildWeeklyScoreSummary, createWeeklyLog } from "../src/lib/mindScore";

const baseWeeklyLog = createWeeklyLog([
  { categoryId: "leafy_greens", servingsPerWeek: 4 },
  { categoryId: "other_veggies", servingsPerWeek: 7 },
  { categoryId: "berries", servingsPerWeek: 1 },
  { categoryId: "whole_grains", servingsPerWeek: 14 },
  { categoryId: "fish", servingsPerWeek: 1 },
  { categoryId: "nuts", servingsPerWeek: 3 },
  { categoryId: "poultry", servingsPerWeek: 2 },
  { categoryId: "olive_oil", servingsPerWeek: 7 },
  { categoryId: "wine", servingsPerWeek: 0 },
  { categoryId: "red_meat", servingsPerWeek: 2 },
  { categoryId: "butter_margarine", servingsPerWeek: 2 },
  { categoryId: "cheese", servingsPerWeek: 0 },
  { categoryId: "pastries_sweets", servingsPerWeek: 1 },
  { categoryId: "fried_fast_food", servingsPerWeek: 0 }
]);

describe("proactiveNudges", () => {
  it("prioritizes nuts in the morning booster", () => {
    const nudges = buildDailyNudges({
      routine: new RoutineAnchors("Toast", "Salad with an Omelet"),
      weeklyGap: buildWeeklyScoreSummary(baseWeeklyLog),
      lunchLimitFoods: []
    });

    const morning = nudges.find((nudge) => nudge.time === "morning");
    expect(morning?.body).toContain("walnuts");
  });

  it("suggests berries in the afternoon when nuts are on target", () => {
    const adjustedLog = createWeeklyLog([
      { categoryId: "leafy_greens", servingsPerWeek: 4 },
      { categoryId: "other_veggies", servingsPerWeek: 7 },
      { categoryId: "berries", servingsPerWeek: 1 },
      { categoryId: "whole_grains", servingsPerWeek: 14 },
      { categoryId: "fish", servingsPerWeek: 1 },
      { categoryId: "nuts", servingsPerWeek: 6 },
      { categoryId: "poultry", servingsPerWeek: 2 },
      { categoryId: "olive_oil", servingsPerWeek: 7 },
      { categoryId: "wine", servingsPerWeek: 0 },
      { categoryId: "red_meat", servingsPerWeek: 2 },
      { categoryId: "butter_margarine", servingsPerWeek: 2 },
      { categoryId: "cheese", servingsPerWeek: 0 },
      { categoryId: "pastries_sweets", servingsPerWeek: 1 },
      { categoryId: "fried_fast_food", servingsPerWeek: 0 }
    ]);

    const nudges = buildDailyNudges({
      routine: new RoutineAnchors("Toast", "Salad with an Omelet"),
      weeklyGap: buildWeeklyScoreSummary(adjustedLog),
      lunchLimitFoods: []
    });

    const afternoon = nudges.find((nudge) => nudge.time === "afternoon");
    expect(afternoon?.body).toContain("berries");
  });

  it("includes a repair suggestion after a limit lunch", () => {
    const nudges = buildDailyNudges({
      routine: new RoutineAnchors("Toast", "Salad with an Omelet"),
      weeklyGap: buildWeeklyScoreSummary(baseWeeklyLog),
      lunchLimitFoods: ["fried_food"]
    });

    const evening = nudges.find((nudge) => nudge.time === "evening");
    expect(evening?.body).toContain("Repair");
  });

  it("throws for duplicate limit foods", () => {
    expect(() =>
      buildDailyNudges({
        routine: new RoutineAnchors("Toast", "Salad with an Omelet"),
        weeklyGap: buildWeeklyScoreSummary(baseWeeklyLog),
        lunchLimitFoods: ["fried_food", "fried_food"]
      })
    ).toThrow("Duplicate limit food");
  });
});
