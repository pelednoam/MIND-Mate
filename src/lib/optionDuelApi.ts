import { evaluateLunchOptions, type LunchOption } from "./optionDuel";

export type OptionDuelRequest = {
  options: LunchOption[];
  currentLimitServings: {
    red_meat: number;
    fried_food: number;
  };
};

export function runOptionDuel(request: OptionDuelRequest) {
  if (!Array.isArray(request.options) || request.options.length === 0) {
    throw new Error("Option duel requires lunch options");
  }
  if (
    !Number.isFinite(request.currentLimitServings.red_meat) ||
    !Number.isFinite(request.currentLimitServings.fried_food)
  ) {
    throw new Error("Option duel requires limit servings");
  }

  return evaluateLunchOptions(request.options, request.currentLimitServings);
}
