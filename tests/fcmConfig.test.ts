import { describe, expect, it } from "vitest";
import { buildFcmConfig } from "../src/lib/notifications/fcmConfig";
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

describe("fcmConfig", () => {
  it("throws when private key is invalid", () => {
    const config = {
      ...baseConfig,
      fcm: {
        ...baseConfig.fcm,
        privateKey: "   "
      }
    };
    expect(() => buildFcmConfig(config)).toThrow("Firebase private_key");
  });

  it("returns config with normalized private key", () => {
    const config = buildFcmConfig(baseConfig);
    expect(config.privateKey).toBe("line1\nline2");
  });
});
