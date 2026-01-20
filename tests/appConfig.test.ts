import { describe, expect, it } from "vitest";
import { buildAppConfig } from "../src/lib/config/appConfig";

describe("appConfig", () => {
  it("builds config from yaml-like input", () => {
    const config = buildAppConfig({
      supabase: { url: "https://example.supabase.co", anonKey: "anon-key" },
      llm: { provider: "openai", model: "gpt-4o", apiKey: "llm-key" },
      fcm: {
        projectId: "project",
        clientEmail: "client@example.com",
        privateKey: "line1\\nline2",
        web: {
          apiKey: "web-key",
          authDomain: "example.firebaseapp.com",
          projectId: "web-project",
          appId: "app-id",
          messagingSenderId: "sender",
          vapidKey: "vapid"
        }
      }
    });

    expect(config.supabase.url).toContain("supabase.co");
    expect(config.llm.provider).toBe("openai");
    expect(config.fcm.web.vapidKey).toBe("vapid");
  });

  it("throws when fcm.web is missing", () => {
    expect(() =>
      buildAppConfig({
        supabase: { url: "https://example.supabase.co", anonKey: "anon-key" },
        llm: { provider: "openai", model: "gpt-4o", apiKey: "llm-key" },
        fcm: {
          projectId: "project",
          clientEmail: "client@example.com",
          privateKey: "line1\\nline2"
        }
      })
    ).toThrow("fcm.web");
  });
});
