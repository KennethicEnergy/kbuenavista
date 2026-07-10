import Link from "next/link";
import type { ActivityData, TimelineData } from "@/content/types";
import { Section } from "@/components/ui/section";
import { CiImageOn } from "react-icons/ci";
import { cn } from "@/lib/utils/cn";

type ExperienceProps = {
  timeline: TimelineData[];
  activities: ActivityData[];
};

export function Experience({ timeline, activities }: ExperienceProps) {
  const items = [...timeline].reverse();

  return (
    <Section
      id="experience"
      title="Experience"
      subtitle="Roles, projects, and a few milestones along the way."
    >
      <ol className="relative space-y-8 border-l border-bg-elevated pl-6 md:pl-8">
        {items.map((item) => (
          <li key={item.id} className="relative animate-fade-up">
            <span
              className={cn(
                "absolute -left-[1.9rem] top-1.5 h-3 w-3 rounded-full border-2 border-bg-base bg-brand md:-left-[2.4rem]",
              )}
              aria-hidden
            />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">{item.date}</p>
                <h3 className="mt-1 font-display text-xl font-semibold text-text-primary">
                  {item.title}
                </h3>
                <p className="mt-1 text-brand">
                  {item.companyUrl ? (
                    <Link
                      href={item.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {item.company}
                    </Link>
                  ) : (
                    item.company
                  )}
                </p>
              </div>
              {item.projectSlug && item.projectName ? (
                <Link
                  href={`/projects/${item.projectSlug}`}
                  className="flex items-center gap-2 text-sm font-medium text-brand underline-offset-4 hover:underline"
                >
                  View {item.projectName}
                  <CiImageOn size={24} />
                </Link>
              ) : null}
            </div>

            <p className="mt-3 text-justify text-sm leading-relaxed text-text-muted md:text-base">
              {Array.isArray(item.description)
                ? item.description.join(" ")
                : item.description}
            </p>
          </li>
        ))}
      </ol>

      {activities.length > 0 ? (
        <div className="mt-16">
          <h3 className="font-display text-xl font-semibold text-brand">Activities</h3>
          <ul className="mt-6 space-y-10">
            {activities.map((activity) => (
              <li key={activity.id}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-text-muted">{activity.date}</p>
                    <h4 className="mt-1 font-medium text-text-primary">{activity.title}</h4>
                    <p className="text-brand">
                      {activity.organizationUrl ? (
                        <Link
                          href={activity.organizationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {activity.organization}
                        </Link>
                      ) : (
                        activity.organization
                      )}
                      {activity.location ? ` · ${activity.location}` : null}
                    </p>
                  </div>
                  {activity.activitySlug ? (
                    <Link
                      href={`/activities/${activity.activitySlug}`}
                      className="flex shrink-0 items-center gap-2 text-sm font-medium text-brand underline-offset-4 hover:underline"
                    >
                      View {activity.organization}
                      <CiImageOn size={24} />
                    </Link>
                  ) : null}
                </div>
                <p className="mt-3 text-sm text-text-muted">{activity.description}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Section>
  );
}
