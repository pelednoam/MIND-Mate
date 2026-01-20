export type SupabaseConfig = {
  url: string;
  anonKey: string;
};

export type SupabaseEnv = {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
};

export function buildSupabaseConfig(env: SupabaseEnv): SupabaseConfig {
  if (!env.SUPABASE_URL || env.SUPABASE_URL.trim().length === 0) {
    throw new Error("SUPABASE_URL is required");
  }
  if (!env.SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY.trim().length === 0) {
    throw new Error("SUPABASE_ANON_KEY is required");
  }

  return {
    url: env.SUPABASE_URL,
    anonKey: env.SUPABASE_ANON_KEY
  };
}
