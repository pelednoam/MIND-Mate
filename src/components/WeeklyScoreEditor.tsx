"use client";

import React, { useEffect, useState } from "react";
import {
  HEALTHY_CATEGORIES,
  LIMIT_CATEGORIES,
  type WeeklyEntry
} from "../lib/mindScore";
import {
  buildZeroWeeklyLog,
  loadWeeklyLog,
  saveWeeklyLog
} from "../lib/weeklyScoreStorage";
import { createWeeklyLog } from "../lib/mindScore";
import { loadMealLogs } from "../lib/mealLogStorage";
import { rebuildWeeklyLogFromMeals } from "../lib/weeklyLogReconciler";
import { getSupabaseClient } from "../lib/persistence/supabaseClient";
import {
  fetchWeeklyLog,
  upsertWeeklyLog
} from "../lib/persistence/weeklyLogRepository";
import { loadSupabaseUserId } from "../lib/persistence/supabaseUserStorage";

const CATEGORY_LABELS = [
  ...HEALTHY_CATEGORIES,
  ...LIMIT_CATEGORIES
] as const;

export function WeeklyScoreEditor() {
  const [entries, setEntries] = useState<WeeklyEntry[]>(buildZeroWeeklyLog());
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const saved = loadWeeklyLog(window.localStorage);
        if (isMounted) {
          setEntries(saved);
          setStatus("Loaded saved weekly log.");
        }
      } catch (caught) {
        const message =
          caught instanceof Error ? caught.message : "Unable to load weekly log";
        if (isMounted) {
          setError(message);
        }
      }

      try {
        const userId = loadSupabaseUserId(window.localStorage);
        const client = getSupabaseClient();
        const remote = await fetchWeeklyLog(client, userId);
        if (isMounted) {
          setEntries(remote);
          setStatus("Loaded weekly log from Supabase.");
        }
      } catch (caught) {
        const message =
          caught instanceof Error
            ? caught.message
            : "Unable to load weekly log from Supabase";
        if (isMounted) {
          setError(message);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (categoryId: WeeklyEntry["categoryId"], value: string) => {
    const parsed = Number(value);
    setEntries((prev) =>
      prev.map((entry) =>
        entry.categoryId === categoryId
          ? {
              ...entry,
              servingsPerWeek: Number.isFinite(parsed) ? parsed : 0
            }
          : entry
      )
    );
  };

  const handleSave = () => {
    setError("");
    setStatus("");
    try {
      const validated = createWeeklyLog([...entries]);
      saveWeeklyLog(window.localStorage, validated);
      setStatus("Weekly log saved.");
      const userId = loadSupabaseUserId(window.localStorage);
      const client = getSupabaseClient();
      void upsertWeeklyLog(client, userId, validated)
        .then(() => {
          setStatus("Weekly log saved to Supabase.");
        })
        .catch((caught) => {
          const message =
            caught instanceof Error
              ? caught.message
              : "Unable to save weekly log to Supabase";
          setError(message);
        });
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "Unable to save weekly log";
      setError(message);
    }
  };

  const handleReset = () => {
    setEntries(buildZeroWeeklyLog());
    setStatus("Weekly log reset to zero.");
    setError("");
  };

  const handleRecalculate = () => {
    setStatus("");
    setError("");
    try {
      const meals = loadMealLogs(window.localStorage);
      const rebuilt = rebuildWeeklyLogFromMeals(meals);
      saveWeeklyLog(window.localStorage, rebuilt);
      setEntries(rebuilt);
      setStatus("Weekly log recalculated from meal logs.");
      const userId = loadSupabaseUserId(window.localStorage);
      const client = getSupabaseClient();
      void upsertWeeklyLog(client, userId, rebuilt)
        .then(() => {
          setStatus("Weekly log recalculated and saved to Supabase.");
        })
        .catch((caught) => {
          const message =
            caught instanceof Error
              ? caught.message
              : "Unable to save recalculated log to Supabase";
          setError(message);
        });
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "Unable to recalculate weekly log";
      setError(message);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Weekly Score</h2>
      <p className="mt-1 text-sm text-slate-500">
        Update servings per week for each category.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {entries.map((entry) => (
          <label key={entry.categoryId} className="text-sm text-slate-600">
            {getCategoryLabel(entry.categoryId)}
            <input
              type="number"
              min="0"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              value={entry.servingsPerWeek}
              onChange={(event) =>
                handleChange(entry.categoryId, event.target.value)
              }
            />
          </label>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          onClick={handleSave}
        >
          Save weekly log
        </button>
        <button
          type="button"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          onClick={handleRecalculate}
        >
          Recalculate from meal logs
        </button>
        <button
          type="button"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          onClick={handleReset}
        >
          Reset to zero
        </button>
      </div>

      {status ? <p className="mt-3 text-sm text-emerald-600">{status}</p> : null}
      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
    </section>
  );
}

function getCategoryLabel(categoryId: WeeklyEntry["categoryId"]): string {
  const match = CATEGORY_LABELS.find((category) => category.id === categoryId);
  if (!match) {
    throw new Error(`Unknown category label for ${categoryId}`);
  }
  return match.label;
}
