"use client";

import React, { useEffect, useState } from "react";
import {
  createMealLogEntry,
  type MealLogEntry,
  type MealType
} from "../lib/mealLogging";
import { HEALTHY_CATEGORIES } from "../lib/mindScore";
import { WARNING_REPAIR_ENGINE, type LimitFood } from "../lib/mindRules";
import {
  appendMealLog,
  initializeMealLogs,
  loadMealLogs,
  saveMealLogs
} from "../lib/mealLogStorage";
import { loadWeeklyLog, saveWeeklyLog } from "../lib/weeklyScoreStorage";
import { applyMealLogEntry } from "../lib/mealLogUpdater";
import { buildMealWarningDecisions } from "../lib/mealLogWarnings";
import type { WarningRepairDecision } from "../lib/warningRepair";
import { getSupabaseClient } from "../lib/persistence/supabaseClient";
import {
  fetchMealLogs,
  upsertMealLogs
} from "../lib/persistence/mealLogRepository";
import { upsertWeeklyLog } from "../lib/persistence/weeklyLogRepository";
import { useSupabaseUser } from "../lib/auth/useSupabaseUser";

type MealDraft = {
  mealType: MealType;
  label: string;
  date: string;
  containsBeans: boolean;
  containsLactose: boolean;
  healthyCategories: string[];
  limitFoods: LimitFood[];
};

type MealLogView = {
  id: string;
  label: string;
  mealType: MealType;
  date: string;
};

const INITIAL_DRAFT: MealDraft = {
  mealType: "lunch",
  label: "",
  date: "",
  containsBeans: false,
  containsLactose: false,
  healthyCategories: [],
  limitFoods: []
};

