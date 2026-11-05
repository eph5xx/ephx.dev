"use client";

import { useEffect, useState } from "react";
import { fetchStars } from "@/lib/github-stars";
import { chipClass } from "@/components/home/chip";

/**
 * Starts from the count fetched at build time, so it's in the HTML, then
 * refreshes in the browser. Shows nothing if neither fetch succeeded.
 */
export function LiveStars({
  repo,
  initial,
}: {
  repo: string;
  initial: number | null;
}) {
  const [stars, setStars] = useState(initial);

  useEffect(() => {
    let cancelled = false;
    fetchStars(repo).then((latest) => {
      if (!cancelled && latest !== null) setStars(latest);
    });
    return () => {
      cancelled = true;
    };
  }, [repo]);

  if (stars === null) return null;

  return <span className={chipClass}>{stars} GitHub stars</span>;
}
