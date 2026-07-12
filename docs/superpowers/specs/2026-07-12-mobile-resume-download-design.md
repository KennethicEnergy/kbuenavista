# Mobile Resume Auth & Download — Design

**Date:** 2026-07-12  
**Status:** Approved (mobile-only; desktop behavior retained)

## Problem

On mobile browsers, resume Google sign-in and/or PDF download often fails:

1. **Primary login failure:** Mobile forced `signInWithRedirect`. On Chrome 115+, Safari 16.1+, and Firefox 109+, redirect auth fails unless a same-origin `authDomain` / proxy is configured (third-party storage partitioning). Users return to the site still logged out. Firebase recommends preferring `signInWithPopup` in this situation.
2. After auth (or when already signed in), the client opened the PDF via a synthetic `<a target="_blank">` click after an async `fetch`. Mobile browsers treat that as a popup and block it.
3. Pending download used `sessionStorage`, which often does not survive OAuth on iOS Safari.

Desktop popup + new-tab flow works and must stay unchanged for open behavior; auth should use popup on mobile too.

## Goals

- Mobile users can complete Google sign-in and receive the resume PDF.
- Desktop keeps popup auth and `target="_blank"` open behavior.
- Minimal surface area: shared helpers, no UI redesign.

## Non-goals

- Changing Firebase providers or API contract.
- Admin UI for download logs.
- Adding a full test framework in this change (helpers stay pure for future tests).
- Changing idle timeout / thank-you modal copy.

## Approach (chosen)

**Branch behavior by the same mobile detection already used for redirect auth.**

| Concern | Desktop | Mobile |
|--------|---------|--------|
| Auth | `signInWithPopup` | `signInWithPopup` (same; redirect only if popup blocked) |
| Pending download flag | unused (popup returns token) | `localStorage` if redirect fallback used |
| Open PDF URL | `<a target="_blank">` (existing) | `window.location.assign(url)` same tab |
| Redirect errors | N/A | Log when `getRedirectResult` fails |

### Alternatives considered

1. **Same-tab open everywhere** — simpler, but changes desktop UX (leaves the portfolio). Rejected.
2. **Always use localStorage + same-tab** — over-broad. Rejected.
3. **Explicit “Download now” button after redirect** — most reliable for gesture, but extra step. Deferred; same-tab assign after resume is enough if auth succeeds.

## Architecture

```
lib/resume-gate.ts          # isMobileClient, pending flag get/set/clear, openResumeUrl
components/auth/auth-provider.tsx  # use localStorage on mobile redirect; handle getRedirectResult
components/profile/profile.tsx     # consume pending flag from helper; use openResumeUrl
```

### Data flow (mobile)

1. User taps download → login modal → Continue with Google.
2. Before redirect: `localStorage.setItem("resumeDownloadAfterAuth", "1")`.
3. User returns; `onAuthStateChanged` sets user; `getRedirectResult` completes (errors toasted, not swallowed silently).
4. Profile effect sees pending flag → clears it → `POST /api/resume-download` → `location.assign(pdfUrl)`.
5. Thank-you modal may not show if navigation leaves the page immediately — acceptable on mobile; thank-you remains for desktop and for already-authenticated mobile downloads only if we open after toast… **Decision:** on mobile same-tab navigation, skip thank-you (user leaves for PDF). Already-auth mobile download also same-tab (no thank-you). Desktop always thank-you after blank open.

### Detection

Reuse existing heuristic (UA regex OR `innerWidth < 768`) in one shared `isMobileClient()` so auth and open/storage stay in sync.

## Error handling

- Keep existing download/sign-in toasts.
- On `getRedirectResult` rejection with a real error code (not “no redirect”), show a short error toast once on mount.

## Testing / verification

- Desktop ≥768, non-mobile UA: popup + new tab + thank-you.
- Narrow desktop window: treated as mobile (same as today) — localStorage + same-tab.
- Real phone: Google redirect → return signed in → PDF opens in same tab.
- Already signed-in mobile: download icon → PDF same tab.

## Files

- Add: `lib/resume-gate.ts`
- Edit: `components/auth/auth-provider.tsx`, `components/profile/profile.tsx`
- Docs: this spec + implementation plan
