import { Experience } from "@/components/experience/experience";
import { Profile } from "@/components/profile/profile";
import { getActivities, getSite, getTimeline } from "@/lib/content";

export default function HomePage() {
  const site = getSite();
  const timeline = getTimeline();
  const activities = getActivities();

  return (
    <>
      <Profile site={site} timeline={timeline} />
      <Experience timeline={timeline} activities={activities} />
    </>
  );
}
