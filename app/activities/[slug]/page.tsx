import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SafeImage } from "@/components/ui/safe-image";
import { getActivityBySlug, getActivitySlugs } from "@/lib/content";

type ActivityPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getActivitySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ActivityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const activity = getActivityBySlug(slug);
  return {
    title: activity?.organization ?? "Activity",
  };
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const { slug } = await params;
  const activity = getActivityBySlug(slug);

  if (!activity) {
    notFound();
  }

  const images =
    activity.images && activity.images.length > 0
      ? activity.images
      : [""];

  return (
    <article className="py-16 animate-fade-up">
      <Link
        href="/"
        className="text-sm font-medium text-brand underline-offset-4 hover:underline"
      >
        ← Back home
      </Link>

      <div className="mt-8 flex items-center justify-between gap-6">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-text-muted">{activity.date}</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-text-primary md:text-5xl">
            {activity.organization}
          </h1>
          <p className="mt-2 text-brand">
            {activity.title}
            {activity.location ? ` · ${activity.location}` : null}
          </p>
          {activity.organizationUrl ? (
            <Link
              href={activity.organizationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex text-sm text-text-muted underline-offset-4 hover:text-brand hover:underline"
            >
              {activity.organizationUrl.replace(/^https?:\/\//, "")}
            </Link>
          ) : null}
        </div>
        <div className="relative h-20 w-20 shrink-0 md:h-28 md:w-28">
          <SafeImage
            src="/images/activities/ng-my-logo.svg"
            alt={`${activity.organization} logo`}
            fill
            sizes="112px"
            className="object-contain"
            unoptimized
          />
        </div>
      </div>
      <p className="mt-6 max-w-3xl text-text-muted">{activity.description}</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {images
          .filter(item => item !== "/images/activities/ng-my-logo.svg")
          .map((src, index) => (
          <div
            key={`${src}-${index}`}
            className="relative aspect-[4/3] overflow-hidden"
          >
            <SafeImage
              src={src}
              alt={`${activity.organization} photo ${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 480px"
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
    </article>
  );
}
