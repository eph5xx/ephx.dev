import type { CSSProperties } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { chipClass } from "@/components/home/chip";
import { LiveStars } from "@/components/home/live-stars";
import { LiveVideos } from "@/components/home/live-videos";
import { GitHubIcon } from "@/components/icons/github";
import type { Project } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** "https://t.me/fjordsgoalbot" -> "t.me/fjordsgoalbot" */
function displayUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

/**
 * A card: icon, name with start month, and chip on top, then the description,
 * then the address the card opens. The name's link stretches over the whole
 * card. `stars` is the build-time count for the `starsRepo` chip.
 * `videos` is the build-time count for the `videosStats` chip.
 */
export function ProjectRow({
  project,
  index,
  stars,
  videos,
}: {
  project: Project;
  index: number;
  stars: number | null;
  videos: number | null;
}) {
  return (
    <li
      className="reveal group bg-foreground/5 hover:bg-foreground/10 relative flex list-none flex-col gap-3 rounded-lg p-4 transition-colors"
      style={{ "--i": index } as CSSProperties}
    >
      <div className="flex items-center gap-3">
        {/* Same white square in both themes, so every icon is the same size */}
        <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-black/10">
          {project.icon ? (
            <Image
              src={project.icon}
              alt=""
              width={80}
              height={80}
              className={cn(
                "object-contain",
                project.iconFillsSquare ? "size-full" : "size-8"
              )}
            />
          ) : (
            <GitHubIcon className="size-8 text-black" aria-hidden="true" />
          )}
        </span>
        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <div className="flex flex-col">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground focus-visible:after:outline-ring text-base leading-snug font-semibold outline-none after:absolute after:inset-0 after:rounded-lg focus-visible:after:outline-2"
            >
              {project.name}
            </a>
            <span className="text-body font-mono text-sm leading-snug tabular-nums">
              {project.date}
            </span>
          </div>
          {project.chip && <span className={chipClass}>{project.chip}</span>}
          {project.starsRepo && (
            <LiveStars repo={project.starsRepo} initial={stars} />
          )}
          {project.videosStats && (
            <LiveVideos url={project.videosStats} initial={videos} />
          )}
        </div>
      </div>
      <p className="text-foreground text-base text-pretty">
        {project.description}
      </p>
      <span className="text-body mt-auto inline-flex min-w-0 items-center gap-1 font-mono text-sm">
        <span className="truncate group-hover:underline group-hover:underline-offset-4">
          {displayUrl(project.url)}
        </span>
        <ArrowUpRight className="size-3.5 shrink-0" aria-hidden="true" />
      </span>
    </li>
  );
}
