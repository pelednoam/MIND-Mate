"use client";

import React, { useState } from "react";
import { getSupabaseClient } from "../lib/persistence/supabaseClient";
import { useSupabaseUser } from "../lib/auth/useSupabaseUser";

export function AuthPanel() {
  const { userId, status, error: authError } = useSupabaseUser();
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async () => {
    setStatusMessage("");
    setErrorMessage("");
    if (email.trim().length === 0) {
      setErrorMessage("Email is required");
      return;
    }
    setIsSubmitting(true);
    try {
      const client = getSupabaseClient();
      const { error } = await client.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });
      if (error) {
        throw new Error(error.message);
      }
      setStatusMessage("Check your inbox for the sign-in link.");
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "Unable to sign in";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    setStatusMessage("");
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      const client = getSupabaseClient();
      const { error } = await client.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
      setStatusMessage("Signed out.");
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "Unable to sign out";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Account</h2>
      <p className="mt-1 text-sm text-slate-500">
        Sign in to sync data and enable notifications.
      </p>

      <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
        <p className="text-xs font-semibold uppercase text-slate-500">Status</p>
        <p className="mt-1 text-sm text-slate-700">
          {status === "loading" ? "Checking session..." : null}
          {status === "ready" && userId ? `Signed in (${userId})` : null}
          {status === "ready" && !userId ? "Signed out" : null}
        </p>
      </div>

      {!userId ? (
        <div className="mt-4 space-y-3">
          <label className="block text-sm text-slate-600">
            Email
            <input
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <button
            type="button"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            onClick={handleSignIn}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send magic link"}
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          onClick={handleSignOut}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing out..." : "Sign out"}
        </button>
      )}

      {authError ? (
        <p className="mt-3 text-sm text-rose-600">{authError}</p>
      ) : null}
      {statusMessage ? (
        <p className="mt-3 text-sm text-emerald-600">{statusMessage}</p>
      ) : null}
      {errorMessage ? (
        <p className="mt-3 text-sm text-rose-600">{errorMessage}</p>
      ) : null}
    </section>
  );
}
