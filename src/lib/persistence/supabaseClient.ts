import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { buildSupabaseConfig } from "./supabaseConfig";

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!client) {
    const config = buildSupabaseConfig(process.env);
    client = createClient(config.url, config.anonKey);
  }
  return client;
}
