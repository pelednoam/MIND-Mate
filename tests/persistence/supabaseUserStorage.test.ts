import { describe, expect, it } from "vitest";
import {
  loadSupabaseUserId,
  saveSupabaseUserId
} from "../../src/lib/persistence/supabaseUserStorage";

class MemoryStorage {
  private readonly store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

describe("supabaseUserStorage", () => {
  it("saves and loads user id", () => {
    const storage = new MemoryStorage();
    saveSupabaseUserId(storage, "user-1");
    expect(loadSupabaseUserId(storage)).toBe("user-1");
  });

  it("throws when missing user id", () => {
    const storage = new MemoryStorage();
    expect(() => loadSupabaseUserId(storage)).toThrow("Supabase user ID");
  });
});
