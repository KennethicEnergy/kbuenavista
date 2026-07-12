"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import {
  GoogleAuthProvider,
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase/client";
import { setPendingResumeDownload } from "@/lib/resume-gate";

const IDLE_TIMEOUT_MS = 10 * 60 * 1000;
const ACTIVITY_EVENTS = ["pointerdown", "keydown", "scroll", "touchstart"] as const;

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  configured: boolean;
  signInWithGoogle: (
    preferRedirect?: boolean,
  ) => Promise<{ token: string; displayName: string | null } | null>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const configured = isFirebaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(configured);

  useEffect(() => {
    if (!configured) return;

    const auth = getFirebaseAuth();
    if (!auth) return;

    void getRedirectResult(auth);

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, [configured]);

  useEffect(() => {
    if (!user) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const signOutIdle = () => {
      const auth = getFirebaseAuth();
      if (!auth) return;
      void firebaseSignOut(auth);
    };

    const resetIdleTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(signOutIdle, IDLE_TIMEOUT_MS);
    };

    resetIdleTimer();
    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, resetIdleTimer, { passive: true });
    }

    return () => {
      clearTimeout(timeoutId);
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, resetIdleTimer);
      }
    };
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      configured,
      signInWithGoogle: async (preferRedirect = false) => {
        const auth = getFirebaseAuth();
        if (!auth) throw new Error("Firebase is not configured");
        const provider = new GoogleAuthProvider();

        // Prefer popup: redirect fails on modern browsers without same-origin authDomain.
        if (preferRedirect) {
          setPendingResumeDownload();
          await signInWithRedirect(auth, provider);
          return null;
        }

        try {
          const result = await signInWithPopup(auth, provider);
          const token = await result.user.getIdToken();
          return { token, displayName: result.user.displayName };
        } catch (err) {
          const code =
            err && typeof err === "object" && "code" in err
              ? String((err as { code: unknown }).code)
              : "";
          if (code === "auth/popup-blocked" || code === "auth/cancelled-popup-request") {
            setPendingResumeDownload();
            await signInWithRedirect(auth, provider);
            return null;
          }
          throw err;
        }
      },
      signOut: async () => {
        const auth = getFirebaseAuth();
        if (!auth) return;
        await firebaseSignOut(auth);
      },
      getIdToken: async () => {
        if (!user) return null;
        return user.getIdToken();
      },
    }),
    [user, loading, configured],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
