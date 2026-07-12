# Mobile Resume Auth & Download Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix mobile Google sign-in + resume PDF open while keeping desktop popup and new-tab behavior.

**Architecture:** Extract shared `lib/resume-gate.ts` helpers (`isMobileClient`, pending-download localStorage, `openResumeUrl`). Auth provider writes the pending flag with localStorage on mobile redirect and surfaces `getRedirectResult` errors. Profile consumes the flag and opens URLs via the helper (same-tab on mobile, blank tab on desktop).

**Tech Stack:** Next.js App Router, Firebase Auth client SDK, React client components.

**Spec:** `docs/superpowers/specs/2026-07-12-mobile-resume-download-design.md`

---

### Task 1: Add `lib/resume-gate.ts`

**Files:**
- Create: `lib/resume-gate.ts`

- [x] **Step 1: Create the helper module**

```ts
export const PENDING_RESUME_DOWNLOAD_KEY = "resumeDownloadAfterAuth";

export function isMobileClient(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    ) || window.innerWidth < 768
  );
}

export function setPendingResumeDownload(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(PENDING_RESUME_DOWNLOAD_KEY, "1");
}

/** Returns true if a pending flag was present (and clears it). */
export function consumePendingResumeDownload(): boolean {
  if (typeof localStorage === "undefined") return false;
  const pending = localStorage.getItem(PENDING_RESUME_DOWNLOAD_KEY) === "1";
  if (pending) localStorage.removeItem(PENDING_RESUME_DOWNLOAD_KEY);
  // Clear legacy sessionStorage flag if present
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.removeItem(PENDING_RESUME_DOWNLOAD_KEY);
  }
  return pending;
}

export function openResumeUrl(url: string): void {
  if (isMobileClient()) {
    window.location.assign(url);
    return;
  }
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
```

- [x] **Step 2: Confirm TypeScript resolves the module**

Run: `pnpm exec tsc --noEmit` (or rely on next build / IDE). No unused exports.

---

### Task 2: Wire auth provider

**Files:**
- Modify: `components/auth/auth-provider.tsx`

- [x] **Step 1: Import helpers**

```ts
import {
  isMobileClient,
  setPendingResumeDownload,
} from "@/lib/resume-gate";
```

- [x] **Step 2: Replace inline mobile detection + sessionStorage with helpers**

In `signInWithGoogle`, replace the local `isMobile` block and `sessionStorage.setItem` with:

```ts
if (preferRedirect || isMobileClient()) {
  setPendingResumeDownload();
  await signInWithRedirect(auth, provider);
  return null;
}
```

- [x] **Step 3: Surface `getRedirectResult` failures**

Replace silent swallow with:

```ts
getRedirectResult(auth).catch((err) => {
  console.error("Firebase redirect result failed:", err);
});
```

(Toast optional; console is enough to avoid import cycles with toaster icons. Prefer a small toaster call if `toaster` is already used from client components without JSX icons — keep console if toaster requires React nodes.)

---

### Task 3: Wire profile download

**Files:**
- Modify: `components/profile/profile.tsx`

- [x] **Step 1: Import helpers; remove local `PENDING_DOWNLOAD_KEY` and `openUrl`**

```ts
import {
  consumePendingResumeDownload,
  isMobileClient,
  openResumeUrl,
} from "@/lib/resume-gate";
```

- [x] **Step 2: In `performDownload`, call `openResumeUrl(url)` instead of `openUrl(url)`**

On mobile, skip thank-you modal (navigation leaves the page):

```ts
const url = await requestResumeUrl(token);
openResumeUrl(url);
if (!isMobileClient()) {
  setThanksName(getFirstName(displayName ?? user?.displayName));
  setShowThanks(true);
}
```

- [x] **Step 3: Resume pending download via `consumePendingResumeDownload`**

```ts
useEffect(() => {
  if (!user) return;
  if (!consumePendingResumeDownload()) return;
  resumePendingDownload();
}, [user]);
```

---

### Task 4: Verify

- [x] **Step 1: Lint touched files**
- [x] **Step 2: Smoke-check in browser** — desktop download still new-tab; narrow viewport / mobile UA uses localStorage + same-tab assign path (verify in DevTools Application → Local Storage after tapping Continue with Google before redirect completes, if possible).

---

## Spec coverage

| Spec requirement | Task |
|------------------|------|
| Shared `isMobileClient` | 1 |
| localStorage pending flag | 1, 2, 3 |
| Same-tab open on mobile | 1, 3 |
| Desktop blank tab retained | 1, 3 |
| getRedirectResult not silent | 2 |
| Skip thank-you on mobile navigate | 3 |
