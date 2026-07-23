import type { Metadata } from "next";
import Link from "next/link";
import { getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Kenneth Buenavista collects and uses email and first name when you download the resume.",
};

export default function PrivacyPage() {
  const site = getSite();

  return (
    <div className="py-16 animate-fade-up">
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="inline-flex text-sm font-medium text-brand underline-offset-4 hover:underline"
        >
          ←
        </Link>
        <p className="text-sm uppercase tracking-section text-brand">Legal</p>
      </div>

      <h1 className="mt-3 font-display text-4xl font-bold text-brand md:text-5xl">
        Privacy Policy
      </h1>
      <p className="mt-3 text-sm text-text-muted">Last updated: July 23, 2026</p>

      <div className="mt-8 max-w-3xl space-y-8 text-text-muted">
        <section>
          <h2 className="font-display text-xl font-semibold text-text-primary">
            Overview
          </h2>
          <p className="mt-3 leading-relaxed">
            This Privacy Policy explains how {site.fullName} (“I”, “me”, or “my”)
            collects and uses limited personal information when you sign in with
            Google to download my resume from {site.siteUrl.replace(/^https?:\/\//, "")}.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-text-primary">
            Information I collect
          </h2>
          <p className="mt-3 leading-relaxed">
            When you continue with Google to download my resume, I collect:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
            <li>Your email address</li>
            <li>Your first name (from your Google account display name)</li>
          </ul>
          <p className="mt-3 leading-relaxed">
            I may also store a download timestamp and basic technical details
            related to the request (such as user agent) to keep a record of the
            download.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-text-primary">
            How I use this information
          </h2>
          <p className="mt-3 leading-relaxed">
            I use your email address and first name so I can contact you after
            you download my resume — for example, to follow up about
            opportunities or continue a conversation.
          </p>
          <p className="mt-3 leading-relaxed">
            I do not sell your personal information, and I do not use it for
            unrelated marketing lists.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-text-primary">
            How this information is stored
          </h2>
          <p className="mt-3 leading-relaxed">
            Resume download records are stored securely using Firebase
            (Google Cloud / Firestore) in connection with Google Authentication.
            Access is limited to operating and maintaining this portfolio site
            and following up with people who download the resume.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-text-primary">
            Your choices
          </h2>
          <p className="mt-3 leading-relaxed">
            You can choose not to sign in. If you do not continue with Google,
            the gated resume download will not proceed. If you previously signed
            in and would like your download record removed, contact me using the
            details below and I will delete it when reasonably possible.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-text-primary">
            Contact
          </h2>
          <p className="mt-3 leading-relaxed">
            Questions about this Privacy Policy or your information can be sent
            through{" "}
            <Link
              href={site.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline-offset-4 hover:underline"
            >
              LinkedIn
            </Link>{" "}
            or{" "}
            <Link
              href={site.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline-offset-4 hover:underline"
            >
              GitHub
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
