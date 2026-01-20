import type { SupabaseClient } from "@supabase/supabase-js";
import type { WeeklyLog } from "../mindScore";
import type { MealLogEntry } from "../mealLogging";
import type { StorageLike as SetupStorage } from "../setupStorage";
import type { StorageLike as WeeklyStorage } from "../weeklyScoreStorage";
import type { StorageLike as MealStorage } from "../mealLogStorage";
import type { StorageLike as EspressoStorage } from "../espressoStorage";
import type { StorageLike as ChatStorage } from "../chatStorage";
import { fetchSetupState, upsertSetupState } from "./setupRepository";
import { fetchWeeklyLog, upsertWeeklyLog } from "./weeklyLogRepository";
import { fetchMealLogs, upsertMealLogs } from "./mealLogRepository";
import { fetchEspressoState, upsertEspressoState } from "./espressoRepository";
import { fetchChatHistory, upsertChatHistory } from "./chatRepository";
import { saveSetupState, loadSetupState } from "../setupStorage";
import { saveWeeklyLog, loadWeeklyLog } from "../weeklyScoreStorage";
import { saveMealLogs, loadMealLogs } from "../mealLogStorage";
import { saveEspressoState, loadEspressoState } from "../espressoStorage";
import { saveChatHistory, loadChatHistory } from "../chatStorage";

export async function pullWeeklyLog(
  client: SupabaseClient,
  userId: string
): Promise<WeeklyLog> {
  return fetchWeeklyLog(client, userId);
}

export async function pushWeeklyLog(
  client: SupabaseClient,
  userId: string,
  log: WeeklyLog
): Promise<void> {
  await upsertWeeklyLog(client, userId, log);
}

export async function pullMealLogs(
  client: SupabaseClient,
  userId: string
): Promise<MealLogEntry[]> {
  return fetchMealLogs(client, userId);
}

export async function pushMealLogs(
  client: SupabaseClient,
  userId: string,
  logs: MealLogEntry[]
): Promise<void> {
  await upsertMealLogs(client, userId, logs);
}

export async function syncSetupFromSupabase(
  client: SupabaseClient,
  userId: string,
  storage: SetupStorage
): Promise<void> {
  const state = await fetchSetupState(client, userId);
  saveSetupState(storage, state);
}

export async function syncWeeklyLogFromSupabase(
  client: SupabaseClient,
  userId: string,
  storage: WeeklyStorage
): Promise<void> {
  const log = await fetchWeeklyLog(client, userId);
  saveWeeklyLog(storage, log);
}

export async function syncMealLogsFromSupabase(
  client: SupabaseClient,
  userId: string,
  storage: MealStorage
): Promise<void> {
  const logs = await fetchMealLogs(client, userId);
  saveMealLogs(storage, logs);
}

export async function syncEspressoFromSupabase(
  client: SupabaseClient,
  userId: string,
  storage: EspressoStorage
): Promise<void> {
  const state = await fetchEspressoState(client, userId);
  saveEspressoState(storage, state);
}

export async function syncChatHistoryFromSupabase(
  client: SupabaseClient,
  userId: string,
  storage: ChatStorage
): Promise<void> {
  const history = await fetchChatHistory(client, userId);
  saveChatHistory(storage, history);
}

export async function pushSetupToSupabase(
  client: SupabaseClient,
  userId: string,
  storage: SetupStorage
): Promise<void> {
  const state = loadSetupState(storage);
  await upsertSetupState(client, userId, state);
}

export async function pushWeeklyLogToSupabase(
  client: SupabaseClient,
  userId: string,
  storage: WeeklyStorage
): Promise<void> {
  const log = loadWeeklyLog(storage);
  await upsertWeeklyLog(client, userId, log);
}

export async function pushMealLogsToSupabase(
  client: SupabaseClient,
  userId: string,
  storage: MealStorage
): Promise<void> {
  const logs = loadMealLogs(storage);
  await upsertMealLogs(client, userId, logs);
}

export async function pushEspressoToSupabase(
  client: SupabaseClient,
  userId: string,
  storage: EspressoStorage
): Promise<void> {
  const state = loadEspressoState(storage);
  await upsertEspressoState(client, userId, state);
}

export async function pushChatHistoryToSupabase(
  client: SupabaseClient,
  userId: string,
  storage: ChatStorage
): Promise<void> {
  const history = loadChatHistory(storage);
  await upsertChatHistory(client, userId, history);
}
