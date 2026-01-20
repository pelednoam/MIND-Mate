import { describe, expect, it } from "vitest";
import { buildSupabaseConfig } from "../src/lib/persistence/supabaseConfig";

describe("supabaseConfig", () => {
  it("builds config when env is present", () => {
    const config = buildSupabaseConfig({
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_ANON_KEY: "anon-key"
    });

    expect(config.url).toContain("supabase.co");
    expect(config.anonKey).toBe("anon-key");
  });

  it("throws when env vars are missing", () => {
    expect(() => buildSupabaseConfig({})).toThrow("SUPABASE_URL");
    expect(() =>
      buildSupabaseConfig({ SUPABASE_URL: "https://example.supabase.co" })
    ).toThrow("SUPABASE_ANON_KEY");
  });
});
