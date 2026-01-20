import { describe, expect, it } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { EspressoState } from "../../src/lib/espressoStorage";
import {
  fetchEspressoState,
  upsertEspressoState
} from "../../src/lib/persistence/espressoRepository";
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
    if (table !== SUPABASE_TABLES.espresso) {
      throw new Error("Unexpected table");
    }
    return new FakeQuery(this.record, this.shouldError);
  }
}

describe("espressoRepository", () => {
  it("fetches espresso state", async () => {
    const client = new FakeSupabaseClient(
      {
        date: "2026-01-20",
        shots_today: 1,
        target_shots: 2
      },
      false
    );

    const result = await fetchEspressoState(
      client as unknown as SupabaseClient,
      "user-1"
    );

    expect(result).toEqual({
      date: "2026-01-20",
      shotsToday: 1,
      targetShots: 2
    });
  });

  it("throws on fetch error", async () => {
    const client = new FakeSupabaseClient(null, true);
    await expect(
      fetchEspressoState(client as unknown as SupabaseClient, "user-1")
    ).rejects.toThrow("DB error");
  });

  it("upserts espresso state", async () => {
    const client = new FakeSupabaseClient(null, false);
    const state: EspressoState = {
      date: "2026-01-20",
      shotsToday: 0,
      targetShots: 2
    };
    await expect(
      upsertEspressoState(client as unknown as SupabaseClient, "user-1", state)
    ).resolves.toBeUndefined();
  });
});
