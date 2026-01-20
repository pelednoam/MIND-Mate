import { describe, expect, it } from "vitest";
import {
  buildWeeklyScoreSummary,
  HEALTHY_CATEGORIES
} from "../src/lib/mindScore";
import { buildZeroWeeklyLog } from "../src/lib/weeklyScoreStorage";
import { buildSmartSuggestions } from "../src/lib/smartSuggestions";

describe("smartSuggestions", () => {
  it("returns top missing categories", () => {
    const log = buildZeroWeeklyLog().map((entry) => {
      const target = HEALTHY_CATEGORIES.find(
        (category) => category.id === entry.categoryId
      )?.weeklyTarget;
      if (target) {
        return { ...entry, servingsPerWeek: target };
      }
      return entry;
    });

    const adjusted = log.map((entry) =>
      ["berries", "fish", "nuts"].includes(entry.categoryId)
        ? { ...entry, servingsPerWeek: 0 }
        : entry
    );

    const summary = buildWeeklyScoreSummary(adjusted);
    const suggestions = buildSmartSuggestions(summary, 2);
    expect(suggestions.map((item) => item.categoryId)).toEqual([
      "nuts",
      "berries"
    ]);
  });
});
