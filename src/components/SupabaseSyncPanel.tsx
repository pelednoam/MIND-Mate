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
import {
  loadSupabaseUserId,
  saveSupabaseUserId
} from "../lib/persistence/supabaseUserStorage";

export function SupabaseSyncPanel() {
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [userStatus, setUserStatus] = useState("");

  React.useEffect(() => {
    try {
      const savedUser = loadSupabaseUserId(window.localStorage);
      setUserId(savedUser);
      setUserStatus("Loaded saved Supabase user ID.");
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "Unable to load Supabase user ID";
      setUserStatus(message);
    }
  }, []);

  const validateUser = () => {
    if (userId.trim().length === 0) {
      throw new Error("User ID is required to sync.");
    }
  };

  const handlePull = async () => {
    setStatus("");
    setError("");
    try {
      validateUser();
      saveSupabaseUserId(window.localStorage, userId);
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
      saveSupabaseUserId(window.localStorage, userId);
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

      <label className="mt-4 block text-sm text-slate-600">
        Supabase user ID
        <input
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
          placeholder="user-123"
        />
      </label>
      {userStatus ? (
        <p className="mt-2 text-xs text-slate-500">{userStatus}</p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          onClick={handlePull}
          disabled={isSyncing}
        >
          {isSyncing ? "Syncing..." : "Pull from Supabase"}
        </button>
        <button
          type="button"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          onClick={handlePush}
          disabled={isSyncing}
        >
          {isSyncing ? "Syncing..." : "Push to Supabase"}
        </button>
      </div>

      {status ? <p className="mt-3 text-sm text-emerald-600">{status}</p> : null}
      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
    </section>
  );
}
