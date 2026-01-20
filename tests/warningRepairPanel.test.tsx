import React from "react";
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { WarningRepairPanel } from "../src/components/WarningRepairPanel";
import { evaluateLimitSelection } from "../src/lib/warningRepair";

describe("WarningRepairPanel", () => {
  it("renders warning and repair content", () => {
    const decisions = [
      evaluateLimitSelection("red_meat", 5),
      evaluateLimitSelection("fried_food", 1)
    ];

    const markup = renderToString(
      <WarningRepairPanel decisions={decisions} />
    );
    expect(markup).toContain("Warning &amp; Repair");
    expect(markup).toContain("Warning when weekly red meat exceeds 4 servings.");
  });
});
