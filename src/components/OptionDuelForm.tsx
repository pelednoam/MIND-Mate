"use client";

import React, { useEffect, useState } from "react";
import { evaluateLunchOptions, type LunchOption } from "../lib/optionDuel";
import { HEALTHY_CATEGORIES, type HealthyCategoryId } from "../lib/mindScore";
import { WARNING_REPAIR_ENGINE, type LimitFood } from "../lib/mindRules";
import type { OptionDuelDecision } from "../lib/optionDuel";
import { applyMealSelection } from "../lib/weeklyLogUpdater";
import { loadWeeklyLog, saveWeeklyLog } from "../lib/weeklyScoreStorage";
import { getLimitServingsFromWeeklyLog } from "../lib/weeklyLogReader";

type OptionInput = {
  id: string;
  label: string;
  containsBeans: boolean;
  containsLactose: boolean;
  healthyCategories: HealthyCategoryId[];
  limitFoods: LimitFood[];
};

const INITIAL_OPTIONS: OptionInput[] = [
  {
    id: "option_1",
    label: "",
    containsBeans: false,
    containsLactose: false,
    healthyCategories: [],
    limitFoods: []
  },
  {
    id: "option_2",
    label: "",
    containsBeans: false,
    containsLactose: false,
    healthyCategories: [],
    limitFoods: []
  },
  {
    id: "option_3",
    label: "",
    containsBeans: false,
    containsLactose: false,
    healthyCategories: [],
    limitFoods: []
  }
];

