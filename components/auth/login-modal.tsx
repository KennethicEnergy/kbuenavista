"use client";

import { useEffect, useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { IoClose } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (idToken: string) => void;
};

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const { configured, signInWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      if (!configured) {
        setError("Sign-in is not configured for this deployment.");
        return;
      }
      const token = await signInWithGoogle();
      if (token) {
        onClose();
        onSuccess?.(token);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-base/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
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

        <h2 id="login-modal-title" className="font-display text-xl font-semibold text-text-primary">
          Sign in to download resume
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          {configured
            ? "Continue with Google so downloads can be tracked. Your email is stored for analytics only."
            : "Firebase Auth is not configured. Add env vars to enable Google sign-in."}
        </p>

        {error ? (
          <p className="mt-4 text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}

        <Button
          className="mt-6 w-full"
          variant="outline"
          onClick={handleGoogle}
          disabled={loading || !configured}
        >
          <FcGoogle size={20} />
          {loading ? "Signing in..." : "Continue with Google"}
        </Button>
      </div>
    </div>
  );
}
