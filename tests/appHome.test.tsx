import React from "react";
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { AppHome } from "../src/components/AppHome";

describe("AppHome", () => {
  it("renders navigation cards for core modules", () => {
    const markup = renderToString(<AppHome />);
    expect(markup).toContain("Smart Coach");
    expect(markup).toContain("/dashboard");
    expect(markup).toContain("/setup");
  });
});
