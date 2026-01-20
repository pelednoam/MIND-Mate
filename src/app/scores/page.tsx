import { WeeklyScoreEditor } from "@/components/WeeklyScoreEditor";

export default function ScoresPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <WeeklyScoreEditor />
      </div>
    </main>
  );
}
