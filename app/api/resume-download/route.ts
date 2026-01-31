import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/firebase-admin";
import { Resend } from "resend";
import { googleDocId } from "@/app/constants/constants";

const RESUME_PDF_URL = `https://docs.google.com/document/d/${googleDocId}/export?format=pdf`;

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await verifyIdToken(token);
    const email = decodedToken.email;
    const displayName = decodedToken.name || email || "Unknown";

    const apiKey = process.env.RESEND_API_KEY;
    const notifyEmail = process.env.RESUME_DOWNLOAD_NOTIFY_EMAIL || process.env.RESEND_FROM_EMAIL;

    if (!apiKey || !notifyEmail) {
      return NextResponse.json(
        { error: "Email not configured", url: RESUME_PDF_URL },
        { status: 200 }
      );
    }

    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
        to: notifyEmail,
        subject: `Resume Downloaded: ${displayName}`,
        html: `
          <h2>Someone downloaded your resume</h2>
          <p><strong>Name:</strong> ${displayName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError);
    }

    return NextResponse.json({ url: RESUME_PDF_URL });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const code = error && typeof error === "object" && "code" in error ? (error as { code: string }).code : "";
    console.error("Resume download error:", code || message, error);
    return NextResponse.json(
      { error: "Unauthorized", details: process.env.NODE_ENV === "development" ? message : undefined },
      { status: 401 }
    );
  }
}
