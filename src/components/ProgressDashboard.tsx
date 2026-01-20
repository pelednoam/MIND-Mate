import React from "react";
import type { DashboardModel } from "@/lib/dashboard";

type ProgressDashboardProps = {
  model: DashboardModel;
};

export function ProgressDashboard({ model }: ProgressDashboardProps) {
  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-slate-900">
          Weekly Progress Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Brain High Score: {model.brainHighScorePercent}%
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Progress Rings
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {model.progressRings.map((ring) => (
            <div
              key={ring.id}
              className="rounded-lg border border-slate-100 bg-slate-50 p-4"
            >
              <p className="text-sm font-semibold text-slate-800">
                {ring.label}
                {ring.isRemoved ? " (removed)" : ""}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {ring.servingsPerWeek}/{ring.target} servings
              </p>
              <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-slate-900"
                  style={{ width: `${ring.progressRatio * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Limit Budgets</h2>
        <div className="mt-4 grid gap-3">
          {model.limitBars.map((bar) => (
            <div
              key={bar.id}
              className="rounded-lg border border-slate-100 bg-slate-50 p-4"
            >
              <div className="flex items-center justify-between text-sm font-medium text-slate-700">
                <span>{bar.label}</span>
                <span>
                  {bar.servingsPerWeek}/{bar.weeklyLimit}
                </span>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
                <div
                  className={`h-2 rounded-full ${
                    bar.isExceeded ? "bg-rose-500" : "bg-amber-500"
                  }`}
                  style={{ width: `${Math.min(1, bar.percentUsed) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Espresso Tracker
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {model.espressoTracker.shotsToday} of{" "}
          {model.espressoTracker.targetShots} shots logged.
        </p>
        <p className="text-xs text-slate-500">
          Remaining shots: {model.espressoTracker.remainingShots}
        </p>
      </section>
    </section>
  );
}
