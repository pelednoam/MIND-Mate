"use client";

import React, { useEffect, useState } from "react";
import { WarningRepairPanel } from "./WarningRepairPanel";
import { evaluateLimitSelection } from "../lib/warningRepair";
import { loadWeeklyLog } from "../lib/weeklyScoreStorage";
import { getLimitServingsFromWeeklyLog } from "../lib/weeklyLogReader";
import type { WarningRepairDecision } from "../lib/warningRepair";

export function WarningRepairStatus() {
  const [decisions, setDecisions] = useState<WarningRepairDecision[] | null>(
    null
  );
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const weeklyLog = loadWeeklyLog(window.localStorage);
      const limits = getLimitServingsFromWeeklyLog(weeklyLog);
      const nextDecisions = [
        evaluateLimitSelection("red_meat", limits.red_meat),
        evaluateLimitSelection("fried_food", limits.fried_food)
      ];
      setDecisions(nextDecisions);
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "Unable to load warnings";
      setError(message);
    }
  }, []);

  if (!decisions) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          Warning & Repair
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {error || "Loading warning and repair status..."}
        </p>
        <a
          href="/scores"
          className="mt-4 inline-flex rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
        >
          Update weekly score
        </a>
      </section>
    );
  }

  return <WarningRepairPanel decisions={decisions} />;
}
