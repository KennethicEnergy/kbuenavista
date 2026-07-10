import { readdirSync } from "fs";
import path from "path";
import { activitiesData, timelineData } from "@/content/data";
import { site } from "@/content/site";
import type { ActivityData, SiteContent, TimelineData } from "@/content/types";

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".avif",
]);

const ABOUT_IMAGES_DIR = path.join(process.cwd(), "public", "images", "me");
const ABOUT_IMAGES_PUBLIC_PREFIX = "/images/me";
const FALLBACK_ABOUT_IMAGE = "/images/placeholders/about.jpg";

export function getAboutSlideshowImages(): string[] {
  try {
    const files = readdirSync(ABOUT_IMAGES_DIR)
      .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
      .sort((a, b) => {
        // Prefer me.* first, then alphabetical.
        const aIsMe = /^me\./i.test(a);
        const bIsMe = /^me\./i.test(b);
        if (aIsMe && !bIsMe) return -1;
        if (!aIsMe && bIsMe) return 1;
        return a.localeCompare(b);
      })
      .map((file) => `${ABOUT_IMAGES_PUBLIC_PREFIX}/${file}`);

    return files.length > 0 ? files : [FALLBACK_ABOUT_IMAGE];
  } catch {
    return [FALLBACK_ABOUT_IMAGE];
  }
}

export function getSite(): SiteContent {
  return {
    ...site,
    aboutSlideshowImages: getAboutSlideshowImages(),
  };
}

export function getTimeline(): TimelineData[] {
  return timelineData;
}

export function getActivities(): ActivityData[] {
  return activitiesData;
}

export function getProjectBySlug(slug: string): TimelineData | undefined {
  return timelineData.find((item) => item.projectSlug === slug);
}

export function getProjectSlugs(): string[] {
  return timelineData
    .map((item) => item.projectSlug)
    .filter((slug): slug is string => Boolean(slug));
}

export function getActivityBySlug(slug: string): ActivityData | undefined {
  return activitiesData.find((item) => item.activitySlug === slug);
}

export function getActivitySlugs(): string[] {
  return activitiesData
    .map((item) => item.activitySlug)
    .filter((slug): slug is string => Boolean(slug));
}
