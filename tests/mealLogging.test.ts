import { describe, expect, it } from "vitest";
import { createMealLogEntry } from "../src/lib/mealLogging";

describe("mealLogging", () => {
  it("validates core meal log fields", () => {
    const entry = createMealLogEntry({
      id: "meal-1",
      mealType: "lunch",
      label: "Grilled chicken wrap",
      date: "2026-01-19",
      healthyCategories: ["whole_grains", "poultry"],
      limitFoods: [],
      containsBeans: false,
      containsLactose: false
    });

    expect(entry.label).toBe("Grilled chicken wrap");
  });

  it("rejects beans and lactose", () => {
    expect(() =>
      createMealLogEntry({
        id: "meal-2",
        mealType: "lunch",
        label: "Bean salad",
        date: "2026-01-19",
        healthyCategories: ["leafy_greens"],
        limitFoods: [],
        containsBeans: true,
        containsLactose: false
      })
    ).toThrow("beans");

    expect(() =>
      createMealLogEntry({
        id: "meal-3",
        mealType: "lunch",
        label: "Cheesy pasta",
        date: "2026-01-19",
        healthyCategories: ["whole_grains"],
        limitFoods: [],
        containsBeans: false,
        containsLactose: true
      })
    ).toThrow("lactose");
  });

  it("requires ISO dates", () => {
    expect(() =>
      createMealLogEntry({
        id: "meal-4",
        mealType: "lunch",
        label: "Salad",
        date: "01-19-2026",
        healthyCategories: ["leafy_greens"],
        limitFoods: [],
        containsBeans: false,
        containsLactose: false
      })
    ).toThrow("ISO");
  });
});
