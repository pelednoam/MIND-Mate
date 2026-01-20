import React from "react";
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { AppHeader } from "../src/components/AppHeader";

describe("AppHeader", () => {
  it("renders navigation links", () => {
    const markup = renderToString(<AppHeader />);
    expect(markup).toContain("MIND-Mate");
    expect(markup).toContain("/dashboard");
    expect(markup).toContain("/log");
  });
});
