# Implementation Notes (MIND-Mate)

This document summarizes the modules implemented so far and how they work.
It is updated after each new module addition.

---

## 1. Core Logic Modules

### `src/lib/mindRules.ts`
- Defines the hard constraints and rule constants.
- Enforces **No Beans** and **No Lactose** via `SENSITIVITY_TOGGLES`.
- Defines `WARNING_REPAIR_ENGINE` and `getWarningAndRepair` for red meat and fried food.

### `src/lib/mindScore.ts`
- Defines 9 healthy categories and 5 limit categories.
- Removes beans and redistributes to nuts + fish.
- Provides `createWeeklyLog` validation and `buildWeeklyScoreSummary`.

### `src/lib/warningRepair.ts`
- Evaluates whether a limit selection should trigger a warning.
- Uses `getWarningAndRepair` rules for consistent messaging.

### `src/lib/optionDuel.ts`
- Evaluates lunch options, checks beans/lactose, scores healthy vs limit categories.
- Elevates nuts/fish scoring due to bean removal.
- Returns rankings and winner.

### `src/lib/proactiveNudges.ts`
- Generates morning/pre‑lunch/afternoon/evening nudges from weekly gaps and lunch limits.
- Uses weekly gap priority (nuts/berries/whole grains).

### `src/lib/dashboard.ts`
- Maps weekly gaps and limit budgets into dashboard model.
- Includes espresso tracker state and brain high‑score percent.

### `src/lib/mealLogging.ts`
- Validates meal log entries (ISO date, required fields, no beans/lactose).

### `src/lib/weeklyLogUpdater.ts`
- Applies a meal selection to weekly log (healthy + limit categories).
- Maps `fried_food` → `fried_fast_food`.

### `src/lib/mealLogUpdater.ts`
- Applies a meal log entry to the weekly log (after validation).

### `src/lib/weeklyLogReconciler.ts`
- Rebuilds the entire weekly log from stored meal logs.

### `src/lib/weeklyLogReader.ts`
- Reads limit servings from weekly log (red meat, fried fast food).

### `src/lib/mealLogReader.ts`
- Finds latest lunch entry and its limit foods.

### `src/lib/mealLogWarnings.ts`
- Builds warning/repair decisions based on weekly log and limit foods.

### `src/lib/coachPrompt.ts`
- Builds system/user prompt from context + user message.

### `src/lib/coachResponder.ts`
- Local responder for the coach API fallback.

### `src/lib/smartSuggestions.ts`
- Suggests top missing healthy categories from weekly gaps.

### `src/lib/notificationSchedule.ts`
- Defines cron schedule for nudges and notification payload structure.

---

## 2. Local Storage Persistence

### `src/lib/setupStorage.ts`
- Saves/loads setup state (breakfast, dinner, coach personality).
- Enforces strict JSON schema validation.

### `src/lib/weeklyScoreStorage.ts`
- Saves/loads weekly log entries.
- Provides `buildZeroWeeklyLog`.

### `src/lib/mealLogStorage.ts`
- Saves/loads meal logs array.
- Initializes empty storage when missing.

### `src/lib/espressoStorage.ts`
- Saves/loads espresso tracker state.
- Validates ISO date and positive target.

### `src/lib/chatStorage.ts`
- Saves/loads chat history for Smart Coach.

---

## 3. Supabase Persistence (Data Access Layer)

### `src/lib/persistence/supabaseConfig.ts`
- Builds Supabase config from env (`SUPABASE_URL`, `SUPABASE_ANON_KEY`).
- Throws if missing.

### `src/lib/persistence/supabaseClient.ts`
- Creates singleton Supabase client from env config.

### `src/lib/persistence/supabaseTables.ts`
- Centralized table names (`mind_setup`, `mind_weekly_log`, `mind_meal_logs`, `mind_espresso`, `mind_chat_history`).

### `src/lib/persistence/setupRepository.ts`
- `fetchSetupState` / `upsertSetupState` for user setup.

### `src/lib/persistence/weeklyLogRepository.ts`
- `fetchWeeklyLog` / `upsertWeeklyLog` for weekly scores.

### `src/lib/persistence/mealLogRepository.ts`
- `fetchMealLogs` / `upsertMealLogs` for meal logs.

### `src/lib/persistence/espressoRepository.ts`
- `fetchEspressoState` / `upsertEspressoState` for espresso tracker.

### `src/lib/persistence/chatRepository.ts`
- `fetchChatHistory` / `upsertChatHistory` for chat messages.

### `src/lib/persistence/mealLogRepository.ts`
- `fetchMealLogs` / `upsertMealLogs` for meal logs.

### `src/lib/persistence/espressoRepository.ts`
- `fetchEspressoState` / `upsertEspressoState` for espresso tracker.

### `src/lib/persistence/supabaseSync.ts`
- Sync helpers that pull/push setup, weekly log, meal logs, espresso, and chat
  between Supabase and local storage.

All repositories are tested with fake Supabase clients.

---

## 4. API Routes (Server)

### `src/app/api/coach/route.ts`
- Accepts `{ prompt }` and returns `{ reply }`.
- Uses local responder for now; placeholder for real LLM integration.

### `src/app/api/option-duel/route.ts`
- Accepts options + limit servings and returns decision.

---

## 5. UI Components / Screens

### Setup & Home
- `src/components/SetupScreen.tsx` with local storage persistence.
- `src/components/AppHome.tsx` and `src/components/AppHeader.tsx`.
- `src/app/setup/page.tsx` and `src/app/page.tsx` (home hub).

### Option Duel
- `src/components/OptionDuelForm.tsx` uses API with local fallback.
- Applies selection to weekly log.
- `src/app/coach/page.tsx`.

### Smart Coach
- `src/components/SmartCoachChat.tsx` builds context, hits API, stores chat history.
- Shows prompt preview + smart suggestions.
- `src/app/chat/page.tsx`.

### Dashboard
- `src/components/WeeklyScoreEditor.tsx` edits weekly log, can recalc from meal logs.
- `src/components/WeeklyScoreDashboard.tsx` reads weekly log + espresso tracker.
- `src/components/ProgressDashboard.tsx` renders rings/bars.
- `src/app/dashboard/page.tsx` and `src/app/scores/page.tsx`.

### Meal Logging
- `src/components/MealLogForm.tsx` logs meals, persists, updates weekly log.
- Shows warning/repair output per log.
- `src/app/log/page.tsx`.

### Warning & Repair
- `src/components/WarningRepairStatus.tsx` reads weekly log and shows warnings.
- `src/components/WarningRepairPanel.tsx` displays decisions.
- `src/app/repairs/page.tsx`.

### Context Preview
- `src/components/ContextBuilder.tsx` builds context from stored setup + weekly log.
- `src/components/ContextPreview.tsx` shows JSON payload.
- `src/app/context/page.tsx`.

### Nudges
- `src/components/NudgeSchedule.tsx` builds nudges from stored data.
- `src/components/NudgePreview.tsx` renders schedule.
- `src/app/nudges/page.tsx`.

---

## 6. Tests

- All logic modules have Vitest coverage under `tests/`.
- UI components render tests use `react-dom/server` and check headings/text.
- Supabase repositories use fake clients for deterministic tests.

---

## 7. Pending Work

- Real Supabase wiring in UI (replace local storage reads/writes).
- Auth/user identity (for user_id).
- Real LLM integration (Vercel AI SDK, OpenAI/Gemini).
- Background worker/FCM for push notifications.
