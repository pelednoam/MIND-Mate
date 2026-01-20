export type SupabaseConfig = {
  url: string;
  anonKey: string;
};

export type SupabaseEnv = {
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
};

export function buildSupabaseConfig(env: SupabaseEnv): SupabaseConfig {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL.trim().length === 0) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is required");
  }
  if (!env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY.trim().length === 0) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is required");
  }

  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  };
}
