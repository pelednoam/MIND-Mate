import type { SupabaseClient } from "@supabase/supabase-js";
import type { ChatMessage } from "../chatStorage";
import { SUPABASE_TABLES } from "./supabaseTables";

export type ChatHistoryRecord = {
  user_id: string;
  messages: ChatMessage[];
};

export async function fetchChatHistory(
  client: SupabaseClient,
  userId: string
): Promise<ChatMessage[]> {
  const { data, error } = await client
    .from(SUPABASE_TABLES.chat)
    .select("messages")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Chat history not found");
  }

  return data.messages;
}

export async function upsertChatHistory(
  client: SupabaseClient,
  userId: string,
  messages: ChatMessage[]
): Promise<void> {
  const record: ChatHistoryRecord = {
    user_id: userId,
    messages
  };

  const { error } = await client.from(SUPABASE_TABLES.chat).upsert(record);
  if (error) {
    throw new Error(error.message);
  }
}
