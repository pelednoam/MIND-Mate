import React from "react";

const HOME_SECTIONS = [
  {
    title: "Account",
    description: "Sign in to sync data and enable notifications.",
    href: "/auth"
  },
  {
    title: "Setup",
    description: "Configure your routines and coach personality.",
    href: "/setup"
  },
  {
    title: "Smart Coach",
    description: "Compare lunch options and review warning/repair guidance.",
    href: "/coach"
  },
  {
    title: "Weekly Dashboard",
    description: "Track progress rings and limit budgets.",
    href: "/dashboard"
  },
  {
    title: "Weekly Score Editor",
    description: "Update servings per week for each category.",
    href: "/scores"
  },
  {
    title: "Proactive Nudges",
    description: "Preview the daily nudge schedule.",
    href: "/nudges"
  },
  {
    title: "LLM Context",
    description: "Inspect the context payload sent to the coach.",
    href: "/context"
  },
  {
    title: "Chat Shell",
    description: "Use the Smart Coach prompt sandbox.",
    href: "/chat"
  },
  {
    title: "Meal Logging",
    description: "Record meals and enforce sensitivities.",
    href: "/log"
  },
  {
    title: "Warning & Repair",
    description: "Preview warning triggers and repair guidance.",
    href: "/repairs"
  },
  {
    title: "Notifications",
    description: "Enable push notifications for proactive nudges.",
    href: "/notifications"
  },
  {
    title: "Supabase Sync",
    description: "Pull or push local data to Supabase.",
    href: "/sync"
  }
] as const;

export function AppHome() {
  return (
    <section className="flex flex-col gap-8">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          MIND-Mate
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Proactive Brain-Health Coach
        </h1>
        <p className="text-sm text-slate-600">
          Navigate each module to configure routines, run option duels, and
          review the weekly score.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {HOME_SECTIONS.map((section) => (
          <a
            key={section.title}
            href={section.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              {section.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600">{section.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
