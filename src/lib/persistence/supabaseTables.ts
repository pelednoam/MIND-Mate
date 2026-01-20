export const SUPABASE_TABLES = {
  setup: "mind_setup",
  weeklyLog: "mind_weekly_log",
  mealLogs: "mind_meal_logs",
  espresso: "mind_espresso",
  chat: "mind_chat_history",
  notificationTokens: "mind_notification_tokens"
} as const;

export type SupabaseTable = (typeof SUPABASE_TABLES)[keyof typeof SUPABASE_TABLES];
