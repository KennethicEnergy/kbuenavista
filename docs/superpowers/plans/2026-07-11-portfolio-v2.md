# Portfolio v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace this repo with a fresh Next.js + Tailwind v4 portfolio using the navy/lime theme, local typed content, Firebase Google resume gate with Firestore logs, and Vercel Analytics.

**Architecture:** App Router with a `lib/content` repository over `content/*` local data; client auth + server API for resume; reusable UI including `SafeImage` fallbacks.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, **pnpm**, Firebase Auth/Admin/Firestore, Vercel Analytics, react-icons, clsx, tailwind-merge, zod

**Spec:** `docs/superpowers/specs/2026-07-11-portfolio-v2-design.md`

**Package manager:** Use `pnpm` for all installs and scripts (`pnpm install`, `pnpm dev`, `pnpm build`). Do not use npm.

---

## File map

| Path | Responsibility |
|------|----------------|
| `content/types.ts` | Timeline, activity, site types |
| `content/data.ts` | Timeline + activities (ported) |
| `content/site.ts` | Name, intro, socials, resume doc id, about images |
| `lib/content/index.ts` | `getSite`, `getTimeline`, `getActivities`, `getProjectBySlug` |
| `lib/firebase/client.ts` | Browser Firebase Auth |
| `lib/firebase/admin.ts` | Admin verify + Firestore |
| `lib/utils/cn.ts` | clsx + twMerge |
| `components/ui/safe-image.tsx` | Image + fallback |
| `components/ui/button.tsx` | Themed button |
| `components/ui/section.tsx` | Section wrapper |
| `components/auth/login-modal.tsx` | Google sign-in modal |
| `components/auth/auth-provider.tsx` | Auth context |
| `components/profile/profile.tsx` | Hero + resume CTA |
| `components/skills/skills.tsx` | Tech marquee |
| `components/experience/*` | Timeline |
| `app/api/resume-download/route.ts` | Verify, log, return PDF URL |
| `app/globals.css` | Tokens + Tailwind |
| `app/layout.tsx` | Fonts, providers, analytics |
| `app/page.tsx` | Home |
| `app/about/page.tsx` | About |
| `app/projects/[slug]/page.tsx` | Project detail |
| `public/images/fallback.jpg` | Fallback asset |

---

### Task 1: Scaffold fresh Next.js app in repo

**Files:** Replace `package.json`, `app/`, configs; keep `docs/`, preserve content seed from old constants.

- [ ] **Step 1:** Create branch `portfolio-v2`
- [ ] **Step 2:** Scaffold with `create-next-app` into `_scaffold` (TS, Tailwind, App Router, eslint, no src dir, npm, `--disable-git`)
- [ ] **Step 3:** Move scaffold files into repo root; remove old `app/components`, SCSS modules, obsolete deps; keep `docs/`
- [ ] **Step 4:** Install deps: `firebase`, `firebase-admin`, `@vercel/analytics`, `react-icons`, `react-fast-marquee`, `clsx`, `tailwind-merge`, `zod`, `zustand`
- [ ] **Step 5:** Verify `npm run build` succeeds on empty scaffold
- [ ] **Step 6:** Commit `chore: scaffold Next.js 16 + Tailwind v4 for portfolio v2`

### Task 2: Theme tokens + layout shell

- [ ] **Step 1:** Set CSS variables and `@theme` mapping in `app/globals.css`
- [ ] **Step 2:** Add display + body fonts in `app/layout.tsx` (e.g. Syne + DM Sans); themeColor `#0a1628`
- [ ] **Step 3:** Commit `style: add navy/lime theme tokens and fonts`

### Task 3: Content module

- [ ] **Step 1:** Create `content/types.ts`, `content/site.ts`, `content/data.ts` (port data; slugs `tcs`, `collabera`, `w-bridges`; about images → placeholders)
- [ ] **Step 2:** Create `lib/content/index.ts` repository API
- [ ] **Step 3:** Commit `feat: add typed local content repository`

### Task 4: Shared UI + SafeImage

- [ ] **Step 1:** Add `lib/utils/cn.ts`, `components/ui/button.tsx`, `section.tsx`, `safe-image.tsx`
- [ ] **Step 2:** Add `public/images/fallback.jpg` and placeholder SVGs/JPGs under `public/images/placeholders/`
- [ ] **Step 3:** Commit `feat: add shared UI and SafeImage fallback`

### Task 5: Home page sections

- [ ] **Step 1:** Build Profile, Skills (marquee), Experience timeline components
- [ ] **Step 2:** Wire `app/page.tsx`
- [ ] **Step 3:** Commit `feat: build home profile, skills, and experience`

### Task 6: About + project pages

- [ ] **Step 1:** `app/about/page.tsx` with slideshow using SafeImage
- [ ] **Step 2:** `app/projects/[slug]/page.tsx` + `not-found.tsx`
- [ ] **Step 3:** Commit `feat: add about and project detail pages`

### Task 7: Firebase auth + resume download + analytics

- [ ] **Step 1:** `lib/firebase/client.ts`, `lib/firebase/admin.ts` (auth verify + Firestore write)
- [ ] **Step 2:** AuthProvider + LoginModal
- [ ] **Step 3:** Resume download flow in Profile + `api/resume-download`
- [ ] **Step 4:** Add `<Analytics />` from `@vercel/analytics/next`
- [ ] **Step 5:** Update `FIREBASE_SETUP.md` / README env docs
- [ ] **Step 6:** Commit `feat: firebase resume gate, firestore logs, vercel analytics`

### Task 8: Verify

- [ ] **Step 1:** `npm run lint` and `npm run build`
- [ ] **Step 2:** Fix any failures
- [ ] **Step 3:** Commit polish if needed

---

## Spec coverage

| Spec item | Task |
|-----------|------|
| Fresh Next + Tailwind v4 | 1 |
| Theme tokens | 2 |
| Local content + repository | 3 |
| SafeImage + placeholders | 4 |
| Refreshed home layout | 5 |
| About + projects | 6 |
| Google gate + Firestore + Analytics | 7 |
| Build verification | 8 |
