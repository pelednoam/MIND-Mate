"use client";

import React, { useEffect, useState } from "react";
import { buildDashboardModel } from "../lib/dashboard";
import { buildWeeklyScoreSummary } from "../lib/mindScore";
import {
  buildZeroWeeklyLog,
  loadWeeklyLog,
  saveWeeklyLog
} from "../lib/weeklyScoreStorage";
import { ProgressDashboard } from "./ProgressDashboard";

export function WeeklyScoreDashboard() {
  const [model, setModel] = useState<ReturnType<
    typeof buildDashboardModel
  > | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const log = loadWeeklyLog(window.localStorage);
      const summary = buildWeeklyScoreSummary(log);
      setModel(
        buildDashboardModel({
          summary,
          espresso: { shotsToday: 0, targetShots: 2 }
        })
      );
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "Unable to load weekly log";
      setError(message);
    }
  }, []);

  const handleInitialize = () => {
    setError("");
    const log = buildZeroWeeklyLog();
    saveWeeklyLog(window.localStorage, log);
    const summary = buildWeeklyScoreSummary(log);
    setModel(
      buildDashboardModel({
        summary,
        espresso: { shotsToday: 0, targetShots: 2 }
      })
    );
  };

  if (!model) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Weekly Dashboard</h2>
        <p className="mt-2 text-sm text-slate-600">
          {error || "Loading weekly score..."}
        </p>
        <button
          type="button"
          className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          onClick={handleInitialize}
        >
          Initialize weekly log
        </button>
        <p className="mt-2 text-xs text-slate-500">
          Use the Weekly Score editor to enter your current servings.
        </p>
      </section>
    );
  }

  return <ProgressDashboard model={model} />;
}
