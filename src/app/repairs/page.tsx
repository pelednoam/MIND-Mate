import { WarningRepairPanel } from "@/components/WarningRepairPanel";
import { evaluateLimitSelection } from "@/lib/warningRepair";

const decisions = [
  evaluateLimitSelection("red_meat", 5),
  evaluateLimitSelection("fried_food", 1)
];

export default function RepairsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <WarningRepairPanel decisions={decisions} />
      </div>
    </main>
  );
}
