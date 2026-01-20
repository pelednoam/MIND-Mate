import { describe, expect, it } from "vitest";
import {
  CoachPersonality,
  RoutineAnchors,
  Sensitivities,
  buildCoachContext
} from "../src/lib/coachContext";
import { buildZeroWeeklyLog } from "../src/lib/weeklyScoreStorage";
import { buildCoachPrompt } from "../src/lib/coachPrompt";

describe("coachPrompt", () => {
  it("builds a prompt with context and user message", () => {
    const context = buildCoachContext(
      new RoutineAnchors("Toast", "Salad with an Omelet"),
      new CoachPersonality("Concise coach."),
      new Sensitivities(true, true),
      buildZeroWeeklyLog()
    ).toJSON();

    const prompt = buildCoachPrompt(context, "Office lunch is pizza or salad.");
    expect(prompt.system).toContain("Sensitivities");
    expect(prompt.system).toContain("noBeans=true");
    expect(prompt.user).toContain("pizza");
  });

  it("throws when user message is empty", () => {
    const context = buildCoachContext(
      new RoutineAnchors("Toast", "Salad with an Omelet"),
      new CoachPersonality("Concise coach."),
      new Sensitivities(true, true),
      buildZeroWeeklyLog()
    ).toJSON();

    expect(() => buildCoachPrompt(context, " ")).toThrow("User message is required");
  });
});
