import { describe, expect, it } from "vitest";
import { getLatestLunchLimitFoods } from "../src/lib/mealLogReader";
import type { MealLogEntry } from "../src/lib/mealLogging";

describe("mealLogReader", () => {
  it("returns empty limit foods when no lunch logs exist", () => {
    const summary = getLatestLunchLimitFoods([]);
    expect(summary.hasLunch).toBe(false);
    expect(summary.limitFoods).toEqual([]);
  });

  it("returns latest lunch limit foods", () => {
    const logs: MealLogEntry[] = [
      {
        id: "meal-1",
        mealType: "lunch",
        label: "Salad",
        date: "2026-01-19",
        healthyCategories: ["leafy_greens"],
        limitFoods: [],
        containsBeans: false,
        containsLactose: false
      },
      {
        id: "meal-2",
        mealType: "lunch",
        label: "Fried chicken",
        date: "2026-01-20",
        healthyCategories: ["poultry"],
        limitFoods: ["fried_food"],
        containsBeans: false,
        containsLactose: false
      }
    ];

    const summary = getLatestLunchLimitFoods(logs);
    expect(summary.hasLunch).toBe(true);
    expect(summary.limitFoods).toEqual(["fried_food"]);
  });
});
