"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BiLogoGithub } from "react-icons/bi";
import { IoLogoLinkedin } from "react-icons/io";
import { MdErrorOutline, MdFileDownload, MdWarningAmber } from "react-icons/md";
import { ImSpinner2 } from "react-icons/im";
import { RiMapPin2Line } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/auth/login-modal";
import { ThankYouModal } from "@/components/auth/thank-you-modal";
import { useAuth } from "@/components/auth/auth-provider";
import { toaster } from "@/lib/toaster";
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

function getFirstName(displayName: string | null | undefined) {
  const trimmed = displayName?.trim();
  if (!trimmed) return "there";
  return trimmed.split(/\s+/)[0] ?? "there";
}

export function Profile({ site }: ProfileProps) {
  const { user, getIdToken, configured } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [thanksName, setThanksName] = useState("there");
  const [isDownloading, setIsDownloading] = useState(false);

  const performDownload = async (token: string, displayName?: string | null) => {
    setIsDownloading(true);
    try {
      const url = await requestResumeUrl(token);
      openUrl(url);
      setThanksName(getFirstName(displayName ?? user?.displayName));
      setShowThanks(true);
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    if (typeof sessionStorage === "undefined") return;
    if (sessionStorage.getItem(PENDING_DOWNLOAD_KEY) !== "1") return;
    sessionStorage.removeItem(PENDING_DOWNLOAD_KEY);
    setIsDownloading(true);
    getIdToken()
      .then((token) => {
        if (token) return performDownload(token, user.displayName);
        setIsDownloading(false);
      })
      .catch(() => {
        setIsDownloading(false);
        toaster.error(
          "Could not download resume. Please try again.",
          <MdErrorOutline size={20} />,
          "top-right",
        );
      });
  }, [user, getIdToken]);

  const handleDownload = async () => {
    if (!configured) {
      toaster.warning(
        "Resume download requires Firebase configuration.",
        <MdWarningAmber size={20} />,
        "top-right",
      );
      return;
    }
    if (!user) {
      setShowLogin(true);
      return;
    }
    try {
      const token = await getIdToken();
      if (!token) throw new Error("Not authenticated");
      await performDownload(token, user.displayName);
    } catch {
      toaster.error(
        "Could not download resume. Please try again.",
        <MdErrorOutline size={20} />,
        "top-right",
      );
    }
  };

  return (
    <>
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={(token, displayName) => {
          performDownload(token, displayName).catch(() =>
            toaster.error(
              "Could not download resume. Please try again.",
              <MdErrorOutline size={20} />,
              "top-right",
            ),
          );
        }}
      />
      <ThankYouModal
        isOpen={showThanks}
        onClose={() => setShowThanks(false)}
        name={thanksName}
        githubUrl={site.githubUrl}
        linkedinUrl={site.linkedinUrl}
      />

      <section className="flex flex-col items-start justify-between py-10 animate-fade-up md:py-12 lg:flex-row">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary lg:text-7xl">
            <Link href="/about" className="text-brand transition-colors hover:underline">
              {site.fullName}
            </Link>
          </h1>
          <p className="my-2 flex items-center gap-2 text-sm uppercase tracking-[0.2em]">
            <RiMapPin2Line size={18} /> {site.country}
          </p>
          <p className="mt-3 max-w-xl text-base text-text-muted">{site.introduction}</p>
        </div>

        <div className="mt-5 flex flex-wrap items-start justify-end gap-1 lg:items-center">
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
          <Button
            onClick={handleDownload}
            disabled={isDownloading || (!configured && !user)}
            aria-busy={isDownloading}
            aria-label={isDownloading ? "Preparing resume download" : "Download resume"}
          >
            {isDownloading ? (
              <ImSpinner2 size={18} className="animate-spin" />
            ) : (
              <MdFileDownload size={18} />
            )}
          </Button>
        </div>
      </section>
    </>
  );
}
