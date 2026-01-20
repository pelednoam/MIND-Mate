"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import {
  DAILY_ANCHORS,
  DEFAULT_COACH_PERSONALITY,
  LIFESTYLE,
  SCORING_ADJUSTMENT,
  SENSITIVITY_TOGGLES,
  WARNING_REPAIR_ENGINE
} from "@/lib/mindRules";

type SetupFormState = {
  breakfastRoutine: string;
  dinnerRoutine: string;
  coachPersonality: string;
};

const INITIAL_BREAKFAST = DAILY_ANCHORS.breakfast.join(", ");
const INITIAL_DINNER = DAILY_ANCHORS.dinner.join(", ");

export function SetupScreen() {
  const [formState, setFormState] = useState<SetupFormState>({
    breakfastRoutine: INITIAL_BREAKFAST,
    dinnerRoutine: INITIAL_DINNER,
    coachPersonality: DEFAULT_COACH_PERSONALITY
  });
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange =
    (field: keyof SetupFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState((prev) => ({
        ...prev,
        [field]: event.target.value
      }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage("Setup saved locally (placeholder).");
  };

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            MIND-Mate Setup
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Build your routine and coach personality
          </h1>
          <p className="text-base text-slate-600">
            This screen hard-codes the MIND constraints from the spec, including
            No Beans, No Lactose, and the Warning and Repair engine for limit
            foods.
          </p>
        </header>

        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-slate-900">
                Routine Builder
              </h2>
              <p className="text-sm text-slate-500">
                Set the default anchors for breakfast and dinner.
              </p>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Breakfast routine
                <input
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  type="text"
                  value={formState.breakfastRoutine}
                  onChange={handleChange("breakfastRoutine")}
                  placeholder="Whole-grain toast, lactose-free yogurt"
                />
                <span className="text-xs font-normal text-slate-500">
                  Anchor options: {DAILY_ANCHORS.breakfast.join(", ")}.
                </span>
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Dinner routine
                <input
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  type="text"
                  value={formState.dinnerRoutine}
                  onChange={handleChange("dinnerRoutine")}
                  placeholder="Spinach salad, omelet"
                />
                <span className="text-xs font-normal text-slate-500">
                  Anchor options: {DAILY_ANCHORS.dinner.join(", ")}.
                </span>
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-slate-900">
                Coach Personality
              </h2>
              <p className="text-sm text-slate-500">
                Edit the system prompt that powers the proactive coach.
              </p>
            </div>
            <textarea
              className="mt-6 min-h-[140px] w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              value={formState.coachPersonality}
              onChange={handleChange("coachPersonality")}
            />
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-slate-900">
                Medical Sensitivities
              </h2>
              <p className="text-sm text-slate-500">
                These filters are enforced at the logic layer and cannot be
                disabled.
              </p>
            </div>
            <div className="mt-5 grid gap-3">
              {SENSITIVITY_TOGGLES.map((toggle) => (
                <label
                  key={toggle.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                >
                  <span>{toggle.label}</span>
                  <span className="flex items-center gap-2 text-xs text-slate-500">
                    <input
                      type="checkbox"
                      checked={toggle.enforced}
                      disabled
                      className="h-4 w-4 accent-slate-500"
                    />
                    Enforced
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-slate-900">
                Logic Engine Notes
              </h2>
              <p className="text-sm text-slate-500">
                These rules are required for weekly scoring and repair logic.
              </p>
            </div>
            <div className="mt-6 grid gap-4 text-sm text-slate-600">
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="font-medium text-slate-800">Lifestyle</p>
                <p>Lunch context: {LIFESTYLE.lunch}.</p>
                <p>Snack style: {LIFESTYLE.snacks}.</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="font-medium text-slate-800">
                  Weekly scoring adjustment
                </p>
                <p>
                  {SCORING_ADJUSTMENT.removedCategory} points are redistributed
                  to {SCORING_ADJUSTMENT.redistributedTo.join(" and ")}.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="font-medium text-slate-800">
                  Warning and Repair engine
                </p>
                <ul className="mt-2 grid gap-3">
                  {WARNING_REPAIR_ENGINE.map((rule) => (
                    <li key={rule.id} className="rounded-lg bg-white px-3 py-3">
                      <p className="font-semibold text-slate-800">
                        {rule.label} (limit:{" "}
                        {rule.weeklyLimit === 1
                          ? "< 1 per week"
                          : `< ${rule.weeklyLimit} per week`}
                        )
                      </p>
                      <p>{rule.warning}</p>
                      <p>{rule.repair}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap items-center gap-4">
            <button
              className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              type="submit"
            >
              Save setup
            </button>
            {statusMessage ? (
              <span className="text-sm text-slate-600">{statusMessage}</span>
            ) : null}
          </div>
        </form>
      </div>
    </main>
  );
}
