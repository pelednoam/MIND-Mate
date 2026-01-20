import { describe, expect, it } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { MealLogEntry } from "../../src/lib/mealLogging";
import type { ChatMessage } from "../../src/lib/chatStorage";
import type { EspressoState } from "../../src/lib/espressoStorage";
import {
  syncSetupFromSupabase,
  syncWeeklyLogFromSupabase,
  syncMealLogsFromSupabase,
  syncEspressoFromSupabase,
  syncChatHistoryFromSupabase,
  pushSetupToSupabase,
  pushWeeklyLogToSupabase,
  pushMealLogsToSupabase,
  pushEspressoToSupabase,
  pushChatHistoryToSupabase
} from "../../src/lib/persistence/supabaseSync";
import { buildZeroWeeklyLog } from "../../src/lib/weeklyScoreStorage";
import { saveSetupState, loadSetupState } from "../../src/lib/setupStorage";
import { saveWeeklyLog, loadWeeklyLog } from "../../src/lib/weeklyScoreStorage";
import { saveMealLogs, loadMealLogs } from "../../src/lib/mealLogStorage";
import { saveEspressoState, loadEspressoState } from "../../src/lib/espressoStorage";
import { saveChatHistory, loadChatHistory } from "../../src/lib/chatStorage";
import { SUPABASE_TABLES } from "../../src/lib/persistence/supabaseTables";

class MemoryStorage {
  private readonly store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

class FakeQuery {
  private readonly record: Record<string, unknown> | null;
  private readonly shouldError: boolean;
  private readonly onUpsert: () => void;

  constructor(
    record: Record<string, unknown> | null,
    shouldError: boolean,
    onUpsert: () => void
  ) {
    this.record = record;
    this.shouldError = shouldError;
    this.onUpsert = onUpsert;
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
    this.onUpsert();
    if (this.shouldError) {
      return { error: { message: "DB error" } };
    }
    return { error: null };
  }
}

class FakeSupabaseClient {
  public readonly upsertedTables: string[] = [];
  private readonly setupRecord: Record<string, unknown> | null;
  private readonly weeklyRecord: Record<string, unknown> | null;
  private readonly mealRecord: Record<string, unknown> | null;
  private readonly espressoRecord: Record<string, unknown> | null;
  private readonly chatRecord: Record<string, unknown> | null;
  private readonly shouldError: boolean;

  constructor(
    setupRecord: Record<string, unknown> | null,
    weeklyRecord: Record<string, unknown> | null,
    mealRecord: Record<string, unknown> | null,
    espressoRecord: Record<string, unknown> | null,
    chatRecord: Record<string, unknown> | null,
    shouldError: boolean
  ) {
    this.setupRecord = setupRecord;
    this.weeklyRecord = weeklyRecord;
    this.mealRecord = mealRecord;
    this.espressoRecord = espressoRecord;
    this.chatRecord = chatRecord;
    this.shouldError = shouldError;
  }

  from(table: string) {
    switch (table) {
      case SUPABASE_TABLES.setup:
        return new FakeQuery(
          this.setupRecord,
          this.shouldError,
          () => this.upsertedTables.push(table)
        );
      case SUPABASE_TABLES.weeklyLog:
        return new FakeQuery(
          this.weeklyRecord,
          this.shouldError,
          () => this.upsertedTables.push(table)
        );
      case SUPABASE_TABLES.mealLogs:
        return new FakeQuery(
          this.mealRecord,
          this.shouldError,
          () => this.upsertedTables.push(table)
        );
      case SUPABASE_TABLES.espresso:
        return new FakeQuery(
          this.espressoRecord,
          this.shouldError,
          () => this.upsertedTables.push(table)
        );
      case SUPABASE_TABLES.chat:
        return new FakeQuery(
          this.chatRecord,
          this.shouldError,
          () => this.upsertedTables.push(table)
        );
      default:
        throw new Error("Unexpected table");
    }
  }
}

describe("supabaseSync", () => {
  it("syncs all entities from Supabase into local storage", async () => {
    const storage = new MemoryStorage();
    const weeklyLog = buildZeroWeeklyLog();
    const mealLogs: MealLogEntry[] = [];
    const espresso: EspressoState = {
      date: "2026-01-20",
      shotsToday: 1,
      targetShots: 2
    };
    const chatHistory: ChatMessage[] = [{ role: "user", text: "Hello" }];
    const client = new FakeSupabaseClient(
      {
        breakfast_routine: "Toast",
        dinner_routine: "Salad",
        coach_personality: "Coach"
      },
      { weekly_log: weeklyLog },
      { meal_logs: mealLogs },
      {
        date: espresso.date,
        shots_today: espresso.shotsToday,
        target_shots: espresso.targetShots
      },
      { messages: chatHistory },
      false
    );

    await syncSetupFromSupabase(client as unknown as SupabaseClient, "user-1", storage);
    await syncWeeklyLogFromSupabase(client as unknown as SupabaseClient, "user-1", storage);
    await syncMealLogsFromSupabase(client as unknown as SupabaseClient, "user-1", storage);
    await syncEspressoFromSupabase(client as unknown as SupabaseClient, "user-1", storage);
    await syncChatHistoryFromSupabase(client as unknown as SupabaseClient, "user-1", storage);

    expect(loadSetupState(storage).breakfastRoutine).toBe("Toast");
    expect(loadWeeklyLog(storage)).toEqual(weeklyLog);
    expect(loadMealLogs(storage)).toEqual(mealLogs);
    expect(loadEspressoState(storage)).toEqual(espresso);
    expect(loadChatHistory(storage)).toEqual(chatHistory);
  });

  it("pushes local storage data to Supabase", async () => {
    const storage = new MemoryStorage();
    saveSetupState(storage, {
      breakfastRoutine: "Toast",
      dinnerRoutine: "Salad",
      coachPersonality: "Coach"
    });
    saveWeeklyLog(storage, buildZeroWeeklyLog());
    saveMealLogs(storage, []);
    saveEspressoState(storage, {
      date: "2026-01-20",
      shotsToday: 0,
      targetShots: 2
    });
    saveChatHistory(storage, [{ role: "user", text: "Ping" }]);

    const client = new FakeSupabaseClient(
      null,
      null,
      null,
      null,
      null,
      false
    );

    await pushSetupToSupabase(client as unknown as SupabaseClient, "user-1", storage);
    await pushWeeklyLogToSupabase(client as unknown as SupabaseClient, "user-1", storage);
    await pushMealLogsToSupabase(client as unknown as SupabaseClient, "user-1", storage);
    await pushEspressoToSupabase(client as unknown as SupabaseClient, "user-1", storage);
    await pushChatHistoryToSupabase(client as unknown as SupabaseClient, "user-1", storage);

    expect(client.upsertedTables).toEqual([
      SUPABASE_TABLES.setup,
      SUPABASE_TABLES.weeklyLog,
      SUPABASE_TABLES.mealLogs,
      SUPABASE_TABLES.espresso,
      SUPABASE_TABLES.chat
    ]);
  });
});
