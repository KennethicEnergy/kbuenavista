"use client";

import { useEffect, useEffectEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BiLogoGithub } from "react-icons/bi";
import { IoLogoLinkedin } from "react-icons/io";
import { MdErrorOutline, MdFileDownload, MdLogout, MdWarningAmber } from "react-icons/md";
import { ImSpinner2 } from "react-icons/im";
import { RiMapPin2Line } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/auth/login-modal";
import { ThankYouModal } from "@/components/auth/thank-you-modal";
import { useAuth } from "@/components/auth/auth-provider";
import { toaster } from "@/lib/toaster";
import {
  consumePendingResumeDownload,
  isMobileClient,
  openResumeUrl,
} from "@/lib/resume-gate";
import type { SiteContent } from "@/content/types";

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

function getFirstName(displayName: string | null | undefined) {
  const trimmed = displayName?.trim();
  if (!trimmed) return "there";
  return trimmed.split(/\s+/)[0] ?? "there";
}

function notifyDownloadError() {
  toaster.error(
    "Could not download resume. Please try again.",
    <MdErrorOutline size={20} />,
    "top-right",
  );
}

export function Profile({ site }: ProfileProps) {
  const { user, getIdToken, configured, signOut } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [thanksName, setThanksName] = useState("there");
  const [isDownloading, setIsDownloading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const performDownload = async (token: string, displayName?: string | null) => {
    setIsDownloading(true);
    try {
      const url = await requestResumeUrl(token);
      openResumeUrl(url);
      if (!isMobileClient()) {
        setThanksName(getFirstName(displayName ?? user?.displayName));
        setShowThanks(true);
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const resumePendingDownload = useEffectEvent(() => {
    void (async () => {
      try {
        const token = await getIdToken();
        if (!token || !user) return;
        await performDownload(token, user.displayName);
      } catch {
        notifyDownloadError();
      }
    })();
  });

  useEffect(() => {
    if (!user) return;
    if (!consumePendingResumeDownload()) return;
    resumePendingDownload();
  }, [user]);

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-account-menu]")) return;
      setMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

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
    setMenuOpen(false);
    try {
      const token = await getIdToken();
      if (!token) throw new Error("Not authenticated");
      await performDownload(token, user.displayName);
    } catch {
      notifyDownloadError();
    }
  };

  const renderUser = () => (
    <>
      {user ? (
        <div data-account-menu className="relative z-30 ml-1">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            disabled={isDownloading}
            aria-busy={isDownloading}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-label={`Account menu for ${user.displayName ?? "signed-in user"}`}
            className="relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-brand/50 transition hover:ring-brand disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDownloading ? (
              <ImSpinner2 size={18} className="animate-spin text-brand" />
            ) : user.photoURL ? (
              <Image
                src={user.photoURL}
                alt=""
                width={40}
                height={40}
                referrerPolicy="no-referrer"
                unoptimized
                className="size-full object-cover"
              />
            ) : (
              <span className="flex size-full items-center justify-center bg-brand text-sm font-semibold text-bg-base">
                {getFirstName(user.displayName).charAt(0).toUpperCase()}
              </span>
            )}
          </button>

          {menuOpen ? (
            <div
              role="menu"
              className="absolute right-0 z-50 mt-2 min-w-44 overflow-hidden rounded-md border border-brand/20 bg-bg-surface py-1 shadow-lg"
            >
              <button
                type="button"
                role="menuitem"
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text-primary transition-colors hover:bg-bg-elevated hover:text-brand disabled:opacity-50"
              >
                <MdFileDownload size={18} />
                Download resume
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text-muted transition-colors hover:bg-bg-elevated hover:text-brand"
              >
                <MdLogout size={18} />
                Log out
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <Button
          onClick={handleDownload}
          disabled={isDownloading || !configured}
          aria-busy={isDownloading}
          aria-label={isDownloading ? "Preparing resume download" : "Download resume"}
        >
          {isDownloading ? (
            <ImSpinner2 size={18} className="animate-spin" />
          ) : (
            <MdFileDownload size={18} />
          )}
        </Button>
      )}

    </>
  )

  const handleSignOut = async () => {
    setMenuOpen(false);
    await signOut();
  };

  return (
    <>
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={(token, displayName) => {
          performDownload(token, displayName).catch(notifyDownloadError);
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
        <div className="w-full">
          <div className="flex w-full items-center justify-between gap-3">
            <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary lg:text-7xl">
              <Link href="/me" className="text-brand transition-colors hover:underline">
                {site.fullName}
              </Link>
            </h1>
            <div className="lg:hidden">{renderUser()}</div>
          </div>
          <p className="my-2 flex items-center gap-2 text-sm uppercase tracking-section">
            <RiMapPin2Line size={18} /> {site.country}
          </p>
          <p className="mt-3 max-w-xl text-base text-text-muted">{site.introduction}</p>
        </div>

        <div className="mt-5 flex items-start justify-end gap-1 lg:items-center">
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
          <div className="hidden lg:block">
            {renderUser()}
          </div>
        </div>
      </section>
    </>
  );
}
