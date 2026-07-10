export type ActivityData = {
  id: number;
  title: string;
  organization: string;
  organizationUrl: string | null;
  date: string;
  location: string | null;
  description: string;
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

export type SiteContent = {
  fullName: string;
  introduction: string;
  country: string;
  githubUrl: string;
  linkedinUrl: string;
  googleDocId: string;
  aboutSlideshowImages: string[];
};

export type AlertType = "success" | "error" | "warning" | "info" | "default";
