import type { Metadata } from "next";
import Link from "next/link";
import { AboutSlideshow } from "@/components/about/about-slideshow";
import { getActivities, getSite, getTimeline } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  const site = getSite();
  const timeline = getTimeline();
  const activities = getActivities();

  const currentRole = [...timeline].reverse().find((item) =>
    item.date.toLowerCase().includes("present"),
  );
  const featuredProjects = timeline
    .filter((item) => item.projectName)
    .map((item) => item.projectName as string);
  const uniqueProjects = [...new Set(featuredProjects)];
  const conference = activities[0];

  return (
    <div className="grid gap-10 py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-start">
      <AboutSlideshow images={site.aboutSlideshowImages} />
      <div className="animate-fade-up">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex text-sm font-medium text-brand underline-offset-4 hover:underline"
          >
            ←
          </Link>
          <p className="text-sm uppercase tracking-section text-brand">About</p>
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold text-brand md:text-5xl">
          {site.fullName}
        </h1>

        <p className="mt-5 text-lg text-text-muted">
          Senior frontend developer based in {site.country}. I build polished product
          interfaces with React, Next.js, and TypeScript — from design systems to
          production platforms.
        </p>

        <p className="mt-4 text-text-muted">
          My path started in 2016 at 98Labs as a QA intern, where HTML, CSS, and
          JavaScript first clicked. I grew into a frontend role there, then spent years
          shipping and supporting large products — from Manulife ID at Tata Consultancy
          Services to Cebu Pacific&apos;s OmniX experience at Collabera Digital.
        </p>

        <p className="mt-4 text-text-muted">
          Since then I&apos;ve focused on multi-theme, multi-market platforms and
          real-money gaming products across Southeast Asia, including Game99, Mansion88,
          and now WOWGames — a full casino stack I architected end to end as the sole
          frontend developer
          {currentRole?.company ? (
            <>
              {" "}
              at{" "}
              {currentRole.companyUrl ? (
                <Link
                  href={currentRole.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand underline-offset-4 hover:underline"
                >
                  {currentRole.company}
                </Link>
              ) : (
                currentRole.company
              )}
            </>
          ) : null}
          .
        </p>

        {uniqueProjects.length > 0 ? (
          <p className="mt-4 text-text-muted">
            Selected work includes{" "}
            {uniqueProjects.map((name, index) => {
              const project = timeline.find((item) => item.projectName === name);
              const isLast = index === uniqueProjects.length - 1;
              const isSecondLast = index === uniqueProjects.length - 2;

              return (
                <span key={name}>
                  {project?.projectSlug ? (
                    <Link
                      href={`/projects/${project.projectSlug}`}
                      className="text-brand underline-offset-4 hover:underline"
                    >
                      {name}
                    </Link>
                  ) : (
                    name
                  )}
                  {isSecondLast ? ", and " : isLast ? "." : ", "}
                </span>
              );
            })}
          </p>
        ) : null}

        {conference ? (
          <p className="mt-4 text-text-muted">
            In 2019 I attended{" "}
            {conference.activitySlug ? (
              <Link
                href={`/activities/${conference.activitySlug}`}
                className="text-brand underline-offset-4 hover:underline"
              >
                {conference.organization}
              </Link>
            ) : (
              conference.organization
            )}
            {conference.location ? ` in ${conference.location}` : null} — the first
            Angular conference in Southeast Asia — which deepened my interest in modern
            frontend architecture and the wider JavaScript community.
          </p>
        ) : null}

        <p className="mt-4 text-text-muted">
          Outside of shipping features, I care about readable architecture, thoughtful
          motion, and experiences that feel fast on every device.{" "}
          {site.introduction}
        </p>
      </div>
    </div>
  );
}
