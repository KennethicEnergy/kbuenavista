import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function getFirebaseAdmin() {
  if (getApps().length) {
    return getAuth();
  }

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccount) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY. Add it to .env.local");
  }

  const parsed = JSON.parse(serviceAccount) as ServiceAccount;
  initializeApp({ credential: cert(parsed) });
  return getAuth();
}

export async function verifyIdToken(token: string) {
  const auth = getFirebaseAdmin();
  return auth.verifyIdToken(token);
}
