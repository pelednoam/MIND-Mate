import type { HealthyCategoryId, WeeklyScoreSummary } from "./mindScore";

export type SmartSuggestion = {
  categoryId: HealthyCategoryId;
  label: string;
  suggestion: string;
};

const SUGGESTION_LIBRARY: {
  id: HealthyCategoryId;
  label: string;
  suggestion: string;
}[] = [
  {
    id: "leafy_greens",
    label: "Leafy Greens",
    suggestion: "Add spinach or kale."
  },
  {
    id: "other_veggies",
    label: "Other Vegetables",
    suggestion: "Add a veggie side."
  },
  { id: "berries", label: "Berries", suggestion: "Add a handful of berries." },
  {
    id: "whole_grains",
    label: "Whole Grains",
    suggestion: "Choose whole-grain bread or oats."
  },
  { id: "fish", label: "Fish", suggestion: "Pick a fish-based lunch." },
  { id: "nuts", label: "Nuts", suggestion: "Add almonds or walnuts." },
  {
    id: "poultry",
    label: "Poultry",
    suggestion: "Choose grilled poultry."
  },
  {
    id: "olive_oil",
    label: "Olive Oil",
    suggestion: "Use olive oil dressing."
  },
  { id: "wine", label: "Wine", suggestion: "Log your wine servings." }
];

export function buildSmartSuggestions(
  weeklyGap: WeeklyScoreSummary,
  maxSuggestions: number
): SmartSuggestion[] {
  if (!Number.isFinite(maxSuggestions) || maxSuggestions <= 0) {
    throw new Error("Max suggestions must be positive");
  }

  const sorted = [...weeklyGap.healthyGaps]
    .filter((gap) => gap.missingServings > 0)
    .sort((a, b) => b.missingServings - a.missingServings);

  const suggestions: SmartSuggestion[] = [];
  for (const gap of sorted) {
    const suggestion = SUGGESTION_LIBRARY.find(
      (item) => item.id === gap.categoryId
    );
    if (!suggestion) {
      throw new Error(`Missing suggestion for ${gap.categoryId}`);
    }
    suggestions.push({
      categoryId: suggestion.id,
      label: suggestion.label,
      suggestion: suggestion.suggestion
    });
    if (suggestions.length >= maxSuggestions) {
      break;
    }
  }

  return suggestions;
}
