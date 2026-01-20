"use client";

import React, { useState } from "react";
import { registerForPush } from "../lib/notifications/fcmWeb";
import { useSupabaseUser } from "../lib/auth/useSupabaseUser";

export function NotificationRegistration() {
  const { userId, status: authStatus, error: authError } = useSupabaseUser();
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = async () => {
    setError("");
    setStatus("");
    try {
      setIsRegistering(true);
      if (!userId) {
        throw new Error("Sign in to enable notifications");
      }
      const token = await registerForPush(userId);
      setStatus(`Notifications enabled (token ${token.slice(0, 8)}...)`);
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "Unable to enable notifications";
      setError(message);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Notifications</h2>
      <p className="mt-1 text-sm text-slate-500">
        Enable push notifications for proactive nudges.
      </p>

      <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
        <p className="text-xs font-semibold uppercase text-slate-500">
          Supabase user ID
        </p>
        <p className="mt-1 text-sm text-slate-700">
          {authStatus === "loading" ? "Checking session..." : null}
          {authStatus === "ready" && userId ? userId : null}
          {authStatus === "ready" && !userId ? "Not signed in" : null}
        </p>
      </div>

      <button
        type="button"
        className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        onClick={handleRegister}
        disabled={isRegistering || !userId}
      >
        {isRegistering ? "Enabling..." : "Enable notifications"}
      </button>

      {authError ? (
        <p className="mt-3 text-sm text-rose-600">{authError}</p>
      ) : null}
      {status ? <p className="mt-3 text-sm text-emerald-600">{status}</p> : null}
      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
    </section>
  );
}
