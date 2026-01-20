import { NextResponse } from "next/server";
import { loadAppConfig } from "@/lib/config/appConfig";

export async function GET() {
  try {
    const config = loadAppConfig();
    return NextResponse.json({
      apiKey: config.fcm.web.apiKey,
      authDomain: config.fcm.web.authDomain,
      projectId: config.fcm.web.projectId,
      appId: config.fcm.web.appId,
      messagingSenderId: config.fcm.web.messagingSenderId,
      vapidKey: config.fcm.web.vapidKey
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to load notification config";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
