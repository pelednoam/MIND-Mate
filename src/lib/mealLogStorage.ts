import type { MealLogEntry } from "./mealLogging";

export type StorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

const STORAGE_KEY = "mindMateMealLogs";

export function appendMealLog(
  storage: StorageLike,
  entry: MealLogEntry
): MealLogEntry[] {
  const logs = loadMealLogs(storage);
  const nextLogs = [...logs, entry];
  saveMealLogs(storage, nextLogs);
  return nextLogs;
}

export function loadMealLogs(storage: StorageLike): MealLogEntry[] {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) {
    throw new Error("Missing meal logs in storage");
  }
  return parseMealLogs(raw);
}

export function saveMealLogs(storage: StorageLike, logs: MealLogEntry[]): void {
  storage.setItem(STORAGE_KEY, serializeMealLogs(logs));
}

export function initializeMealLogs(storage: StorageLike): void {
  saveMealLogs(storage, []);
}

export function serializeMealLogs(logs: MealLogEntry[]): string {
  return JSON.stringify(logs);
}

export function parseMealLogs(raw: string): MealLogEntry[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch (error) {
    throw new Error("Meal logs must be valid JSON");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Meal logs must be an array");
  }

  const logs: MealLogEntry[] = [];
  for (const entry of parsed) {
    if (!isMealLogEntry(entry)) {
      throw new Error("Meal log entry is missing required fields");
    }
    logs.push(entry);
  }

  return logs;
}

function isMealLogEntry(value: unknown): value is MealLogEntry {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.mealType === "string" &&
    typeof record.label === "string" &&
    typeof record.date === "string" &&
    Array.isArray(record.healthyCategories) &&
    Array.isArray(record.limitFoods) &&
    typeof record.containsBeans === "boolean" &&
    typeof record.containsLactose === "boolean"
  );
}
