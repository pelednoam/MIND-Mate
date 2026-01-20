import type { SupabaseClient } from "@supabase/supabase-js";
import type { WeeklyEntry, WeeklyLog } from "../mindScore";
import { createWeeklyLog } from "../mindScore";
import { SUPABASE_TABLES } from "./supabaseTables";

export type WeeklyLogRecord = {
  user_id: string;
  weekly_log: WeeklyEntry[];
};

export async function fetchWeeklyLog(
  client: SupabaseClient,
  userId: string
): Promise<WeeklyLog> {
  const { data, error } = await client
    .from(SUPABASE_TABLES.weeklyLog)
    .select("weekly_log")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Weekly log not found");
  }

  return createWeeklyLog(data.weekly_log);
}

export async function upsertWeeklyLog(
  client: SupabaseClient,
  userId: string,
  log: WeeklyLog
): Promise<void> {
  const record: WeeklyLogRecord = {
    user_id: userId,
    weekly_log: log
  };

  const { error } = await client.from(SUPABASE_TABLES.weeklyLog).upsert(record);
  if (error) {
    throw new Error(error.message);
  }
}
