"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BiLogoGithub } from "react-icons/bi";
import { IoLogoLinkedin } from "react-icons/io";
import { MdFileDownload } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/auth/login-modal";
import { useAuth } from "@/components/auth/auth-provider";
import type { SiteContent } from "@/content/types";

const PENDING_DOWNLOAD_KEY = "resumeDownloadAfterAuth";

type ProfileProps = {
  site: SiteContent;
};

async function requestResumeUrl(token: string) {
  const res = await fetch("/api/resume-download", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = (await res.json()) as { url?: string; error?: string; details?: string };
  if (!res.ok || !data.url) {
    throw new Error(data.details || data.error || "Failed to get download link");
  }
  return data.url;
}

function openUrl(url: string) {
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function Profile({ site }: ProfileProps) {
  const { user, getIdToken, configured } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [error, setError] = useState("");

  const performDownload = async (token: string) => {
    const url = await requestResumeUrl(token);
    openUrl(url);
  };

  useEffect(() => {
    if (!user) return;
    if (typeof sessionStorage === "undefined") return;
    if (sessionStorage.getItem(PENDING_DOWNLOAD_KEY) !== "1") return;
    sessionStorage.removeItem(PENDING_DOWNLOAD_KEY);
    getIdToken()
      .then((token) => {
        if (token) return performDownload(token);
      })
      .catch(() => setError("Could not download resume. Please try again."));
  }, [user, getIdToken]);

  const handleDownload = async () => {
    setError("");
    if (!user) {
      setShowLogin(true);
      return;
    }
    try {
      const token = await getIdToken();
      if (!token) throw new Error("Not authenticated");
      await performDownload(token);
    } catch {
      setError("Could not download resume. Please try again.");
    }
  };

  return (
    <>
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={(token) => {
          performDownload(token).catch(() =>
            setError("Could not download resume. Please try again."),
          );
        }}
      />

      <section className="flex min-h-[70vh] flex-col justify-center py-16 animate-fade-up">
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-brand">
          {site.country}
        </p>
        <h1 className="font-display text-5xl font-bold leading-tight tracking-tight text-text-primary md:text-7xl">
          {site.fullName}
        </h1>
        <p className="mt-5 max-w-xl text-lg text-text-muted md:text-xl">
          {site.introduction}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button onClick={handleDownload} disabled={!configured && !user}>
            <MdFileDownload size={18} />
            Download resume
          </Button>
          <Link
            href={site.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-text-muted transition-colors hover:text-brand"
            aria-label="GitHub"
          >
            <BiLogoGithub size={24} />
          </Link>
          <Link
            href={site.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-text-muted transition-colors hover:text-brand"
            aria-label="LinkedIn"
          >
            <IoLogoLinkedin size={24} />
          </Link>
          <Link
            href="/about"
            className="text-sm text-text-muted underline-offset-4 hover:text-brand hover:underline"
          >
            About
          </Link>
        </div>

        {!configured ? (
          <p className="mt-4 text-sm text-warning">
            Resume download requires Firebase configuration.
          </p>
        ) : null}
        {error ? (
          <p className="mt-4 text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}
      </section>
    </>
  );
}
