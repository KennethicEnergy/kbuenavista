"use client";

import { SkillsMarquee } from "@/components/skills/skills-marquee";
import { Section } from "@/components/ui/section";

export function Skills() {
  return (
    <Section title="What I work with" subtitle="Tools and technologies across the stack.">
      <div className="overflow-hidden rounded-xl border border-bg-elevated bg-bg-surface/60">
        <div className="py-6">
          <SkillsMarquee />
        </div>
      </div>
    </Section>
  );
}
