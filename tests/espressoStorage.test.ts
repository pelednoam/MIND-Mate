import { describe, expect, it } from "vitest";
import {
  initializeEspressoState,
  loadEspressoState,
  parseEspressoState,
  saveEspressoState,
  serializeEspressoState
} from "../src/lib/espressoStorage";

class MemoryStorage {
  private readonly store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

describe("espressoStorage", () => {
  it("serializes and parses espresso state", () => {
    const state = initializeEspressoState("2026-01-20", 2);
    const raw = serializeEspressoState(state);
    const parsed = parseEspressoState(raw);
    expect(parsed).toEqual(state);
  });

  it("throws when espresso tracker is missing", () => {
    const storage = new MemoryStorage();
    expect(() => loadEspressoState(storage)).toThrow("Missing espresso");
  });

  it("saves and loads espresso state", () => {
    const storage = new MemoryStorage();
    const state = initializeEspressoState("2026-01-20", 2);
    saveEspressoState(storage, state);
    const loaded = loadEspressoState(storage);
    expect(loaded).toEqual(state);
  });
});
