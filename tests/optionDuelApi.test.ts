import { describe, expect, it } from "vitest";
import { runOptionDuel } from "../src/lib/optionDuelApi";

describe("optionDuelApi", () => {
  it("returns a winner for valid input", () => {
    const decision = runOptionDuel({
      options: [
        {
          id: "salad",
          label: "Salad",
          containsBeans: false,
          containsLactose: false,
          healthyCategories: ["leafy_greens"],
          limitFoods: []
        },
        {
          id: "pizza",
          label: "Pizza",
          containsBeans: false,
          containsLactose: true,
          healthyCategories: ["whole_grains"],
          limitFoods: ["fried_food"]
        }
      ],
      currentLimitServings: {
        red_meat: 0,
        fried_food: 0
      }
    });

    expect(decision.winnerId).toBe("salad");
  });

  it("throws when limits are missing", () => {
    expect(() =>
      runOptionDuel({
        options: [],
        currentLimitServings: {
          red_meat: Number.NaN,
          fried_food: 1
        }
      })
    ).toThrow("Option duel requires");
  });
});
