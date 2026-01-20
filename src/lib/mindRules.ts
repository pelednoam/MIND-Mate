export const DEFAULT_COACH_PERSONALITY =
  "Concise, proactive, empathetic coach. Use warning/repair logic for limit foods. Never suggest beans/lactose.";

export const DAILY_ANCHORS = {
  breakfast: ["Toast", "Lactose-free yogurt"],
  dinner: ["Salad with an Omelet"]
} as const;

export const LIFESTYLE = {
  lunch: "Office-based lunch (multiple choice)",
  snacks: "High-control snacks"
} as const;

export const SENSITIVITY_TOGGLES = [
  {
    id: "beans",
    label: "No Beans (Legumes)",
    enforced: true
  },
  {
    id: "lactose",
    label: "No Lactose (Dairy)",
    enforced: true
  }
] as const;

export const SCORING_ADJUSTMENT = {
  removedCategory: "Beans",
  redistributedTo: ["Nuts", "Fish"]
} as const;

export const WARNING_REPAIR_ENGINE = [
  {
    id: "red_meat",
    label: "Red Meat",
    weeklyLimit: 4,
    warning: "Warning when weekly red meat exceeds 4 servings.",
    repair:
      "Repair suggestion: prioritize leafy greens and fish at the next meal."
  },
  {
    id: "fried_food",
    label: "Fried Food",
    weeklyLimit: 1,
    warning: "Warning every time fried food is selected.",
    repair:
      "Repair suggestion: keep dinner light with extra greens and no added fats."
  }
] as const;

export type LimitFood = (typeof WARNING_REPAIR_ENGINE)[number]["id"];

export type WarningRepair = {
  label: string;
  weeklyLimit: number;
  warning: string;
  repair: string;
};

export function getWarningAndRepair(limitFood: LimitFood): WarningRepair {
  switch (limitFood) {
    case "red_meat":
      return {
        label: "Red Meat",
        weeklyLimit: 4,
        warning: "Warning when weekly red meat exceeds 4 servings.",
        repair:
          "Repair suggestion: prioritize leafy greens and fish at the next meal."
      };
    case "fried_food":
      return {
        label: "Fried Food",
        weeklyLimit: 1,
        warning: "Warning every time fried food is selected.",
        repair:
          "Repair suggestion: keep dinner light with extra greens and no added fats."
      };
    default: {
      const exhaustiveCheck: never = limitFood;
      throw new Error(`Unsupported limit food: ${exhaustiveCheck}`);
    }
  }
}
