import { describe, expect, it } from "vitest";
import { buildMealWarningDecisions } from "../src/lib/mealLogWarnings";
import { buildZeroWeeklyLog } from "../src/lib/weeklyScoreStorage";

describe("mealLogWarnings", () => {
  it("builds warning decisions for limit foods", () => {
    const log = buildZeroWeeklyLog().map((entry) =>
      entry.categoryId === "fried_fast_food"
        ? { ...entry, servingsPerWeek: 1 }
        : entry
    );

    const warnings = buildMealWarningDecisions(log, ["fried_food"]);
    expect(warnings).toHaveLength(1);
    expect(warnings[0].shouldWarn).toBe(true);
  });
});
