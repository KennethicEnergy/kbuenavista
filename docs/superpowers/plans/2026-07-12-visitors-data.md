# Visitors Data Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Visitors Data card under the skills marquee showing Total Download CV from Firestore `resume_downloads`.

**Architecture:** Server Component on the home page calls a Firebase Admin count helper and passes the number into a presentational card. Failures degrade to `0`.

**Tech Stack:** Next.js App Router, firebase-admin Firestore, Tailwind v4 theme tokens, react-icons.

**Spec:** `docs/superpowers/specs/2026-07-12-visitors-data-design.md`

---

### Task 1: Count helper

**Files:**
- Modify: `lib/firebase/admin.ts`

- [x] **Step 1: Add `getResumeDownloadCount`**

```ts
export async function getResumeDownloadCount(): Promise<number> {
  getAdminApp();
  const snapshot = await getFirestore().collection("resume_downloads").count().get();
  return snapshot.data().count;
}
```

---

### Task 2: Visitors Data UI

**Files:**
- Create: `components/visitors/visitors-data.tsx`

- [x] **Step 1: Presentational card** with header, one metric row (MdFileDownload), footer. Props: `{ downloadCount: number }`.

---

### Task 3: Wire home page

**Files:**
- Modify: `app/page.tsx`

- [x] **Step 1: Make page async**, call `getResumeDownloadCount` in try/catch → `0` on failure, render `<VisitorsData downloadCount={...} />` after `<Skills />`.

---

### Task 4: Verify

- [x] Lint / typecheck touched files
- [x] Confirm card appears under marquee; count loads when Firebase is configured
