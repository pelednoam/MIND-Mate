import React from "react";
import type { CoachContextPayload } from "../lib/coachContext";

type ContextPreviewProps = {
  payload: CoachContextPayload;
};

export function ContextPreview({ payload }: ContextPreviewProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">
        LLM Context Preview
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        Sensitivities: No Beans ={" "}
        {payload.sensitivities.noBeans ? "true" : "false"}, No Lactose ={" "}
        {payload.sensitivities.noLactose ? "true" : "false"}
      </p>
      <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-4 text-xs text-slate-700">
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(payload, null, 2)}
        </pre>
      </div>
    </section>
  );
}
