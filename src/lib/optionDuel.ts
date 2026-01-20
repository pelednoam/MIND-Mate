import { SCORING_ADJUSTMENT, type LimitFood } from "./mindRules";
import { evaluateLimitSelection } from "./warningRepair";
import type { HealthyCategoryId } from "./mindScore";

export type LunchOption = {
  id: string;
  label: string;
  containsBeans: boolean;
  containsLactose: boolean;
  healthyCategories: HealthyCategoryId[];
  limitFoods: LimitFood[];
};

export type LimitServingCounts = {
  red_meat: number;
  fried_food: number;
};

export type LunchOptionScore = {
  id: string;
  label: string;
  score: number;
  isAllowed: boolean;
  warnings: ReturnType<typeof evaluateLimitSelection>[];
  reasons: string[];
};

export type OptionDuelDecision = {
  winnerId: string;
  rankings: LunchOptionScore[];
};

const REDISTRIBUTED_IDS = SCORING_ADJUSTMENT.redistributedTo.map((label) =>
  toHealthyCategoryId(label)
);

export function evaluateLunchOptions(
  options: LunchOption[],
  currentLimitServings: LimitServingCounts
): OptionDuelDecision {
  if (options.length === 0) {
    throw new Error("No lunch options provided");
  }

  const ids: string[] = [];
  for (const option of options) {
    if (option.id.trim().length === 0) {
      throw new Error("Lunch option id is required");
    }
    if (option.label.trim().length === 0) {
      throw new Error("Lunch option label is required");
    }
    if (ids.includes(option.id)) {
      throw new Error(`Duplicate lunch option id: ${option.id}`);
    }
    ensureUniqueCategories(option.healthyCategories, "healthy");
    ensureUniqueLimitFoods(option.limitFoods);
    ids.push(option.id);
  }

  const rankings = options.map((option) =>
    scoreOption(option, currentLimitServings)
  );

  const allowed = rankings.filter((ranking) => ranking.isAllowed);
  if (allowed.length === 0) {
    throw new Error("All lunch options violate No Beans/No Lactose constraints");
  }

  const sorted = [...allowed].sort(compareRankings);
  return {
    winnerId: sorted[0].id,
    rankings
  };
}

function scoreOption(
  option: LunchOption,
  currentLimitServings: LimitServingCounts
): LunchOptionScore {
  const reasons: string[] = [];
  const warnings = option.limitFoods.map((limitFood) =>
    evaluateLimitSelection(
      limitFood,
      currentLimitServings[limitFood] + 1
    )
  );

  const isAllowed = !option.containsBeans && !option.containsLactose;
  if (option.containsBeans) {
    reasons.push("Contains beans");
  }
  if (option.containsLactose) {
    reasons.push("Contains lactose");
  }

  let score = 0;
  for (const category of option.healthyCategories) {
    score += 1;
    reasons.push(`Adds ${category.replace("_", " ")}`);
    if (REDISTRIBUTED_IDS.includes(category)) {
      score += 1;
      reasons.push(`Boosted for ${category.replace("_", " ")}`);
    }
  }

  for (const limitFood of option.limitFoods) {
    score -= 2;
    reasons.push(`Limit food: ${limitFood.replace("_", " ")}`);
    if (limitFood === "fried_food") {
      score -= 3;
      reasons.push("Extra penalty for fried food");
    }
  }

  if (!isAllowed) {
    score -= 10;
  }

  return {
    id: option.id,
    label: option.label,
    score,
    isAllowed,
    warnings,
    reasons
  };
}

function compareRankings(a: LunchOptionScore, b: LunchOptionScore): number {
  if (a.score !== b.score) {
    return b.score - a.score;
  }
  const healthyCountA = a.reasons.filter((reason) =>
    reason.startsWith("Adds ")
  ).length;
  const healthyCountB = b.reasons.filter((reason) =>
    reason.startsWith("Adds ")
  ).length;
  if (healthyCountA !== healthyCountB) {
    return healthyCountB - healthyCountA;
  }
  return a.label.localeCompare(b.label);
}

function ensureUniqueCategories(
  categories: HealthyCategoryId[],
  label: string
): void {
  const seen: HealthyCategoryId[] = [];
  for (const category of categories) {
    if (seen.includes(category)) {
      throw new Error(`Duplicate ${label} category: ${category}`);
    }
    seen.push(category);
  }
}

function ensureUniqueLimitFoods(limitFoods: LimitFood[]): void {
  const seen: LimitFood[] = [];
  for (const limitFood of limitFoods) {
    if (seen.includes(limitFood)) {
      throw new Error(`Duplicate limit food: ${limitFood}`);
    }
    seen.push(limitFood);
  }
}

function toHealthyCategoryId(label: string): HealthyCategoryId {
  switch (label) {
    case "Nuts":
      return "nuts";
    case "Fish":
      return "fish";
    default:
      throw new Error(`Unsupported redistributed category: ${label}`);
  }
}
