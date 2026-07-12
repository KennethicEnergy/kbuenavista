import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function parseServiceAccount(raw: string): ServiceAccount {
  const trimmed = raw.trim();

  const candidates = [
    trimmed,
    trimmed.replace(/^['"]|['"]$/g, ""),
  ];

  const objectMatch = trimmed.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    candidates.push(objectMatch[0]);
  }

  for (const candidate of candidates) {
    try {
      let parsed: unknown = JSON.parse(candidate);
      if (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }
      const account = parsed as ServiceAccount & { private_key?: string };
      if (typeof account.private_key === "string") {
        account.private_key = account.private_key.replace(/\\n/g, "\n");
      }
      return account;
    } catch {
      // try next
    }
  }

  throw new Error(
    "FIREBASE_SERVICE_ACCOUNT_KEY is invalid JSON. Paste the full key as one line in .env.local / Vercel.",
  );
}

function getAdminApp() {
  if (getApps().length) {
    return getApps()[0]!;
  }

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccount) {
    throw new Error(
      "Missing FIREBASE_SERVICE_ACCOUNT_KEY. Add it in Vercel or .env.local.",
    );
  }

  const parsed = parseServiceAccount(serviceAccount);
  return initializeApp({ credential: cert(parsed) });
}

export async function logResumeDownload(entry: {
  uid: string;
  email: string | undefined;
  displayName: string | undefined;
  userAgent: string | null;
}) {
  getAdminApp();
  await getFirestore().collection("resume_downloads").add({
    uid: entry.uid,
    email: entry.email ?? null,
    displayName: entry.displayName ?? null,
    userAgent: entry.userAgent,
    downloadedAt: new Date().toISOString(),
  });
}

export type ResumeDownloadStats = {
  total: number;
  uniqueDownloaders: number;
  downloadsToday: number;
};

export async function getResumeDownloadStats(): Promise<ResumeDownloadStats> {
  getAdminApp();
  const snapshot = await getFirestore()
    .collection("resume_downloads")
    .select("uid", "downloadedAt")
    .get();

  const now = new Date();
  const startOfUtcDay = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  ).toISOString();

  const uids = new Set<string>();
  let downloadsToday = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (typeof data.uid === "string" && data.uid.length > 0) {
      uids.add(data.uid);
    }
    if (typeof data.downloadedAt === "string" && data.downloadedAt >= startOfUtcDay) {
      downloadsToday += 1;
    }
  }

  return {
    total: snapshot.size,
    uniqueDownloaders: uids.size,
    downloadsToday,
  };
}
