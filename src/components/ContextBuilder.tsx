"use client";

import React, { useEffect, useState } from "react";
import { ContextPreview } from "./ContextPreview";
import {
  CoachPersonality,
  RoutineAnchors,
  Sensitivities,
  buildCoachContext,
  type CoachContextPayload
} from "../lib/coachContext";
import { loadSetupState } from "../lib/setupStorage";
import { loadWeeklyLog } from "../lib/weeklyScoreStorage";

export function ContextBuilder() {
  const [payload, setPayload] = useState<CoachContextPayload | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const setup = loadSetupState(window.localStorage);
      const weeklyLog = loadWeeklyLog(window.localStorage);
      const context = buildCoachContext(
        new RoutineAnchors(setup.breakfastRoutine, setup.dinnerRoutine),
        new CoachPersonality(setup.coachPersonality),
        new Sensitivities(true, true),
        weeklyLog
      );
      setPayload(context.toJSON());
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "Unable to load context";
      setError(message);
    }
  }, []);

  if (!payload) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          Context Builder
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {error || "Loading context from storage..."}
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <a
            href="/setup"
            className="rounded-lg border border-slate-200 px-3 py-2 text-slate-700"
          >
            Update setup
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

  return <ContextPreview payload={payload} />;
}
