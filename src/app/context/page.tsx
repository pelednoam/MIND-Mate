import { ContextBuilder } from "@/components/ContextBuilder";

export default function ContextPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <ContextBuilder />
      </div>
    </main>
  );
}
