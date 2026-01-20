type ServiceAccount = {
  project_id?: string;
  client_email?: string;
  private_key?: string;
};

export type FcmConfig = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

export function loadFcmConfig(): FcmConfig {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is required");
  }

  let parsed: ServiceAccount;
  try {
    parsed = JSON.parse(raw) as ServiceAccount;
  } catch (error) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON must be valid JSON");
  }

  const projectId = parsed.project_id;
  const clientEmail = parsed.client_email;
  const privateKey = parsed.private_key;

  if (!projectId || projectId.trim().length === 0) {
    throw new Error("Firebase project_id is required");
  }
  if (!clientEmail || clientEmail.trim().length === 0) {
    throw new Error("Firebase client_email is required");
  }
  if (!privateKey || privateKey.trim().length === 0) {
    throw new Error("Firebase private_key is required");
  }

  const normalizedKey = privateKey.replace(/\\\\n/g, "\n");
  if (normalizedKey.trim().length === 0) {
    throw new Error("Firebase private_key is invalid");
  }

  return {
    projectId,
    clientEmail,
    privateKey: normalizedKey
  };
}
