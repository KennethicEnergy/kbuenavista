import type { Metadata } from "next";
import Link from "next/link";
import { AboutSlideshow } from "@/components/about/about-slideshow";
import { getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  const site = getSite();

  return (
    <div className="grid gap-10 py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-start">
      <AboutSlideshow images={site.aboutSlideshowImages} />
      <div className="animate-fade-up">
        <p className="text-sm uppercase tracking-[0.2em] text-brand">About</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-text-primary md:text-5xl">
          {site.fullName}
        </h1>
        <p className="mt-5 text-lg text-text-muted">
          Senior frontend developer based in {site.country}. I build polished product
          interfaces with React, Next.js, and TypeScript — from design systems to
          production platforms.
        </p>
        <p className="mt-4 text-text-muted">
          Outside of shipping features, I care about readable architecture, thoughtful
          motion, and experiences that feel fast on every device.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex text-sm font-medium text-brand underline-offset-4 hover:underline"
        >
          ← Back home
        </Link>
      </div>
    </div>
  );
}
