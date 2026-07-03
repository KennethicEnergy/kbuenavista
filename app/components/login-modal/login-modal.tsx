"use client";

import React, { useEffect, useRef, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import styles from "./login-modal.module.scss";
import { getFirebaseAuth } from "@/lib/firebase";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (idToken: string) => void;
  authConfigured?: boolean;
  onDownloadWithoutSignIn?: () => void;
};

export default function LoginModal({
  isOpen,
  onClose,
  onSuccess,
  authConfigured = true,
  onDownloadWithoutSignIn,
}: LoginModalProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    modalRef.current?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const { signInWithPopup, signInWithRedirect, GoogleAuthProvider } = await import("firebase/auth");
      const auth = getFirebaseAuth();
      if (!auth) throw new Error("Firebase not initialized");
      const provider = new GoogleAuthProvider();

      const isMobile =
        typeof navigator !== "undefined" &&
        (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
          (typeof window !== "undefined" && window.innerWidth < 768));

      if (isMobile) {
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.setItem("resumeDownloadAfterAuth", "1");
        }
        await signInWithRedirect(auth, provider);
        return;
      }

      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      handleClose();
      onSuccess?.(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div
        ref={modalRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close"
        >
          <IoIosClose size={28} />
        </button>

        <h2 id="login-modal-title" className={styles.title}>Sign in to download resume</h2>
        <p className={styles.subtitle}>
          {authConfigured
            ? "Your email will be shared so we can stay in touch."
            : "Sign-in is not configured for this deployment."}
        </p>

        {error && <p className={styles.error} role="alert">{error}</p>}

        {!authConfigured && onDownloadWithoutSignIn ? (
          <button
            type="button"
            className={styles.submitButton}
            onClick={() => {
              onClose();
              onDownloadWithoutSignIn();
            }}
          >
            Download resume
          </button>
        ) : (
          <button
            type="button"
            className={styles.googleButton}
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <FcGoogle size={22} />
            {loading ? "Signing in..." : "Continue with Google"}
          </button>
        )}
      </div>
    </div>
  );
}
