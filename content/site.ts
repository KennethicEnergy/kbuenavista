import type { SiteContentBase } from "./types";

export const introductions = [
  "I create beautiful websites your users will love.",
  "I build fast, modern web experiences that just work.",
  "I turn complex ideas into intuitive user interfaces.",
  "I transform designs into pixel-perfect experiences.",
  "I build scalable frontend applications with clean, maintainable code.",
] as const;

/** How often the live intro and OG taglines advance (seconds). */
export const introductionIntervalSeconds = 8;

export const site: SiteContentBase = {
  fullName: "Kenneth Buenavista",
  introduction: introductions[0],
  introductions: [...introductions],
  introductionIntervalSeconds,
  country: "Philippines",
  githubUrl: "https://github.com/KennethicEnergy",
  linkedinUrl: "https://www.linkedin.com/in/ken-buenavista-94a736144/",
  // googleDocId: "1Hhe7097d9GVNDvz5JibYl1N80DdSg7wYhvK3CIbjjr0", // OLD
  googleDocId: "12jqm7Qfym_TsYqDcTB4QYkXJOc8NCV-Hp8DgC0ZcGLU",
  /** Used for Open Graph / absolute URLs. Override with NEXT_PUBLIC_SITE_URL. */
  siteUrl: "https://kbuenavista.com",
};
