import { describe, expect, it } from "vitest";
import { applyMealSelection } from "../src/lib/weeklyLogUpdater";
import { buildZeroWeeklyLog } from "../src/lib/weeklyScoreStorage";

describe("weeklyLogUpdater", () => {
  it("increments healthy categories and limit foods", () => {
    const log = buildZeroWeeklyLog();
    const updated = applyMealSelection(log, {
      healthyCategories: ["fish", "whole_grains"],
      limitFoods: ["red_meat"]
    });

    const fish = updated.find((entry) => entry.categoryId === "fish");
    const grains = updated.find((entry) => entry.categoryId === "whole_grains");
    const redMeat = updated.find((entry) => entry.categoryId === "red_meat");

    expect(fish?.servingsPerWeek).toBe(1);
    expect(grains?.servingsPerWeek).toBe(1);
    expect(redMeat?.servingsPerWeek).toBe(1);
  });

  it("maps fried food to the fried fast food category", () => {
    const log = buildZeroWeeklyLog();
    const updated = applyMealSelection(log, {
      healthyCategories: [],
      limitFoods: ["fried_food"]
    });

    const fried = updated.find(
      (entry) => entry.categoryId === "fried_fast_food"
    );
    expect(fried?.servingsPerWeek).toBe(1);
  });
});
