import { describe, expect, it } from "vitest";
import {
  buildZeroWeeklyLog,
  loadWeeklyLog,
  parseWeeklyLog,
  saveWeeklyLog,
  serializeWeeklyLog
} from "../src/lib/weeklyScoreStorage";

class MemoryStorage {
  private readonly store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

describe("weeklyScoreStorage", () => {
  it("serializes and parses weekly logs", () => {
    const log = buildZeroWeeklyLog();
    const raw = serializeWeeklyLog(log);
    const parsed = parseWeeklyLog(raw);
    expect(parsed).toEqual(log);
  });

  it("throws when weekly log is missing", () => {
    const storage = new MemoryStorage();
    expect(() => loadWeeklyLog(storage)).toThrow("Missing weekly log");
  });

  it("saves and loads weekly logs", () => {
    const storage = new MemoryStorage();
    const log = buildZeroWeeklyLog();
    saveWeeklyLog(storage, log);
    const loaded = loadWeeklyLog(storage);
    expect(loaded).toEqual(log);
  });
});
