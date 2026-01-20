"use client";

import React, { useState } from "react";
import {
  CoachPersonality,
  RoutineAnchors,
  Sensitivities,
  buildCoachContext,
  type CoachContextPayload
} from "../lib/coachContext";
import { buildCoachPrompt, type CoachPrompt } from "../lib/coachPrompt";
import { DEFAULT_COACH_PERSONALITY } from "../lib/mindRules";
import { loadSetupState } from "../lib/setupStorage";
import { loadWeeklyLog } from "../lib/weeklyScoreStorage";

type ChatMessage = {
  role: "user" | "coach";
  text: string;
};

export function SmartCoachChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [promptPreview, setPromptPreview] = useState<CoachPrompt | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (draft.trim().length === 0) {
      setError("Please enter a lunch option.");
      return;
    }

    let context: CoachContextPayload;
    try {
      const setup = loadSetupState(window.localStorage);
      const weeklyLog = loadWeeklyLog(window.localStorage);
      const coachContext = buildCoachContext(
        new RoutineAnchors(setup.breakfastRoutine, setup.dinnerRoutine),
        new CoachPersonality(setup.coachPersonality),
        new Sensitivities(true, true),
        weeklyLog
      );
      context = coachContext.toJSON();
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "Unable to load context";
      setError(message);
      return;
    }

    const prompt = buildCoachPrompt(context, draft);
    setPromptPreview(prompt);

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", text: draft },
      { role: "coach", text: buildCoachReply(draft, context) }
    ];

    setMessages(nextMessages);
    setDraft("");
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-slate-900">Smart Coach</h2>
        <p className="text-sm text-slate-500">{DEFAULT_COACH_PERSONALITY}</p>
      </header>

      <div className="mt-6 flex flex-col gap-3">
        {messages.length === 0 ? (
          <p className="text-sm text-slate-500">
            Ask the coach to compare lunch options.
          </p>
        ) : (
          messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`rounded-lg px-4 py-3 text-sm ${
                message.role === "user"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-800"
              }`}
            >
              <span className="block text-xs uppercase tracking-wide opacity-70">
                {message.role}
              </span>
              {message.text}
            </div>
          ))
        )}
      </div>

      <form className="mt-6 flex flex-col gap-3" onSubmit={handleSubmit}>
        <textarea
          className="min-h-[90px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          placeholder="Office lunch is pizza or grilled chicken wrap..."
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button
          type="submit"
          className="self-start rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Ask coach
        </button>
      </form>

      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

      {promptPreview ? (
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">
          <p className="text-xs font-semibold uppercase text-slate-500">
            Prompt preview
          </p>
          <pre className="mt-2 whitespace-pre-wrap">
            {JSON.stringify(promptPreview, null, 2)}
          </pre>
        </div>
      ) : null}
    </section>
  );
}

function buildCoachReply(
  input: string,
  context: CoachContextPayload
): string {
  const normalized = input.toLowerCase();
  if (normalized.includes("beans")) {
    return `Beans are off-limits. Choose a bean-free option and add nuts or fish later. (noBeans=${context.sensitivities.noBeans})`;
  }
  if (normalized.includes("lactose") || normalized.includes("cheese")) {
    return `Avoid lactose. Pick the option without dairy and keep dinner light. (noLactose=${context.sensitivities.noLactose})`;
  }
  if (normalized.includes("fried")) {
    return "Fried food triggers a warning. If you proceed, plan a repair with extra greens.";
  }
  return "Pick the option that adds whole grains, fish, or leafy greens. I can help refine it.";
}
