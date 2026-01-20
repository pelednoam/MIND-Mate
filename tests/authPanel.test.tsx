import React from "react";
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { AuthPanel } from "../src/components/AuthPanel";

describe("AuthPanel", () => {
  it("renders auth controls", () => {
    const markup = renderToString(<AuthPanel />);
    expect(markup).toContain("Account");
    expect(markup).toContain("Send magic link");
  });
});
