# MIND-Mate Configuration Guide

This guide explains every field in `config/mindmate.yaml` in plain language.
Each step tells you what the service is, why MIND‑Mate needs it, and where to
get the value.

**Security note:** `config/mindmate.yaml` contains secrets. Keep it local and do
not commit it. If you already committed it, remove it from git history and
rotate the keys.

To keep it out of commits:
- Add `config/mindmate.yaml` to `.gitignore`, or
- Run `git update-index --assume-unchanged config/mindmate.yaml`

---

## 1) Supabase (Database + Auth)

**What it is:** Supabase is the cloud database and authentication system for
MIND‑Mate. It stores your setup, meal logs, weekly scores, chat history, and
notification tokens, and it manages user sign‑in.

**Why it is needed:** Without Supabase, the app can only store data locally in
your browser. Supabase enables sync across devices and user accounts.

**Goal:** Fill `supabase.url` and `supabase.anonKey`.

**Steps:**
1. Open **Supabase Dashboard** and select your project.
2. Go to **Project Settings → API**.
3. Copy:
   - **Project URL** → `supabase.url`
   - **Anon public key** → `supabase.anonKey`

---

## 2) LLM Provider (OpenAI or Gemini)

**What it is:** The LLM provider generates the coach’s responses (the Smart
Coach chat and meal comparisons).

**Why it is needed:** MIND‑Mate uses a hybrid architecture: the logic layer
produces rules and context, and the LLM turns that context into human‑readable
coaching.

**Goal:** Fill `llm.provider`, `llm.model`, `llm.apiKey`.

### Option A: OpenAI
1. Go to **OpenAI Dashboard → API Keys**.
2. Create a new key.
3. Use:
   - `llm.provider: "openai"`
   - `llm.model: "gpt-4o"`
   - `llm.apiKey: "<your-openai-key>"`

### Option B: Gemini
1. Go to **Google AI Studio → API Keys**.
2. Create a new key.
3. Use:
   - `llm.provider: "gemini"`
   - `llm.model: "gemini-1.5-pro"`
   - `llm.apiKey: "<your-gemini-key>"`

---

## 3) Firebase Admin (Server‑side FCM)

**What it is:** Firebase Cloud Messaging (FCM) sends push notifications. The
Admin credentials let your server send messages on behalf of your Firebase
project.

**Why it is needed:** Proactive nudges are delivered as push notifications, so
the server needs permission to send them.

**Goal:** Fill `fcm.projectId`, `fcm.clientEmail`, `fcm.privateKey`.

**Steps:**
1. Open **Firebase Console** and select your project.
2. Go to **Project Settings → Service Accounts**.
3. Click **Generate new private key** and download the JSON file.
4. Copy these fields from the JSON:
   - `project_id` → `fcm.projectId`
   - `client_email` → `fcm.clientEmail`
   - `private_key` → `fcm.privateKey`

**Important:** paste `private_key` using YAML’s multi‑line format.

---

## 4) Firebase Web (Client‑side FCM)

**What it is:** The Firebase Web config lets the browser register itself and
receive push notifications.

**Why it is needed:** The user’s browser must get a device token and send it to
the server so notifications can be targeted to that user.

**Goal:** Fill the `fcm.web.*` section.

### 4.1 Register a Web App
1. Firebase Console → **Project Settings → General**.
2. Under **Your apps**, click **Add app** → **Web**.
3. Register the app and copy the Firebase config values:
   - `apiKey` → `fcm.web.apiKey`
   - `authDomain` → `fcm.web.authDomain`
   - `projectId` → `fcm.web.projectId`
   - `appId` → `fcm.web.appId`
   - `messagingSenderId` → `fcm.web.messagingSenderId`

### 4.2 Generate a VAPID key
1. Firebase Console → **Project Settings → Cloud Messaging**.
2. Under **Web configuration**, generate a **Web Push certificate**.
3. Copy the **VAPID key** → `fcm.web.vapidKey`.

---

## 5) Example YAML Template

```
supabase:
  url: "https://YOUR-PROJECT.supabase.co"
  anonKey: "YOUR-ANON-KEY"
llm:
  provider: "openai"
  model: "gpt-4o"
  apiKey: "sk-..."
fcm:
  projectId: "your-firebase-project-id"
  clientEmail: "firebase-adminsdk-xyz@your-project.iam.gserviceaccount.com"
  privateKey: |
    -----BEGIN PRIVATE KEY-----
    ABCDEF...
    -----END PRIVATE KEY-----
  web:
    apiKey: "AIza..."
    authDomain: "your-project.firebaseapp.com"
    projectId: "your-project-id"
    appId: "1:123456:web:abcdef"
    messagingSenderId: "123456"
    vapidKey: "BNc..."
```

---

## 6) Validate the Config

**What it does:** The validator checks that every field is filled and that no
placeholders remain.

**Why it is needed:** It prevents the app from starting with missing or fake
credentials, which would cause confusing runtime failures.

Run it manually:

```
npm run validate:config
```

It also runs automatically before:
- `npm run dev`
- `npm run start`

---

## 7) Test Supabase Parameters

**What it does:** Confirms your Supabase URL and anon key were loaded from the
YAML file and look valid.

Run the targeted test:

```
npm test -- tests/supabaseConfigIntegration.test.ts
```

If it fails:
- Re-check the **Project URL** and **Anon public key**.
- Make sure `supabase.url` starts with `https://` and ends with `.supabase.co`.

---

## 8) Supabase Auth Redirect URL

**What it is:** Supabase needs to know which URLs are allowed to complete
magic‑link sign‑in.

**Why it is needed:** Without this, sign‑in links will fail after the user
clicks them.

Steps:
1. Supabase → **Auth → URL Configuration**.
2. Add:
   - `http://localhost:3000/auth`
   - `https://<your-domain>/auth`
