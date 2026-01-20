import { SCORING_ADJUSTMENT, WARNING_REPAIR_ENGINE } from "./mindRules";
import {
  REMOVED_CATEGORIES,
  buildWeeklyScoreSummary,
  createWeeklyLog,
  type WeeklyEntry,
  type WeeklyScoreSummary
} from "./mindScore";

export type CoachContextPayload = {
  sensitivities: {
    noBeans: boolean;
    noLactose: boolean;
  };
  routine: {
    breakfast: string;
    dinner: string;
  };
  coachPersonality: string;
  weeklyGap: WeeklyScoreSummary;
  scoringAdjustment: {
    removedCategory: string;
    redistributedTo: readonly string[];
  };
  warningRepairEngine: readonly {
    id: string;
    label: string;
    weeklyLimit: number;
    warning: string;
    repair: string;
  }[];
  removedCategories: readonly {
    id: string;
    label: string;
    weeklyTarget: number;
    redistributedTo: readonly string[];
  }[];
};

export class RoutineAnchors {
  readonly breakfast: string;
  readonly dinner: string;

  constructor(breakfast: string, dinner: string) {
    this.breakfast = ensureNonEmpty(breakfast, "breakfast routine");
    this.dinner = ensureNonEmpty(dinner, "dinner routine");
  }
}

export class CoachPersonality {
  readonly prompt: string;

  constructor(prompt: string) {
    this.prompt = ensureNonEmpty(prompt, "coach personality");
  }
}

export class Sensitivities {
  readonly noBeans: boolean;
  readonly noLactose: boolean;

  constructor(noBeans: boolean, noLactose: boolean) {
    if (!noBeans) {
      throw new Error("No Beans sensitivity must be enforced");
    }
    if (!noLactose) {
      throw new Error("No Lactose sensitivity must be enforced");
    }
    this.noBeans = noBeans;
    this.noLactose = noLactose;
  }
}

export class CoachContext {
  readonly routine: RoutineAnchors;
  readonly coachPersonality: CoachPersonality;
  readonly sensitivities: Sensitivities;
  readonly weeklyGap: WeeklyScoreSummary;

  constructor(
    routine: RoutineAnchors,
    coachPersonality: CoachPersonality,
    sensitivities: Sensitivities,
    weeklyGap: WeeklyScoreSummary
  ) {
    this.routine = routine;
    this.coachPersonality = coachPersonality;
    this.sensitivities = sensitivities;
    this.weeklyGap = weeklyGap;
  }

  toJSON(): CoachContextPayload {
    return {
      sensitivities: {
        noBeans: this.sensitivities.noBeans,
        noLactose: this.sensitivities.noLactose
      },
      routine: {
        breakfast: this.routine.breakfast,
        dinner: this.routine.dinner
      },
      coachPersonality: this.coachPersonality.prompt,
      weeklyGap: this.weeklyGap,
      scoringAdjustment: {
        removedCategory: SCORING_ADJUSTMENT.removedCategory,
        redistributedTo: SCORING_ADJUSTMENT.redistributedTo
      },
      warningRepairEngine: WARNING_REPAIR_ENGINE,
      removedCategories: REMOVED_CATEGORIES
    };
  }
}

export function buildCoachContext(
  routine: RoutineAnchors,
  coachPersonality: CoachPersonality,
  sensitivities: Sensitivities,
  weeklyEntries: WeeklyEntry[]
): CoachContext {
  const weeklyLog = createWeeklyLog(weeklyEntries);
  const weeklyGap = buildWeeklyScoreSummary(weeklyLog);
  return new CoachContext(routine, coachPersonality, sensitivities, weeklyGap);
}

function ensureNonEmpty(value: string, label: string): string {
  if (value.trim().length === 0) {
    throw new Error(`Missing ${label}`);
  }
  return value;
}
