"use client";

import React, { useEffect, useState } from "react";
import {
  CoachPersonality,
  RoutineAnchors,
  Sensitivities,
  buildCoachContext
} from "../lib/coachContext";
import { buildCoachPrompt, type CoachPrompt } from "../lib/coachPrompt";
import { generateCoachResponse } from "../lib/coachResponder";
import { DEFAULT_COACH_PERSONALITY } from "../lib/mindRules";
import { loadSetupState } from "../lib/setupStorage";
import { loadWeeklyLog } from "../lib/weeklyScoreStorage";
import {
  loadChatHistory,
  saveChatHistory,
  type ChatMessage
} from "../lib/chatStorage";
import { getSupabaseClient } from "../lib/persistence/supabaseClient";
import {
  fetchChatHistory,
  upsertChatHistory
} from "../lib/persistence/chatRepository";
import { loadSupabaseUserId } from "../lib/persistence/supabaseUserStorage";
import {
  buildSmartSuggestions,
  type SmartSuggestion
} from "../lib/smartSuggestions";

export function SmartCoachChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [promptPreview, setPromptPreview] = useState<CoachPrompt | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [historyStatus, setHistoryStatus] = useState("");
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const history = loadChatHistory(window.localStorage);
        if (isMounted) {
          setMessages(history);
          setHistoryStatus("Loaded chat history.");
        }
      } catch (caught) {
        const message =
          caught instanceof Error
            ? caught.message
            : "Unable to load chat history";
        if (isMounted) {
          setHistoryStatus(message);
        }
      }

      try {
        const userId = loadSupabaseUserId(window.localStorage);
        const client = getSupabaseClient();
        const remote = await fetchChatHistory(client, userId);
        saveChatHistory(window.localStorage, remote);
        if (isMounted) {
          setMessages(remote);
          setHistoryStatus("Loaded chat history from Supabase.");
        }
      } catch (caught) {
        const message =
          caught instanceof Error
            ? caught.message
            : "Unable to load chat history from Supabase";
        if (isMounted) {
          setHistoryStatus(message);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
    setSuggestions(buildSmartSuggestions(context.weeklyGap, 3));
    setIsSending(true);

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error("Coach API request failed");
      }

      const data = (await response.json()) as { reply: string };
      const nextMessages: ChatMessage[] = [
        ...messages,
        { role: "user", text: draft },
        { role: "coach", text: data.reply }
      ];
      try {
        saveChatHistory(window.localStorage, nextMessages);
      } catch (historyError) {
        const message =
          historyError instanceof Error
            ? historyError.message
            : "Unable to save chat history";
        setError(message);
      }
      setMessages(nextMessages);
      setDraft("");
      void syncChatHistory(nextMessages).catch((caught) => {
        const message =
          caught instanceof Error
            ? caught.message
            : "Unable to save chat history to Supabase";
        setError(message);
      });
    } catch (caught) {
      const fallback = generateCoachResponse(prompt);
      const nextMessages: ChatMessage[] = [
        ...messages,
        { role: "user", text: draft },
        { role: "coach", text: fallback }
      ];
      try {
        saveChatHistory(window.localStorage, nextMessages);
      } catch (historyError) {
        const message =
          historyError instanceof Error
            ? historyError.message
            : "Unable to save chat history";
        setError(message);
      }
      setMessages(nextMessages);
      setError("Coach API unavailable, using local response.");
      void syncChatHistory(nextMessages).catch((caught) => {
        const message =
          caught instanceof Error
            ? caught.message
            : "Unable to save chat history to Supabase";
        setError(message);
      });
    } finally {
      setIsSending(false);
    }
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
          disabled={isSending}
        >
          {isSending ? "Sending..." : "Ask coach"}
        </button>
      </form>

      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
      {historyStatus ? (
        <p className="mt-2 text-xs text-slate-500">{historyStatus}</p>
      ) : null}

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
      {suggestions.length > 0 ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
          <p className="text-xs font-semibold uppercase text-slate-500">
            Smart suggestions
          </p>
          <ul className="mt-2 space-y-2">
            {suggestions.map((item) => (
              <li key={item.categoryId}>
                <span className="font-semibold">{item.label}:</span>{" "}
                {item.suggestion}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

async function syncChatHistory(messages: ChatMessage[]) {
  const userId = loadSupabaseUserId(window.localStorage);
  const client = getSupabaseClient();
  await upsertChatHistory(client, userId, messages);
}
