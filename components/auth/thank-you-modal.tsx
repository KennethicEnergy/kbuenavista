"use client";

import { useEffect, useRef, type ReactElement } from "react";
import Link from "next/link";
import { BiLogoGithub } from "react-icons/bi";
import { IoClose, IoLogoLinkedin } from "react-icons/io5";
import { Button } from "@/components/ui/button";

type ConnectLink = {
  href: string;
  label: string;
  icon: ReactElement;
};

type ThankYouModalProps = {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  githubUrl?: string;
  linkedinUrl?: string;
};

export function ThankYouModal({
  isOpen,
  onClose,
  name,
  githubUrl,
  linkedinUrl,
}: ThankYouModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    modalRef.current?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const connectLinks: ConnectLink[] = [];
  if (githubUrl) {
    connectLinks.push({
      href: githubUrl,
      label: "GitHub",
      icon: <BiLogoGithub size={22} />,
    });
  }
  if (linkedinUrl) {
    connectLinks.push({
      href: linkedinUrl,
      label: "LinkedIn",
      icon: <IoLogoLinkedin size={22} />,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-base/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="thank-you-modal-title"
        tabIndex={-1}
        className="relative w-full max-w-md rounded-xl border border-bg-elevated bg-bg-surface p-6 shadow-xl animate-fade-up"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-3 top-3 rounded-md p-1 text-text-muted hover:bg-bg-elevated hover:text-text-primary"
          onClick={onClose}
          aria-label="Close"
        >
          <IoClose size={22} />
        </button>

        <h2
          id="thank-you-modal-title"
          className="font-display text-2xl font-semibold text-text-primary"
        >
          Thanks, <span className="text-brand">{name}!</span>
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          Your download has started. If you&apos;d like to stay in touch, feel free
          to connect — I&apos;d love to hear from you.
        </p>

        {connectLinks.length > 0 ? (
          <div className="mt-6">
            <p className="text-sm text-text-muted">Connect with me</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {connectLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button type="button" variant="outline" aria-label={link.label}>
                    {link.icon}
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
