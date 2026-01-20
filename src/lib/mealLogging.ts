import type { HealthyCategoryId } from "./mindScore";
import type { LimitFood } from "./mindRules";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type MealLogEntry = {
  id: string;
  mealType: MealType;
  label: string;
  date: string;
  healthyCategories: HealthyCategoryId[];
  limitFoods: LimitFood[];
  containsBeans: boolean;
  containsLactose: boolean;
};

export function createMealLogEntry(entry: MealLogEntry): MealLogEntry {
  if (entry.id.trim().length === 0) {
    throw new Error("Meal log id is required");
  }
  if (entry.label.trim().length === 0) {
    throw new Error("Meal log label is required");
  }
  if (!isIsoDate(entry.date)) {
    throw new Error("Meal log date must be ISO YYYY-MM-DD");
  }
  if (entry.containsBeans) {
    throw new Error("Meal log includes beans, which are not allowed");
  }
  if (entry.containsLactose) {
    throw new Error("Meal log includes lactose, which is not allowed");
  }

  ensureUniqueCategories(entry.healthyCategories);
  ensureUniqueLimitFoods(entry.limitFoods);

  return entry;
}

function ensureUniqueCategories(categories: HealthyCategoryId[]): void {
  const seen: HealthyCategoryId[] = [];
  for (const category of categories) {
    if (seen.includes(category)) {
      throw new Error(`Duplicate healthy category: ${category}`);
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

function isIsoDate(value: string): boolean {
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDatePattern.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime());
}
