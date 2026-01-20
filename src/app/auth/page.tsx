import { AuthPanel } from "@/components/AuthPanel";

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <AuthPanel />
      </div>
    </main>
  );
}
