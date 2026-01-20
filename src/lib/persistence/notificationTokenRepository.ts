import type { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_TABLES } from "./supabaseTables";

export type NotificationTokenRecord = {
  user_id: string;
  token: string;
};

export async function registerNotificationToken(
  client: SupabaseClient,
  userId: string,
  token: string
): Promise<void> {
  if (token.trim().length === 0) {
    throw new Error("Notification token is required");
  }
  const record: NotificationTokenRecord = { user_id: userId, token };
  const { error } = await client
    .from(SUPABASE_TABLES.notificationTokens)
    .upsert(record);
  if (error) {
    throw new Error(error.message);
  }
}

export async function fetchNotificationTokens(
  client: SupabaseClient,
  userId: string
): Promise<string[]> {
  const { data, error } = await client
    .from(SUPABASE_TABLES.notificationTokens)
    .select("token")
    .eq("user_id", userId);

  if (error || !data) {
    throw new Error(error?.message || "Notification tokens not found");
  }
  if (data.length === 0) {
    throw new Error("Notification tokens not found");
  }

  const tokens: string[] = [];
  for (const row of data) {
    if (!row.token || row.token.trim().length === 0) {
      throw new Error("Notification token is invalid");
    }
    if (tokens.includes(row.token)) {
      throw new Error(`Duplicate notification token: ${row.token}`);
    }
    tokens.push(row.token);
  }

  return tokens;
}

export async function fetchAllNotificationTokens(
  client: SupabaseClient
): Promise<NotificationTokenRecord[]> {
  const { data, error } = await client
    .from(SUPABASE_TABLES.notificationTokens)
    .select("user_id,token");

  if (error || !data) {
    throw new Error(error?.message || "Notification tokens not found");
  }
  if (data.length === 0) {
    throw new Error("Notification tokens not found");
  }

  return data as NotificationTokenRecord[];
}
