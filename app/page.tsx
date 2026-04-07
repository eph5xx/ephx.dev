import { articles } from "@/lib/articles";
import { ArticleCard } from "@/components/home/article-card";
import { GradientMesh } from "@/components/home/gradient-mesh";

export default function HomePage() {
  if (articles.length === 0) {
    return (
      <>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-lg font-semibold text-foreground">
              No articles yet
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Check back soon — new articles are on the way.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <GradientMesh />
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard
              key={article.slug + article.date}
              article={article}
            />
          ))}
        </div>
      </div>
    </>
  );
}
