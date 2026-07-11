type VerifiedUser = {
  uid: string;
  email: string | undefined;
  name: string | undefined;
};

/**
 * Verify a Firebase ID token via Identity Toolkit REST (no Admin SDK).
 * Avoids firebase-admin cold-start crashes on Vercel serverless.
 */
export async function verifyIdToken(idToken: string): Promise<VerifiedUser> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing NEXT_PUBLIC_FIREBASE_API_KEY");
  }

  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    },
  );

  const data = (await res.json()) as {
    users?: Array<{ localId?: string; email?: string; displayName?: string }>;
    error?: { message?: string };
  };

  const user = data.users?.[0];
  if (!res.ok || !user?.localId) {
    throw new Error(data.error?.message || "Invalid Firebase ID token");
  }

  return {
    uid: user.localId,
    email: user.email,
    name: user.displayName,
  };
}
