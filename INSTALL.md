# MIND-Mate Configuration Guide

This guide walks through every field in `config/mindmate.yaml` and where to
get the values. It also covers how to validate the configuration before
running the app.

---

## 1) Supabase

**Goal:** Fill `supabase.url` and `supabase.anonKey`.

1. Open **Supabase Dashboard** → your project.
2. Go to **Project Settings → API**.
3. Copy:
   - **Project URL** → `supabase.url`
   - **Anon public key** → `supabase.anonKey`

---

## 2) LLM Provider (OpenAI or Gemini)

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

**Goal:** Fill `fcm.projectId`, `fcm.clientEmail`, `fcm.privateKey`.

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

Run the validator before starting the app:

```
npm run validate:config
```

This command is also run automatically before:
- `npm run dev`
- `npm run start`

---

## 7) Supabase Auth Redirect URL

For magic‑link sign‑in:
1. Supabase → **Auth → URL Configuration**.
2. Add:
   - `http://localhost:3000/auth`
   - `https://<your-domain>/auth`