export function MealLogForm() {
  const { userId, error: authError } = useSupabaseUser();
  const [draft, setDraft] = useState<MealDraft>(INITIAL_DRAFT);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [logs, setLogs] = useState<MealLogView[]>([]);
  const [warnings, setWarnings] = useState<WarningRepairDecision[]>([]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const stored = loadMealLogs(window.localStorage);
        if (isMounted) {
          setLogs(stored.map(toMealLogView));
        }
      } catch (caught) {
        const message =
          caught instanceof Error ? caught.message : "Unable to load meal logs";
        if (message.includes("Missing meal logs")) {
          if (isMounted) {
            setStatus("No meal logs yet.");
          }
          return;
        }
        if (isMounted) {
          setError(message);
        }
      }

      if (userId) {
        try {
          const client = getSupabaseClient();
          const remote = await fetchMealLogs(client, userId);
          saveMealLogs(window.localStorage, remote);
          if (isMounted) {
            setLogs(remote.map(toMealLogView));
          }
        } catch (caught) {
          const message =
            caught instanceof Error
              ? caught.message
              : "Unable to load meal logs from Supabase";
          if (isMounted) {
            setError(message);
          }
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatus("");
    setWarnings([]);

    try {
      const entry = createMealLogEntry({
        id: crypto.randomUUID(),
        mealType: draft.mealType,
        label: draft.label,
        date: draft.date,
        healthyCategories: draft.healthyCategories,
        limitFoods: draft.limitFoods,
        containsBeans: draft.containsBeans,
        containsLactose: draft.containsLactose
      });

      const { updatedWeeklyLog, updatedLogs } = persistMealLog(entry);
      setWarnings(buildMealWarningDecisions(updatedWeeklyLog, entry.limitFoods));
      setLogs(updatedLogs.map(toMealLogView));
      setStatus(`Logged ${entry.mealType}: ${entry.label}`);
      setDraft(INITIAL_DRAFT);
      void syncSupabase(userId, updatedWeeklyLog, updatedLogs).catch((caught) => {
        const message =
          caught instanceof Error
            ? caught.message
            : "Unable to sync meal logs to Supabase";
        setError(message);
      });
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "Unexpected error";
      if (message.includes("Missing meal logs")) {
        try {
          initializeMealLogs(window.localStorage);
          const entry = createMealLogEntry({
            id: crypto.randomUUID(),
            mealType: draft.mealType,
            label: draft.label,
            date: draft.date,
            healthyCategories: draft.healthyCategories,
            limitFoods: draft.limitFoods,
            containsBeans: draft.containsBeans,
            containsLactose: draft.containsLactose
          });
          const { updatedWeeklyLog, updatedLogs } = persistMealLog(entry);
          setWarnings(
            buildMealWarningDecisions(updatedWeeklyLog, entry.limitFoods)
          );
          setLogs(updatedLogs.map(toMealLogView));
          setStatus(`Logged ${entry.mealType}: ${entry.label}`);
          setDraft(INITIAL_DRAFT);
          void syncSupabase(userId, updatedWeeklyLog, updatedLogs).catch(
            (caught) => {
            const message =
              caught instanceof Error
                ? caught.message
                : "Unable to sync meal logs to Supabase";
            setError(message);
          });
          return;
        } catch (innerError) {
          const innerMessage =
            innerError instanceof Error
              ? innerError.message
              : "Unable to initialize meal logs";
          setError(innerMessage);
          return;
        }
      }
      setError(message);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Meal Logging</h2>
      <p className="mt-1 text-sm text-slate-500">
        Capture meals while enforcing No Beans and No Lactose.
      </p>

      <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className="text-sm text-slate-600">
          Meal type
          <select
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            value={draft.mealType}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                mealType: event.target.value as MealType
              }))
            }
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </label>

        <label className="text-sm text-slate-600">
          Meal label
          <input
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            value={draft.label}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, label: event.target.value }))
            }
            placeholder="Grilled chicken wrap"
          />
        </label>

        <label className="text-sm text-slate-600">
          Date (YYYY-MM-DD)
          <input
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            value={draft.date}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, date: event.target.value }))
            }
            placeholder="2026-01-20"
          />
        </label>

        <div className="flex flex-wrap gap-4 text-xs text-slate-600">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={draft.containsBeans}
              onChange={() =>
                setDraft((prev) => ({
                  ...prev,
                  containsBeans: !prev.containsBeans
                }))
              }
              className="h-4 w-4 accent-slate-600"
            />
            Contains beans
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={draft.containsLactose}
              onChange={() =>
                setDraft((prev) => ({
                  ...prev,
                  containsLactose: !prev.containsLactose
                }))
              }
              className="h-4 w-4 accent-slate-600"
            />
            Contains lactose
          </label>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Healthy categories
          </p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
            {HEALTHY_CATEGORIES.map((category) => (
              <label key={category.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={draft.healthyCategories.includes(category.id)}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      healthyCategories: event.target.checked
                        ? [...prev.healthyCategories, category.id]
                        : prev.healthyCategories.filter(
                            (item) => item !== category.id
                          )
                    }))
                  }
                  className="h-4 w-4 accent-slate-600"
                />
                {category.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Limit foods
          </p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
            {WARNING_REPAIR_ENGINE.map((rule) => (
              <label key={rule.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={draft.limitFoods.includes(rule.id)}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      limitFoods: event.target.checked
                        ? [...prev.limitFoods, rule.id]
                        : prev.limitFoods.filter((item) => item !== rule.id)
                    }))
                  }
                  className="h-4 w-4 accent-slate-600"
                />
                {rule.label}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="self-start rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Log meal
        </button>
      </form>

      {authError ? (
        <p className="mt-4 text-sm text-rose-600">{authError}</p>
      ) : null}
      {status ? <p className="mt-4 text-sm text-emerald-600">{status}</p> : null}
      {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
      {warnings.length > 0 ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Warning & Repair</p>
          <ul className="mt-2 space-y-2 text-sm text-amber-900">
            {warnings.map((warning) => (
              <li key={warning.limitFood}>
                {warning.warning} {warning.repair}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {logs.length > 0 ? (
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="text-xs font-semibold uppercase text-slate-500">
            Recent logs
          </p>
          <ul className="mt-3 space-y-2">
            {logs.map((entry) => (
              <li key={entry.id} className="rounded-lg bg-white px-3 py-2">
                <span className="text-xs uppercase text-slate-500">
                  {entry.mealType}
                </span>
                <p className="text-sm text-slate-800">{entry.label}</p>
                <p className="text-xs text-slate-500">{entry.date}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function toMealLogView(entry: MealLogEntry): MealLogView {
  return {
    id: entry.id,
    label: entry.label,
    mealType: entry.mealType,
    date: entry.date
  };
}

function persistMealLog(entry: ReturnType<typeof createMealLogEntry>) {
  const weeklyLog = loadWeeklyLog(window.localStorage);
  const updatedWeeklyLog = applyMealLogEntry(weeklyLog, entry);
  saveWeeklyLog(window.localStorage, updatedWeeklyLog);
  const updatedLogs = appendMealLog(window.localStorage, entry);
  if (updatedLogs.length === 0) {
    throw new Error("Meal log did not persist");
  }
  return { updatedWeeklyLog, updatedLogs };
}

async function syncSupabase(
  userId: string | null,
  updatedWeeklyLog: ReturnType<typeof loadWeeklyLog>,
  updatedLogs: ReturnType<typeof loadMealLogs>
) {
  if (!userId) {
    throw new Error("Sign in to sync meal logs.");
  }
  const client = getSupabaseClient();
  await upsertWeeklyLog(client, userId, updatedWeeklyLog);
  await upsertMealLogs(client, userId, updatedLogs);
}
