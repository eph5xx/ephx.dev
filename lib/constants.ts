export const SITE_NAME = "ephx.dev" as const;

export const PROFILE = {
  name: "Aleksandr Sarantsev",
  tagline:
    "I worked on search at Yandex and storage at Databricks. Now I build tools for AI agents on my own.",
  description:
    "Aleksandr Sarantsev worked on search at Yandex and storage at Databricks. Now he builds tools for AI agents. Projects you can try, background, and links.",
  avatar: "/ava.jpg",
} as const;

export interface Project {
  name: string;
  description: string;
  /** Repo or live site; omit when there is no public link yet */
  url?: string;
  /** Launch month, formatted as MM.YYYY */
  date?: string;
  /** Shell command a visitor can copy to try it */
  install?: string;
  /** How to try it when there is no command, e.g. "Build from source" */
  note?: string;
  /** Verified public proof, e.g. "55 stars" */
  proof?: string;
}

export interface ProfileLink {
  /** Muted part shown before the handle, e.g. "github.com/" */
  prefix: string;
  handle: string;
  href: string;
}

/** Ordered by how quickly a visitor can try each one. */
export const PROJECTS: Project[] = [
  {
    name: "TweakIdea",
    description:
      "Agent skill that scores a startup idea and says go, pivot, or stop.",
    url: "https://github.com/eph5xx/tweakidea",
    date: "04.2026",
    install: "npx skills add eph5xx/tweakidea",
    proof: "55 stars on GitHub",
  },
  {
    name: "Surf Skills",
    description: "Directory of AI agent skills, each shown actually working.",
    url: "https://surfskills.surf",
    date: "06.2026",
    note: "Live at surfskills.surf",
  },
  {
    name: "Tiebreaker",
    description:
      "Claude Code skill that settles decisions with a weighted scoring matrix.",
    url: "https://github.com/eph5xx/tiebreaker",
    date: "07.2026",
    install: "npx skills add eph5xx/tiebreaker",
  },
  {
    name: "Touchless",
    description: "macOS menu-bar voice-to-text app with plugins.",
    url: "https://github.com/eph5xx/touchless",
    date: "07.2026",
    note: "Build from source",
  },
  {
    name: "Fjords",
    description:
      "AI cofounder: dashboard, social media, distribution, AI investor. Pluginizable.",
    date: "05.2026",
    note: "Private for now",
  },
];

export const SOCIAL = {
  github: {
    prefix: "github.com/",
    handle: "eph5xx",
    href: "https://github.com/eph5xx",
  },
  linkedin: {
    prefix: "linkedin.com/in/",
    handle: "eph5xx",
    href: "https://www.linkedin.com/in/eph5xx/",
  },
  x: {
    prefix: "x.com/",
    handle: "eph5xx",
    href: "https://x.com/eph5xx",
  },
} satisfies Record<string, ProfileLink>;

export const LINKS: ProfileLink[] = [SOCIAL.github, SOCIAL.linkedin, SOCIAL.x];
