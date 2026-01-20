import { SCORING_ADJUSTMENT } from "./mindRules";

export type HealthyCategoryId =
  | "leafy_greens"
  | "other_veggies"
  | "berries"
  | "whole_grains"
  | "fish"
  | "nuts"
  | "poultry"
  | "olive_oil"
  | "wine";

export type LimitCategoryId =
  | "red_meat"
  | "butter_margarine"
  | "cheese"
  | "pastries_sweets"
  | "fried_fast_food";

export type RemovedCategoryId = "beans";

export type HealthyCategory = {
  id: HealthyCategoryId;
  label: string;
  weeklyTarget: number;
};

export type LimitCategory = {
  id: LimitCategoryId;
  label: string;
  weeklyLimit: number;
};

export type RemovedCategory = {
  id: RemovedCategoryId;
  label: string;
  weeklyTarget: number;
  redistributedTo: readonly string[];
};

export const HEALTHY_CATEGORIES: readonly HealthyCategory[] = [
  {
    id: "leafy_greens",
    label: "Leafy Greens",
    weeklyTarget: 6
  },
  {
    id: "other_veggies",
    label: "Other Vegetables",
    weeklyTarget: 7
  },
  {
    id: "berries",
    label: "Berries",
    weeklyTarget: 2
  },
  {
    id: "whole_grains",
    label: "Whole Grains",
    weeklyTarget: 21
  },
  {
    id: "fish",
    label: "Fish",
    weeklyTarget: 1
  },
  {
    id: "nuts",
    label: "Nuts",
    weeklyTarget: 6
  },
  {
    id: "poultry",
    label: "Poultry",
    weeklyTarget: 2
  },
  {
    id: "olive_oil",
    label: "Olive Oil",
    weeklyTarget: 7
  },
  {
    id: "wine",
    label: "Wine",
    weeklyTarget: 7
  }
] as const;

export const LIMIT_CATEGORIES: readonly LimitCategory[] = [
  {
    id: "red_meat",
    label: "Red Meat",
    weeklyLimit: 4
  },
  {
    id: "butter_margarine",
    label: "Butter & Margarine",
    weeklyLimit: 7
  },
  {
    id: "cheese",
    label: "Cheese",
    weeklyLimit: 1
  },
  {
    id: "pastries_sweets",
    label: "Pastries & Sweets",
    weeklyLimit: 5
  },
  {
    id: "fried_fast_food",
    label: "Fried or Fast Food",
    weeklyLimit: 1
  }
] as const;

export const REMOVED_CATEGORIES: readonly RemovedCategory[] = [
  {
    id: "beans",
    label: "Beans",
    weeklyTarget: 3,
    redistributedTo: SCORING_ADJUSTMENT.redistributedTo
  }
] as const;

export type ActiveCategoryId = HealthyCategoryId | LimitCategoryId;

export type WeeklyEntry = {
  categoryId: ActiveCategoryId;
  servingsPerWeek: number;
};

export type WeeklyLog = readonly WeeklyEntry[];

export type HealthyGap = {
  categoryId: HealthyCategoryId;
  label: string;
  weeklyTarget: number;
  servingsPerWeek: number;
  missingServings: number;
};

export type LimitBudget = {
  categoryId: LimitCategoryId;
  label: string;
  weeklyLimit: number;
  servingsPerWeek: number;
  remainingServings: number;
  isExceeded: boolean;
};

export type WeeklyScoreSummary = {
  healthyGaps: readonly HealthyGap[];
  limitBudgets: readonly LimitBudget[];
};

export function createWeeklyLog(entries: WeeklyEntry[]): WeeklyLog {
  const seenIds: ActiveCategoryId[] = [];
  for (const entry of entries) {
    if (!isActiveCategory(entry.categoryId)) {
      throw new Error(`Unknown category: ${entry.categoryId}`);
    }
    if (seenIds.includes(entry.categoryId)) {
      throw new Error(`Duplicate weekly entry: ${entry.categoryId}`);
    }
    if (!Number.isFinite(entry.servingsPerWeek)) {
      throw new Error(`Invalid servings for ${entry.categoryId}`);
    }
    if (entry.servingsPerWeek < 0) {
      throw new Error(`Negative servings for ${entry.categoryId}`);
    }
    seenIds.push(entry.categoryId);
  }

  const missingIds: ActiveCategoryId[] = [];
  for (const categoryId of getActiveCategoryIds()) {
    if (!seenIds.includes(categoryId)) {
      missingIds.push(categoryId);
    }
  }

  if (missingIds.length > 0) {
    throw new Error(`Missing weekly entries for: ${missingIds.join(", ")}`);
  }

  return entries;
}

export function buildWeeklyScoreSummary(log: WeeklyLog): WeeklyScoreSummary {
  const healthyGaps = HEALTHY_CATEGORIES.map((category) => {
    const servingsPerWeek = getServingsForCategory(log, category.id);
    const missingServings = Math.max(
      0,
      category.weeklyTarget - servingsPerWeek
    );

    return {
      categoryId: category.id,
      label: category.label,
      weeklyTarget: category.weeklyTarget,
      servingsPerWeek,
      missingServings
    };
  });

  const limitBudgets = LIMIT_CATEGORIES.map((category) => {
    const servingsPerWeek = getServingsForCategory(log, category.id);
    const remainingServings = category.weeklyLimit - servingsPerWeek;

    return {
      categoryId: category.id,
      label: category.label,
      weeklyLimit: category.weeklyLimit,
      servingsPerWeek,
      remainingServings,
      isExceeded: remainingServings < 0
    };
  });

  return {
    healthyGaps,
    limitBudgets
  };
}

function getServingsForCategory(
  log: WeeklyLog,
  categoryId: ActiveCategoryId
): number {
  const entry = log.find((item) => item.categoryId === categoryId);
  if (!entry) {
    throw new Error(`Missing weekly entry for ${categoryId}`);
  }
  return entry.servingsPerWeek;
}

function isActiveCategory(categoryId: ActiveCategoryId): boolean {
  return getActiveCategoryIds().includes(categoryId);
}

function getActiveCategoryIds(): readonly ActiveCategoryId[] {
  return [
    ...HEALTHY_CATEGORIES.map((category) => category.id),
    ...LIMIT_CATEGORIES.map((category) => category.id)
  ];
}
