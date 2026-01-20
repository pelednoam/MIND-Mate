import React from "react";
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { SmartCoachChat } from "../src/components/SmartCoachChat";

describe("SmartCoachChat", () => {
  it("renders the chat shell", () => {
    const markup = renderToString(<SmartCoachChat />);
    expect(markup).toContain("Smart Coach");
    expect(markup).toContain("Ask coach");
  });

  it("shows the empty state helper text", () => {
    const markup = renderToString(<SmartCoachChat />);
    expect(markup).toContain("Ask the coach to compare lunch options.");
  });
});
