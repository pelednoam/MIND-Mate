import type { NudgeMessage, NudgeTime } from "./proactiveNudges";

export type NudgeScheduleItem = {
  time: NudgeTime;
  cron: string;
  label: string;
};

export const DEFAULT_NUDGE_SCHEDULE: NudgeScheduleItem[] = [
  { time: "morning", cron: "0 8 * * *", label: "Morning booster" },
  { time: "pre_lunch", cron: "45 11 * * *", label: "Pre-lunch reminder" },
  { time: "afternoon", cron: "0 15 * * *", label: "Afternoon snack" },
  { time: "evening", cron: "0 18 * * *", label: "Evening optimization" }
];

export type NotificationPayload = {
  title: string;
  body: string;
  tags: string[];
};

export function buildNotificationPayload(
  nudge: NudgeMessage
): NotificationPayload {
  if (nudge.title.trim().length === 0) {
    throw new Error("Nudge title is required");
  }
  if (nudge.body.trim().length === 0) {
    throw new Error("Nudge body is required");
  }

  return {
    title: nudge.title,
    body: nudge.body,
    tags: nudge.tags
  };
}
