export const SITE_NAME = "ephx.dev" as const;

export const PROFILE = {
  name: "Aleksandr Sarantsev",
  tagline: "Software engineer building tools for AI agents.",
  description:
    "Aleksandr Sarantsev, software engineer building tools for AI agents. Projects, background, and links.",
  avatar: "/ava.jpg",
} as const;

export interface Project {
  name: string;
  description: string;
  /** Repo or live site; omit when there is no public link yet */
  url?: string;
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

export const PROJECTS: Project[] = [
  {
    name: "TweakIdea",
    description: "Claude Code skill that scores startup ideas.",
    url: "https://github.com/eph5xx/tweakidea",
    date: "04.2026",
  },
  {
    name: "Fjords",
    description:
      "AI cofounder: dashboard, social media, distribution, AI investor. Pluginizable.",
    date: "05.2026",
  },
  {
    name: "Surf Skills",
    description: "Directory of AI agent skills, each shown actually working.",
    url: "https://surfskills.surf",
    date: "06.2026",
  },
  {
    name: "Tiebreaker",
    description:
      "Claude Code skill that settles decisions with a weighted scoring matrix.",
    url: "https://github.com/eph5xx/tiebreaker",
    date: "07.2026",
  },
  {
    name: "Touchless",
    description:
      "World-class mic capture with plugins: tutor, idea capture, and more.",
    url: "https://github.com/eph5xx/touchless",
    date: "07.2026",
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
