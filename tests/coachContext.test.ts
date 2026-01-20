import { describe, expect, it } from "vitest";
import {
  CoachPersonality,
  RoutineAnchors,
  Sensitivities,
  buildCoachContext
} from "../src/lib/coachContext";

const weeklyEntries = [
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
];

describe("coachContext", () => {
  it("requires sensitivities to be enforced", () => {
    expect(() => new Sensitivities(false, true)).toThrow(
      "No Beans sensitivity must be enforced"
    );
    expect(() => new Sensitivities(true, false)).toThrow(
      "No Lactose sensitivity must be enforced"
    );
  });

  it("requires a routine and coach personality prompt", () => {
    expect(() => new RoutineAnchors("", "Dinner")).toThrow(
      "Missing breakfast routine"
    );
    expect(() => new CoachPersonality("")).toThrow(
      "Missing coach personality"
    );
  });

  it("builds a JSON payload for the LLM context layer", () => {
    const context = buildCoachContext(
      new RoutineAnchors("Toast", "Salad with an Omelet"),
      new CoachPersonality("Concise, proactive coach."),
      new Sensitivities(true, true),
      weeklyEntries
    );

    const payload = context.toJSON();
    expect(payload.sensitivities).toEqual({
      noBeans: true,
      noLactose: true
    });
    expect(payload.routine.breakfast).toBe("Toast");
    expect(payload.weeklyGap.healthyGaps).toHaveLength(9);
    expect(payload.warningRepairEngine).toHaveLength(2);
  });
});
