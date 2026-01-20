"use client";

import React, { useState } from "react";
import { getSupabaseClient } from "../lib/persistence/supabaseClient";
import {
  pushChatHistoryToSupabase,
  pushEspressoToSupabase,
  pushMealLogsToSupabase,
  pushSetupToSupabase,
  pushWeeklyLogToSupabase,
  syncChatHistoryFromSupabase,
  syncEspressoFromSupabase,
  syncMealLogsFromSupabase,
  syncSetupFromSupabase,
  syncWeeklyLogFromSupabase
} from "../lib/persistence/supabaseSync";
import { useSupabaseUser } from "../lib/auth/useSupabaseUser";

export function SupabaseSyncPanel() {
  const { userId, status: authStatus, error: authError } = useSupabaseUser();
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  const validateUser = () => {
    if (!userId) {
      throw new Error("Sign in to sync data.");
    }
  };

  const handlePull = async () => {
    setStatus("");
    setError("");
    try {
      validateUser();
      setIsSyncing(true);
      const client = getSupabaseClient();
      await syncSetupFromSupabase(client, userId, window.localStorage);
      await syncWeeklyLogFromSupabase(client, userId, window.localStorage);
      await syncMealLogsFromSupabase(client, userId, window.localStorage);
      await syncEspressoFromSupabase(client, userId, window.localStorage);
      await syncChatHistoryFromSupabase(client, userId, window.localStorage);
      setStatus("Pulled all data from Supabase.");
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "Unable to sync from Supabase";
      setError(message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePush = async () => {
    setStatus("");
    setError("");
    try {
      validateUser();
      setIsSyncing(true);
      const client = getSupabaseClient();
      await pushSetupToSupabase(client, userId, window.localStorage);
      await pushWeeklyLogToSupabase(client, userId, window.localStorage);
      await pushMealLogsToSupabase(client, userId, window.localStorage);
      await pushEspressoToSupabase(client, userId, window.localStorage);
      await pushChatHistoryToSupabase(client, userId, window.localStorage);
      setStatus("Pushed all data to Supabase.");
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "Unable to sync to Supabase";
      setError(message);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Supabase Sync</h2>
      <p className="mt-1 text-sm text-slate-500">
        Pull or push local state to Supabase.
      </p>

      <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
        <p className="text-xs font-semibold uppercase text-slate-500">
          Signed in user
        </p>
        <p className="mt-1 text-sm text-slate-700">
          {authStatus === "loading" ? "Checking session..." : null}
          {authStatus === "ready" && userId ? userId : null}
          {authStatus === "ready" && !userId ? "Not signed in" : null}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          onClick={handlePull}
          disabled={isSyncing || !userId}
        >
          {isSyncing ? "Syncing..." : "Pull from Supabase"}
        </button>
        <button
          type="button"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          onClick={handlePush}
          disabled={isSyncing || !userId}
        >
          {isSyncing ? "Syncing..." : "Push to Supabase"}
        </button>
      </div>

      {authError ? (
        <p className="mt-3 text-sm text-rose-600">{authError}</p>
      ) : null}
      {status ? <p className="mt-3 text-sm text-emerald-600">{status}</p> : null}
      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
    </section>
  );
}
