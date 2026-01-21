import { describe, expect, it } from "vitest";
import { loadAppConfig } from "../src/lib/config/appConfig";

describe("fcm web config integration", () => {
  it("loads firebase web config", () => {
    const config = loadAppConfig();
    expect(config.fcm.web.apiKey.length).toBeGreaterThan(0);
    expect(config.fcm.web.authDomain.length).toBeGreaterThan(0);
    expect(config.fcm.web.projectId.length).toBeGreaterThan(0);
    expect(config.fcm.web.appId.length).toBeGreaterThan(0);
    expect(config.fcm.web.messagingSenderId.length).toBeGreaterThan(0);
    expect(config.fcm.web.vapidKey.length).toBeGreaterThan(0);
  });
});
