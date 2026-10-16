import type { Article } from "@/lib/articles";

interface ArticleHeaderProps {
  article: Article;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <header className="mx-auto w-full max-w-3xl px-4 pb-8 md:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-pretty md:text-4xl">
        {article.title}
      </h1>
      <time
        dateTime={article.date}
        className="text-muted-foreground mt-4 block font-mono text-sm"
      >
        {new Date(article.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        })}
      </time>
    </header>
  );
}
