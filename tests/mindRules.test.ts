import { describe, expect, it } from "vitest";
import {
  DAILY_ANCHORS,
  DEFAULT_COACH_PERSONALITY,
  SCORING_ADJUSTMENT,
  SENSITIVITY_TOGGLES,
  WARNING_REPAIR_ENGINE,
  getWarningAndRepair
} from "../src/lib/mindRules";

describe("mindRules", () => {
  it("includes the default coach personality text", () => {
    expect(DEFAULT_COACH_PERSONALITY).toContain("Concise, proactive, empathetic");
    expect(DEFAULT_COACH_PERSONALITY).toContain("Never suggest beans/lactose");
  });

  it("keeps daily anchors aligned with the spec", () => {
    expect(DAILY_ANCHORS.breakfast).toEqual(["Toast", "Lactose-free yogurt"]);
    expect(DAILY_ANCHORS.dinner).toEqual(["Salad with an Omelet"]);
  });

  it("hard-enforces the No Beans / No Lactose sensitivities", () => {
    const enforced = SENSITIVITY_TOGGLES.filter((toggle) => toggle.enforced);
    expect(enforced.map((toggle) => toggle.id)).toEqual(["beans", "lactose"]);
  });

  it("redistributes bean points to nuts and fish", () => {
    expect(SCORING_ADJUSTMENT.removedCategory).toBe("Beans");
    expect(SCORING_ADJUSTMENT.redistributedTo).toEqual(["Nuts", "Fish"]);
  });

  it("defines warning and repair rules for limit foods", () => {
    const ids = WARNING_REPAIR_ENGINE.map((rule) => rule.id);
    expect(ids).toEqual(["red_meat", "fried_food"]);
  });

  it("returns warning and repair guidance for red meat", () => {
    const rule = getWarningAndRepair("red_meat");
    expect(rule.label).toBe("Red Meat");
    expect(rule.weeklyLimit).toBe(4);
  });

  it("throws for unsupported limit foods", () => {
    expect(() => getWarningAndRepair("unknown" as never)).toThrow(
      "Unsupported limit food"
    );
  });
});
