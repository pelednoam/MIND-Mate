export type EspressoState = {
  date: string;
  shotsToday: number;
  targetShots: number;
};

export type StorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

const STORAGE_KEY = "mindMateEspresso";

export function saveEspressoState(
  storage: StorageLike,
  state: EspressoState
): void {
  storage.setItem(STORAGE_KEY, serializeEspressoState(state));
}

export function loadEspressoState(storage: StorageLike): EspressoState {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) {
    throw new Error("Missing espresso tracker in storage");
  }
  return parseEspressoState(raw);
}

export function serializeEspressoState(state: EspressoState): string {
  return JSON.stringify(state);
}

export function parseEspressoState(raw: string): EspressoState {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch (error) {
    throw new Error("Espresso state must be valid JSON");
  }

  if (!isEspressoState(parsed)) {
    throw new Error("Espresso state is missing required fields");
  }

  return parsed;
}

export function initializeEspressoState(
  date: string,
  targetShots: number
): EspressoState {
  if (!isIsoDate(date)) {
    throw new Error("Espresso date must be ISO YYYY-MM-DD");
  }
  if (!Number.isFinite(targetShots) || targetShots <= 0) {
    throw new Error("Espresso target must be positive");
  }
  return {
    date,
    shotsToday: 0,
    targetShots
  };
}

function isEspressoState(value: unknown): value is EspressoState {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.date === "string" &&
    typeof record.shotsToday === "number" &&
    typeof record.targetShots === "number"
  );
}

function isIsoDate(value: string): boolean {
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDatePattern.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime());
}
