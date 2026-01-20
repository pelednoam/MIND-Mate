import { useEffect, useState } from "react";
import { getSupabaseClient } from "../persistence/supabaseClient";

export type SupabaseUserState = {
  userId: string | null;
  status: "loading" | "ready";
  error: string;
};

export function useSupabaseUser(): SupabaseUserState {
  const [userId, setUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<SupabaseUserState["status"]>("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const client = getSupabaseClient();

    const load = async () => {
      const { data, error: authError } = await client.auth.getUser();
      if (!isMounted) {
        return;
      }
      if (authError || !data.user) {
        setUserId(null);
        setError(authError?.message || "No active session");
        setStatus("ready");
        return;
      }
      setUserId(data.user.id);
      setError("");
      setStatus("ready");
    };

    void load();

    const { data } = client.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) {
        return;
      }
      if (!session?.user?.id) {
        setUserId(null);
        setError("No active session");
        setStatus("ready");
        return;
      }
      setUserId(session.user.id);
      setError("");
      setStatus("ready");
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return { userId, status, error };
}
