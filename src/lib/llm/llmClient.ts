import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { loadLlmConfig } from "./llmConfig";

export function getCoachModel() {
  const config = loadLlmConfig();
  if (config.provider === "openai") {
    const provider = createOpenAI({ apiKey: config.apiKey });
    return provider(config.model);
  }
  const provider = createGoogleGenerativeAI({ apiKey: config.apiKey });
  return provider(config.model);
}
