"use client";

import React, { useEffect, useState } from "react";
import { buildDashboardModel } from "../lib/dashboard";
import { buildWeeklyScoreSummary, type WeeklyLog } from "../lib/mindScore";
import {
  buildZeroWeeklyLog,
  loadWeeklyLog,
  saveWeeklyLog
} from "../lib/weeklyScoreStorage";
import { ProgressDashboard } from "./ProgressDashboard";
import {
  initializeEspressoState,
  loadEspressoState,
  saveEspressoState,
  type EspressoState
} from "../lib/espressoStorage";
import { getSupabaseClient } from "../lib/persistence/supabaseClient";
import {
  fetchEspressoState,
  upsertEspressoState
} from "../lib/persistence/espressoRepository";
import { fetchWeeklyLog } from "../lib/persistence/weeklyLogRepository";
import { loadSupabaseUserId } from "../lib/persistence/supabaseUserStorage";

export function WeeklyScoreDashboard() {
  const [model, setModel] = useState<ReturnType<
    typeof buildDashboardModel
  > | null>(null);
  const [weeklyLog, setWeeklyLog] = useState<ReturnType<
    typeof buildZeroWeeklyLog
  > | null>(null);
  const [espresso, setEspresso] = useState<EspressoState | null>(null);
  const [error, setError] = useState("");
  const [espressoError, setEspressoError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const log = loadWeeklyLog(window.localStorage);
        const espressoState = loadEspressoState(window.localStorage);
        if (isMounted) {
          setWeeklyLog(log);
          setEspresso(espressoState);
          setModel(buildModel(log, espressoState));
        }
      } catch (caught) {
        const message =
          caught instanceof Error ? caught.message : "Unable to load weekly log";
        if (isMounted) {
          if (message.includes("espresso")) {
            setEspressoError(message);
          } else {
            setError(message);
          }
        }
      }

      try {
        const userId = loadSupabaseUserId(window.localStorage);
        const client = getSupabaseClient();
        const remote = await fetchWeeklyLog(client, userId);
        const espressoState =
          espresso ?? loadEspressoState(window.localStorage);
        saveWeeklyLog(window.localStorage, remote);
        if (isMounted) {
          setWeeklyLog(remote);
          setEspresso(espressoState);
          setModel(buildModel(remote, espressoState));
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

      try {
        const userId = loadSupabaseUserId(window.localStorage);
        const client = getSupabaseClient();
        const remote = await fetchEspressoState(client, userId);
        const log = weeklyLog ?? loadWeeklyLog(window.localStorage);
        saveEspressoState(window.localStorage, remote);
        if (isMounted) {
          setEspresso(remote);
          setWeeklyLog(log);
          setModel(buildModel(log, remote));
        }
      } catch (caught) {
        const message =
          caught instanceof Error
            ? caught.message
            : "Unable to load espresso tracker from Supabase";
        if (isMounted) {
          setEspressoError(message);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleInitialize = () => {
    setError("");
    const log = buildZeroWeeklyLog();
    saveWeeklyLog(window.localStorage, log);
    setWeeklyLog(log);
    const espressoState = initializeEspressoState(getTodayIsoDate(), 2);
    saveEspressoState(window.localStorage, espressoState);
    setEspresso(espressoState);
    setModel(buildModel(log, espressoState));
    try {
      const userId = loadSupabaseUserId(window.localStorage);
      const client = getSupabaseClient();
      void upsertEspressoState(client, userId, espressoState).catch((caught) => {
        const message =
          caught instanceof Error
            ? caught.message
            : "Unable to save espresso tracker to Supabase";
        setEspressoError(message);
      });
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "Unable to save espresso tracker to Supabase";
      setEspressoError(message);
    }
  };

  const handleIncrementEspresso = () => {
    if (!weeklyLog || !espresso) {
      setEspressoError("Espresso tracker is not initialized.");
      return;
    }
    const next = {
      ...espresso,
      shotsToday: espresso.shotsToday + 1
    };
    saveEspressoState(window.localStorage, next);
    setEspresso(next);
    setModel(buildModel(weeklyLog, next));
    try {
      const userId = loadSupabaseUserId(window.localStorage);
      const client = getSupabaseClient();
      void upsertEspressoState(client, userId, next).catch((caught) => {
        const message =
          caught instanceof Error
            ? caught.message
            : "Unable to save espresso tracker to Supabase";
        setEspressoError(message);
      });
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "Unable to save espresso tracker to Supabase";
      setEspressoError(message);
    }
  };

  const handleResetEspresso = () => {
    if (!weeklyLog) {
      setEspressoError("Weekly log is not initialized.");
      return;
    }
    const next = initializeEspressoState(getTodayIsoDate(), 2);
    saveEspressoState(window.localStorage, next);
    setEspresso(next);
    setEspressoError("");
    setModel(buildModel(weeklyLog, next));
    try {
      const userId = loadSupabaseUserId(window.localStorage);
      const client = getSupabaseClient();
      void upsertEspressoState(client, userId, next).catch((caught) => {
        const message =
          caught instanceof Error
            ? caught.message
            : "Unable to save espresso tracker to Supabase";
        setEspressoError(message);
      });
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "Unable to save espresso tracker to Supabase";
      setEspressoError(message);
    }
  };

  if (!model) {
    const message = error || espressoError || "Loading weekly score...";
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Weekly Dashboard</h2>
        <p className="mt-2 text-sm text-slate-600">
          {message}
        </p>
        {weeklyLog && espressoError ? (
          <button
            type="button"
            className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            onClick={handleResetEspresso}
          >
            Initialize espresso tracker
          </button>
        ) : (
          <button
            type="button"
            className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            onClick={handleInitialize}
          >
            Initialize weekly log
          </button>
        )}
        <p className="mt-2 text-xs text-slate-500">
          Use the Weekly Score editor to enter your current servings.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <ProgressDashboard model={model} />
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
        <h3 className="text-sm font-semibold uppercase text-slate-500">
          Espresso tracker
        </h3>
        <p className="mt-2 text-sm text-slate-700">
          Track today&apos;s shots to match the 2-shot habit.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
            onClick={handleIncrementEspresso}
          >
            Add shot
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
            onClick={handleResetEspresso}
          >
            Reset for today
          </button>
        </div>
        {espressoError ? (
          <p className="mt-3 text-sm text-rose-600">{espressoError}</p>
        ) : null}
      </section>
    </div>
  );
}

function buildModel(log: WeeklyLog, espressoState: EspressoState) {
  const summary = buildWeeklyScoreSummary(log);
  return buildDashboardModel({
    summary,
    espresso: {
      shotsToday: espressoState.shotsToday,
      targetShots: espressoState.targetShots
    }
  });
}

function getTodayIsoDate(): string {
  const today = new Date();
  const year = today.getUTCFullYear();
  const month = String(today.getUTCMonth() + 1).padStart(2, "0");
  const day = String(today.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
