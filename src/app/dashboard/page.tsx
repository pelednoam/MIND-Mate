import { WeeklyScoreDashboard } from "@/components/WeeklyScoreDashboard";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto w-full max-w-5xl">
        <WeeklyScoreDashboard />
      </div>
    </main>
  );
}
