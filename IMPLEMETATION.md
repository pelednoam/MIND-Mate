# Implementation Notes (MIND-Mate)

This document summarizes the modules implemented so far, with short notes on how
each module is implemented and what it does. It is updated after each new module
addition.

---

## 1. Core Logic Modules

### `src/lib/mindRules.ts`
- Defines the hard constraints and rule constants used across the app.
- Uses `as const` arrays and typed IDs so category names and limit rules remain
  stable and compile-time checked.
- Enforces **No Beans** and **No Lactose** via `SENSITIVITY_TOGGLES`, and exposes
  the `WARNING_REPAIR_ENGINE` and `getWarningAndRepair` mappings for limit foods.

### `src/lib/mindScore.ts`
- Defines the weekly scoring model for 9 healthy and 5 limit categories.
- Uses `createWeeklyLog` to validate entries (non-negative, known category IDs)
  and returns a normalized log.
- `buildWeeklyScoreSummary` computes healthy gaps and remaining limit budgets
  for use in dashboards and nudges.

### `src/lib/coachContext.ts`
- Builds the JSON payload for the LLM context layer.
- Aggregates routine anchors, coach personality, sensitivities, and weekly gaps
  from the scoring model into a single typed payload.

### `src/lib/warningRepair.ts`
- Evaluates whether a limit selection should trigger a warning.
- Uses the `WARNING_REPAIR_ENGINE` rules to return a consistent decision shape
  with warning text and repair guidance.

### `src/lib/optionDuel.ts`
- Scores lunch options with healthy vs limit category weights and sensitivities.
- Penalizes beans/lactose directly, and boosts nuts/fish to compensate for bean
  removal in the MIND rules.
- Returns a ranking and a winner ID for the chosen option.

### `src/lib/proactiveNudges.ts`
- Generates morning/pre-lunch/afternoon/evening suggestions from weekly gaps.
- Uses simple heuristics to pick the most under-served healthy categories.

### `src/lib/dashboard.ts`
- Maps the weekly score summary into dashboard-friendly progress metrics.
- Includes espresso tracker data and a normalized brain high-score percent.

### `src/lib/mealLogging.ts`
- Validates meal log entries at creation time.
- Enforces ISO date format, required fields, and No Beans/No Lactose flags.

### `src/lib/weeklyLogUpdater.ts`
- Applies a meal selection to the weekly log (healthy + limit categories).
- Normalizes `fried_food` to the canonical `fried_fast_food` category.

### `src/lib/mealLogUpdater.ts`
- Applies a full `MealLogEntry` to the weekly log after validation.
- Reuses `weeklyLogUpdater` to keep update logic consistent.

### `src/lib/weeklyLogReconciler.ts`
- Rebuilds the entire weekly log from stored meal logs.
- Starts from a zero log and replays each entry deterministically.

### `src/lib/weeklyLogReader.ts`
- Reads limit servings (red meat and fried fast food) from a weekly log.
- Used in warning/repair checks and option duel evaluations.

### `src/lib/mealLogReader.ts`
- Reads the latest lunch entry and its limit foods.
- Provides focused data for quick UI summaries.

### `src/lib/mealLogWarnings.ts`
- Builds warning/repair decisions for a meal log using the latest weekly log.
- Keeps warning logic centralized and reusable.

### `src/lib/coachPrompt.ts`
- Builds the prompt object sent to the coach API from context + user input.
- Keeps prompt composition consistent between UI and tests.

### `src/lib/coachResponder.ts`
- Local fallback responder for the coach API.
- Provides deterministic output when the API route is unavailable.

### `src/lib/smartSuggestions.ts`
- Picks the highest-priority healthy gaps for short actionable suggestions.
- Used in the Smart Coach chat UI.

### `src/lib/notificationSchedule.ts`
- Defines the schedule and payload shape for push notification nudges.
- Works with `proactiveNudges` to generate time-of-day messages.

---

## 2. Local Storage Persistence

### `src/lib/setupStorage.ts`
- Saves/loads setup state (breakfast, dinner, coach personality).
- Validates stored JSON and throws on missing/invalid data.

### `src/lib/weeklyScoreStorage.ts`
- Saves/loads weekly log entries and validates the result.
- Provides `buildZeroWeeklyLog` for consistent initialization.

### `src/lib/mealLogStorage.ts`
- Saves/loads the meal logs array with strict validation.
- Provides `initializeMealLogs` for first-time setup.

### `src/lib/espressoStorage.ts`
- Saves/loads espresso tracker state with date validation.
- Exposes `initializeEspressoState` for deterministic resets.

### `src/lib/chatStorage.ts`
- Saves/loads chat history for the Smart Coach.
- Ensures the history is a valid list of `{ role, text }` entries.

---

## 3. Supabase Persistence (Data Access Layer)

### `src/lib/persistence/supabaseConfig.ts`
- Builds Supabase config from env (`SUPABASE_URL`, `SUPABASE_ANON_KEY`).
- Throws if any required env variables are missing.

### `src/lib/persistence/supabaseClient.ts`
- Creates a singleton Supabase client using the env config.
- Used by all repositories and sync helpers.

### `src/lib/persistence/supabaseTables.ts`
- Centralized table names for all persistence operations.
- Prevents drift and reduces typos between repositories.

### `src/lib/persistence/supabaseUserStorage.ts`
- Stores and loads the Supabase user ID in local storage.
- Throws if missing or empty to avoid silent fallbacks.

