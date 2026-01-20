import React from "react";
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { ContextPreview } from "../src/components/ContextPreview";
import {
  CoachPersonality,
  RoutineAnchors,
  Sensitivities,
  buildCoachContext
} from "../src/lib/coachContext";
import { createWeeklyLog } from "../src/lib/mindScore";

const weeklyLog = createWeeklyLog([
  { categoryId: "leafy_greens", servingsPerWeek: 4 },
  { categoryId: "other_veggies", servingsPerWeek: 7 },
  { categoryId: "berries", servingsPerWeek: 1 },
  { categoryId: "whole_grains", servingsPerWeek: 14 },
  { categoryId: "fish", servingsPerWeek: 1 },
  { categoryId: "nuts", servingsPerWeek: 3 },
  { categoryId: "poultry", servingsPerWeek: 2 },
  { categoryId: "olive_oil", servingsPerWeek: 7 },
  { categoryId: "wine", servingsPerWeek: 0 },
  { categoryId: "red_meat", servingsPerWeek: 2 },
  { categoryId: "butter_margarine", servingsPerWeek: 2 },
  { categoryId: "cheese", servingsPerWeek: 0 },
  { categoryId: "pastries_sweets", servingsPerWeek: 1 },
  { categoryId: "fried_fast_food", servingsPerWeek: 0 }
]);

describe("ContextPreview", () => {
  it("renders the JSON payload and sensitivity flags", () => {
    const coachContext = buildCoachContext(
      new RoutineAnchors("Toast", "Salad with an Omelet"),
      new CoachPersonality("Concise, proactive, empathetic coach."),
      new Sensitivities(true, true),
      weeklyLog
    );

    const payload = coachContext.toJSON();
    const markup = renderToString(<ContextPreview payload={payload} />);
    expect(markup).toContain("LLM Context Preview");
    expect(markup).toContain("No Beans");
    expect(markup).toContain("&quot;noBeans&quot;: true");
  });
});
