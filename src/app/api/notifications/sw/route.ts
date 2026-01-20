import { loadAppConfig } from "@/lib/config/appConfig";

export async function GET() {
  const config = loadAppConfig();
  const webConfig = {
    apiKey: config.fcm.web.apiKey,
    authDomain: config.fcm.web.authDomain,
    projectId: config.fcm.web.projectId,
    appId: config.fcm.web.appId,
    messagingSenderId: config.fcm.web.messagingSenderId
  };

  const script = `
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp(${JSON.stringify(webConfig)});
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload?.notification?.title || "MIND-Mate";
  const body = payload?.notification?.body || "";
  self.registration.showNotification(title, {
    body,
    data: payload?.data || {}
  });
});
`;

  return new Response(script, {
    headers: {
      "Content-Type": "application/javascript",
      "Service-Worker-Allowed": "/"
    }
  });
}
