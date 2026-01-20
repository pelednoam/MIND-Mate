import React from "react";

const NAV_LINKS = [
  { label: "Setup", href: "/setup" },
  { label: "Coach", href: "/coach" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Scores", href: "/scores" },
  { label: "Nudges", href: "/nudges" },
  { label: "Context", href: "/context" },
  { label: "Chat", href: "/chat" },
  { label: "Log", href: "/log" }
] as const;

export function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <a href="/" className="text-lg font-semibold text-slate-900">
          MIND-Mate
        </a>
        <nav className="flex flex-wrap gap-4 text-sm text-slate-600">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-2 py-1 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
