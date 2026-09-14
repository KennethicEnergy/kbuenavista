# Home hero resume CTA + OG refresh

**Date:** 2026-09-14  
**Status:** Approved  
**Scope:** Upgrade home `Profile` into a clearer hero with a labeled resume download button; visually refresh Open Graph / Twitter images with updated eyebrow copy.

## Goals

- Make the resume download action obvious on the home page (labeled button, not icon-only).
- Keep the existing Firebase-gated download flow (login modal, thank-you modal, signed-in avatar menu).
- Refresh the OG/Twitter share image hierarchy and change the eyebrow to “Let’s Work Together!” without changing the rest of the informational content.

## Non-goals

- Full-bleed / two-column hero redesign.
- Extracting a separate Hero component or download hook module.
- Putting “Download resume” copy into the OG image.
- Changes to `/me`, Skills, or Experience sections.

## Approach

Evolve `components/profile/profile.tsx` in place (Option 1). Update `app/opengraph-image.tsx` and `app/twitter-image.tsx` in sync.

## Hero layout & CTA

**File:** `components/profile/profile.tsx`

**Structure (unchanged):**

- Left: name (links to `/me`), location, rotating introduction.
- Right (desktop) / top-right (mobile): GitHub, LinkedIn, resume control.

**Signed out:**

- Replace the icon-only primary button with a primary `Button` showing the download icon + label **Download resume**.
- Preserve current behavior: unauthenticated click opens login modal; success continues download; desktop shows thank-you modal.

**Signed in:**

- Keep the avatar account menu with **Download resume** and **Log out**.
- Do not add a second labeled download button beside the avatar.

**Polish:**

- Slightly clearer vertical rhythm / spacing so the block reads as the page hero, without new imagery or layout rewrite.

## Open Graph / Twitter image

**Files:** `app/opengraph-image.tsx`, `app/twitter-image.tsx` (keep identical content).

**Content:**

| Slot | Value |
|------|--------|
| Eyebrow | Let’s Work Together! |
| Name | Kenneth Buenavista |
| Role | Senior Frontend Developer — React, Next.js, TypeScript |
| Tagline | Existing rotating tagline via `getRotatingTagline()` |
| Footer | Philippines · Hire Me |

**Visual refresh:**

- Stronger hierarchy: name dominant, role secondary, tagline quieter.
- Tighter spacing and alignment.
- Subtle brand accent (thin lime rule or corner mark) on navy `#0a1628` / lime `#aaff00`.
- Size `1200×630`, `revalidate = 8`, alt text unchanged in meaning.

## Out of scope / deferred

- Resume CTA on About (`/me`).
- Shared OG image component extraction (optional later if duplication becomes painful).
- Metadata description / title string changes in `layout.tsx`.

## Success criteria

- Signed-out visitors see a labeled **Download resume** button in the home hero next to socials.
- Signed-in visitors still use the avatar menu for download/logout.
- Existing auth/download edge cases (Firebase not configured, mobile thank-you skip, pending download after auth) still work.
- `/opengraph-image` and `/twitter-image` show the new eyebrow and refreshed layout.
