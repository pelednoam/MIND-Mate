import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppHeader } from "@/components/AppHeader";

export const metadata: Metadata = {
  title: "MIND-Mate",
  description:
    "Proactive MIND diet coach with hard constraints and warning/repair guidance."
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
