import { REMOVED_CATEGORIES } from "./mindScore";
import type { WeeklyScoreSummary } from "./mindScore";

export type ProgressRing = {
  id: string;
  label: string;
  servingsPerWeek: number;
  target: number;
  progressRatio: number;
  isRemoved: boolean;
};

export type LimitBar = {
  id: string;
  label: string;
  servingsPerWeek: number;
  weeklyLimit: number;
  remainingServings: number;
  percentUsed: number;
  isExceeded: boolean;
};

export type EspressoTracker = {
  shotsToday: number;
  targetShots: number;
  remainingShots: number;
  isComplete: boolean;
};

export type DashboardModel = {
  progressRings: ProgressRing[];
  limitBars: LimitBar[];
  espressoTracker: EspressoTracker;
  brainHighScorePercent: number;
};

export type DashboardInput = {
  summary: WeeklyScoreSummary;
  espresso: {
    shotsToday: number;
    targetShots: number;
  };
};

export function buildDashboardModel(input: DashboardInput): DashboardModel {
  if (!Number.isFinite(input.espresso.shotsToday)) {
    throw new Error("Invalid espresso shots value");
  }
  if (!Number.isFinite(input.espresso.targetShots)) {
    throw new Error("Invalid espresso target value");
  }
  if (input.espresso.shotsToday < 0) {
    throw new Error("Negative espresso shots value");
  }
  if (input.espresso.targetShots <= 0) {
    throw new Error("Espresso target must be positive");
  }

  const progressRings = [
    ...input.summary.healthyGaps.map((gap) => {
      if (gap.weeklyTarget <= 0) {
        throw new Error(`Invalid weekly target for ${gap.categoryId}`);
      }
      const ratio = Math.min(1, gap.servingsPerWeek / gap.weeklyTarget);
      return {
        id: gap.categoryId,
        label: gap.label,
        servingsPerWeek: gap.servingsPerWeek,
        target: gap.weeklyTarget,
        progressRatio: ratio,
        isRemoved: false
      };
    }),
    ...REMOVED_CATEGORIES.map((removed) => ({
      id: removed.id,
      label: removed.label,
      servingsPerWeek: 0,
      target: removed.weeklyTarget,
      progressRatio: 0,
      isRemoved: true
    }))
  ];

  const limitBars = input.summary.limitBudgets.map((budget) => {
    if (budget.weeklyLimit <= 0) {
      throw new Error(`Invalid weekly limit for ${budget.categoryId}`);
    }
    return {
      id: budget.categoryId,
      label: budget.label,
      servingsPerWeek: budget.servingsPerWeek,
      weeklyLimit: budget.weeklyLimit,
      remainingServings: budget.remainingServings,
      percentUsed: budget.servingsPerWeek / budget.weeklyLimit,
      isExceeded: budget.isExceeded
    };
  });

  const espressoTracker = {
    shotsToday: input.espresso.shotsToday,
    targetShots: input.espresso.targetShots,
    remainingShots: Math.max(0, input.espresso.targetShots - input.espresso.shotsToday),
    isComplete: input.espresso.shotsToday >= input.espresso.targetShots
  };

  const brainHighScorePercent = calculateBrainHighScore(input.summary);

  return {
    progressRings,
    limitBars,
    espressoTracker,
    brainHighScorePercent
  };
}

function calculateBrainHighScore(summary: WeeklyScoreSummary): number {
  const ratios = summary.healthyGaps.map((gap) => {
    if (gap.weeklyTarget <= 0) {
      throw new Error(`Invalid weekly target for ${gap.categoryId}`);
    }
    return Math.min(1, gap.servingsPerWeek / gap.weeklyTarget);
  });
  const total = ratios.reduce((acc, value) => acc + value, 0);
  return Math.round((total / ratios.length) * 100);
}