### `src/lib/persistence/setupRepository.ts`
- `fetchSetupState` / `upsertSetupState` map `SetupState` to the `mind_setup` table.
- Data mapping ensures the table schema stays aligned with the UI model.

### `src/lib/persistence/weeklyLogRepository.ts`
- `fetchWeeklyLog` / `upsertWeeklyLog` for weekly scores.
- Validates log integrity with `createWeeklyLog` before returning results.

### `src/lib/persistence/mealLogRepository.ts`
- `fetchMealLogs` / `upsertMealLogs` for meal logs.
- Converts Supabase records into typed entries for storage + UI.

### `src/lib/persistence/espressoRepository.ts`
- `fetchEspressoState` / `upsertEspressoState` for espresso tracker state.
- Ensures target shots and date are valid before returning.

### `src/lib/persistence/chatRepository.ts`
- `fetchChatHistory` / `upsertChatHistory` for chat message arrays.
- Normalizes message shapes to match the local storage schema.

### `src/lib/persistence/supabaseSync.ts`
- Pull/push helpers for setup, weekly log, meal logs, espresso, and chat.
- Sync helpers copy Supabase records into local storage and push local storage
  back to Supabase for a full device sync flow.

---

## 4. LLM Integration

### `src/lib/llm/llmConfig.ts`
- Centralizes LLM provider configuration and enforces required env vars.
- Requires `LLM_PROVIDER`, `LLM_MODEL`, and the provider API key to avoid silent
  fallbacks.

### `src/lib/llm/llmClient.ts`
- Builds the Vercel AI SDK model instance based on the configured provider.
- Supports OpenAI (`gpt-4o`) and Gemini (`gemini-1.5-pro`).

---

## 5. Supabase Sync UI

### `src/components/SupabaseSyncPanel.tsx`
- Manual UI for pulling/pushing all local state to Supabase.
- Reads/saves the user ID and triggers the supabase sync helpers.

### `src/app/sync/page.tsx`
- Screen wrapper for the Supabase sync panel.

All repositories are tested with fake Supabase clients.

---

## 6. API Routes (Server)

### `src/app/api/coach/route.ts`
- Accepts `{ prompt }` and returns `{ reply }`.
- Uses Vercel AI SDK (`generateText`) with the configured LLM provider.

### `src/app/api/option-duel/route.ts`
- Accepts options + limit servings and returns decision.
- Calls the core `optionDuel` logic to stay consistent with UI evaluations.

---

## 7. UI Components / Screens

### Setup & Home
- `src/components/SetupScreen.tsx` loads setup from local storage and Supabase.
- Saves locally and upserts to Supabase when a stored user ID is available.
- `src/components/AppHome.tsx` and `src/components/AppHeader.tsx` provide
  navigation and feature entry points.
- `src/app/setup/page.tsx` and `src/app/page.tsx` render the setup flow and
  the home hub.

### Option Duel
- `src/components/OptionDuelForm.tsx` uses the API route with local fallback.
- Applies the chosen option to the weekly log after evaluation.
- `src/app/coach/page.tsx` wraps the coach and duel experience.

### Smart Coach
- `src/components/SmartCoachChat.tsx` builds context, hits the coach API, and
  stores chat history.
- Pulls chat history from Supabase and upserts after each exchange.
- Shows prompt preview and smart suggestions from weekly gaps.
- `src/app/chat/page.tsx` renders the chat experience.

### Dashboard
- `src/components/WeeklyScoreEditor.tsx` edits weekly log and can recalc from
  meal logs.
- Loads weekly log from Supabase when a stored user ID exists and upserts on
  save/recalculate.
- `src/components/WeeklyScoreDashboard.tsx` reads weekly log + espresso tracker.
- Pulls weekly log and espresso tracker from Supabase to refresh the dashboard.
- Espresso actions upsert the tracker state to Supabase.
- `src/components/ProgressDashboard.tsx` renders rings/bars.
- `src/app/dashboard/page.tsx` and `src/app/scores/page.tsx` render dashboard
  and editor screens.

### Meal Logging
- `src/components/MealLogForm.tsx` logs meals, persists, updates weekly log.
- Pulls meal logs from Supabase and upserts meal logs + weekly log on submit.
- Shows warning/repair output per log.
- `src/app/log/page.tsx` renders the logging screen.

### Warning & Repair
- `src/components/WarningRepairStatus.tsx` reads weekly log and shows warnings.
- `src/components/WarningRepairPanel.tsx` displays decision details.
- `src/app/repairs/page.tsx` wraps the warning/repair UI.

### Context Preview
- `src/components/ContextBuilder.tsx` builds context from stored setup + weekly log.
- `src/components/ContextPreview.tsx` shows the JSON payload.
- `src/app/context/page.tsx` renders the preview screen.

### Nudges
- `src/components/NudgeSchedule.tsx` builds nudges from stored data.
- `src/components/NudgePreview.tsx` renders the schedule.
- `src/app/nudges/page.tsx` wraps the nudge preview screen.

### Supabase Sync
- `src/components/SupabaseSyncPanel.tsx` pulls/pushes all local storage data to
  Supabase.
- `src/app/sync/page.tsx` renders the sync screen.

---

## 8. Tests

- All logic modules have Vitest coverage under `tests/`.
- UI components render tests use `react-dom/server` and check headings/text.
- Supabase repositories use fake clients for deterministic tests.

---

## 9. Pending Work

- Auth/user identity (secure user_id handling instead of manual entry).
- Background worker + FCM for push notifications.
