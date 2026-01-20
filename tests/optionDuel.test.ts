import { describe, expect, it } from "vitest";
import { evaluateLunchOptions } from "../src/lib/optionDuel";

describe("optionDuel", () => {
  it("chooses the best allowed option and rejects all-invalid lists", () => {
    const decision = evaluateLunchOptions(
      [
        {
          id: "pizza",
          label: "Pizza",
          containsBeans: false,
          containsLactose: true,
          healthyCategories: ["whole_grains"],
          limitFoods: ["fried_food"]
        },
        {
          id: "wrap",
          label: "Grilled Chicken Wrap",
          containsBeans: false,
          containsLactose: false,
          healthyCategories: ["whole_grains", "poultry"],
          limitFoods: []
        }
      ],
      { red_meat: 0, fried_food: 0 }
    );

    expect(decision.winnerId).toBe("wrap");

    expect(() =>
      evaluateLunchOptions(
        [
          {
            id: "beans",
            label: "Bean Salad",
            containsBeans: true,
            containsLactose: false,
            healthyCategories: ["leafy_greens"],
            limitFoods: []
          }
        ],
        { red_meat: 0, fried_food: 0 }
      )
    ).toThrow("All lunch options violate No Beans/No Lactose constraints");
  });

  it("rewards nuts and fish due to the scoring adjustment", () => {
    const decision = evaluateLunchOptions(
      [
        {
          id: "fish_bowl",
          label: "Fish Bowl",
          containsBeans: false,
          containsLactose: false,
          healthyCategories: ["fish", "leafy_greens"],
          limitFoods: []
        },
        {
          id: "salad",
          label: "Salad",
          containsBeans: false,
          containsLactose: false,
          healthyCategories: ["leafy_greens"],
          limitFoods: []
        }
      ],
      { red_meat: 0, fried_food: 0 }
    );

    expect(decision.winnerId).toBe("fish_bowl");
  });

  it("flags warning decisions for limit foods", () => {
    const decision = evaluateLunchOptions(
      [
        {
          id: "burger",
          label: "Burger",
          containsBeans: false,
          containsLactose: false,
          healthyCategories: ["whole_grains"],
          limitFoods: ["red_meat"]
        }
      ],
      { red_meat: 4, fried_food: 0 }
    );

    const burger = decision.rankings.find((option) => option.id === "burger");
    expect(burger?.warnings[0].shouldWarn).toBe(true);
  });

  it("throws for duplicate option ids", () => {
    expect(() =>
      evaluateLunchOptions(
        [
          {
            id: "dup",
            label: "Option A",
            containsBeans: false,
            containsLactose: false,
            healthyCategories: ["berries"],
            limitFoods: []
          },
          {
            id: "dup",
            label: "Option B",
            containsBeans: false,
            containsLactose: false,
            healthyCategories: ["berries"],
            limitFoods: []
          }
        ],
        { red_meat: 0, fried_food: 0 }
      )
    ).toThrow("Duplicate lunch option id");
  });
});
