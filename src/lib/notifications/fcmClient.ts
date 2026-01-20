import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { loadFcmConfig } from "./fcmConfig";

export function getFcmMessaging() {
  if (getApps().length === 0) {
    const config = loadFcmConfig();
    initializeApp({
      credential: cert({
        projectId: config.projectId,
        clientEmail: config.clientEmail,
        privateKey: config.privateKey
      })
    });
  }
  return getMessaging();
}
