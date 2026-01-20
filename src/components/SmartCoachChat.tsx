"use client";

import React, { useState } from "react";
import { DEFAULT_COACH_PERSONALITY } from "../lib/mindRules";

type ChatMessage = {
  role: "user" | "coach";
  text: string;
};

export function SmartCoachChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (draft.trim().length === 0) {
      setError("Please enter a lunch option.");
      return;
    }

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", text: draft },
      { role: "coach", text: buildCoachReply(draft) }
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
    </section>
  );
}

function buildCoachReply(input: string): string {
  const normalized = input.toLowerCase();
  if (normalized.includes("beans")) {
    return "Beans are off-limits. Choose a bean-free option and add nuts or fish later.";
  }
  if (normalized.includes("lactose") || normalized.includes("cheese")) {
    return "Avoid lactose. Pick the option without dairy and keep dinner light.";
  }
  if (normalized.includes("fried")) {
    return "Fried food triggers a warning. If you proceed, plan a repair with extra greens.";
  }
  return "Pick the option that adds whole grains, fish, or leafy greens. I can help refine it.";
}
