import { describe, expect, it } from "vitest";
import { loadAppConfig } from "../src/lib/config/appConfig";

describe("supabase config integration", () => {
  it("loads a valid Supabase URL and anon key", () => {
    const config = loadAppConfig();
    expect(config.supabase.url.startsWith("https://")).toBe(true);
    expect(config.supabase.url.endsWith(".supabase.co")).toBe(true);
    expect(config.supabase.anonKey.length).toBeGreaterThan(20);
    expect(config.supabase.anonKey).not.toBe("public-anon-key");
  });
});
