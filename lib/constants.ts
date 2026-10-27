export const SITE_NAME = "ephx.dev" as const;

export const PROFILE = {
  name: "Aleksandr Sarantsev",
  tagline: "I build tools for AI agents.",
  description:
    "Aleksandr Sarantsev builds tools for AI agents. Projects you can try, background, and links.",
  avatar: "/ava.jpg",
} as const;

export interface Project {
  name: string;
  description: string;
  /** Repo, live site, or bot; the whole row links here */
  url: string;
  /** Start month, formatted as MM.YYYY */
  date: string;
}

export interface ProfileLink {
  /** Muted part shown before the handle, e.g. "github.com/" */
  prefix: string;
  handle: string;
  href: string;
}

/** Oldest first. */
export const PROJECTS: Project[] = [
  {
    name: "TweakIdea",
    description:
      "Agent skill that scores a startup idea and suggests the next steps.",
    url: "https://github.com/eph5xx/tweakidea",
    date: "04.2026",
  },
  {
    name: "Fjords",
    description: "Agent that helps you achieve your goals.",
    url: "https://t.me/fjordsgoalbot",
    date: "05.2026",
  },
  {
    name: "Surf Skills",
    description: "Directory of AI agent skills with video previews.",
    url: "https://surfskills.surf",
    date: "06.2026",
  },
  {
    name: "Tiebreaker",
    description: "Agent skill that helps agents make well-reasoned decisions.",
    url: "https://github.com/eph5xx/tiebreaker",
    date: "07.2026",
  },
  {
    name: "Touchless",
    description: "macOS voice-to-text app, plugin-friendly.",
    url: "https://github.com/eph5xx/touchless",
    date: "07.2026",
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
