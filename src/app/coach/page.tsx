import { OptionDuelForm } from "@/components/OptionDuelForm";

export default function CoachPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Smart Coach
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Option Duel & Warning/Repair Guidance
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Compare lunch options while enforcing No Beans and No Lactose
            constraints.
          </p>
        </header>

        <OptionDuelForm />
      </div>
    </main>
  );
}
