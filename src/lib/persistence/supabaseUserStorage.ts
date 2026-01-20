export type StorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

const STORAGE_KEY = "mindMateSupabaseUserId";

export function saveSupabaseUserId(
  storage: StorageLike,
  userId: string
): void {
  if (userId.trim().length === 0) {
    throw new Error("Supabase user ID is required");
  }
  storage.setItem(STORAGE_KEY, userId);
}

export function loadSupabaseUserId(storage: StorageLike): string {
  const value = storage.getItem(STORAGE_KEY);
  if (!value || value.trim().length === 0) {
    throw new Error("Supabase user ID is missing");
  }
  return value;
}
