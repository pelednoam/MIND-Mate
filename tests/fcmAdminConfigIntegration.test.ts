import { describe, expect, it } from "vitest";
import { loadAppConfig } from "../src/lib/config/appConfig";

describe("fcm admin config integration", () => {
  it("loads firebase admin credentials", () => {
    const config = loadAppConfig();
    expect(config.fcm.projectId.length).toBeGreaterThan(0);
    expect(config.fcm.clientEmail.length).toBeGreaterThan(0);
    expect(config.fcm.privateKey.length).toBeGreaterThan(0);
  });
});
