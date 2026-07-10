# Kenneth Buenavista — Portfolio

Senior frontend developer portfolio rebuilt with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **pnpm**.

## Stack

- App Router + TypeScript
- Local typed content (`content/`) behind `lib/content` (Firestore-swappable later)
- Firebase Google Auth for resume downloads + Firestore `resume_downloads` logs
- Vercel Analytics for visits
- `SafeImage` with `/images/fallback.jpg` for every image

## Setup

```bash
pnpm install
pnpm dev
```

Copy `.env.local` Firebase vars (see `FIREBASE_SETUP.md`).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | ESLint |

## Docs

- Design: `docs/superpowers/specs/2026-07-11-portfolio-v2-design.md`
- Plan: `docs/superpowers/plans/2026-07-11-portfolio-v2.md`
