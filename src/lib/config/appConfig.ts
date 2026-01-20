import fs from "fs";
import path from "path";
import { parse } from "yaml";

export type AppConfig = {
  supabase: {
    url: string;
    anonKey: string;
  };
  llm: {
    provider: "openai" | "gemini";
    model: "gpt-4o" | "gemini-1.5-pro";
    apiKey: string;
  };
  fcm: {
    projectId: string;
    clientEmail: string;
    privateKey: string;
  };
};

const CONFIG_PATH = path.join(process.cwd(), "config", "mindmate.yaml");

export function loadAppConfig(): AppConfig {
  const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
  const parsed = parse(raw) as unknown;
  return buildAppConfig(parsed);
}

export function buildAppConfig(input: unknown): AppConfig {
  const root = requireObject(input, "config");
  const supabase = requireObject(root.supabase, "supabase");
  const llm = requireObject(root.llm, "llm");
  const fcm = requireObject(root.fcm, "fcm");

  const provider = requireString(llm.provider, "llm.provider");
  if (provider !== "openai" && provider !== "gemini") {
    throw new Error("llm.provider must be openai or gemini");
  }

  const model = requireString(llm.model, "llm.model");
  if (provider === "openai" && model !== "gpt-4o") {
    throw new Error("llm.model must be gpt-4o when using openai");
  }
  if (provider === "gemini" && model !== "gemini-1.5-pro") {
    throw new Error("llm.model must be gemini-1.5-pro when using gemini");
  }

  return {
    supabase: {
      url: requireString(supabase.url, "supabase.url"),
      anonKey: requireString(supabase.anonKey, "supabase.anonKey")
    },
    llm: {
      provider,
      model,
      apiKey: requireString(llm.apiKey, "llm.apiKey")
    },
    fcm: {
      projectId: requireString(fcm.projectId, "fcm.projectId"),
      clientEmail: requireString(fcm.clientEmail, "fcm.clientEmail"),
      privateKey: requireString(fcm.privateKey, "fcm.privateKey")
    }
  };
}

type UnknownRecord = Record<string, unknown>;

function requireObject(value: unknown, label: string): UnknownRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value as UnknownRecord;
}

function requireString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string`);
  }
  return value;
}
