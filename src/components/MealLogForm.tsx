"use client";

import React, { useState } from "react";
import { createMealLogEntry, type MealType } from "../lib/mealLogging";
import { HEALTHY_CATEGORIES } from "../lib/mindScore";
import { WARNING_REPAIR_ENGINE, type LimitFood } from "../lib/mindRules";

type MealDraft = {
  mealType: MealType;
  label: string;
  date: string;
  containsBeans: boolean;
  containsLactose: boolean;
  healthyCategories: string[];
  limitFoods: LimitFood[];
};

const INITIAL_DRAFT: MealDraft = {
  mealType: "lunch",
  label: "",
  date: "",
  containsBeans: false,
  containsLactose: false,
  healthyCategories: [],
  limitFoods: []
};

export function MealLogForm() {
  const [draft, setDraft] = useState<MealDraft>(INITIAL_DRAFT);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatus("");

    try {
      const entry = createMealLogEntry({
        id: crypto.randomUUID(),
        mealType: draft.mealType,
        label: draft.label,
        date: draft.date,
        healthyCategories: draft.healthyCategories,
        limitFoods: draft.limitFoods,
        containsBeans: draft.containsBeans,
        containsLactose: draft.containsLactose
      });

      setStatus(`Logged ${entry.mealType}: ${entry.label}`);
      setDraft(INITIAL_DRAFT);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unexpected error");
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Meal Logging</h2>
      <p className="mt-1 text-sm text-slate-500">
        Capture meals while enforcing No Beans and No Lactose.
      </p>

      <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className="text-sm text-slate-600">
          Meal type
          <select
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            value={draft.mealType}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                mealType: event.target.value as MealType
              }))
            }
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </label>

        <label className="text-sm text-slate-600">
          Meal label
          <input
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            value={draft.label}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, label: event.target.value }))
            }
            placeholder="Grilled chicken wrap"
          />
        </label>

        <label className="text-sm text-slate-600">
          Date (YYYY-MM-DD)
          <input
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            value={draft.date}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, date: event.target.value }))
            }
            placeholder="2026-01-20"
          />
        </label>

        <div className="flex flex-wrap gap-4 text-xs text-slate-600">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={draft.containsBeans}
              onChange={() =>
                setDraft((prev) => ({
                  ...prev,
                  containsBeans: !prev.containsBeans
                }))
              }
              className="h-4 w-4 accent-slate-600"
            />
            Contains beans
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={draft.containsLactose}
              onChange={() =>
                setDraft((prev) => ({
                  ...prev,
                  containsLactose: !prev.containsLactose
                }))
              }
              className="h-4 w-4 accent-slate-600"
            />
            Contains lactose
          </label>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Healthy categories
          </p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
            {HEALTHY_CATEGORIES.map((category) => (
              <label key={category.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={draft.healthyCategories.includes(category.id)}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      healthyCategories: event.target.checked
                        ? [...prev.healthyCategories, category.id]
                        : prev.healthyCategories.filter(
                            (item) => item !== category.id
                          )
                    }))
                  }
                  className="h-4 w-4 accent-slate-600"
                />
                {category.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Limit foods
          </p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
            {WARNING_REPAIR_ENGINE.map((rule) => (
              <label key={rule.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={draft.limitFoods.includes(rule.id)}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      limitFoods: event.target.checked
                        ? [...prev.limitFoods, rule.id]
                        : prev.limitFoods.filter((item) => item !== rule.id)
                    }))
                  }
                  className="h-4 w-4 accent-slate-600"
                />
                {rule.label}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="self-start rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Log meal
        </button>
      </form>

      {status ? <p className="mt-4 text-sm text-emerald-600">{status}</p> : null}
      {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
    </section>
  );
}
