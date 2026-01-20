import { getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

type WebFcmConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
  messagingSenderId: string;
  vapidKey: string;
};

export async function registerForPush(userId: string): Promise<string> {
  if (!userId || userId.trim().length === 0) {
    throw new Error("User ID is required to register notifications");
  }
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service workers are not supported");
  }
  if (!("Notification" in window)) {
    throw new Error("Notifications are not supported");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission was denied");
  }

  const registration = await navigator.serviceWorker.register(
    "/api/notifications/sw",
    { scope: "/" }
  );

  const config = await fetchWebConfig();
  if (getApps().length === 0) {
    initializeApp({
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      appId: config.appId,
      messagingSenderId: config.messagingSenderId
    });
  }

  const messaging = getMessaging();
  const token = await getToken(messaging, {
    vapidKey: config.vapidKey,
    serviceWorkerRegistration: registration
  });

  if (!token || token.trim().length === 0) {
    throw new Error("FCM token was empty");
  }

  await registerToken(userId, token);
  return token;
}

async function fetchWebConfig(): Promise<WebFcmConfig> {
  const response = await fetch("/api/notifications/config");
  if (!response.ok) {
    throw new Error("Unable to load notification config");
  }
  const data = (await response.json()) as WebFcmConfig;
  if (!data || !data.vapidKey) {
    throw new Error("Notification config is invalid");
  }
  return data;
}

async function registerToken(userId: string, token: string): Promise<void> {
  const response = await fetch("/api/notifications/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userId, token })
  });
  if (!response.ok) {
    const payload = (await response.json()) as { error?: string };
    throw new Error(payload.error || "Unable to register notification token");
  }
}
