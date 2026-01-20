export type SetupState = {
  breakfastRoutine: string;
  dinnerRoutine: string;
  coachPersonality: string;
};

export type StorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

const STORAGE_KEY = "mindMateSetup";

export function saveSetupState(
  storage: StorageLike,
  state: SetupState
): void {
  const payload = serializeSetupState(state);
  storage.setItem(STORAGE_KEY, payload);
}

export function loadSetupState(storage: StorageLike): SetupState {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) {
    throw new Error("Missing setup state in storage");
  }
  return parseSetupState(raw);
}

export function serializeSetupState(state: SetupState): string {
  return JSON.stringify(state);
}

export function parseSetupState(raw: string): SetupState {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch (error) {
    throw new Error("Setup state must be valid JSON");
  }

  if (!isSetupState(parsed)) {
    throw new Error("Setup state is missing required fields");
  }

  return parsed;
}

function isSetupState(value: unknown): value is SetupState {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.breakfastRoutine === "string" &&
    typeof record.dinnerRoutine === "string" &&
    typeof record.coachPersonality === "string"
  );
}
