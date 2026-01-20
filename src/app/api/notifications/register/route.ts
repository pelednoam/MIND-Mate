import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/persistence/supabaseClient";
import { registerNotificationToken } from "@/lib/persistence/notificationTokenRepository";

type RegisterNotificationBody = {
  userId: string;
  token: string;
};

export async function POST(request: Request) {
  let body: RegisterNotificationBody;
  try {
    body = (await request.json()) as RegisterNotificationBody;
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.userId || !body.token) {
    return NextResponse.json(
      { error: "Missing userId or token" },
      { status: 400 }
    );
  }

  try {
    const client = getSupabaseClient();
    await registerNotificationToken(client, body.userId, body.token);
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to register notification token";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
