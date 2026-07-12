"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

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

  return (
    <p key={index} className={cn("animate-fade-up", className)}>
      {safeLines[index] ?? safeLines[0]}
    </p>
  );
}
