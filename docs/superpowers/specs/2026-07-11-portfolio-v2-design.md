# Portfolio v2 — Design Spec

**Date:** 2026-07-11  
**Repo:** `kbuenavista` (replace in place)  
**Status:** Approved for planning

## Goal

Rebuild the portfolio as a **fresh Next.js app** (no reuse of old component/auth wiring), keep the same content hierarchy with a **refreshed layout**, apply a navy + lime theme, gate resume downloads behind **Firebase Google sign-in**, and track **visits + resume downloads**.

## Decisions (locked)

| Topic | Choice |
|--------|--------|
| Rebuild style | Fresh Next.js app; do not carry old logic |
| Content source (v1) | Local typed data (`data.ts` shape); repository pattern for later Firestore |
| Resume gate | Firebase Google sign-in + Firestore download logs |
| Styling | Tailwind CSS v4 + CSS variables |
| Location | Replace this repo |
| Layout | Same content hierarchy, refreshed composition (not pixel-clone) |
| Architecture approach | Clean App Router rewrite with content repository |

## Out of scope (v1)

- Firestore-backed content CMS / admin editor
- Email/password auth
- Admin UI for download logs (use Firebase Console)
- Light theme toggle
- Open resume download without auth in production

---

## Architecture

```
app/
  layout.tsx                 # fonts, theme tokens, AuthProvider, Analytics
  page.tsx                   # home: Profile + Skills + Experience
  about/page.tsx
  projects/[slug]/page.tsx
  not-found.tsx
  api/resume-download/route.ts
components/
  ui/                        # Button, Section, Alert, SafeImage
  profile/
  skills/
  experience/                # Timeline, TimelineItem
  auth/                      # LoginModal
  about/                     # slideshow
lib/
  content/                   # getTimeline, getProject, getSite — local impl
  firebase/                  # client + admin
  analytics/                 # logResumeDownload helper
content/
  data.ts                    # ported timeline + activities
  site.ts                    # name, intro, socials, resume doc id, about images
  types.ts
public/images/
  fallback.jpg               # required fallback for all images
  placeholders/              # project/about placeholders until real assets
```

### Stack

- **Next.js** latest stable (App Router), **React 19**, **TypeScript**
- **Tailwind CSS v4**
- **Firebase** Auth (Google) + Admin (token verify) + Firestore (`resume_downloads`)
- **Vercel Analytics** (+ optional Speed Insights) for visits
- **Zustand** only if needed for lightweight UI state (alert/loader); prefer React state for modal
- Patterns inspired by casino frontend: clear `lib/`, typed modules, reusable UI — **not** casino product features

### Content repository

```ts
// lib/content/index.ts — public API
getSite()
getTimeline()
getActivities()
getProjectBySlug(slug)
```

v1 implementation reads from `content/data.ts` / `content/site.ts`.  
Later: swap to Firestore behind the same functions; components stay unchanged.

Port existing types from `app/constants/types.ts` and data from `app/constants/data.ts` + `constants.ts`.

---

## UI & theme

### Tokens

```css
:root {
  --brand: #aaff00;
  --bg-base: #0a1628;
  --bg-surface: #111e33;
  --bg-elevated: #1a2d4a;
  --text-primary: #f0f4ff;
  --text-muted: #7a90b0;
  --success: #22c55e;
  --warning: #f59e0b;
  --danger: #ef4444;
}
```

Map these into Tailwind theme (`@theme`) so utilities use brand/surface/muted consistently. No inline styles for colors.

### Visual direction

- Navy base (`--bg-base`), lime accent (`--brand`) for CTAs, links, timeline markers
- Surfaces for modals / elevated blocks
- Expressive display font for name/headings (not Inter/Roboto/Arial/system default stack as the hero face)
- Clean sans for body
- Subtle atmosphere (gradient or soft pattern on base) — not flat single fill only
- Motion: 2–3 intentional transitions (e.g. section fade-in, timeline marker, modal)

### Home sections (order)

1. **Profile** — brand-level name, short intro, GitHub/LinkedIn, Download Resume
2. **Skills / What I work with** — tech icons marquee or row
3. **Experience** — timeline; entries with projects link to `/projects/[slug]`

### Shared components

- `SafeImage` — wraps `next/image`; on missing `src` or `onError` → `/images/fallback.jpg`
- `LoginModal` — accessible (dialog, Escape, focus, aria)
- `Button`, `Section`, timeline pieces, alert/toast

### Images

- Ship placeholder paths for project GIFs/images and about slideshow
- Every image uses `SafeImage` + fallback
- User will replace placeholders with real assets later

