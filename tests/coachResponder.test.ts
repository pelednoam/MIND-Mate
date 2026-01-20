import { describe, expect, it } from "vitest";
import { generateCoachResponse } from "../src/lib/coachResponder";

describe("coachResponder", () => {
  it("warns on beans and lactose", () => {
    expect(generateCoachResponse({ system: "x", user: "beans" })).toContain(
      "Beans"
    );
    expect(
      generateCoachResponse({ system: "x", user: "cheese" })
    ).toContain("Avoid lactose");
  });

  it("flags fried food", () => {
    expect(
      generateCoachResponse({ system: "x", user: "fried chicken" })
    ).toContain("Fried food triggers");
  });
});
