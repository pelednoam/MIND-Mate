# MIND-Mate Deployment Guide

This guide shows how to deploy the app from GitHub to Vercel.

---

## 1) Prepare the repo locally

1. Fill in `config/mindmate.yaml` with real values.
2. Run checks:
   - `npm test`
   - `npm run build`

**Security note:** `config/mindmate.yaml` contains secrets. Keep the GitHub repo
private, or ask to convert the config to a secure secrets-based workflow.

---

## 2) Push to GitHub

```bash
git status
git add config/mindmate.yaml
git commit -m "Add production config"
```

Create a new GitHub repository and push:

```bash
git remote add origin https://github.com/<you>/MIND-Mate.git
git push -u origin main
```

---

## 3) Deploy on Vercel

1. Go to **Vercel Dashboard → New Project**.
2. Import the GitHub repo.
3. Framework auto-detects **Next.js**.
4. Click **Deploy**.

No extra environment variables are needed because the app reads config from
`config/mindmate.yaml`.

---

## 4) Update Supabase Auth Redirect URLs

Magic-link auth requires redirect URLs in Supabase:

1. Supabase → **Auth → URL Configuration**.
2. Add:
   - `https://<your-vercel-domain>/auth`
   - `http://localhost:3000/auth` (for local dev)

---

## 5) Verify the deployment

1. Open `/auth` and sign in.
2. Open `/notifications` and enable push.
3. Open `/sync` and confirm Supabase sync works.
