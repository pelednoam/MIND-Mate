import type { NotificationPayload } from "../notificationSchedule";
import { getFcmMessaging } from "./fcmClient";

export async function sendFcmNotification(
  tokens: string[],
  payload: NotificationPayload
): Promise<void> {
  if (tokens.length === 0) {
    throw new Error("Notification tokens are required");
  }

  const messaging = getFcmMessaging();
  const response = await messaging.sendEachForMulticast({
    tokens,
    notification: {
      title: payload.title,
      body: payload.body
    },
    data: {
      tags: payload.tags.join(",")
    }
  });

  if (response.failureCount > 0) {
    const errors = response.responses
      .filter((item) => !item.success)
      .map((item) => item.error?.message)
      .filter((message): message is string => Boolean(message));
    const message =
      errors.length > 0 ? errors.join("; ") : "FCM send failed";
    throw new Error(message);
  }
}