---

## Auth, analytics & data flow

### Resume download

1. User clicks Download Resume
2. If not signed in → Google login modal
3. After auth → `POST /api/resume-download` with `Authorization: Bearer <idToken>`
4. API verifies token (Firebase Admin)
5. API writes Firestore `resume_downloads`: `{ uid, email, displayName, downloadedAt, userAgent }`
6. API returns Google Docs PDF export URL (from `googleDocId` in site content)
7. Client opens download in new tab

Mobile: prefer redirect flow if popup is unreliable; resume pending download via session flag after redirect (same UX goal as current site, new implementation).

### Visits

- **Vercel Analytics** for page views / engagement
- Optional Speed Insights
- No custom `page_views` collection in v1 unless needed later

### Production rule

If Firebase is not configured, show a clear error in the modal — **do not** silently allow unauthenticated resume download in production.

---

## Errors & quality

| Case | Behavior |
|------|----------|
| Auth misconfigured | Modal error message |
| Token invalid | 401 + user alert to retry |
| Image fail / missing | Fallback image |
| Unknown project slug | Themed `not-found` |

### Practices

- Server Components by default; `"use client"` only for auth, modal, marquee, interactive bits
- Env validation (Zod recommended) for Firebase public + server keys
- `clsx` + `tailwind-merge` for class names
- Mobile-first, accessible controls
- Readable, small, single-purpose modules

---

## Copy-paste agent prompt

Use this prompt in a new agent session (or after the implementation plan is written) to build the app:

```text
Rebuild the Kenneth Buenavista portfolio as a FRESH Next.js app in this repo (replace old app code; do not reuse old component/auth wiring).

## Product
- Same content hierarchy, refreshed layout (not a pixel clone): Profile → Skills → Experience timeline; About page; Project detail pages by slug.
- Theme CSS variables (required):
  --brand: #aaff00;
  --bg-base: #0a1628;
  --bg-surface: #111e33;
  --bg-elevated: #1a2d4a;
  --text-primary: #f0f4ff;
  --text-muted: #7a90b0;
  --success: #22c55e;
  --warning: #f59e0b;
  --danger: #ef4444;
- Name is a hero-level brand signal. Expressive display font (not Inter). No purple-on-white AI aesthetic. No inline styles for theme colors.
- Placeholders for project/about images; EVERY image via SafeImage with fallback `/images/fallback.jpg`.

## Stack
- Latest stable Next.js (App Router) + React 19 + TypeScript + Tailwind CSS v4.
- Firebase Auth (Google) + Firebase Admin token verify + Firestore resume_downloads logging.
- Vercel Analytics for visits.
- Content: port app/constants/data.ts + constants.ts into content/ with types; expose via lib/content repository (local data now, Firestore-swappable later).
- Follow docs/superpowers/specs/2026-07-11-portfolio-v2-design.md and the implementation plan if present.

## Resume gate
- Download requires Google sign-in.
- POST /api/resume-download verifies ID token, logs { uid, email, displayName, downloadedAt, userAgent } to Firestore, returns Google Docs PDF export URL.
- Production: no unauthenticated download bypass if Firebase missing — show clear error.

## Quality
- Readable, reusable components; Server Components by default.
- Accessible login modal.
- Mobile-responsive.
- Do not commit secrets. Document env vars in README / FIREBASE_SETUP.

## Reference (patterns only, not product UI)
- Casino frontend at ../wew/casino/frontend-react for Next 16 / Tailwind / lib organization inspiration only.
```

---

## Implementation outline (high level)

Detailed step-by-step plan will be written next via `writing-plans` after this spec is confirmed.

1. Scaffold fresh Next.js + Tailwind v4 in repo; remove obsolete app code carefully (keep `content` seed from old `data.ts`)
2. Theme tokens + layout + fonts
3. Content module + types + repository
4. Home sections (Profile, Skills, Experience) with refreshed layout
5. About + project pages + SafeImage + placeholders
6. Firebase client/admin + AuthProvider + LoginModal + resume API + Firestore logs
7. Vercel Analytics
8. Env docs, polish, verify build/lint

---

## Success criteria

- [ ] Fresh Next app builds and runs with the navy/lime theme
- [ ] Timeline/about/project content renders from local typed data
- [ ] Google sign-in required before resume URL is issued
- [ ] Download events appear in Firestore
- [ ] Vercel Analytics wired
- [ ] All images degrade to fallback
- [ ] Code is modular and content API is DB-swappable later
