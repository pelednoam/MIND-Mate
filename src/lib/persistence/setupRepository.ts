import type { SupabaseClient } from "@supabase/supabase-js";
import type { SetupState } from "../setupStorage";
import { SUPABASE_TABLES } from "./supabaseTables";

export type SetupRecord = {
  user_id: string;
  breakfast_routine: string;
  dinner_routine: string;
  coach_personality: string;
};

export async function fetchSetupState(
  client: SupabaseClient,
  userId: string
): Promise<SetupState> {
  const { data, error } = await client
    .from(SUPABASE_TABLES.setup)
    .select("breakfast_routine,dinner_routine,coach_personality")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Setup state not found");
  }

  return {
    breakfastRoutine: data.breakfast_routine,
    dinnerRoutine: data.dinner_routine,
    coachPersonality: data.coach_personality
  };
}

export async function upsertSetupState(
  client: SupabaseClient,
  userId: string,
  state: SetupState
): Promise<void> {
  const record: SetupRecord = {
    user_id: userId,
    breakfast_routine: state.breakfastRoutine,
    dinner_routine: state.dinnerRoutine,
    coach_personality: state.coachPersonality
  };

  const { error } = await client.from(SUPABASE_TABLES.setup).upsert(record);
  if (error) {
    throw new Error(error.message);
  }
}
