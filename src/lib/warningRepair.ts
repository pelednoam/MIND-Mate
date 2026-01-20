import { getWarningAndRepair, type LimitFood } from "./mindRules";

export type WarningRepairDecision = {
  limitFood: LimitFood;
  label: string;
  weeklyLimit: number;
  servingsAfterSelection: number;
  shouldWarn: boolean;
  warning: string;
  repair: string;
};

export function evaluateLimitSelection(
  limitFood: LimitFood,
  servingsAfterSelection: number
): WarningRepairDecision {
  if (!Number.isFinite(servingsAfterSelection)) {
    throw new Error("Invalid servings count");
  }
  if (servingsAfterSelection < 0) {
    throw new Error("Negative servings count");
  }

  const rule = getWarningAndRepair(limitFood);
  const shouldWarn =
    limitFood === "fried_food"
      ? servingsAfterSelection >= 1
      : servingsAfterSelection > rule.weeklyLimit;

  return {
    limitFood,
    label: rule.label,
    weeklyLimit: rule.weeklyLimit,
    servingsAfterSelection,
    shouldWarn,
    warning: rule.warning,
    repair: rule.repair
  };
}
