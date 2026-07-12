# Visitors Data Card (Resume Downloads) — Design

**Date:** 2026-07-12  
**Status:** Approved (option B)

## Goal

Show a **Visitors Data** strip on the home page **inside** the “What I work with” panel (under the marquee), with three live metrics from Firestore `resume_downloads`.

## Placement

Inside the skills bordered panel: Marquee → Visitors Data strip. Not a separate narrow card.

## UI

- Full-width strip under the marquee (same panel).
- Header: chart icon + “Visitors Data”.
- Three metrics in a responsive grid (`sm:grid-cols-3`):
  1. Total Download CV
  2. Unique downloaders (distinct `uid`)
  3. Downloads today (UTC day)
- No percentage deltas.
- Footer note about signed-in downloads / UTC.
- Tailwind v4 utilities / `@theme` tokens only.

## Data

- `getResumeDownloadStats()` loads `uid` + `downloadedAt` via Admin `select`, then computes total / unique / today in process (fine for portfolio-scale collections).
- Home page loads stats server-side; failures degrade to zeros.

## Non-goals

- Page views / Vercel Analytics API
- Fake trend percentages
- Client-side Firebase Admin

## Files

- `lib/firebase/admin.ts` — add count helper
- `components/visitors/visitors-data.tsx` — presentational card
- `app/page.tsx` — fetch count, render under Skills
- Spec/plan under `docs/superpowers/`
