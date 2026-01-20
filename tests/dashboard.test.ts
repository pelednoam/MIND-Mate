import { describe, expect, it } from "vitest";
import { buildDashboardModel } from "../src/lib/dashboard";
import { buildWeeklyScoreSummary, createWeeklyLog } from "../src/lib/mindScore";

const weeklyLog = createWeeklyLog([
  { categoryId: "leafy_greens", servingsPerWeek: 6 },
  { categoryId: "other_veggies", servingsPerWeek: 7 },
  { categoryId: "berries", servingsPerWeek: 2 },
  { categoryId: "whole_grains", servingsPerWeek: 21 },
  { categoryId: "fish", servingsPerWeek: 1 },
  { categoryId: "nuts", servingsPerWeek: 6 },
  { categoryId: "poultry", servingsPerWeek: 2 },
  { categoryId: "olive_oil", servingsPerWeek: 7 },
  { categoryId: "wine", servingsPerWeek: 0 },
  { categoryId: "red_meat", servingsPerWeek: 1 },
  { categoryId: "butter_margarine", servingsPerWeek: 2 },
  { categoryId: "cheese", servingsPerWeek: 0 },
  { categoryId: "pastries_sweets", servingsPerWeek: 1 },
  { categoryId: "fried_fast_food", servingsPerWeek: 0 }
]);

describe("dashboard", () => {
  it("builds progress rings, limit bars, and espresso tracker", () => {
    const summary = buildWeeklyScoreSummary(weeklyLog);
    const model = buildDashboardModel({
      summary,
      espresso: { shotsToday: 1, targetShots: 2 }
    });

    expect(model.progressRings).toHaveLength(10);
    expect(model.limitBars).toHaveLength(5);
    expect(model.espressoTracker.remainingShots).toBe(1);
  });

  it("calculates a brain high score percentage", () => {
    const summary = buildWeeklyScoreSummary(weeklyLog);
    const model = buildDashboardModel({
      summary,
      espresso: { shotsToday: 2, targetShots: 2 }
    });

    expect(model.brainHighScorePercent).toBe(89);
  });

  it("throws for invalid espresso targets", () => {
    const summary = buildWeeklyScoreSummary(weeklyLog);
    expect(() =>
      buildDashboardModel({
        summary,
        espresso: { shotsToday: 1, targetShots: 0 }
      })
    ).toThrow("Espresso target must be positive");
  });
});
