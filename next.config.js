const fs = require("fs");
const path = require("path");
const { parse } = require("yaml");

const configPath = path.join(__dirname, "config", "mindmate.yaml");
const rawConfig = fs.readFileSync(configPath, "utf8");
const parsed = parse(rawConfig);

if (!parsed || typeof parsed !== "object") {
  throw new Error("config must be an object");
}

const supabase = parsed.supabase;
if (!supabase || typeof supabase !== "object") {
  throw new Error("supabase config is required");
}

const supabaseUrl = supabase.url;
const supabaseAnonKey = supabase.anonKey;
if (!supabaseUrl || typeof supabaseUrl !== "string") {
  throw new Error("supabase.url is required");
}
if (!supabaseAnonKey || typeof supabaseAnonKey !== "string") {
  throw new Error("supabase.anonKey is required");
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey
  }
};

module.exports = nextConfig;
