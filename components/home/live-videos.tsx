"use client";

import { useEffect, useState } from "react";
import { fetchVideoCount } from "@/lib/surf-stats";
import { chipClass } from "@/components/home/chip";

/**
 * Starts from the count fetched at build time, so it's in the HTML, then
 * refreshes in the browser. Shows nothing if neither fetch succeeded.
 */
export function LiveVideos({
  url,
  initial,
}: {
  url: string;
  initial: number | null;
}) {
  const [videos, setVideos] = useState(initial);

  useEffect(() => {
    let cancelled = false;
    fetchVideoCount(url).then((latest) => {
      if (!cancelled && latest !== null) setVideos(latest);
    });
    return () => {
      cancelled = true;
    };
  }, [url]);

  if (videos === null) return null;

  return (
    <span className={chipClass}>
      {videos} {videos === 1 ? "video" : "videos"}
    </span>
  );
}
