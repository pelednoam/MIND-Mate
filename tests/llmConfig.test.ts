import { describe, expect, it } from "vitest";
import { buildLlmConfig } from "../src/lib/llm/llmConfig";
import type { AppConfig } from "../src/lib/config/appConfig";

const baseConfig: AppConfig = {
  supabase: {
    url: "https://example.supabase.co",
    anonKey: "anon-key"
  },
  llm: {
    provider: "openai",
    model: "gpt-4o",
    apiKey: "test-key"
  },
  fcm: {
    projectId: "project",
    clientEmail: "client@example.com",
    privateKey: "line1\\nline2"
  }
};

describe("llmConfig", () => {
  it("throws when api key is missing", () => {
    const config = {
      ...baseConfig,
      llm: {
        ...baseConfig.llm,
        provider: "openai" as "openai" | "gemini"
      }
    };
    config.llm.provider = "openai";
    config.llm.model = "gpt-4o";
    config.llm.apiKey = "";
    expect(() => buildLlmConfig(config)).toThrow("llm.apiKey");
  });

  it("throws when model is invalid for provider", () => {
    const config = {
      ...baseConfig,
      llm: {
        ...baseConfig.llm,
        model: "" as "gpt-4o" | "gemini-1.5-pro"
      }
    };
    expect(() => buildLlmConfig(config)).toThrow("gpt-4o");
  });

  it("returns openai config when values are valid", () => {
    expect(buildLlmConfig(baseConfig)).toEqual({
      provider: "openai",
      model: "gpt-4o",
      apiKey: "test-key"
    });
  });

  it("rejects gemini when model does not match", () => {
    const config = {
      ...baseConfig,
      llm: {
        provider: "gemini",
        model: "gpt-4o" as "gpt-4o" | "gemini-1.5-pro",
        apiKey: "test-key"
      }
    };
    expect(() => buildLlmConfig(config)).toThrow("gemini-1.5-pro");
  });
});
