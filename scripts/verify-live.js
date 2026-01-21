const fs = require("fs");
const path = require("path");
const { parse } = require("yaml");

const configPath = path.join(__dirname, "..", "config", "mindmate.yaml");
if (!fs.existsSync(configPath)) {
  throw new Error("config/mindmate.yaml not found");
}

const config = parse(fs.readFileSync(configPath, "utf8"));

async function verifySupabase() {
  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(config.supabase.url, config.supabase.anonKey);
  const { error } = await client
    .from("mind_setup")
    .select("user_id", { head: true, count: "exact" })
    .limit(1);
  if (error) {
    throw new Error(`Supabase check failed: ${error.message}`);
  }
}

async function verifyLlm() {
  const { generateText } = await import("ai");
  const { createOpenAI } = await import("@ai-sdk/openai");
  const { createGoogleGenerativeAI } = await import("@ai-sdk/google");

  let model;
  if (config.llm.provider === "openai") {
    const provider = createOpenAI({ apiKey: config.llm.apiKey });
    model = provider(config.llm.model);
  } else {
    const provider = createGoogleGenerativeAI({ apiKey: config.llm.apiKey });
    model = provider(config.llm.model);
  }

  await generateText({
    model,
    system: "You are a test assistant.",
    prompt: "Reply with: OK"
  });
}

async function verifyFcmAdmin() {
  const testToken = config.fcm.testToken;
  if (!testToken) {
    throw new Error("Missing fcm.testToken for admin send verification");
  }

  const { cert, getApps, initializeApp } = require("firebase-admin/app");
  const { getMessaging } = require("firebase-admin/messaging");

  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: config.fcm.projectId,
        clientEmail: config.fcm.clientEmail,
        privateKey: config.fcm.privateKey.replace(/\\n/g, "\n")
      })
    });
  }

  const messaging = getMessaging();
  await messaging.send({
    token: testToken,
    notification: {
      title: "MIND-Mate test",
      body: "Config verification ping."
    }
  });
}

async function run() {
  const failures = [];

  try {
    await verifySupabase();
    console.log("Supabase: OK");
  } catch (error) {
    failures.push(error instanceof Error ? error.message : String(error));
  }

  try {
    await verifyLlm();
    console.log("LLM: OK");
  } catch (error) {
    failures.push(error instanceof Error ? error.message : String(error));
  }

  try {
    await verifyFcmAdmin();
    console.log("FCM Admin: OK");
  } catch (error) {
    failures.push(error instanceof Error ? error.message : String(error));
  }

  if (failures.length > 0) {
    console.error("Verification failed:");
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
