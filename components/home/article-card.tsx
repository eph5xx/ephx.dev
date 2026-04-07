"use client";

import * as m from "motion/react-m";
import Link from "next/link";
import type { Article } from "@/lib/articles";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={article.slug === "#" ? "#" : `/a/${article.slug}`}>
      <m.article
        className={cn(
          "group relative h-full rounded-xl p-6",
          "border border-white/10",
          "bg-white/5 backdrop-blur-md",
          "cursor-pointer"
        )}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Accent border glow overlay on hover */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-xl",
            "ring-0 ring-accent/0 transition-all duration-300",
            "group-hover:ring-1 group-hover:ring-accent/30"
          )}
          aria-hidden="true"
        />

        <time className="text-sm text-muted-foreground">
          {new Date(article.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <h2 className="mt-2 text-lg font-semibold text-foreground">
          {article.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {article.description}
        </p>
      </m.article>
    </Link>
  );
}
