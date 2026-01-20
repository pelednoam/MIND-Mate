import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { loadLlmConfig } from "./llmConfig";

export function getCoachModel() {
  const config = loadLlmConfig();
  if (config.provider === "openai") {
    return openai(config.model);
  }
  return google(config.model);
}
