import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SafeImage } from "@/components/ui/safe-image";
import { getProjectBySlug, getProjectSlugs } from "@/lib/content";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  return {
    title: project?.projectName ?? "Project",
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || !project.projectName) {
    notFound();
  }

  const images =
    project.projectImages && project.projectImages.length > 0
      ? project.projectImages
      : ["/images/placeholders/project.jpg"];

  const roleDescription = Array.isArray(project.description)
    ? project.description.join(" ")
    : project.description;

  return (
    <article className="py-16 animate-fade-up">
      <Link
        href="/"
        className="text-sm font-medium text-brand underline-offset-4 hover:underline"
      >
        ← Back home
      </Link>

      <p className="mt-8 text-sm text-text-muted">{project.date}</p>
      <h1 className="mt-2 font-display text-4xl font-bold text-text-primary md:text-5xl">
        {project.projectName}
      </h1>
      <p className="mt-2 text-brand">{project.company}</p>
      {project.projectDescription ? (
        <p className="mt-6 w-full text-text-muted">{project.projectDescription}</p>
      ) : null}
      {roleDescription ? (
        <p className="mt-4 w-full text-justify text-sm leading-relaxed text-text-muted md:text-base">
          {roleDescription}
        </p>
      ) : null}

      {project.projectTechStack?.length ? (
        <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-1 text-sm text-text-muted">
          {project.projectTechStack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      ) : null}

      <div className="relative mt-10 aspect-video w-full overflow-hidden">
        <SafeImage
          src={project.projectGif ?? images[0]}
          alt={`${project.projectName} preview`}
          fill
          sizes="(max-width: 768px) 100vw, 960px"
          className="object-cover"
          priority
        />
      </div>

      {project.projectImages && project.projectImages.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {images.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="relative aspect-video overflow-hidden"
            >
              <SafeImage
                src={src}
                alt={`${project.projectName} screenshot ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 480px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}
