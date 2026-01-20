import { ProgressDashboard } from "@/components/ProgressDashboard";
import { buildDashboardModel } from "@/lib/dashboard";
import { buildWeeklyScoreSummary, createWeeklyLog } from "@/lib/mindScore";

const weeklyLog = createWeeklyLog([
  { categoryId: "leafy_greens", servingsPerWeek: 4 },
  { categoryId: "other_veggies", servingsPerWeek: 7 },
  { categoryId: "berries", servingsPerWeek: 1 },
  { categoryId: "whole_grains", servingsPerWeek: 14 },
  { categoryId: "fish", servingsPerWeek: 1 },
  { categoryId: "nuts", servingsPerWeek: 3 },
  { categoryId: "poultry", servingsPerWeek: 2 },
  { categoryId: "olive_oil", servingsPerWeek: 7 },
  { categoryId: "wine", servingsPerWeek: 0 },
  { categoryId: "red_meat", servingsPerWeek: 2 },
  { categoryId: "butter_margarine", servingsPerWeek: 2 },
  { categoryId: "cheese", servingsPerWeek: 0 },
  { categoryId: "pastries_sweets", servingsPerWeek: 1 },
  { categoryId: "fried_fast_food", servingsPerWeek: 0 }
]);

const dashboardModel = buildDashboardModel({
  summary: buildWeeklyScoreSummary(weeklyLog),
  espresso: {
    shotsToday: 1,
    targetShots: 2
  }
});

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto w-full max-w-5xl">
        <ProgressDashboard model={dashboardModel} />
      </div>
    </main>
  );
}
