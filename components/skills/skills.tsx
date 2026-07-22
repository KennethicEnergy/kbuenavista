"use client";

import Marquee from "react-fast-marquee";
import {
  BiLogoAngular,
  BiLogoBootstrap,
  BiLogoCss3,
  BiLogoDocker,
  BiLogoFigma,
  BiLogoGithub,
  BiLogoHtml5,
  BiLogoJavascript,
  BiLogoMongodb,
  BiLogoNodejs,
  BiLogoReact,
  BiLogoRedux,
  BiLogoSass,
  BiLogoTailwindCss,
  BiLogoTypescript,
  BiLogoVuejs,
} from "react-icons/bi";
import { DiMysql, DiRedis } from "react-icons/di";
import { IoLogoIonic } from "react-icons/io";
import { RiNextjsFill } from "react-icons/ri";
import { SiFirebase, SiGoogleanalytics, SiGoogletagmanager } from "react-icons/si";
import { Section } from "@/components/ui/section";

const icons = [
  { icon: BiLogoGithub, label: "GitHub" },
  { icon: BiLogoJavascript, label: "JavaScript" },
  { icon: BiLogoHtml5, label: "HTML" },
  { icon: BiLogoCss3, label: "CSS" },
  { icon: BiLogoTypescript, label: "TypeScript" },
  { icon: BiLogoDocker, label: "Docker" },
  { icon: BiLogoSass, label: "SASS" },
  { icon: BiLogoBootstrap, label: "Bootstrap" },
  { icon: BiLogoTailwindCss, label: "Tailwind" },
  { icon: BiLogoMongodb, label: "MongoDB" },
  { icon: BiLogoReact, label: "React" },
  { icon: BiLogoAngular, label: "Angular" },
  { icon: BiLogoVuejs, label: "Vue" },
  { icon: BiLogoRedux, label: "Redux" },
  { icon: BiLogoNodejs, label: "Node.js" },
  { icon: BiLogoFigma, label: "Figma" },
  { icon: RiNextjsFill, label: "Next.js" },
  { icon: IoLogoIonic, label: "Ionic" },
  { icon: DiRedis, label: "Redis" },
  { icon: DiMysql, label: "MySQL" },
  { icon: SiFirebase, label: "Firebase" },
  { icon: SiGoogletagmanager, label: "GTM" },
  { icon: SiGoogleanalytics, label: "Analytics" },
];

export function Skills() {
  return (
    <Section title="What I work with" subtitle="Tools and technologies across the stack.">
      <div className="overflow-hidden rounded-xl border border-bg-elevated bg-bg-surface/60">
        <div className="py-6">
          <Marquee gradient={false} speed={40} pauseOnHover>
            {icons.map(({ icon: Icon, label }) => (
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
