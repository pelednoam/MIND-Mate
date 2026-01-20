import { describe, expect, it, afterEach } from "vitest";
import { loadFcmConfig } from "../src/lib/notifications/fcmConfig";

const envSnapshot = { ...process.env };

afterEach(() => {
  process.env = { ...envSnapshot };
});

describe("loadFcmConfig", () => {
  it("throws when env is missing", () => {
    delete process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    expect(() => loadFcmConfig()).toThrow("FIREBASE_SERVICE_ACCOUNT_JSON");
  });

  it("throws when JSON is invalid", () => {
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON = "{bad json}";
    expect(() => loadFcmConfig()).toThrow("valid JSON");
  });

  it("throws when required fields are missing", () => {
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON = JSON.stringify({
      project_id: "project",
      client_email: "client@example.com"
    });
    expect(() => loadFcmConfig()).toThrow("private_key");
  });

  it("returns config with normalized private key", () => {
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON = JSON.stringify({
      project_id: "project",
      client_email: "client@example.com",
      private_key: "line1\\\\nline2"
    });
    const config = loadFcmConfig();
    expect(config.privateKey).toBe("line1\nline2");
  });
});
