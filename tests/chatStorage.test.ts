import { describe, expect, it } from "vitest";
import {
  loadChatHistory,
  parseChatHistory,
  saveChatHistory,
  serializeChatHistory,
  type ChatMessage
} from "../src/lib/chatStorage";

class MemoryStorage {
  private readonly store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

describe("chatStorage", () => {
  it("serializes and parses chat history", () => {
    const messages: ChatMessage[] = [
      { role: "user", text: "Hello" },
      { role: "coach", text: "Hi" }
    ];
    const raw = serializeChatHistory(messages);
    const parsed = parseChatHistory(raw);
    expect(parsed).toEqual(messages);
  });

  it("throws when chat history is missing", () => {
    const storage = new MemoryStorage();
    expect(() => loadChatHistory(storage)).toThrow("Missing chat history");
  });

  it("saves and loads chat history", () => {
    const storage = new MemoryStorage();
    const messages: ChatMessage[] = [{ role: "user", text: "Ping" }];
    saveChatHistory(storage, messages);
    const loaded = loadChatHistory(storage);
    expect(loaded).toEqual(messages);
  });
});
