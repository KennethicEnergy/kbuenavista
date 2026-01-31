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
3. Verify your domain (or use `onboarding@resend.dev` for testing)

Add to `.env.local`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=Portfolio <onboarding@resend.dev>
RESUME_DOWNLOAD_NOTIFY_EMAIL=your-email@example.com
```

- `RESEND_FROM_EMAIL`: Sender address (use your verified domain in production)
- `RESUME_DOWNLOAD_NOTIFY_EMAIL`: Where to receive download notifications (your email)

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
- Your production domain (e.g. `knvzta.com`)
