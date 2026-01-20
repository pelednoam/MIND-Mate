import React from "react";
import type { NudgeMessage } from "../lib/proactiveNudges";

type NudgePreviewProps = {
  nudges: NudgeMessage[];
};

export function NudgePreview({ nudges }: NudgePreviewProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">
        Proactive Nudge Schedule
      </h2>
      <div className="mt-4 grid gap-4">
        {nudges.map((nudge) => (
          <div
            key={nudge.time}
            className="rounded-lg border border-slate-100 bg-slate-50 p-4"
          >
            <p className="text-xs font-semibold uppercase text-slate-500">
              {nudge.time.replace("_", " ")}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {nudge.title}
            </p>
            <p className="mt-2 text-sm text-slate-600">{nudge.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
