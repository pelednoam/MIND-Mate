import type { LimitFood } from "./mindRules";
import { getWarningAndRepair } from "./mindRules";
import type { HealthyGap, WeeklyScoreSummary } from "./mindScore";
import { RoutineAnchors } from "./coachContext";

export type NudgeTime = "morning" | "pre_lunch" | "afternoon" | "evening";

export type NudgeMessage = {
  time: NudgeTime;
  title: string;
  body: string;
  tags: string[];
};

export type NudgeContext = {
  routine: RoutineAnchors;
  weeklyGap: WeeklyScoreSummary;
  lunchLimitFoods: LimitFood[];
};

export function buildDailyNudges(context: NudgeContext): NudgeMessage[] {
  ensureUniqueLimitFoods(context.lunchLimitFoods);

  return [
    buildMorningNudge(context),
    buildPreLunchNudge(),
    buildAfternoonNudge(context),
    buildEveningNudge(context)
  ];
}

function buildMorningNudge(context: NudgeContext): NudgeMessage {
  const priorities = ["nuts", "berries", "whole_grains"] as const;
  const gap = findFirstGap(context.weeklyGap, priorities);

  if (!gap) {
    return {
      time: "morning",
      title: "Breakfast on track",
      body: `Stick with your breakfast anchor: ${context.routine.breakfast}.`,
      tags: ["breakfast", "anchor"]
    };
  }

  const suggestion = getBreakfastBooster(gap);
  return {
    time: "morning",
    title: "Breakfast booster",
    body: `${suggestion} Pair it with ${context.routine.breakfast}.`,
    tags: ["breakfast", gap.categoryId]
  };
}

function buildPreLunchNudge(): NudgeMessage {
  return {
    time: "pre_lunch",
    title: "Office lunch reminder",
    body:
      "Aim for fish, nuts, or whole grains. Skip beans and lactose to stay within your sensitivities.",
    tags: ["lunch", "office", "no-beans", "no-lactose"]
  };
}

function buildAfternoonNudge(context: NudgeContext): NudgeMessage {
  const priorities = ["nuts", "berries"] as const;
  const gap = findFirstGap(context.weeklyGap, priorities);

  if (!gap) {
    return {
      time: "afternoon",
      title: "Snack check-in",
      body: "Snack only if you need it. Keep it light and controlled.",
      tags: ["snack"]
    };
  }

  const suggestion = gap.categoryId === "nuts" ? "Grab nuts" : "Add berries";
  return {
    time: "afternoon",
    title: "Snack booster",
    body: `${suggestion} to close your weekly gap.`,
    tags: ["snack", gap.categoryId]
  };
}

function buildEveningNudge(context: NudgeContext): NudgeMessage {
  if (context.lunchLimitFoods.length === 0) {
    return {
      time: "evening",
      title: "Dinner optimization",
      body: `Lean on your dinner anchor: ${context.routine.dinner}.`,
      tags: ["dinner", "anchor"]
    };
  }

  const repairs = context.lunchLimitFoods.map((limitFood) => {
    const rule = getWarningAndRepair(limitFood);
    return rule.repair;
  });

  return {
    time: "evening",
    title: "Repair dinner",
    body: repairs.join(" "),
    tags: ["dinner", "repair"]
  };
}

function findFirstGap(
  weeklyGap: WeeklyScoreSummary,
  priorities: readonly HealthyGap["categoryId"][]
): HealthyGap | undefined {
  for (const categoryId of priorities) {
    const gap = weeklyGap.healthyGaps.find(
      (entry) => entry.categoryId === categoryId
    );
    if (!gap) {
      throw new Error(`Missing weekly gap for ${categoryId}`);
    }
    if (gap.missingServings > 0) {
      return gap;
    }
  }
  return undefined;
}

function getBreakfastBooster(gap: HealthyGap): string {
  switch (gap.categoryId) {
    case "nuts":
      return "Add walnuts or almonds";
    case "berries":
      return "Add a handful of berries";
    case "whole_grains":
      return "Choose a whole-grain topping";
    default:
      throw new Error(`Unsupported breakfast booster: ${gap.categoryId}`);
  }
}

function ensureUniqueLimitFoods(limitFoods: LimitFood[]): void {
  const seen: LimitFood[] = [];
  for (const limitFood of limitFoods) {
    if (seen.includes(limitFood)) {
      throw new Error(`Duplicate limit food: ${limitFood}`);
    }
    seen.push(limitFood);
  }
}
