export type ChatMessage = {
  role: "user" | "coach";
  text: string;
};

export type StorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

const STORAGE_KEY = "mindMateChatHistory";

export function saveChatHistory(
  storage: StorageLike,
  messages: ChatMessage[]
): void {
  storage.setItem(STORAGE_KEY, serializeChatHistory(messages));
}

export function loadChatHistory(storage: StorageLike): ChatMessage[] {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) {
    throw new Error("Missing chat history in storage");
  }
  return parseChatHistory(raw);
}

export function serializeChatHistory(messages: ChatMessage[]): string {
  return JSON.stringify(messages);
}

export function parseChatHistory(raw: string): ChatMessage[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch (error) {
    throw new Error("Chat history must be valid JSON");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Chat history must be an array");
  }

  const messages: ChatMessage[] = [];
  for (const entry of parsed) {
    if (!isChatMessage(entry)) {
      throw new Error("Chat message is missing required fields");
    }
    messages.push(entry);
  }

  return messages;
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    (record.role === "user" || record.role === "coach") &&
    typeof record.text === "string"
  );
}
