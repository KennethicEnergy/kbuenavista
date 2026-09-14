"use client";

import Marquee from "react-fast-marquee";
import { techIcons } from "@/components/skills/tech-icons";

/** Icons shown in the homepage marquee (original set). */
const marqueeLabels = new Set([
  "GitHub",
  "JavaScript",
  "HTML",
  "CSS",
  "TypeScript",
  "Docker",
  "SASS",
  "Bootstrap",
  "Tailwind",
  "MongoDB",
  "React",
  "Angular",
  "Vue",
  "Redux",
  "Node.js",
  "Figma",
  "Next.js",
  "Ionic",
  "Redis",
  "MySQL",
  "Firebase",
  "GTM",
  "Analytics",
]);

const marqueeItems = techIcons.filter(({ label }) => marqueeLabels.has(label));

type SkillsMarqueeProps = {
  className?: string;
  compact?: boolean;
};

export function SkillsMarquee({ className, compact = false }: SkillsMarqueeProps) {
  return (
    <div className={className}>
      <Marquee gradient={false} speed={40} pauseOnHover>
        {marqueeItems.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className={
              compact
                ? "mx-5 flex flex-col items-center gap-1.5 text-text-muted transition-colors hover:text-brand"
                : "mx-6 flex flex-col items-center gap-2 text-text-muted transition-colors hover:text-brand"
            }
            title={label}
          >
            <Icon size={compact ? 24 : 28} aria-hidden />
            <span className="text-xs">{label}</span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}
