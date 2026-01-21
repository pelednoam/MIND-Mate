import { describe, expect, it } from "vitest";
import { loadAppConfig } from "../src/lib/config/appConfig";

describe("llm config integration", () => {
  it("loads provider, model, and api key", () => {
    const config = loadAppConfig();
    expect(["openai", "gemini"]).toContain(config.llm.provider);
    expect(config.llm.apiKey).not.toContain("replace-with");
    if (config.llm.provider === "openai") {
      expect(config.llm.model).toBe("gpt-4o");
    } else {
      expect(config.llm.model).toBe("gemini-1.5-pro");
    }
  });
});
