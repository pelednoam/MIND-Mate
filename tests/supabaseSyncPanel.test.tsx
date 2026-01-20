import React from "react";
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { SupabaseSyncPanel } from "../src/components/SupabaseSyncPanel";

describe("SupabaseSyncPanel", () => {
  it("renders the sync controls", () => {
    const markup = renderToString(<SupabaseSyncPanel />);
    expect(markup).toContain("Supabase Sync");
    expect(markup).toContain("Pull from Supabase");
    expect(markup).toContain("Push to Supabase");
  });
});
