import type { MetadataRoute } from "next";
import { getPublishedArticles } from "@/lib/articles";

// Required for static export (output: 'export')
export const dynamic = "force-static";

const BASE_URL = "https://ephx.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const articleUrls: MetadataRoute.Sitemap = getPublishedArticles().map(
    (article) => ({
      url: `${BASE_URL}/a/${article.slug}`,
      lastModified: new Date(article.date),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })
  );

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...articleUrls,
  ];
}
