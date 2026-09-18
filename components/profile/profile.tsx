"use client";

import { useEffect, useEffectEvent, useState } from "react";
import dynamic from "next/dynamic";
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
import { RotatingIntroduction } from "@/components/ui/rotating-introduction";
import { SkillsMarquee } from "@/components/skills/skills-marquee";

const HeroParticles = dynamic(
  () =>
    import("@/components/profile/hero-particles").then((mod) => mod.HeroParticles),
  { ssr: false },
);
import { toaster } from "@/lib/toaster";
import { cn } from "@/lib/utils/cn";
import {
  consumePendingResumeDownload,
  isMobileClient,
  openResumeUrl,
} from "@/lib/resume-gate";
import type { SiteContent, TimelineData } from "@/content/types";

type ProfileProps = {
  site: SiteContent;
  timeline: TimelineData[];
};

function isCareerBreak(item: TimelineData) {
  return (
    /break/i.test(item.company) ||
    /break/i.test(item.title) ||
    /break/i.test(item.projectName ?? "")
  );
}

function getFeaturedRoles(timeline: TimelineData[], count = 3) {
  return [...timeline]
    .reverse()
    .filter((item) => !isCareerBreak(item))
    .slice(0, count);
}

function shortRoleDate(date: string) {
  const parts = date.split(/\s*[-–—]\s*/);
  if (parts.length < 2) return date;
  const startYear = parts[0]?.match(/\d{4}/)?.[0];
  const end = /present/i.test(parts[1] ?? "")
    ? "Present"
    : parts[1]?.match(/\d{4}/)?.[0];
  if (startYear && end) return `${startYear} – ${end}`;
  return date;
}

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

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

function useIsCoarsePointer() {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarse(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return coarse;
}

function useScrollParallax(enabled: boolean) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setOffset(window.scrollY);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [enabled]);

  return enabled ? offset : 0;
}

export function Profile({ site, timeline }: ProfileProps) {
  const { user, getIdToken, configured, signOut } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [thanksName, setThanksName] = useState("there");
  const [isDownloading, setIsDownloading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const isCoarsePointer = useIsCoarsePointer();
  const scrollY = useScrollParallax(!reducedMotion && !isCoarsePointer);
  const featuredRoles = getFeaturedRoles(timeline);

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

  const handleSignOut = async () => {
    setMenuOpen(false);
    await signOut();
  };

  const renderUser = () => (
    <>
      {user ? (
        <div data-account-menu className="relative z-30">
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
              className="absolute left-0 z-50 mt-2 min-w-44 overflow-hidden rounded-md border border-brand/20 bg-bg-surface py-1 shadow-lg"
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
          className="shrink-0"
        >
          {isDownloading ? (
            <ImSpinner2 size={18} className="animate-spin" />
          ) : (
            <MdFileDownload size={18} />
          )}
          <span className="whitespace-nowrap">
            {isDownloading ? "Preparing…" : "Download resume"}
          </span>
        </Button>
      )}
    </>
  );

  const particlesOffset = Math.min(scrollY * 0.35, 180);
  const contentOffset = Math.min(scrollY * 0.18, 90);

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

      <section
        aria-label="Introduction"
        className="relative isolate ml-[calc(50%-50vw)] w-screen max-w-[100vw] overflow-hidden min-h-[100svh] min-h-dvh"
      >
        <div
          className="pointer-events-none absolute bg-bg-base"
          style={{
            top: "calc(-1 * env(safe-area-inset-top, 0px))",
            right: "calc(-1 * env(safe-area-inset-right, 0px))",
            bottom: "calc(-1 * env(safe-area-inset-bottom, 0px))",
            left: "calc(-1 * env(safe-area-inset-left, 0px))",
          }}
          aria-hidden
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_srgb,var(--brand)_14%,transparent),transparent_55%),radial-gradient(ellipse_at_bottom_left,color-mix(in_srgb,var(--bg-elevated)_80%,transparent),transparent_50%)]" />
          {/*
            Keep the canvas in a non-transformed box on touch devices. Safari iOS
            often paints a blank canvas when an ancestor uses transform.
          */}
          {!reducedMotion ? (
            <div className="absolute inset-0 overflow-hidden">
              <HeroParticles
                className="absolute inset-0 h-full min-h-full w-full"
                style={
                  isCoarsePointer
                    ? undefined
                    : {
                        transform: `translate3d(0, ${particlesOffset}px, 0)`,
                        willChange: "transform",
                      }
                }
              />
            </div>
          ) : null}
        </div>

        <div className="relative mx-auto flex min-h-dvh min-h-[100dvh] w-full max-w-5xl flex-col pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] pt-[max(4rem,env(safe-area-inset-top))] pb-[max(4rem,env(safe-area-inset-bottom))] md:pl-[max(2rem,env(safe-area-inset-left))] md:pr-[max(2rem,env(safe-area-inset-right))] md:pt-[max(5rem,env(safe-area-inset-top))] md:pb-[max(5rem,env(safe-area-inset-bottom))]">
          <div
            className="flex flex-1 flex-col justify-center will-change-transform"
            style={
              reducedMotion
                ? undefined
                : { transform: `translate3d(0, ${contentOffset}px, 0)` }
            }
          >
            <div className="flex max-w-4xl flex-col items-start">
              <p className="animate-fade-up flex items-center gap-2 text-sm uppercase tracking-section text-brand">
                <RiMapPin2Line size={18} /> {site.country}
              </p>

              <h1 className="animate-fade-up-delayed mt-4 font-display text-5xl font-bold leading-[0.95] tracking-tight text-brand sm:text-6xl md:text-7xl lg:text-8xl">
                <Link href="/me" className="transition-colors hover:underline">
                  {site.fullName}
                </Link>
              </h1>

              <RotatingIntroduction
                lines={site.introductions}
                intervalSeconds={site.introductionIntervalSeconds}
                className="mt-6 min-h-[2lh] max-w-xl text-lg text-text-primary/90 md:text-xl [animation-delay:0.12s]"
              />

              <div className="mt-10 flex w-full animate-fade-up-late items-start justify-between gap-4">
                <div>{renderUser()}</div>
                <div className="flex items-center gap-1 sm:gap-2">
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
                </div>
              </div>
            </div>

            {featuredRoles.length > 0 ? (
              <div className="mt-10 max-w-4xl animate-fade-up-late">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-sm uppercase tracking-section text-brand">
                    Recent roles
                  </p>
                  <Link
                    href="#experience"
                    className="text-sm text-text-muted underline-offset-4 transition-colors hover:text-brand hover:underline"
                  >
                    Full experience
                  </Link>
                </div>
                <ul className="mt-3 space-y-2">
                  {featuredRoles.map((role, index) => (
                    <li
                      key={role.id}
                      className={cn(
                        "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm text-text-muted transition-opacity md:text-base",
                        index === 1 && "opacity-55",
                        index === 2 && "opacity-28",
                      )}
                    >
                      <span
                        className={cn(
                          "font-medium",
                          index === 0 ? "text-text-primary" : "text-text-muted",
                        )}
                      >
                        {role.company}
                      </span>
                      <span aria-hidden className="text-text-muted/50">
                        ·
                      </span>
                      <span>{role.title}</span>
                      <span className="text-text-muted/70">
                        {shortRoleDate(role.date)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="relative mt-12 w-full overflow-hidden animate-fade-up-late">
            <p className="mb-4 text-sm uppercase tracking-section text-brand">
              What I work with
            </p>
            <SkillsMarquee
              compact
              className="overflow-hidden mask-[linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]"
            />
          </div>
        </div>
      </section>
    </>
  );
}
