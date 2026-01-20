import { describe, expect, it } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { buildZeroWeeklyLog } from "../../src/lib/weeklyScoreStorage";
import {
  fetchWeeklyLog,
  upsertWeeklyLog
} from "../../src/lib/persistence/weeklyLogRepository";
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
    if (table !== SUPABASE_TABLES.weeklyLog) {
      throw new Error("Unexpected table");
    }
    return new FakeQuery(this.record, this.shouldError);
  }
}

describe("weeklyLogRepository", () => {
  it("fetches weekly log", async () => {
    const log = buildZeroWeeklyLog();
    const client = new FakeSupabaseClient({ weekly_log: log }, false);
    const result = await fetchWeeklyLog(
      client as unknown as SupabaseClient,
      "user-1"
    );

    expect(result).toEqual(log);
  });

  it("throws on fetch error", async () => {
    const client = new FakeSupabaseClient(null, true);
    await expect(
      fetchWeeklyLog(client as unknown as SupabaseClient, "user-1")
    ).rejects.toThrow("DB error");
  });

  it("upserts weekly log", async () => {
    const log = buildZeroWeeklyLog();
    const client = new FakeSupabaseClient(null, false);
    await expect(
      upsertWeeklyLog(client as unknown as SupabaseClient, "user-1", log)
    ).resolves.toBeUndefined();
  });
});
