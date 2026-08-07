"use client";

import Marquee from "react-fast-marquee";
import { techIcons } from "@/components/skills/tech-icons";
import { Section } from "@/components/ui/section";

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

export function Skills() {
  return (
    <Section title="What I work with" subtitle="Tools and technologies across the stack.">
      <div className="overflow-hidden rounded-xl border border-bg-elevated bg-bg-surface/60">
        <div className="py-6">
          <Marquee gradient={false} speed={40} pauseOnHover>
            {techIcons
              .filter(({ label }) => marqueeLabels.has(label))
              .map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="mx-6 flex flex-col items-center gap-2 text-text-muted transition-colors hover:text-brand"
                  title={label}
                >
                  <Icon size={28} aria-hidden />
                  <span className="text-xs">{label}</span>
                </div>
              ))}
          </Marquee>
        </div>
      </div>
    </Section>
  );
}
