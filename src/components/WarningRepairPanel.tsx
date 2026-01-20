import React from "react";
import type { WarningRepairDecision } from "../lib/warningRepair";

type WarningRepairPanelProps = {
  decisions: WarningRepairDecision[];
};

export function WarningRepairPanel({ decisions }: WarningRepairPanelProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">
        Warning & Repair
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Trigger warnings when limit foods exceed weekly thresholds.
      </p>

      <div className="mt-4 grid gap-4">
        {decisions.map((decision) => (
          <div
            key={decision.limitFood}
            className={`rounded-lg border p-4 ${
              decision.shouldWarn
                ? "border-rose-200 bg-rose-50"
                : "border-emerald-200 bg-emerald-50"
            }`}
          >
            <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
              <span>{decision.label}</span>
              <span>
                {decision.servingsAfterSelection}/{decision.weeklyLimit}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {decision.shouldWarn ? decision.warning : "Within weekly limit."}
            </p>
            {decision.shouldWarn ? (
              <p className="mt-1 text-sm text-slate-600">{decision.repair}</p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
