# Firebase & Email Setup for Resume Download

This guide explains how to configure Firebase Authentication and email notifications for the resume download feature.

## Overview

- **Firebase Auth**: Visitors must sign in (Google or Email/Password) before downloading your resume.
- **Resend**: Sends you an email notification when someone downloads your resume (name, email, timestamp).

If you skip setup, the resume will download directly without login or notifications.

---

## 1. Firebase Setup

### Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable **Authentication** → Sign-in method → Enable **Google** and **Email/Password**

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
3. Add to `.env.local` as a single line (escape quotes if needed), or save to a file and use `GOOGLE_APPLICATION_CREDENTIALS`:

```env
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

For Vercel: paste the full JSON as the env var value.

---

## 2. Resend Setup (Email notifications)

1. Sign up at [Resend](https://resend.com) (free tier: 100 emails/day)
2. Create an API key at [Resend API Keys](https://resend.com/api-keys)
3. **Important:** If you use `onboarding@resend.dev` as the sender, Resend only allows sending **to the email address of your Resend account**. So set `RESUME_DOWNLOAD_NOTIFY_EMAIL` to that same email. To send to any address (e.g. a different Gmail), add and verify your own domain at [Resend Domains](https://resend.com/domains), then set `RESEND_FROM_EMAIL` to an address on that domain (e.g. `Portfolio <notify@yourdomain.com>`).

Add to `.env.local`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=Portfolio <onboarding@resend.dev>
RESUME_DOWNLOAD_NOTIFY_EMAIL=your-email@example.com
```

- `RESEND_FROM_EMAIL`: Sender address. With `onboarding@resend.dev`, you can only send to your Resend account email. Use a verified domain to send to any recipient.
- `RESUME_DOWNLOAD_NOTIFY_EMAIL`: Where to receive download notifications. Must be your Resend account email if using `onboarding@resend.dev`.

---

## 3. Full .env.local example

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

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=Portfolio <onboarding@resend.dev>
RESUME_DOWNLOAD_NOTIFY_EMAIL=
```

---

## 4. Authorized domains (Firebase Auth)

In Firebase Console → Authentication → Settings → Authorized domains, add:

- `localhost` (for local dev)
- Your production domain (e.g. `your-app.vercel.app` or custom domain)

---

## 5. Login then download – checklist (Vercel)

For **“Sign in → then download resume”** to work in production, **all** of the following must be true. If one is wrong, you get “Could not download resume” or the login form doesn’t show.

| # | What to check | Where |
|---|----------------|--------|
| 1 | **Same Firebase project** | Client config (NEXT_PUBLIC_FIREBASE_*) and **FIREBASE_SERVICE_ACCOUNT_KEY** must be from the **same** Firebase project. Check `project_id` in the service account JSON and compare with `NEXT_PUBLIC_FIREBASE_PROJECT_ID`. |
| 2 | **Client env vars on Vercel** | In your project → Settings → Environment Variables, add all 6: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`. |
| 3 | **Service account on Vercel** | Add `FIREBASE_SERVICE_ACCOUNT_KEY` with the **full** service account JSON (same project as step 1), as **one line**. |
| 4 | **Authorized domain** | Firebase Console → Authentication → Authorized domains includes your Vercel URL (e.g. `kbuenavista.vercel.app`). |
| 5 | **Redeploy** | After changing env vars, trigger a new deployment so the new values are used. |

If it still fails, open Vercel → your project → **Logs** (or **Functions** → resume-download) and check the “Resume download error: …” line for the exact cause (e.g. wrong project, invalid JSON).
