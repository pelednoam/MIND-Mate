import { describe, expect, it } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  fetchAllNotificationTokens,
  fetchNotificationTokens,
  registerNotificationToken
} from "../../src/lib/persistence/notificationTokenRepository";
import { SUPABASE_TABLES } from "../../src/lib/persistence/supabaseTables";

type RecordRow = { user_id: string; token: string };

class FakeQuery {
  private readonly records: RecordRow[] | null;
  private readonly shouldError: boolean;

  constructor(records: RecordRow[] | null, shouldError: boolean) {
    this.records = records;
    this.shouldError = shouldError;
  }

  select() {
    return this;
  }

  eq() {
    return this;
  }

  async upsert() {
    if (this.shouldError) {
      return { error: { message: "DB error" } };
    }
    return { error: null };
  }

  then(
    resolve: (value: {
      data: RecordRow[] | null;
      error: { message: string } | null;
    }) => void
  ) {
    if (this.shouldError) {
      resolve({ data: null, error: { message: "DB error" } });
      return;
    }
    resolve({ data: this.records, error: null });
  }
}

class FakeSupabaseClient {
  private readonly records: RecordRow[] | null;
  private readonly shouldError: boolean;

  constructor(records: RecordRow[] | null, shouldError: boolean) {
    this.records = records;
    this.shouldError = shouldError;
  }

  from(table: string) {
    if (table !== SUPABASE_TABLES.notificationTokens) {
      throw new Error("Unexpected table");
    }
    return new FakeQuery(this.records, this.shouldError);
  }
}

describe("notificationTokenRepository", () => {
  it("fetches notification tokens for a user", async () => {
    const client = new FakeSupabaseClient(
      [
        { user_id: "user-1", token: "token-a" },
        { user_id: "user-1", token: "token-b" }
      ],
      false
    );
    const tokens = await fetchNotificationTokens(
      client as unknown as SupabaseClient,
      "user-1"
    );
    expect(tokens).toEqual(["token-a", "token-b"]);
  });

  it("throws on duplicate tokens", async () => {
    const client = new FakeSupabaseClient(
      [
        { user_id: "user-1", token: "dup-token" },
        { user_id: "user-1", token: "dup-token" }
      ],
      false
    );
    await expect(
      fetchNotificationTokens(
        client as unknown as SupabaseClient,
        "user-1"
      )
    ).rejects.toThrow("Duplicate notification token");
  });

  it("fetches all notification tokens", async () => {
    const client = new FakeSupabaseClient(
      [{ user_id: "user-1", token: "token-a" }],
      false
    );
    const records = await fetchAllNotificationTokens(
      client as unknown as SupabaseClient
    );
    expect(records).toEqual([{ user_id: "user-1", token: "token-a" }]);
  });

  it("registers a notification token", async () => {
    const client = new FakeSupabaseClient([], false);
    await expect(
      registerNotificationToken(
        client as unknown as SupabaseClient,
        "user-1",
        "token-a"
      )
    ).resolves.toBeUndefined();
  });
});
