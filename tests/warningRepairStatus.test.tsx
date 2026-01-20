import React from "react";
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { WarningRepairStatus } from "../src/components/WarningRepairStatus";

describe("WarningRepairStatus", () => {
  it("renders the warning status placeholder", () => {
    const markup = renderToString(<WarningRepairStatus />);
    expect(markup).toContain("Warning &amp; Repair");
    expect(markup).toContain("Loading warning");
  });
});
