import { describe, expect, it } from "vitest";
import { evaluateLimitSelection } from "../src/lib/warningRepair";

describe("warningRepair", () => {
  it("warns for fried food on any selection", () => {
    const decision = evaluateLimitSelection("fried_food", 1);
    expect(decision.shouldWarn).toBe(true);
    expect(decision.warning).toContain("fried food");
  });

  it("warns when red meat exceeds the weekly limit", () => {
    const decision = evaluateLimitSelection("red_meat", 5);
    expect(decision.weeklyLimit).toBe(4);
    expect(decision.shouldWarn).toBe(true);
  });

  it("does not warn for red meat below the weekly limit", () => {
    const decision = evaluateLimitSelection("red_meat", 4);
    expect(decision.shouldWarn).toBe(false);
  });

  it("throws for invalid serving counts", () => {
    expect(() => evaluateLimitSelection("red_meat", -1)).toThrow(
      "Negative servings count"
    );
    expect(() => evaluateLimitSelection("red_meat", Number.NaN)).toThrow(
      "Invalid servings count"
    );
  });
});
