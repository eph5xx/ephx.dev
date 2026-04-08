import type { ComponentType } from "react";

export interface Article {
  title: string;
  slug: string;
  description: string;
  date: string; // ISO date string
  published: boolean;
}

// Article metadata registry -- single source of truth for all article data.
// Used by generateStaticParams, generateMetadata, sitemap, and home page grid.
export const articles: Article[] = [
  {
    title: "Tweak Idea: evaluate your startup ideas in Claude Code",
    slug: "tweak-idea",
    description:
      "Using multi-agent orchestration to score startup ideas across weighted dimensions.",
    date: "2026-04-08",
    published: true,
  },
];

// Content component registry (lazy-loaded).
// Maps slug -> dynamic import of the article's creative content component.
export const articleContent: Record<
  string,
  () => Promise<{ default: ComponentType }>
> = {
  "tweak-idea": () =>
    import("@/components/articles/content/tweak-idea"),
};

// Helper: look up a single published article by slug
export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug && a.published);
}

// Helper: get all published articles (for home page grid, sitemap, etc.)
export function getPublishedArticles(): Article[] {
  return articles.filter((a) => a.published);
}
