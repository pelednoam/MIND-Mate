import { loadAppConfig, type AppConfig } from "../config/appConfig";

export type FcmConfig = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

export function buildFcmConfig(config: AppConfig): FcmConfig {
  const projectId = config.fcm.projectId;
  const clientEmail = config.fcm.clientEmail;
  const privateKey = config.fcm.privateKey;

  if (!projectId || projectId.trim().length === 0) {
    throw new Error("Firebase projectId is required");
  }
  if (!clientEmail || clientEmail.trim().length === 0) {
    throw new Error("Firebase clientEmail is required");
  }
  const normalizedKey = privateKey.replace(/\\n/g, "\n");
  if (normalizedKey.trim().length === 0) {
    throw new Error("Firebase private_key is invalid");
  }

  return {
    projectId,
    clientEmail,
    privateKey: normalizedKey
  };
}

export function loadFcmConfig(): FcmConfig {
  return buildFcmConfig(loadAppConfig());
}
