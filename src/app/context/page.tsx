import { ContextPreview } from "@/components/ContextPreview";
import {
  CoachPersonality,
  RoutineAnchors,
  Sensitivities,
  buildCoachContext
} from "@/lib/coachContext";
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

const coachContext = buildCoachContext(
  new RoutineAnchors("Toast", "Salad with an Omelet"),
  new CoachPersonality("Concise, proactive, empathetic coach."),
  new Sensitivities(true, true),
  weeklyLog
);

export default function ContextPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <ContextPreview payload={coachContext.toJSON()} />
      </div>
    </main>
  );
}
