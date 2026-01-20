import React from "react";
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { ContextBuilder } from "../src/components/ContextBuilder";

describe("ContextBuilder", () => {
  it("renders the context builder placeholder", () => {
    const markup = renderToString(<ContextBuilder />);
    expect(markup).toContain("Context Builder");
    expect(markup).toContain("Loading context");
  });
});
