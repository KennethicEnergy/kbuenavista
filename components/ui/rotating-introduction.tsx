"use client";

import { useEffect, useState } from "react";

type RotatingIntroductionProps = {
  lines: string[];
  intervalSeconds: number;
  className?: string;
};

export function RotatingIntroduction({
  lines,
  intervalSeconds,
  className,
}: RotatingIntroductionProps) {
  const [index, setIndex] = useState(0);
  const safeLines = lines.length > 0 ? lines : [""];

  useEffect(() => {
    if (safeLines.length <= 1) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % safeLines.length);
    }, Math.max(1, intervalSeconds) * 1000);

    return () => window.clearInterval(timer);
  }, [intervalSeconds, safeLines.length]);

  // The live region must stay mounted: remounting it on every change (via `key`)
  // makes screen readers miss the update. Only the inner span is re-keyed to
  // replay the fade animation.
  return (
    <p aria-live="polite" aria-atomic="true" className={className}>
      <span key={index} className="block animate-fade-up">
        {safeLines[index] ?? safeLines[0]}
      </span>
    </p>
  );
}
