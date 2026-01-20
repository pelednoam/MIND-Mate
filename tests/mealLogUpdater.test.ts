import { describe, expect, it } from "vitest";
import { applyMealLogEntry } from "../src/lib/mealLogUpdater";
import { buildZeroWeeklyLog } from "../src/lib/weeklyScoreStorage";
import type { MealLogEntry } from "../src/lib/mealLogging";

describe("mealLogUpdater", () => {
  it("applies a meal log entry to the weekly log", () => {
    const log = buildZeroWeeklyLog();
    const entry: MealLogEntry = {
      id: "meal-1",
      mealType: "lunch",
      label: "Fish bowl",
      date: "2026-01-20",
      healthyCategories: ["fish", "leafy_greens"],
      limitFoods: ["fried_food"],
      containsBeans: false,
      containsLactose: false
    };

    const updated = applyMealLogEntry(log, entry);
    const fish = updated.find((item) => item.categoryId === "fish");
    const greens = updated.find((item) => item.categoryId === "leafy_greens");
    const fried = updated.find(
      (item) => item.categoryId === "fried_fast_food"
    );

    expect(fish?.servingsPerWeek).toBe(1);
    expect(greens?.servingsPerWeek).toBe(1);
    expect(fried?.servingsPerWeek).toBe(1);
  });

  it("rejects entries with beans or lactose", () => {
    const log = buildZeroWeeklyLog();
    const entry: MealLogEntry = {
      id: "meal-2",
      mealType: "lunch",
      label: "Cheesy bean salad",
      date: "2026-01-20",
      healthyCategories: ["other_veggies"],
      limitFoods: [],
      containsBeans: true,
      containsLactose: false
    };

    expect(() => applyMealLogEntry(log, entry)).toThrow("beans");
  });
});
