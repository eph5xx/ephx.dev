import Link from "next/link";
import type { Article } from "@/lib/articles";

interface ArticleHeaderProps {
  article: Article;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <header className="mx-auto max-w-3xl px-4 pt-12 pb-8 md:px-6">
      <Link
        href="/"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        &larr; Articles
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
        {article.title}
      </h1>
      <time className="mt-2 block text-sm text-muted-foreground">
        {new Date(article.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
    </header>
  );
}
