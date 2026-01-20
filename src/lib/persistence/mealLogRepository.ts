import type { SupabaseClient } from "@supabase/supabase-js";
import type { MealLogEntry } from "../mealLogging";
import { SUPABASE_TABLES } from "./supabaseTables";

export type MealLogsRecord = {
  user_id: string;
  meal_logs: MealLogEntry[];
};

export async function fetchMealLogs(
  client: SupabaseClient,
  userId: string
): Promise<MealLogEntry[]> {
  const { data, error } = await client
    .from(SUPABASE_TABLES.mealLogs)
    .select("meal_logs")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Meal logs not found");
  }

  return data.meal_logs;
}

export async function upsertMealLogs(
  client: SupabaseClient,
  userId: string,
  logs: MealLogEntry[]
): Promise<void> {
  const record: MealLogsRecord = {
    user_id: userId,
    meal_logs: logs
  };

  const { error } = await client.from(SUPABASE_TABLES.mealLogs).upsert(record);
  if (error) {
    throw new Error(error.message);
  }
}
