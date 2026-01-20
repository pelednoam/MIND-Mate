import React from "react";
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { ProgressDashboard } from "../src/components/ProgressDashboard";
import { buildDashboardModel } from "../src/lib/dashboard";
import { buildWeeklyScoreSummary, createWeeklyLog } from "../src/lib/mindScore";

const weeklyLog = createWeeklyLog([
  { categoryId: "leafy_greens", servingsPerWeek: 6 },
  { categoryId: "other_veggies", servingsPerWeek: 7 },
  { categoryId: "berries", servingsPerWeek: 2 },
  { categoryId: "whole_grains", servingsPerWeek: 21 },
  { categoryId: "fish", servingsPerWeek: 1 },
  { categoryId: "nuts", servingsPerWeek: 6 },
  { categoryId: "poultry", servingsPerWeek: 2 },
  { categoryId: "olive_oil", servingsPerWeek: 7 },
  { categoryId: "wine", servingsPerWeek: 0 },
  { categoryId: "red_meat", servingsPerWeek: 1 },
  { categoryId: "butter_margarine", servingsPerWeek: 2 },
  { categoryId: "cheese", servingsPerWeek: 0 },
  { categoryId: "pastries_sweets", servingsPerWeek: 1 },
  { categoryId: "fried_fast_food", servingsPerWeek: 0 }
]);

describe("ProgressDashboard", () => {
  it("renders dashboard headings and espresso tracker", () => {
    const model = buildDashboardModel({
      summary: buildWeeklyScoreSummary(weeklyLog),
      espresso: { shotsToday: 1, targetShots: 2 }
    });

    const markup = renderToString(<ProgressDashboard model={model} />);
    expect(markup).toContain("Weekly Progress Dashboard");
    expect(markup).toContain("Brain High Score");
    expect(markup).toContain("Espresso Tracker");
  });
});
