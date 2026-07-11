import { NextRequest, NextResponse } from "next/server";
import { getSite } from "@/lib/content";
import { verifyIdToken } from "@/lib/firebase/verify-token";

export const runtime = "nodejs";

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

    // Optional analytics — Admin SDK is loaded only here so verify/download
    // still works if firebase-admin fails on Vercel.
    try {
      const { logResumeDownload } = await import("@/lib/firebase/admin");
      await logResumeDownload({
        uid: decoded.uid,
        email: decoded.email,
        displayName: decoded.name,
        userAgent: request.headers.get("user-agent"),
      });
    } catch (logError) {
      console.error("Resume download log failed:", logError);
    }

    return NextResponse.json({ url: resumeUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Resume download error:", message, error);

    return NextResponse.json(
      {
        error: "Unauthorized",
        details: "Token verification failed. Check Firebase configuration.",
      },
      { status: 401 },
    );
  }
}
