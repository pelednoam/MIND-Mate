import { describe, expect, it } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { MealLogEntry } from "../../src/lib/mealLogging";
import {
  fetchMealLogs,
  upsertMealLogs
} from "../../src/lib/persistence/mealLogRepository";
import { SUPABASE_TABLES } from "../../src/lib/persistence/supabaseTables";

class FakeQuery {
  private readonly record: Record<string, unknown> | null;
  private readonly shouldError: boolean;

  constructor(record: Record<string, unknown> | null, shouldError: boolean) {
    this.record = record;
    this.shouldError = shouldError;
  }

  select() {
    return this;
  }

  eq() {
    return this;
  }

  single() {
    if (this.shouldError) {
      return { data: null, error: { message: "DB error" } };
    }
    return { data: this.record, error: null };
  }

  upsert() {
    if (this.shouldError) {
      return { error: { message: "DB error" } };
    }
    return { error: null };
  }
}

class FakeSupabaseClient {
  private readonly record: Record<string, unknown> | null;
  private readonly shouldError: boolean;

  constructor(record: Record<string, unknown> | null, shouldError: boolean) {
    this.record = record;
    this.shouldError = shouldError;
  }

  from(table: string) {
    if (table !== SUPABASE_TABLES.mealLogs) {
      throw new Error("Unexpected table");
    }
    return new FakeQuery(this.record, this.shouldError);
  }
}

describe("mealLogRepository", () => {
  it("fetches meal logs", async () => {
    const logs: MealLogEntry[] = [
      {
        id: "meal-1",
        mealType: "lunch",
        label: "Salad",
        date: "2026-01-20",
        healthyCategories: ["leafy_greens"],
        limitFoods: [],
        containsBeans: false,
        containsLactose: false
      }
    ];
    const client = new FakeSupabaseClient({ meal_logs: logs }, false);
    const result = await fetchMealLogs(
      client as unknown as SupabaseClient,
      "user-1"
    );

    expect(result).toEqual(logs);
  });

  it("throws on fetch error", async () => {
    const client = new FakeSupabaseClient(null, true);
    await expect(
      fetchMealLogs(client as unknown as SupabaseClient, "user-1")
    ).rejects.toThrow("DB error");
  });

  it("upserts meal logs", async () => {
    const logs: MealLogEntry[] = [];
    const client = new FakeSupabaseClient(null, false);
    await expect(
      upsertMealLogs(client as unknown as SupabaseClient, "user-1", logs)
    ).resolves.toBeUndefined();
  });
});
