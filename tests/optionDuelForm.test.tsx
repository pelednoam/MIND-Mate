import React from "react";
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { OptionDuelForm } from "../src/components/OptionDuelForm";

describe("OptionDuelForm", () => {
  it("renders the option duel form", () => {
    const markup = renderToString(<OptionDuelForm />);
    expect(markup).toContain("Option Duel");
    expect(markup).toContain("Evaluate options");
  });
});
