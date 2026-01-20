import { describe, expect, it } from "vitest";
import { rebuildWeeklyLogFromMeals } from "../src/lib/weeklyLogReconciler";
import type { MealLogEntry } from "../src/lib/mealLogging";

describe("weeklyLogReconciler", () => {
  it("rebuilds weekly log from meal logs", () => {
    const meals: MealLogEntry[] = [
      {
        id: "meal-1",
        mealType: "lunch",
        label: "Fish bowl",
        date: "2026-01-20",
        healthyCategories: ["fish", "leafy_greens"],
        limitFoods: [],
        containsBeans: false,
        containsLactose: false
      },
      {
        id: "meal-2",
        mealType: "dinner",
        label: "Omelet",
        date: "2026-01-20",
        healthyCategories: ["poultry"],
        limitFoods: [],
        containsBeans: false,
        containsLactose: false
      }
    ];

    const log = rebuildWeeklyLogFromMeals(meals);
    const fish = log.find((entry) => entry.categoryId === "fish");
    const greens = log.find((entry) => entry.categoryId === "leafy_greens");
    const poultry = log.find((entry) => entry.categoryId === "poultry");

    expect(fish?.servingsPerWeek).toBe(1);
    expect(greens?.servingsPerWeek).toBe(1);
    expect(poultry?.servingsPerWeek).toBe(1);
  });
});
