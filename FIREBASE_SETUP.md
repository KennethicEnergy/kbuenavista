# Firebase Setup for Resume Download

This guide explains how to configure Firebase Authentication for the resume download feature.

## Overview

- **Firebase Auth**: Visitors sign in with Google, then can download your resume. No email notifications.

If you skip setup, the resume will open directly without login.

---

## 1. Firebase Setup

### Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable **Authentication** → Sign-in method → Enable **Google**

### Get Firebase config

1. Project Settings (gear icon) → General → Your apps → Add app → Web
2. Copy the config values and add to `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Get Service Account key (for API route)

1. Project Settings → Service accounts → Generate new private key
2. Copy the entire JSON content
3. Add to `.env.local` as a single line:

```env
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

For Vercel: paste the full JSON as the env var value.

---

## 2. Full .env.local example

```env
# Firebase (client)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase (server - paste entire JSON)
FIREBASE_SERVICE_ACCOUNT_KEY={}
```

---

## 3. Authorized domains (Firebase Auth)

In Firebase Console → Authentication → Settings → Authorized domains, add:

- `localhost` (for local dev)
- Your production domain (e.g. `your-app.vercel.app` or custom domain)

---

## 4. Login then download – checklist (Vercel)

For **“Sign in with Google → download resume”** to work in production:

| # | What to check | Where |
|---|----------------|--------|
| 1 | **Same Firebase project** | Client config (NEXT_PUBLIC_FIREBASE_*) and **FIREBASE_SERVICE_ACCOUNT_KEY** must be from the **same** Firebase project. |
| 2 | **Client env vars on Vercel** | Add all 6: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`. |
| 3 | **Service account on Vercel** | Add `FIREBASE_SERVICE_ACCOUNT_KEY` with the **full** service account JSON as **one line**. |
| 4 | **Authorized domain** | Firebase Console → Authentication → Authorized domains includes your Vercel URL. |
| 5 | **Redeploy** | After changing env vars, trigger a new deployment. |

If it still fails, check Vercel → Logs (or Functions → resume-download) for the exact error.
