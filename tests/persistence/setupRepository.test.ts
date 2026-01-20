import { describe, expect, it } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { SetupState } from "../../src/lib/setupStorage";
import {
  fetchSetupState,
  upsertSetupState
} from "../../src/lib/persistence/setupRepository";
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
    if (table !== SUPABASE_TABLES.setup) {
      throw new Error("Unexpected table");
    }
    return new FakeQuery(this.record, this.shouldError);
  }
}

describe("setupRepository", () => {
  it("fetches setup state", async () => {
    const client = new FakeSupabaseClient(
      {
        breakfast_routine: "Toast",
        dinner_routine: "Salad",
        coach_personality: "Coach"
      },
      false
    );

    const state = await fetchSetupState(
      client as unknown as SupabaseClient,
      "user-1"
    );

    expect(state).toEqual({
      breakfastRoutine: "Toast",
      dinnerRoutine: "Salad",
      coachPersonality: "Coach"
    });
  });

  it("throws on fetch error", async () => {
    const client = new FakeSupabaseClient(null, true);
    await expect(
      fetchSetupState(
        client as unknown as SupabaseClient,
        "user-1"
      )
    ).rejects.toThrow("DB error");
  });

  it("upserts setup state", async () => {
    const client = new FakeSupabaseClient(null, false);
    const state: SetupState = {
      breakfastRoutine: "Toast",
      dinnerRoutine: "Salad",
      coachPersonality: "Coach"
    };

    await expect(
      upsertSetupState(
        client as unknown as SupabaseClient,
        "user-1",
        state
      )
    ).resolves.toBeUndefined();
  });
});
