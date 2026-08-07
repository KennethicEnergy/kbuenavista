import type { IconType } from "react-icons";
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
import {
  SiFirebase,
  SiFormik,
  SiFramer,
  SiGoogleanalytics,
  SiGoogletagmanager,
  SiJenkins,
  SiNewrelic,
  SiRabbitmq,
  SiReactquery,
  SiSonarqubeserver,
  SiZod,
} from "react-icons/si";
import { TbPlugConnected } from "react-icons/tb";
import { ZustandIcon } from "@/components/skills/zustand-icon";

export type TechIcon = {
  icon: IconType;
  label: string;
  /** Extra names that resolve to this icon (e.g. "NextJs" → Next.js). */
  aliases?: string[];
};

export const techIcons: TechIcon[] = [
  { icon: BiLogoGithub, label: "GitHub" },
  { icon: BiLogoJavascript, label: "JavaScript" },
  { icon: BiLogoHtml5, label: "HTML" },
  { icon: BiLogoCss3, label: "CSS" },
  { icon: BiLogoTypescript, label: "TypeScript" },
  { icon: BiLogoDocker, label: "Docker" },
  { icon: BiLogoSass, label: "SASS", aliases: ["Sass", "SCSS"] },
  { icon: BiLogoBootstrap, label: "Bootstrap" },
  { icon: BiLogoTailwindCss, label: "Tailwind", aliases: ["Tailwind CSS", "TailwindCSS"] },
  { icon: BiLogoMongodb, label: "MongoDB" },
  { icon: BiLogoReact, label: "React" },
  { icon: BiLogoAngular, label: "Angular" },
  { icon: BiLogoVuejs, label: "Vue", aliases: ["Vue.js", "Vuejs"] },
  { icon: BiLogoRedux, label: "Redux" },
  { icon: BiLogoNodejs, label: "Node.js", aliases: ["Node", "NodeJS"] },
  { icon: BiLogoFigma, label: "Figma" },
  { icon: RiNextjsFill, label: "Next.js", aliases: ["NextJs", "NextJS", "Next"] },
  { icon: IoLogoIonic, label: "Ionic" },
  { icon: DiRedis, label: "Redis" },
  { icon: DiMysql, label: "MySQL" },
  { icon: SiFirebase, label: "Firebase" },
  { icon: SiGoogletagmanager, label: "GTM", aliases: ["Google Tag Manager"] },
  { icon: SiGoogleanalytics, label: "Analytics", aliases: ["Google Analytics"] },
  { icon: SiJenkins, label: "Jenkins" },
  { icon: SiSonarqubeserver, label: "SonarQube", aliases: ["Sonar"] },
  { icon: SiNewrelic, label: "New Relic", aliases: ["NewRelic"] },
  { icon: SiRabbitmq, label: "RabbitMQ" },
  { icon: ZustandIcon, label: "Zustand" },
  { icon: SiReactquery, label: "TanStack Query", aliases: ["React Query"] },
  { icon: SiFormik, label: "Formik" },
  { icon: SiZod, label: "Zod" },
  { icon: SiFramer, label: "Motion", aliases: ["Framer Motion", "Framer"] },
  { icon: TbPlugConnected, label: "WebSockets", aliases: ["WebSocket", "Websocket"] },
];

function normalize(name: string) {
  return name.trim().toLowerCase().replace(/[\s._-]+/g, "");
}

const techIconByKey = new Map<string, TechIcon>();

for (const entry of techIcons) {
  techIconByKey.set(normalize(entry.label), entry);
  for (const alias of entry.aliases ?? []) {
    techIconByKey.set(normalize(alias), entry);
  }
}

export function resolveTechIcon(name: string): TechIcon | undefined {
  return techIconByKey.get(normalize(name));
}
