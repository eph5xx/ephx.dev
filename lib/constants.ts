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
  /** Path under public/; projects without one show the GitHub icon */
  icon?: string;
  /** The icon is an opaque square that fills its tile, with no white margin */
  iconFillsSquare?: boolean;
  /** Fixed accomplishment shown as a chip */
  chip?: string;
  /** "owner/name" of the repo whose live star count is shown as a chip */
  starsRepo?: string;
  /** stats.json URL whose `videos` count is shown as a chip */
  videosStats?: string;
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
    description: "Skill that scores startup ideas.",
    url: "https://github.com/eph5xx/tweakidea",
    date: "04.2026",
    starsRepo: "eph5xx/tweakidea",
  },
  {
    name: "Fjords",
    description: "Agent that helps you achieve goals.",
    url: "https://t.me/fjordsgoalbot",
    date: "05.2026",
    icon: "/projects/fjords.jpg",
    iconFillsSquare: true,
  },
  {
    name: "Surf Skills",
    description: "Directory of agent skills with videos.",
    url: "https://surfskills.surf",
    date: "06.2026",
    icon: "/projects/surf-skills.png",
    videosStats: "https://surfskills.surf/stats.json",
  },
  {
    name: "Tiebreaker",
    description: "Skill for well-reasoned decisions.",
    url: "https://github.com/eph5xx/tiebreaker",
    date: "07.2026",
  },
  {
    name: "Touchless",
    description: "macOS voice-to-text app with plugins.",
    url: "https://github.com/eph5xx/touchless",
    date: "08.2026",
    icon: "/projects/touchless.png",
    iconFillsSquare: true,
  },
  {
    name: "Biviu",
    description: "Tool that finds and ranks any entities.",
    url: "https://biviu.com",
    date: "09.2026",
    icon: "/projects/biviu.svg",
    chip: "Main focus",
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
  cal: {
    prefix: "cal.com/",
    handle: "eph5xx",
    href: "https://cal.com/eph5xx",
  },
} satisfies Record<string, ProfileLink>;

export const LINKS: ProfileLink[] = [
  SOCIAL.github,
  SOCIAL.linkedin,
  SOCIAL.x,
  SOCIAL.cal,
];
