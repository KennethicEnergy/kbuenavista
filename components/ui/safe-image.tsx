"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

const FALLBACK = "/images/fallback.jpg";

type SafeImageProps = Omit<ImageProps, "src" | "alt"> & {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
};

function isGif(src: string) {
  return /\.gif($|\?)/i.test(src);
}

function isSvg(src: string) {
  return /\.svg($|\?)/i.test(src);
}

export function SafeImage({
  src,
  alt,
  fallbackSrc = FALLBACK,
  className,
  onError,
  unoptimized,
  ...props
}: SafeImageProps) {
  const resolved = src && src.trim().length > 0 ? src : fallbackSrc;
  const [failedFor, setFailedFor] = useState<string | null>(null);
  const currentSrc = failedFor === resolved ? fallbackSrc : resolved;

  return (
    <Image
      {...props}
      key={resolved}
      src={currentSrc}
      alt={alt}
      className={cn(className)}
      // Large animated GIFs / SVGs fail or are skipped by Next image optimization.
      unoptimized={unoptimized ?? (isGif(currentSrc) || isSvg(currentSrc))}
      onError={(event) => {
        if (currentSrc !== fallbackSrc) {
          setFailedFor(resolved);
        }
        onError?.(event);
      }}
    />
  );
}
