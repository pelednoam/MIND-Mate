"use client";

import React, { useEffect, useState } from "react";
import { NudgePreview } from "./NudgePreview";
import { RoutineAnchors } from "../lib/coachContext";
import { buildDailyNudges } from "../lib/proactiveNudges";
import { buildWeeklyScoreSummary } from "../lib/mindScore";
import { loadSetupState } from "../lib/setupStorage";
import { loadWeeklyLog } from "../lib/weeklyScoreStorage";
import { loadMealLogs } from "../lib/mealLogStorage";
import { getLatestLunchLimitFoods } from "../lib/mealLogReader";
import type { NudgeMessage } from "../lib/proactiveNudges";

export function NudgeSchedule() {
  const [nudges, setNudges] = useState<NudgeMessage[] | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const setup = loadSetupState(window.localStorage);
      const weeklyLog = loadWeeklyLog(window.localStorage);
      const mealLogs = loadMealLogs(window.localStorage);
      const lunchSummary = getLatestLunchLimitFoods(mealLogs);
      if (!lunchSummary.hasLunch) {
        setStatus("No lunch logs yet. Dinner nudge will use anchors only.");
      }
      const weeklyGap = buildWeeklyScoreSummary(weeklyLog);
      const dailyNudges = buildDailyNudges({
        routine: new RoutineAnchors(setup.breakfastRoutine, setup.dinnerRoutine),
        weeklyGap,
        lunchLimitFoods: lunchSummary.limitFoods
      });
      setNudges(dailyNudges);
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "Unable to load nudges";
      setError(message);
    }
  }, []);

  if (!nudges) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          Proactive Nudge Schedule
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {error || "Loading nudges from storage..."}
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <a
            href="/setup"
            className="rounded-lg border border-slate-200 px-3 py-2 text-slate-700"
          >
            Update setup
          </a>
          <a
            href="/log"
            className="rounded-lg border border-slate-200 px-3 py-2 text-slate-700"
          >
            Log a lunch
          </a>
          <a
            href="/scores"
            className="rounded-lg border border-slate-200 px-3 py-2 text-slate-700"
          >
            Update weekly score
          </a>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      {status ? <p className="text-sm text-amber-600">{status}</p> : null}
      <NudgePreview nudges={nudges} />
    </div>
  );
}
