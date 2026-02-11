"use client";

import React, { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import styles from "./login-modal.module.scss";
// import { useAuth } from "@/app/providers/auth-provider";
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
  // const { signInWithEmail, signUpWithEmail } = useAuth();
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // const resetForm = () => {
  //   setEmail("");
  //   setPassword("");
  //   setError("");
  // };

  const handleClose = () => {
    // resetForm();
    onClose();
  };

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

  // const handleEmailSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");
  //   setLoading(true);
  //   try {
  //     if (isSignUp) {
  //       await signUpWithEmail(email, password);
  //     } else {
  //       await signInWithEmail(email, password);
  //     }
  //     const auth = getFirebaseAuth();
  //     const user = auth?.currentUser;
  //     const token = user ? await user.getIdToken() : "";
  //     handleClose();
  //     if (token) onSuccess?.(token);
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : "Authentication failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close"
        >
          <IoIosClose size={28} />
        </button>

        <h2 className={styles.title}>Sign in to download resume</h2>
        <p className={styles.subtitle}>
          {authConfigured
            ? "Your email will be shared so we can stay in touch."
            : "Sign-in is not configured for this deployment."}
        </p>

        {error && <p className={styles.error}>{error}</p>}

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
          <>
        <button
          type="button"
          className={styles.googleButton}
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <FcGoogle size={22} />
          Continue with Google
        </button>

        {/* <div className={styles.divider}>
          <span>or</span>
        </div> */}

        {/* <form onSubmit={handleEmailSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
            autoComplete={isSignUp ? "new-password" : "current-password"}
          />
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? "Please wait..." : isSignUp ? "Create account" : "Sign in"}
          </button>
        </form> */}

        {/* <button
          type="button"
          className={styles.toggleMode}
          onClick={() => {
            setIsSignUp((prev) => !prev);
            setError("");
          }}
        >
          {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
        </button> */}
          </>
        )}
      </div>
    </div>
  );
}
