"use client";

import { useEffect, useState } from "react";
import { SafeImage } from "@/components/ui/safe-image";
import { cn } from "@/lib/utils/cn";

type AboutSlideshowProps = {
  images: string[];
};

export function AboutSlideshow({ images }: AboutSlideshowProps) {
  const [index, setIndex] = useState(0);
  const slides = images.length > 0 ? images : ["/images/placeholders/about.jpg"];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-bg-elevated bg-bg-surface">
      {slides.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === index ? "opacity-100" : "opacity-0",
          )}
        >
          <SafeImage
            src={src}
            alt={`About photo ${i + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 480px"
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show slide ${i + 1}`}
            className={cn(
              "h-2 w-2 rounded-full transition-colors",
              i === index ? "bg-brand" : "bg-text-muted/50",
            )}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
