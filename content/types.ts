export type ActivityData = {
  id: number;
  title: string;
  organization: string;
  organizationUrl: string | null;
  date: string;
  location: string | null;
  description: string;
  images: string[] | null;
  /** YouTube (or other) embed URL for the activity detail page */
  videoUrl: string | null;
  /** Clean slug for `/activities/[slug]`, or null when no activity page */
  activitySlug: string | null;
};

/** A plain text segment, or a brand-styled name (optionally linked). */
export type HighlightPart = {
  text: string;
  href?: string;
  /** Apply brand styling without a link (e.g. project name with no public URL). */
  brand?: boolean;
};

/** A highlight bullet: plain string, or mixed text + brand links. */
export type ExperienceHighlight = string | HighlightPart[];

export type TimelineData = {
  id: number;
  title: string;
  company: string;
  companyUrl: string | null;
  date: string;
  description: string | string[];
  /** Short bullet points shown on the Experience section */
  highlights: ExperienceHighlight[];
  /** Clean slug for `/projects/[slug]`, or null when no project page */
  projectSlug: string | null;
  projectImages: string[] | null;
  projectGif: string | null;
  projectName: string | null;
  projectDescription: string | null;
  projectTechStack: string[] | null;
};

export type SiteContentBase = {
  fullName: string;
  /** Default / first introduction line */
  introduction: string;
  /** Rotating introduction lines for the live site and OG images */
  introductions: string[];
  introductionIntervalSeconds: number;
  country: string;
  githubUrl: string;
  linkedinUrl: string;
  googleDocId: string;
  siteUrl: string;
};

export type SiteContent = SiteContentBase & {
  aboutSlideshowImages: string[];
};

export type AlertType = "success" | "error" | "warning" | "info" | "default";
