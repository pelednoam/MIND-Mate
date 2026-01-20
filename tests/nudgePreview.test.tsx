import React from "react";
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { NudgePreview } from "../src/components/NudgePreview";
import { buildDailyNudges } from "../src/lib/proactiveNudges";
import { RoutineAnchors } from "../src/lib/coachContext";
import { buildWeeklyScoreSummary, createWeeklyLog } from "../src/lib/mindScore";

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

describe("NudgePreview", () => {
  it("renders the daily nudge schedule", () => {
    const nudges = buildDailyNudges({
      routine: new RoutineAnchors("Toast", "Salad with an Omelet"),
      weeklyGap: buildWeeklyScoreSummary(weeklyLog),
      lunchLimitFoods: []
    });

    const markup = renderToString(<NudgePreview nudges={nudges} />);
    expect(markup).toContain("Proactive Nudge Schedule");
    expect(markup).toContain("morning");
  });
});
