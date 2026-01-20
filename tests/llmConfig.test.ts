import { describe, expect, it, afterEach } from "vitest";
import { loadLlmConfig } from "../src/lib/llm/llmConfig";

const envSnapshot = { ...process.env };

afterEach(() => {
  process.env = { ...envSnapshot };
});

describe("loadLlmConfig", () => {
  it("throws when LLM_PROVIDER is missing", () => {
    delete process.env.LLM_PROVIDER;
    expect(() => loadLlmConfig()).toThrow("LLM_PROVIDER");
  });

  it("throws when LLM_MODEL is missing", () => {
    process.env.LLM_PROVIDER = "openai";
    delete process.env.LLM_MODEL;
    process.env.OPENAI_API_KEY = "test-key";
    expect(() => loadLlmConfig()).toThrow("LLM_MODEL");
  });

  it("returns openai config when env is valid", () => {
    process.env.LLM_PROVIDER = "openai";
    process.env.LLM_MODEL = "gpt-4o";
    process.env.OPENAI_API_KEY = "test-key";
    expect(loadLlmConfig()).toEqual({
      provider: "openai",
      model: "gpt-4o"
    });
  });

  it("rejects gemini when model does not match", () => {
    process.env.LLM_PROVIDER = "gemini";
    process.env.LLM_MODEL = "gpt-4o";
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test-key";
    expect(() => loadLlmConfig()).toThrow("gemini-1.5-pro");
  });
});
