import { describe, expect, it } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ChatMessage } from "../../src/lib/chatStorage";
import {
  fetchChatHistory,
  upsertChatHistory
} from "../../src/lib/persistence/chatRepository";
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
    if (table !== SUPABASE_TABLES.chat) {
      throw new Error("Unexpected table");
    }
    return new FakeQuery(this.record, this.shouldError);
  }
}

describe("chatRepository", () => {
  it("fetches chat history", async () => {
    const messages: ChatMessage[] = [
      { role: "user", text: "Hello" },
      { role: "coach", text: "Hi there" }
    ];
    const client = new FakeSupabaseClient({ messages }, false);
    const result = await fetchChatHistory(
      client as unknown as SupabaseClient,
      "user-1"
    );

    expect(result).toEqual(messages);
  });

  it("throws on fetch error", async () => {
    const client = new FakeSupabaseClient(null, true);
    await expect(
      fetchChatHistory(client as unknown as SupabaseClient, "user-1")
    ).rejects.toThrow("DB error");
  });

  it("upserts chat history", async () => {
    const client = new FakeSupabaseClient(null, false);
    const messages: ChatMessage[] = [{ role: "user", text: "Ping" }];
    await expect(
      upsertChatHistory(client as unknown as SupabaseClient, "user-1", messages)
    ).resolves.toBeUndefined();
  });
});
