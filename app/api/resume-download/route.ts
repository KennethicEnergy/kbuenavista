import { NextRequest, NextResponse } from "next/server";
import { getSite } from "@/lib/content";
import { logResumeDownload, verifyIdToken } from "@/lib/firebase/admin";

export const runtime = "nodejs";

function isConfigError(message: string) {
  return (
    message.includes("FIREBASE_SERVICE_ACCOUNT_KEY") ||
    message.includes("Failed to parse private key") ||
    message.includes("error:1E08010C") ||
    message.includes("credential")
  );
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyIdToken(token);
    const site = getSite();
    const resumeUrl = `https://docs.google.com/document/d/${site.googleDocId}/export?format=pdf`;

    try {
      await logResumeDownload({
        uid: decoded.uid,
        email: decoded.email,
        displayName: decoded.name,
        userAgent: request.headers.get("user-agent"),
      });
    } catch (logError) {
      // Don't block the download if analytics logging fails (e.g. Firestore not enabled yet).
      console.error("Resume download log failed:", logError);
    }

    return NextResponse.json({ url: resumeUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Resume download error:", message, error);

    if (isConfigError(message)) {
      return NextResponse.json(
        {
          error: "Server misconfigured",
          details:
            "FIREBASE_SERVICE_ACCOUNT_KEY is missing or invalid on this host. Set it as one-line JSON in Vercel env and redeploy.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        error: "Unauthorized",
        details: "Token verification failed. Check Firebase Admin configuration.",
      },
      { status: 401 },
    );
  }
}
