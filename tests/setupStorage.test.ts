import { describe, expect, it } from "vitest";
import {
  loadSetupState,
  parseSetupState,
  saveSetupState,
  serializeSetupState,
  type SetupState
} from "../src/lib/setupStorage";

class MemoryStorage {
  private readonly store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

describe("setupStorage", () => {
  it("serializes and parses setup state", () => {
    const state: SetupState = {
      breakfastRoutine: "Toast",
      dinnerRoutine: "Salad with an Omelet",
      coachPersonality: "Concise coach."
    };

    const raw = serializeSetupState(state);
    const parsed = parseSetupState(raw);
    expect(parsed).toEqual(state);
  });

  it("throws when setup state is missing", () => {
    const storage = new MemoryStorage();
    expect(() => loadSetupState(storage)).toThrow("Missing setup state");
  });

  it("saves and loads setup state", () => {
    const storage = new MemoryStorage();
    const state: SetupState = {
      breakfastRoutine: "Toast",
      dinnerRoutine: "Salad",
      coachPersonality: "Proactive coach."
    };

    saveSetupState(storage, state);
    const loaded = loadSetupState(storage);
    expect(loaded).toEqual(state);
  });
});
