import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles, articleContent, getArticleBySlug } from "@/lib/articles";
import { ArticleHeader } from "@/components/articles/article-header";
import { ReadingProgress } from "@/components/articles/reading-progress";

// Only serve pre-rendered slugs; unknown slugs get 404 instead of SSR
export const dynamicParams = false;

// Generates all article pages at build time
export function generateStaticParams() {
  return articles
    .filter((a) => a.published)
    .map((a) => ({ slug: a.slug }));
}

// Per-page metadata for SEO + LinkedIn OG tags
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
      url: `/a/${article.slug}`,
      images: ["/og-default.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: ["/og-default.png"],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  const contentLoader = articleContent[slug];

  if (!article || !contentLoader) {
    notFound();
  }

  const Content = (await contentLoader()).default;

  return (
    <>
      <ReadingProgress />
      <ArticleHeader article={article} />
      <Content />
    </>
  );
}
