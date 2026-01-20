import type { SupabaseClient } from "@supabase/supabase-js";
import type { EspressoState } from "../espressoStorage";
import { SUPABASE_TABLES } from "./supabaseTables";

export type EspressoRecord = {
  user_id: string;
  date: string;
  shots_today: number;
  target_shots: number;
};

export async function fetchEspressoState(
  client: SupabaseClient,
  userId: string
): Promise<EspressoState> {
  const { data, error } = await client
    .from(SUPABASE_TABLES.espresso)
    .select("date,shots_today,target_shots")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Espresso state not found");
  }

  return {
    date: data.date,
    shotsToday: data.shots_today,
    targetShots: data.target_shots
  };
}

export async function upsertEspressoState(
  client: SupabaseClient,
  userId: string,
  state: EspressoState
): Promise<void> {
  const record: EspressoRecord = {
    user_id: userId,
    date: state.date,
    shots_today: state.shotsToday,
    target_shots: state.targetShots
  };

  const { error } = await client.from(SUPABASE_TABLES.espresso).upsert(record);
  if (error) {
    throw new Error(error.message);
  }
}
