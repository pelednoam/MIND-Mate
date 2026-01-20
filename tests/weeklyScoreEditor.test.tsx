import React from "react";
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { WeeklyScoreEditor } from "../src/components/WeeklyScoreEditor";

describe("WeeklyScoreEditor", () => {
  it("renders the weekly score editor", () => {
    const markup = renderToString(<WeeklyScoreEditor />);
    expect(markup).toContain("Weekly Score");
    expect(markup).toContain("Save weekly log");
  });

  it("shows recalculation controls", () => {
    const markup = renderToString(<WeeklyScoreEditor />);
    expect(markup).toContain("Recalculate from meal logs");
  });
});
