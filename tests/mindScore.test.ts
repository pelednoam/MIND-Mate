import { describe, expect, it } from "vitest";
import {
  HEALTHY_CATEGORIES,
  LIMIT_CATEGORIES,
  REMOVED_CATEGORIES,
  buildWeeklyScoreSummary,
  createWeeklyLog
} from "../src/lib/mindScore";

describe("mindScore", () => {
  it("defines 9 active healthy categories and 5 limit categories", () => {
    expect(HEALTHY_CATEGORIES).toHaveLength(9);
    expect(LIMIT_CATEGORIES).toHaveLength(5);
  });

  it("removes beans and redistributes points to nuts and fish", () => {
    expect(REMOVED_CATEGORIES).toEqual([
      {
        id: "beans",
        label: "Beans",
        weeklyTarget: 3,
        redistributedTo: ["Nuts", "Fish"]
      }
    ]);
  });

  it("requires weekly log entries for every active category", () => {
    expect(() => createWeeklyLog([])).toThrow("Missing weekly entries");
  });

  it("summarizes weekly gaps and limit budgets", () => {
    const fullLog = createWeeklyLog([
      { categoryId: "leafy_greens", servingsPerWeek: 4 },
      { categoryId: "other_veggies", servingsPerWeek: 7 },
      { categoryId: "berries", servingsPerWeek: 1 },
      { categoryId: "whole_grains", servingsPerWeek: 14 },
      { categoryId: "fish", servingsPerWeek: 1 },
      { categoryId: "nuts", servingsPerWeek: 3 },
      { categoryId: "poultry", servingsPerWeek: 2 },
      { categoryId: "olive_oil", servingsPerWeek: 7 },
      { categoryId: "wine", servingsPerWeek: 0 },
      { categoryId: "red_meat", servingsPerWeek: 4 },
      { categoryId: "butter_margarine", servingsPerWeek: 2 },
      { categoryId: "cheese", servingsPerWeek: 0 },
      { categoryId: "pastries_sweets", servingsPerWeek: 1 },
      { categoryId: "fried_fast_food", servingsPerWeek: 1 }
    ]);

    const summary = buildWeeklyScoreSummary(fullLog);

    const leafyGreens = summary.healthyGaps.find(
      (item) => item.categoryId === "leafy_greens"
    );
    expect(leafyGreens).toMatchObject({
      weeklyTarget: 6,
      servingsPerWeek: 4,
      missingServings: 2
    });

    const friedFood = summary.limitBudgets.find(
      (item) => item.categoryId === "fried_fast_food"
    );
    expect(friedFood).toMatchObject({
      weeklyLimit: 1,
      servingsPerWeek: 1,
      remainingServings: 0,
      isExceeded: false
    });
  });
});
