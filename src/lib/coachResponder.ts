import type { CoachPrompt } from "./coachPrompt";

export function generateCoachResponse(prompt: CoachPrompt): string {
  const normalized = prompt.user.toLowerCase();
  if (normalized.includes("beans")) {
    return "Beans are off-limits. Choose a bean-free option and add nuts or fish later.";
  }
  if (normalized.includes("lactose") || normalized.includes("cheese")) {
    return "Avoid lactose. Pick the option without dairy and keep dinner light.";
  }
  if (normalized.includes("fried")) {
    return "Fried food triggers a warning. If you proceed, plan a repair with extra greens.";
  }
  return "Pick the option that adds whole grains, fish, or leafy greens.";
}
