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
  date: string;
}

export interface Role {
  role: string;
  company: string;
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
    name: "Tweak Idea",
    description: "Claude Code skill that scores startup ideas.",
    url: "https://github.com/eph5xx/tweakidea",
    date: "04.2026",
  },
];

export const BACKGROUND: Role[] = [
  {
    role: "Software Engineer",
    company: "Databricks",
    url: "https://www.databricks.com/",
  },
  {
    role: "Software Engineer",
    company: "Yandex",
    url: "https://yandex.com/",
  },
  { role: "Founder", company: "CODE work" },
  {
    role: "Student",
    company: "Yandex School of Data Analysis",
    url: "https://shad.yandex.ru/",
  },
  {
    role: "Software Engineering",
    company: "Far Eastern Federal University",
    url: "https://www.dvfu.ru/",
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
    handle: "ephemeralsad",
    href: "https://www.linkedin.com/in/ephemeralsad/",
  },
];
