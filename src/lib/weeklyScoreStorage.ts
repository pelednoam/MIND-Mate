import {
  createWeeklyLog,
  type WeeklyEntry,
  type WeeklyLog
} from "./mindScore";

export type StorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

const STORAGE_KEY = "mindMateWeeklyLog";

export function saveWeeklyLog(storage: StorageLike, log: WeeklyLog): void {
  storage.setItem(STORAGE_KEY, serializeWeeklyLog(log));
}

export function loadWeeklyLog(storage: StorageLike): WeeklyLog {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) {
    throw new Error("Missing weekly log in storage");
  }
  return parseWeeklyLog(raw);
}

export function serializeWeeklyLog(log: WeeklyLog): string {
  return JSON.stringify(log);
}

export function parseWeeklyLog(raw: string): WeeklyLog {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch (error) {
    throw new Error("Weekly log must be valid JSON");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Weekly log must be an array");
  }

  const entries: WeeklyEntry[] = [];
  for (const item of parsed) {
    if (!isWeeklyEntry(item)) {
      throw new Error("Weekly log entry is missing required fields");
    }
    entries.push(item);
  }

  return createWeeklyLog(entries);
}

export function buildZeroWeeklyLog(): WeeklyLog {
  return createWeeklyLog([
    { categoryId: "leafy_greens", servingsPerWeek: 0 },
    { categoryId: "other_veggies", servingsPerWeek: 0 },
    { categoryId: "berries", servingsPerWeek: 0 },
    { categoryId: "whole_grains", servingsPerWeek: 0 },
    { categoryId: "fish", servingsPerWeek: 0 },
    { categoryId: "nuts", servingsPerWeek: 0 },
    { categoryId: "poultry", servingsPerWeek: 0 },
    { categoryId: "olive_oil", servingsPerWeek: 0 },
    { categoryId: "wine", servingsPerWeek: 0 },
    { categoryId: "red_meat", servingsPerWeek: 0 },
    { categoryId: "butter_margarine", servingsPerWeek: 0 },
    { categoryId: "cheese", servingsPerWeek: 0 },
    { categoryId: "pastries_sweets", servingsPerWeek: 0 },
    { categoryId: "fried_fast_food", servingsPerWeek: 0 }
  ]);
}

function isWeeklyEntry(value: unknown): value is WeeklyEntry {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.categoryId === "string" &&
    typeof record.servingsPerWeek === "number"
  );
}
