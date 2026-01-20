import { describe, expect, it } from "vitest";
import {
  appendMealLog,
  initializeMealLogs,
  loadMealLogs,
  parseMealLogs,
  serializeMealLogs
} from "../src/lib/mealLogStorage";
import type { MealLogEntry } from "../src/lib/mealLogging";

class MemoryStorage {
  private readonly store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

const sampleEntry: MealLogEntry = {
  id: "meal-1",
  mealType: "lunch",
  label: "Grilled chicken wrap",
  date: "2026-01-20",
  healthyCategories: ["whole_grains", "poultry"],
  limitFoods: [],
  containsBeans: false,
  containsLactose: false
};

describe("mealLogStorage", () => {
  it("serializes and parses meal logs", () => {
    const raw = serializeMealLogs([sampleEntry]);
    const parsed = parseMealLogs(raw);
    expect(parsed).toEqual([sampleEntry]);
  });

  it("throws when logs are missing", () => {
    const storage = new MemoryStorage();
    expect(() => loadMealLogs(storage)).toThrow("Missing meal logs");
  });

  it("appends logs and reloads them", () => {
    const storage = new MemoryStorage();
    initializeMealLogs(storage);
    appendMealLog(storage, sampleEntry);
    const loaded = loadMealLogs(storage);
    expect(loaded).toHaveLength(1);
    expect(loaded[0].label).toBe("Grilled chicken wrap");
  });
});
