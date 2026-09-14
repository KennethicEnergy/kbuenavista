# Home hero resume CTA + OG refresh

**Date:** 2026-09-14  
**Status:** Approved (revised: full first-viewport hero)  
**Scope:** Full-viewport home hero with labeled resume download; visually refresh Open Graph / Twitter images with updated eyebrow copy.

## Goals

- Own the first viewport as a single hero composition (full-bleed photo plane + brand + CTA).
- Make the resume download action obvious (labeled button above socials).
- Keep the existing Firebase-gated download flow (login modal, thank-you modal, signed-in avatar menu).
- Refresh the OG/Twitter share image hierarchy and change the eyebrow to “Let’s Work Together!” without changing the rest of the informational content.

## Non-goals

- Extracting a separate Hero component or download hook module.
- Putting “Download resume” copy into the OG image.
- Changes to `/me`, Skills, or Experience sections (beyond the home hero preceding them).

## Approach

Evolve `components/profile/profile.tsx` into a full-viewport hero. Update `app/opengraph-image.tsx` and `app/twitter-image.tsx` in sync.

## Hero layout & CTA

**File:** `components/profile/profile.tsx`

**Structure:**

- Full-bleed first viewport (`min-h-[100dvh]`, breaks out of the max-width shell).
- Dominant background: first about slideshow image with navy scrims for type contrast; slow pan motion.
- Content stack (left-aligned, vertically centered): location eyebrow → name (brand) → rotating intro → download CTA → socials.
- Name links to `/me`.

**Signed out:**

- Primary `Button`: download icon + label **Download resume**, above GitHub/LinkedIn.
- Preserve gated flow: login modal → download → thank-you (desktop).

**Signed in:**

- Avatar account menu above socials (**Download resume** + **Log out**).
- No second labeled download button.

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
- Subtle brand accent (lime edge bar + rule) on navy `#0a1628` / lime `#aaff00`.
- Size `1200×630`, `revalidate = 8`, alt text unchanged in meaning.

## Out of scope / deferred

- Resume CTA on About (`/me`).
- Shared OG image component extraction (optional later if duplication becomes painful).
- Metadata description / title string changes in `layout.tsx`.

## Success criteria

- First viewport reads as one full-page hero with photo plane, brand name, intro, and download CTA.
- Signed-out visitors see a labeled **Download resume** button above socials.
- Signed-in visitors still use the avatar menu for download/logout.
- Existing auth/download edge cases (Firebase not configured, mobile thank-you skip, pending download after auth) still work.
- `/opengraph-image` and `/twitter-image` show the new eyebrow and refreshed layout.
