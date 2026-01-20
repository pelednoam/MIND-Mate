const fs = require("fs");
const path = require("path");
const { parse } = require("yaml");

const configPath = path.join(__dirname, "..", "config", "mindmate.yaml");
if (!fs.existsSync(configPath)) {
  throw new Error("config/mindmate.yaml not found");
}

const raw = fs.readFileSync(configPath, "utf8");
const parsed = parse(raw);

function requireObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value;
}

function requireString(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string`);
  }
  if (value.includes("replace-with")) {
    throw new Error(`${label} still contains a placeholder`);
  }
  return value;
}

const root = requireObject(parsed, "config");

const supabase = requireObject(root.supabase, "supabase");
const supabaseUrl = requireString(supabase.url, "supabase.url");
const supabaseAnon = requireString(supabase.anonKey, "supabase.anonKey");
if (supabaseUrl.includes("example.supabase.co")) {
  throw new Error("supabase.url still contains placeholder");
}
if (supabaseAnon === "public-anon-key") {
  throw new Error("supabase.anonKey still contains placeholder");
}

const llm = requireObject(root.llm, "llm");
const llmProvider = requireString(llm.provider, "llm.provider");
const llmModel = requireString(llm.model, "llm.model");
requireString(llm.apiKey, "llm.apiKey");

if (llmProvider !== "openai" && llmProvider !== "gemini") {
  throw new Error("llm.provider must be openai or gemini");
}
if (llmProvider === "openai" && llmModel !== "gpt-4o") {
  throw new Error("llm.model must be gpt-4o when using openai");
}
if (llmProvider === "gemini" && llmModel !== "gemini-1.5-pro") {
  throw new Error("llm.model must be gemini-1.5-pro when using gemini");
}

const fcm = requireObject(root.fcm, "fcm");
requireString(fcm.projectId, "fcm.projectId");
requireString(fcm.clientEmail, "fcm.clientEmail");
const privateKey = requireString(fcm.privateKey, "fcm.privateKey");
if (privateKey.includes("line1") && privateKey.includes("line2")) {
  throw new Error("fcm.privateKey still contains placeholder");
}

const fcmWeb = requireObject(fcm.web, "fcm.web");
requireString(fcmWeb.apiKey, "fcm.web.apiKey");
requireString(fcmWeb.authDomain, "fcm.web.authDomain");
requireString(fcmWeb.projectId, "fcm.web.projectId");
requireString(fcmWeb.appId, "fcm.web.appId");
requireString(fcmWeb.messagingSenderId, "fcm.web.messagingSenderId");
requireString(fcmWeb.vapidKey, "fcm.web.vapidKey");
