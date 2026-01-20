export type LlmProvider = "openai" | "gemini";

export type LlmConfig = {
  provider: LlmProvider;
  model: "gpt-4o" | "gemini-1.5-pro";
};

export function loadLlmConfig(): LlmConfig {
  const provider = process.env.LLM_PROVIDER;
  if (!provider) {
    throw new Error("LLM_PROVIDER is required");
  }
  if (provider !== "openai" && provider !== "gemini") {
    throw new Error("LLM_PROVIDER must be openai or gemini");
  }

  const model = process.env.LLM_MODEL;
  if (!model) {
    throw new Error("LLM_MODEL is required");
  }

  if (provider === "openai" && model !== "gpt-4o") {
    throw new Error("LLM_MODEL must be gpt-4o when using openai");
  }
  if (provider === "gemini" && model !== "gemini-1.5-pro") {
    throw new Error("LLM_MODEL must be gemini-1.5-pro when using gemini");
  }

  const keyEnv =
    provider === "openai" ? "OPENAI_API_KEY" : "GOOGLE_GENERATIVE_AI_API_KEY";
  const apiKey = process.env[keyEnv];
  if (!apiKey) {
    throw new Error(`${keyEnv} is required`);
  }

  return { provider, model };
}
