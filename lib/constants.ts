export const SITE_NAME = "ephx.dev" as const;

export const PROFILE = {
  name: "Aleksandr Sarantsev",
  tagline:
    "Software engineer. I love building things that actually help people.",
  description:
    "Aleksandr Sarantsev, software engineer. Projects, background, and links.",
  avatar: "/ava.jpg",
} as const;

export interface Project {
  name: string;
  description: string;
  url: string;
  /** Launch month, formatted as MM.YYYY */
  date?: string;
}

export interface Role {
  role: string;
  company: string;
  /** Third part of the one-line entry: team, program, or scope */
  focus: string;
  url?: string;
  /** e.g. "2022–2024" */
  period?: string;
}

export interface ProfileLink {
  /** Muted part shown before the handle, e.g. "github.com/" */
  prefix: string;
  handle: string;
  href: string;
}

// Placeholder target until each project gets its own page.
const PROJECT_URL = "https://ephx.dev";

export const PROJECTS: Project[] = [
  {
    name: "TweakIdea",
    description: "Claude Code skill that scores startup ideas.",
    url: PROJECT_URL,
    date: "04.2026",
  },
  {
    name: "Foglight Connectivity",
    description:
      "Connectivity, memory, and RAG for agents, plus corpus building.",
    url: PROJECT_URL,
    date: "04.2026",
  },
  {
    name: "Biviu",
    description:
      "Paradigm-style AI tables for decisions, shown on a people database.",
    url: PROJECT_URL,
    date: "05.2026",
  },
  {
    name: "Fjords",
    description:
      "AI cofounder: dashboard, social media, distribution, AI investor. Pluginizable.",
    url: PROJECT_URL,
    date: "05.2026",
  },
  {
    name: "Surf Skills",
    description: "Directory of AI agent skills, each shown actually working.",
    url: PROJECT_URL,
    date: "06.2026",
  },
  {
    name: "Design Mascot",
    description: "Paste a link, get a mascot sketched to match your site.",
    url: PROJECT_URL,
    date: "07.2026",
  },
  {
    name: "Touchless",
    description:
      "World-class mic capture with plugins: tutor, idea capture, and more.",
    url: PROJECT_URL,
    date: "07.2026",
  },
  {
    name: "Foglight Agent Builder",
    description:
      "AI setup app for building agents, with custom search relevance.",
    url: PROJECT_URL,
    date: "08.2026",
  },
  {
    name: "Foglight Vibe Clustering",
    description: "Cluster anything by vibe.",
    url: PROJECT_URL,
    date: "09.2026",
  },
  {
    name: "Foglight Jobs",
    description: "Foglight applied to hiring and job search.",
    url: PROJECT_URL,
    date: "10.2026",
  },
];

export const BACKGROUND: Role[] = [
  {
    role: "B.S.",
    company: "FEFU",
    focus: "Software Engineering",
    url: "https://www.dvfu.ru/",
    period: "2018–2022",
  },
  {
    role: "Founder",
    company: "CODE work",
    focus: "800+ volunteers",
    period: "2021–2022",
  },
  {
    role: "SWE",
    company: "Yandex",
    focus: "Search as a Service",
    url: "https://yandex.com/",
    period: "2022–2025",
  },
  {
    role: "Student",
    company: "YSDA",
    focus: "Machine Learning",
    url: "https://shad.yandex.ru/",
    period: "2023–2024",
  },
  {
    role: "SWE",
    company: "Databricks",
    focus: "Neon Storage",
    url: "https://www.databricks.com/",
    period: "2025–2026",
  },
];

export const LINKS: ProfileLink[] = [
  {
    prefix: "github.com/",
    handle: "eph5xx",
    href: "https://github.com/eph5xx",
  },
  {
    prefix: "linkedin.com/in/",
    handle: "eph5xx",
    href: "https://www.linkedin.com/in/eph5xx/",
  },
  {
    prefix: "x.com/",
    handle: "eph5xx",
    href: "https://x.com/eph5xx",
  },
];
