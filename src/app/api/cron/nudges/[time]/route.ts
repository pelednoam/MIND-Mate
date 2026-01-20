import { NextResponse } from "next/server";
import { buildNotificationPayload } from "@/lib/notificationSchedule";
import { buildUserNudges } from "@/lib/notifications/nudgeComposer";
import { sendFcmNotification } from "@/lib/notifications/pushNudges";
import {
  fetchAllNotificationTokens,
  type NotificationTokenRecord
} from "@/lib/persistence/notificationTokenRepository";
import { fetchMealLogs } from "@/lib/persistence/mealLogRepository";
import { fetchSetupState } from "@/lib/persistence/setupRepository";
import { fetchWeeklyLog } from "@/lib/persistence/weeklyLogRepository";
import { getSupabaseClient } from "@/lib/persistence/supabaseClient";
import type { NudgeTime } from "@/lib/proactiveNudges";

const VALID_TIMES: NudgeTime[] = [
  "morning",
  "pre_lunch",
  "afternoon",
  "evening"
];

type RouteParams = {
  params: {
    time: string;
  };
};

export async function GET(request: Request, { params }: RouteParams) {
  const time = params.time;
  if (!VALID_TIMES.includes(time as NudgeTime)) {
    return NextResponse.json({ error: "Invalid nudge time" }, { status: 400 });
  }

  try {
    const client = getSupabaseClient();
    const records = await fetchAllNotificationTokens(client);
    const grouped = groupTokensByUser(records);

    const deliveries = [];
    for (const group of grouped) {
      const [setup, weeklyLog, mealLogs] = await Promise.all([
        fetchSetupState(client, group.userId),
        fetchWeeklyLog(client, group.userId),
        fetchMealLogs(client, group.userId)
      ]);
      const nudges = buildUserNudges(setup, weeklyLog, mealLogs);
      const nudge = nudges.find((item) => item.time === time);
      if (!nudge) {
        throw new Error(`Missing nudge for ${group.userId}`);
      }
      const payload = buildNotificationPayload(nudge);
      await sendFcmNotification(group.tokens, payload);
      deliveries.push({
        userId: group.userId,
        tokens: group.tokens.length
      });
    }

    return NextResponse.json({
      sent: deliveries.length,
      deliveries
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to send nudges";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

type TokenGroup = {
  userId: string;
  tokens: string[];
};

function groupTokensByUser(records: NotificationTokenRecord[]): TokenGroup[] {
  const grouped: TokenGroup[] = [];
  for (const record of records) {
    if (!record.user_id || record.user_id.trim().length === 0) {
      throw new Error("Notification user_id is required");
    }
    if (!record.token || record.token.trim().length === 0) {
      throw new Error("Notification token is required");
    }
    let group = grouped.find((item) => item.userId === record.user_id);
    if (!group) {
      group = { userId: record.user_id, tokens: [] };
      grouped.push(group);
    }
    if (group.tokens.includes(record.token)) {
      throw new Error(`Duplicate notification token: ${record.token}`);
    }
    group.tokens.push(record.token);
  }

  return grouped;
}
