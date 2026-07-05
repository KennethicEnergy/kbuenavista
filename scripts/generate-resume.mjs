import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, "..", "Kenneth-Buenavista-Resume.docx");

const FONT = "Calibri";
const BODY_SIZE = 22; // 11pt
const SMALL_SIZE = 20; // 10pt
const NAME_SIZE = 36; // 18pt
const SECTION_SIZE = 24; // 12pt
const DARK = "1A1A1A";
const GRAY = "444444";

const body = (text, opts = {}) =>
  new TextRun({
    text,
    font: FONT,
    size: opts.size ?? BODY_SIZE,
    color: opts.color ?? DARK,
    bold: opts.bold,
    italics: opts.italics,
  });

const sectionHeading = (text) =>
  new Paragraph({
    spacing: { before: 280, after: 120 },
    border: { bottom: { color: DARK, size: 6, space: 1 } },
    children: [body(text, { bold: true, size: SECTION_SIZE })],
  });

const para = (runs, spacing = { after: 100 }) =>
  new Paragraph({ spacing, children: Array.isArray(runs) ? runs : [runs] });

const bullet = (text) =>
  new Paragraph({
    spacing: { after: 60 },
    indent: { left: 360, hanging: 180 },
    children: [body(`• ${text}`)],
  });

const jobHeader = (title, company, date, location = "Philippines") =>
  new Paragraph({
    spacing: { before: 160, after: 40 },
    children: [
      body(title, { bold: true }),
      body("  |  ", { color: GRAY }),
      body(company, { bold: true }),
      body("  |  ", { color: GRAY }),
      body(date, { italics: true, color: GRAY }),
    ],
  });

const jobSub = (text) =>
  para([body(text, { italics: true, color: GRAY, size: SMALL_SIZE })], { after: 80 });

const projectEntry = (name, stack, description, bullets = []) => [
  para([body(name, { bold: true }), body("  —  ", { color: GRAY }), body(stack, { color: GRAY, size: SMALL_SIZE })]),
  para([body(description, { size: SMALL_SIZE })]),
  ...bullets.map(bullet),
];

