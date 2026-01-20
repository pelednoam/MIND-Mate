import type { CoachContextPayload } from "./coachContext";

export type CoachPrompt = {
  system: string;
  user: string;
};

export function buildCoachPrompt(
  context: CoachContextPayload,
  userMessage: string
): CoachPrompt {
  if (userMessage.trim().length === 0) {
    throw new Error("User message is required");
  }

  const system = [
    context.coachPersonality,
    `Sensitivities: noBeans=${context.sensitivities.noBeans}, noLactose=${context.sensitivities.noLactose}.`,
    `Routine: breakfast=${context.routine.breakfast}, dinner=${context.routine.dinner}.`,
    `Weekly gap: ${JSON.stringify(context.weeklyGap)}.`,
    `Warning/Repair rules: ${JSON.stringify(context.warningRepairEngine)}.`
  ].join(" ");

  return {
    system,
    user: userMessage
  };
}
