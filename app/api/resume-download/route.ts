import { NextRequest, NextResponse } from "next/server";
import { getSite } from "@/lib/content";
import { logResumeDownload, verifyIdToken } from "@/lib/firebase/admin";

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
    const isDev = process.env.NODE_ENV === "development";
    return NextResponse.json(
      {
        error: "Unauthorized",
        details: isDev
          ? message
          : "Token verification failed. Check Firebase Admin configuration.",
      },
      { status: 401 },
    );
  }
}