const doc = new Document({
  creator: "Kenneth Buenavista",
  title: "Kenneth Buenavista - Resume",
  description: "ATS-friendly resume",
  styles: {
    default: {
      document: {
        run: { font: FONT, size: BODY_SIZE, color: DARK },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 720, right: 720, bottom: 720, left: 720 },
        },
      },
      children: [
        // ── HEADER ──
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [body("KENNETH BUENAVISTA", { bold: true, size: NAME_SIZE })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [
            body("Senior Front-End Web Developer", { color: GRAY }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            body("Philippines", { size: SMALL_SIZE }),
            body("  •  ", { size: SMALL_SIZE, color: GRAY }),
            body("linkedin.com/in/ken-buenavista-94a736144", { size: SMALL_SIZE }),
            body("  •  ", { size: SMALL_SIZE, color: GRAY }),
            body("github.com/KennethicEnergy", { size: SMALL_SIZE }),
          ],
        }),

        // ── PROFESSIONAL SUMMARY ──
        sectionHeading("PROFESSIONAL SUMMARY"),
        para([
          body(
            "Senior Front-End Developer with 8+ years of experience building scalable web applications across insurance, aviation, gaming, and iGaming industries. Expert in React, Next.js, TypeScript, and Angular with a proven track record of delivering production-grade UIs, leading code reviews, and owning full frontend architecture solo. Strong in API integration, real-time features, performance optimization, CI/CD workflows, and translating Figma designs into responsive, accessible interfaces."
          ),
        ]),

        // ── EDUCATION (TEMPLATE) ──
        sectionHeading("EDUCATION"),
        para([body("[Degree Name]", { bold: true }), body("  |  ", { color: GRAY }), body("[University / Institution Name]", { bold: true })]),
        para([body("[Month Year] – [Month Year]", { italics: true, color: GRAY, size: SMALL_SIZE })]),
        bullet("[City], [Country]"),
        bullet("Relevant coursework: [Course 1], [Course 2], [Course 3]"),
        bullet("Honors / Awards: [Optional — Dean's List, Academic Distinction, etc.]"),
        para([body("[Add second degree or certification program here if applicable]", { italics: true, color: GRAY, size: SMALL_SIZE })]),

        // ── WORK EXPERIENCE ──
        sectionHeading("WORK EXPERIENCE"),

        jobHeader(
          "Senior Front-End Web Developer",
          "Webzoid System Solutions Corporation",
          "April 2026 – Present"
        ),
        jobSub("Sole Front-End Developer — WOWGames Online Casino Platform"),
        bullet("Architected and built a full-scale online casino platform from scratch as the sole frontend developer using Next.js, React, and TypeScript"),
        bullet("Owned end-to-end frontend delivery: app routing, authentication, WebSocket real-time features, game launcher, sportsbook, tournaments, and community forums"),
        bullet("Integrated REST APIs with TanStack Query; managed client state with Zustand; implemented form validation with Formik and Zod"),
        bullet("Delivered responsive UI across all breakpoints using Tailwind CSS and Motion for animated interactions"),
        bullet("Made independent architectural decisions, established reusable component patterns, and shipped production-ready features"),

        jobHeader(
          "Senior Front-End Web Developer",
          "Vela Ventures Inc.",
          "December 2024 – October 2025"
        ),
        bullet("Developed betting websites and platforms including Mansion88 and S5.com using Next.js and JavaScript"),
        bullet("Built and maintained core features; integrated third-party and internal APIs for seamless user experiences"),
        bullet("Optimized site performance for fast, responsive interactions across devices and browsers"),
        bullet("Translated UI mockups into dynamic interfaces; coordinated with stakeholders on requirements and deployments"),
        bullet("Implemented Google Tag Manager and Google Analytics for tracking and conversion measurement"),

        jobHeader(
          "Senior Front-End Web Developer",
          "BossDeal Corporation",
          "September 2024 – December 2024"
        ),
        bullet("Developed betting game applications using Next.js and Vue.js in an agile delivery environment"),
        bullet("Designed and implemented key features with seamless backend API integration"),
        bullet("Translated designer mockups into interactive, maintainable interfaces following best practices"),
        bullet("Wrote unit tests to ensure code reliability; collaborated with stakeholders on requirements and releases"),

        jobHeader(
          "Senior Front-End Web Developer",
          "W-Bridges Manpower Corporation",
          "September 2023 – September 2024"
        ),
        bullet("Maintained large-scale multi-theme applications with multiple brand variants in a single codebase"),
        bullet("Translated Figma designs into fully functional, responsive websites and web applications"),
        bullet("Reviewed and approved frontend tickets from other developers; documented tasks with test attachments"),
        bullet("Collaborated with cross-regional teams across Southeast Asia in scrum ceremonies and planning sessions"),

        jobHeader(
          "Senior Front-End Web Developer",
          "Collabera Digital",
          "July 2022 – July 2023"
        ),
        bullet("Converted UI content into CMS-driven pages to improve website optimization and content management"),
        bullet("Built fluid UI/UX from Figma designs for enterprise client projects including Cebu Pacific Air"),
        bullet("Reviewed and approved frontend code submissions; participated in sprint planning and scrum meetings"),
        bullet("Collaborated with cross-functional teams to deliver projects on schedule and to specification"),

        jobHeader(
          "Front-End Web Developer / Production Support",
          "Tata Consultancy Services",
          "May 2021 – July 2022"
        ),
        bullet("Maintained codebase: reviewed pull requests, merged to main, and managed Jenkins deployments across environments"),
        bullet("Used Husky, SonarQube, and Fortify in CI/CD pipelines for quality and security checks"),
        bullet("Resolved production issues using New Relic, Devo, and RabbitMQ on the Production Support team"),
        bullet("Developed Angular UI components for Manulife ID ePOS insurance platform"),

        jobHeader(
          "Front-End Web Developer",
          "98Labs Inc.",
          "December 2018 – May 2021"
        ),
        bullet("Built web applications using React and Angular with component-based architecture and state management"),
        bullet("Integrated REST APIs; focused on performance optimization, reusable components, and responsive design"),
        bullet("Improved debugging and testing practices; ensured cross-browser compatibility across deliverables"),

        jobHeader("Internship", "98Labs Inc.", "November 2016 – April 2017"),
        bullet("Performed QA testing while learning HTML, CSS, and JavaScript fundamentals"),
        bullet("Automated repetitive testing tasks with scripts; collaborated with developers on bug identification and verification"),
        bullet("Gained foundational understanding of frontend-backend interaction and web development workflows"),

        // ── PROJECTS ──
        sectionHeading("PROJECTS"),
        ...projectEntry(
          "WOWGames",
          "Next.js · React · TypeScript · Tailwind CSS · Zustand · TanStack Query · WebSockets",
          "Full-featured online casino platform built solo as sole frontend developer.",
          [
            "Game lobby, launcher, sportsbook, tournaments, promotions, referral program, VIP/profile pages, and community forum",
            "Real-time updates via WebSockets; authenticated user flows with NextAuth",
            "Responsive Tailwind CSS interface with Motion animations across all device breakpoints",
          ]
        ),
        ...projectEntry(
          "Mansion88",
          "Next.js · React · JavaScript · SASS · Google Tag Manager · Google Analytics",
          "Betting platform with responsive UI and third-party API integrations.",
          [
            "Performance-optimized pages for seamless cross-device user experience",
            "Analytics and tag management integration for marketing and conversion tracking",
          ]
        ),
        ...projectEntry(
          "Game99",
          "Next.js · React · TypeScript · SASS · Tailwind CSS",
          "Multi-platform gaming application where users place bets across game categories.",
          [
            "Multi-theme architecture supporting multiple brand variants in one application",
            "Responsive UI built from Figma designs with scalable component patterns",
          ]
        ),
        ...projectEntry(
          "Cebu Pacific Air (OmniX Web)",
          "Angular · TypeScript · SASS · Figma",
          "Airline booking platform with flight search, seat selection, and online payments.",
          [
            "Flight search by date, origin, and destination; ancillary services (baggage, meals)",
            "CMS-driven content for optimized website management and performance",
          ]
        ),
        ...projectEntry(
          "Manulife ID (ePOS)",
          "Angular · TypeScript · SASS",
          "Electronic Point of Sale system for insurance advisors.",
          [
            "Guided policy purchase workflow without face-to-face interaction",
            "Proposal delivery and application process for insurance advisors",
          ]
        ),

        // ── ACTIVITIES ──
        sectionHeading("ACTIVITIES"),
        para([
          body("NG-MY 2019", { bold: true }),
          body("  —  Conference Attendee  —  ", { color: GRAY }),
          body("July 6–7, 2019", { italics: true, color: GRAY }),
        ]),
        bullet("Attended the first-ever Angular conference in Southeast Asia (#ngMY2019), a community-driven event for the Angular ecosystem in Malaysia"),
        bullet("Participated in two days of technical sessions and speaker talks at Sunway University, Kuala Lumpur"),
        bullet("Gained exposure to Angular best practices, ecosystem updates, and regional frontend developer networking"),
        bullet("Event details: 2019.ng-my.org — labour-of-love conference organized for the Angular community in Malaysia"),
        para([body("Portfolio: Personal developer portfolio showcasing projects, experience timeline, and technical stack", { size: SMALL_SIZE, italics: true })]),

        // ── SKILLS & CERTIFICATIONS ──
        sectionHeading("SKILLS & CERTIFICATIONS"),
        para([body("Languages & Frameworks: ", { bold: true }), body("JavaScript, TypeScript, HTML5, CSS3, React, Next.js, Angular, Vue.js")]),
        para([body("Styling & UI: ", { bold: true }), body("SASS/SCSS, Tailwind CSS, Bootstrap, Responsive Design, Figma")]),
        para([body("State & Data: ", { bold: true }), body("Zustand, Redux, TanStack Query (React Query), REST APIs, WebSockets (Socket.io)")]),
        para([body("Forms & Validation: ", { bold: true }), body("Formik, Zod")]),
        para([body("Tools & DevOps: ", { bold: true }), body("Git, Jenkins, Husky, SonarQube, Fortify, Docker, Google Tag Manager, Google Analytics")]),
        para([body("Monitoring & Support: ", { bold: true }), body("New Relic, RabbitMQ, Production Support, Code Review")]),
        para([body("Animation: ", { bold: true }), body("Motion (Framer Motion), CSS Animations")]),
        para([body("Certifications: ", { bold: true }), body("[Certification Name] — [Issuing Organization] — [Year]", { italics: true, color: GRAY })]),
        para([body("", { size: SMALL_SIZE }), body("[Add additional certifications here]", { italics: true, color: GRAY, size: SMALL_SIZE })]),
      ],
    },
  ],
});

const buffer = await Packer.toBuffer(doc);
fs.writeFileSync(OUT_PATH, buffer);
console.log(`Resume created: ${OUT_PATH}`);
