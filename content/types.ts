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

export type TimelineData = {
  id: number;
  title: string;
  company: string;
  companyUrl: string | null;
  date: string;
  description: string | string[];
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
  introduction: string;
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
