import { Experience } from "@/components/experience/experience";
import { Profile } from "@/components/profile/profile";
import { Skills } from "@/components/skills/skills";
import { VisitorsData } from "@/components/visitors/visitors-data";
import { getActivities, getSite, getTimeline } from "@/lib/content";
import type { ResumeDownloadStats } from "@/lib/firebase/admin";

const EMPTY_STATS: ResumeDownloadStats = {
  total: 0,
  uniqueDownloaders: 0,
  downloadsToday: 0,
};

async function loadResumeDownloadStats(): Promise<ResumeDownloadStats> {
  try {
    const { getResumeDownloadStats } = await import("@/lib/firebase/admin");
    return await getResumeDownloadStats();
  } catch {
    return EMPTY_STATS;
  }
}

export default async function HomePage() {
  const site = getSite();
  const timeline = getTimeline();
  const activities = getActivities();
  const stats = await loadResumeDownloadStats();

  return (
    <>
      <Profile site={site} />
      <Skills>
        <VisitorsData
          total={stats.total}
          uniqueDownloaders={stats.uniqueDownloaders}
          downloadsToday={stats.downloadsToday}
        />
      </Skills>
      <Experience timeline={timeline} activities={activities} />
    </>
  );
}
