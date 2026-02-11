import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/firebase-admin";
import { googleDocId } from "@/app/constants/constants";

const RESUME_PDF_URL = `https://docs.google.com/document/d/${googleDocId}/export?format=pdf`;

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await verifyIdToken(token);

    return NextResponse.json({ url: RESUME_PDF_URL });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const code = error && typeof error === "object" && "code" in error ? (error as { code: string }).code : "";
    console.error("Resume download error:", code || message, error);
    const isDev = process.env.NODE_ENV === "development";
    const details = isDev
      ? message
      : "Token verification failed. Ensure FIREBASE_SERVICE_ACCOUNT_KEY is set on Vercel and matches the same Firebase project as your client config. Check the function logs for the exact error.";
    return NextResponse.json({ error: "Unauthorized", details }, { status: 401 });
  }
}
