import React from "react";
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { MealLogForm } from "../src/components/MealLogForm";

describe("MealLogForm", () => {
  it("renders the meal log form", () => {
    const markup = renderToString(<MealLogForm />);
    expect(markup).toContain("Meal Logging");
    expect(markup).toContain("Log meal");
  });

  it("includes sensitivity toggles", () => {
    const markup = renderToString(<MealLogForm />);
    expect(markup).toContain("Contains beans");
    expect(markup).toContain("Contains lactose");
  });
});
