import { activitiesData, timelineData } from "@/content/data";
import { site } from "@/content/site";
import type { ActivityData, SiteContent, TimelineData } from "@/content/types";

export function getSite(): SiteContent {
  return site;
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
