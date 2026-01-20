import React from "react";
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { WeeklyScoreDashboard } from "../src/components/WeeklyScoreDashboard";

describe("WeeklyScoreDashboard", () => {
  it("renders the dashboard placeholder", () => {
    const markup = renderToString(<WeeklyScoreDashboard />);
    expect(markup).toContain("Weekly Dashboard");
    expect(markup).toContain("Initialize weekly log");
  });

  it("mentions the espresso tracker in the placeholder", () => {
    const markup = renderToString(<WeeklyScoreDashboard />);
    expect(markup).toContain("Loading weekly score");
  });
});