export function OptionDuelForm() {
  const [options, setOptions] = useState<OptionInput[]>(INITIAL_OPTIONS);
  const [includeThird, setIncludeThird] = useState(false);
  const [currentLimitServings, setCurrentLimitServings] = useState({
    red_meat: 0,
    fried_food: 0
  });
  const [decision, setDecision] = useState<OptionDuelDecision | null>(null);
  const [error, setError] = useState("");
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [evaluatedOptions, setEvaluatedOptions] = useState<LunchOption[]>([]);
  const [applyStatus, setApplyStatus] = useState("");
  const [applyError, setApplyError] = useState("");
  const [limitStatus, setLimitStatus] = useState("");
  const [limitError, setLimitError] = useState("");

  useEffect(() => {
    try {
      const log = loadWeeklyLog(window.localStorage);
      const limits = getLimitServingsFromWeeklyLog(log);
      setCurrentLimitServings(limits);
      setLimitStatus("Loaded current limits from weekly log.");
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "Unable to load weekly log limits";
      setLimitError(message);
    }
  }, []);

  const handleOptionLabelChange = (index: number, value: string) => {
    setOptions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], label: value };
      return updated;
    });
  };

  const handleOptionToggle = (
    index: number,
    field: "containsBeans" | "containsLactose"
  ) => {
    setOptions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: !updated[index][field] };
      return updated;
    });
  };

  const handleCategoryToggle = (
    index: number,
    categoryId: HealthyCategoryId,
    isChecked: boolean
  ) => {
    setOptions((prev) => {
      const updated = [...prev];
      const nextCategories = isChecked
        ? [...updated[index].healthyCategories, categoryId]
        : updated[index].healthyCategories.filter(
            (category) => category !== categoryId
          );
      updated[index] = { ...updated[index], healthyCategories: nextCategories };
      return updated;
    });
  };

  const handleLimitFoodToggle = (
    index: number,
    limitFood: LimitFood,
    isChecked: boolean
  ) => {
    setOptions((prev) => {
      const updated = [...prev];
      const nextLimitFoods = isChecked
        ? [...updated[index].limitFoods, limitFood]
        : updated[index].limitFoods.filter((item) => item !== limitFood);
      updated[index] = { ...updated[index], limitFoods: nextLimitFoods };
      return updated;
    });
  };

  const handleLimitServingsChange = (
    field: "red_meat" | "fried_food",
    value: string
  ) => {
    const parsed = Number(value);
    setCurrentLimitServings((prev) => ({
      ...prev,
      [field]: Number.isFinite(parsed) ? parsed : 0
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setApplyStatus("");
    setApplyError("");

    const activeOptions = includeThird
      ? options
      : options.slice(0, 2);

    try {
    const payload = activeOptions.map((option) => mapToLunchOption(option));
      const result = evaluateLunchOptions(payload, currentLimitServings);
      setDecision(result);
      setEvaluatedOptions(payload);
      setSelectedOptionId(result.winnerId);
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "Unexpected error";
      setDecision(null);
      setEvaluatedOptions([]);
      setSelectedOptionId("");
      setError(message);
    }
  };

  const handleApplySelection = () => {
    setApplyStatus("");
    setApplyError("");
    if (!decision) {
      setApplyError("Run an option duel before applying.");
      return;
    }
    const selected = evaluatedOptions.find(
      (option) => option.id === selectedOptionId
    );
    if (!selected) {
      setApplyError("Selected option not found.");
      return;
    }

    try {
      const log = loadWeeklyLog(window.localStorage);
      const updated = applyMealSelection(log, {
        healthyCategories: selected.healthyCategories,
        limitFoods: selected.limitFoods
      });
      saveWeeklyLog(window.localStorage, updated);
      setApplyStatus(`Applied ${selected.label} to weekly log.`);
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "Unable to update weekly log";
      setApplyError(message);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Option Duel</h2>
      <p className="mt-1 text-sm text-slate-500">
        Compare office lunch options and get the MIND winner.
      </p>

      <form className="mt-6 flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <input
            id="include-third"
            type="checkbox"
            checked={includeThird}
            onChange={() => setIncludeThird((prev) => !prev)}
            className="h-4 w-4 accent-slate-600"
          />
          <label htmlFor="include-third">Include a third option</label>
        </div>

        {options.slice(0, includeThird ? 3 : 2).map((option, index) => (
          <div
            key={option.id}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <label className="text-sm font-medium text-slate-700">
              Option {index + 1}
              <input
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                placeholder="Grilled chicken wrap"
                value={option.label}
                onChange={(event) =>
                  handleOptionLabelChange(index, event.target.value)
                }
              />
            </label>

            <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-600">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={option.containsBeans}
                  onChange={() => handleOptionToggle(index, "containsBeans")}
                  className="h-4 w-4 accent-slate-600"
                />
                Contains beans
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={option.containsLactose}
                  onChange={() => handleOptionToggle(index, "containsLactose")}
                  className="h-4 w-4 accent-slate-600"
                />
                Contains lactose
              </label>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Healthy categories
              </p>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
                {HEALTHY_CATEGORIES.map((category) => (
                  <label key={category.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={option.healthyCategories.includes(category.id)}
                      onChange={(event) =>
                        handleCategoryToggle(
                          index,
                          category.id,
                          event.target.checked
                        )
                      }
                      className="h-4 w-4 accent-slate-600"
                    />
                    {category.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Limit foods
              </p>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
                {WARNING_REPAIR_ENGINE.map((rule) => (
                  <label key={rule.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={option.limitFoods.includes(rule.id)}
                      onChange={(event) =>
                        handleLimitFoodToggle(
                          index,
                          rule.id,
                          event.target.checked
                        )
                      }
                      className="h-4 w-4 accent-slate-600"
                    />
                    {rule.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase text-slate-500">
            Current weekly limit servings
          </p>
          {limitStatus ? (
            <p className="mt-2 text-xs text-emerald-600">{limitStatus}</p>
          ) : null}
          {limitError ? (
            <p className="mt-2 text-xs text-rose-600">{limitError}</p>
          ) : null}
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-slate-600">
              Red meat
              <input
                type="number"
                min="0"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                value={currentLimitServings.red_meat}
                onChange={(event) =>
                  handleLimitServingsChange("red_meat", event.target.value)
                }
              />
            </label>
            <label className="text-sm text-slate-600">
              Fried food
              <input
                type="number"
                min="0"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                value={currentLimitServings.fried_food}
                onChange={(event) =>
                  handleLimitServingsChange("fried_food", event.target.value)
                }
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="self-start rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          Evaluate options
        </button>
      </form>

      {error ? (
        <p className="mt-4 text-sm text-rose-600">{error}</p>
      ) : null}

      {decision ? (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <p className="font-semibold">MIND Winner: {decision.winnerId}</p>
          <ul className="mt-2 list-disc pl-5 text-xs text-emerald-900">
            {decision.rankings.map((ranking) => (
              <li key={ranking.id}>
                {ranking.label || ranking.id}: score {ranking.score}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {decision ? (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
          <label className="text-xs font-semibold uppercase text-slate-500">
            Apply selection to weekly log
            <select
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              value={selectedOptionId}
              onChange={(event) => setSelectedOptionId(event.target.value)}
            >
              {decision.rankings.map((ranking) => (
                <option key={ranking.id} value={ranking.id}>
                  {ranking.label || ranking.id}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            onClick={handleApplySelection}
          >
            Apply selection
          </button>
          {applyStatus ? (
            <p className="mt-2 text-sm text-emerald-600">{applyStatus}</p>
          ) : null}
          {applyError ? (
            <p className="mt-2 text-sm text-rose-600">{applyError}</p>
          ) : null}

          {selectedOptionId ? (
            <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
              <p className="font-semibold text-slate-700">
                Warning & Repair guidance
              </p>
              {decision.rankings
                .find((ranking) => ranking.id === selectedOptionId)
                ?.warnings.filter((warning) => warning.shouldWarn).length ? (
                <ul className="mt-2 list-disc pl-4">
                  {decision.rankings
                    .find((ranking) => ranking.id === selectedOptionId)
                    ?.warnings.filter((warning) => warning.shouldWarn)
                    .map((warning) => (
                      <li key={warning.limitFood}>
                        {warning.warning} {warning.repair}
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="mt-2">No limit warnings for this selection.</p>
              )}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function mapToLunchOption(option: OptionInput): LunchOption {
  if (option.label.trim().length === 0) {
    throw new Error(`Missing label for ${option.id}`);
  }

  return {
    id: option.id,
    label: option.label,
    containsBeans: option.containsBeans,
    containsLactose: option.containsLactose,
    healthyCategories: option.healthyCategories,
    limitFoods: option.limitFoods
  };
}
