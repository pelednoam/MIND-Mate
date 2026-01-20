import React from "react";
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { SetupScreen } from "../src/components/SetupScreen";

describe("SetupScreen", () => {
  it("renders the setup form", () => {
    const markup = renderToString(<SetupScreen />);
    expect(markup).toContain("Routine Builder");
    expect(markup).toContain("Save setup");
  });
});
