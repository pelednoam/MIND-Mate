import { loadAppConfig, type AppConfig } from "../config/appConfig";

export type LlmProvider = "openai" | "gemini";

export type LlmConfig = {
  provider: LlmProvider;
  model: "gpt-4o" | "gemini-1.5-pro";
  apiKey: string;
};

export function buildLlmConfig(config: AppConfig): LlmConfig {
  const provider = config.llm.provider;
  const model = config.llm.model;
  const apiKey = config.llm.apiKey;

  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error("llm.apiKey is required");
  }
  if (provider === "openai" && model !== "gpt-4o") {
    throw new Error("llm.model must be gpt-4o when using openai");
  }
  if (provider === "gemini" && model !== "gemini-1.5-pro") {
    throw new Error("llm.model must be gemini-1.5-pro when using gemini");
  }

  return { provider, model, apiKey };
}

export function loadLlmConfig(): LlmConfig {
  return buildLlmConfig(loadAppConfig());
}
