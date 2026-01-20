import React from "react";
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { NudgeSchedule } from "../src/components/NudgeSchedule";

describe("NudgeSchedule", () => {
  it("renders the nudge schedule placeholder", () => {
    const markup = renderToString(<NudgeSchedule />);
    expect(markup).toContain("Proactive Nudge Schedule");
    expect(markup).toContain("Loading nudges");
  });
});
