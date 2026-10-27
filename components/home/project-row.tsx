import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/constants";

/** "https://t.me/fjordsgoalbot" -> "t.me/fjordsgoalbot" */
function displayUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

/**
 * Two lines on a two-column grid: name and description, then date and the
 * address the row opens. Phones stack it as name and date, description,
 * address. The name's link stretches over the whole row.
 */
export function ProjectRow({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <li
      data-hover-item
      className="reveal group relative -mx-2 grid list-none grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-1 rounded-md px-2 py-2 md:grid-cols-[6.5rem_1fr] md:gap-x-6"
      style={{ "--i": index } as CSSProperties}
    >
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground focus-visible:after:outline-ring text-base font-medium outline-none after:absolute after:inset-0 after:rounded-md focus-visible:after:outline-2"
      >
        {project.name}
      </a>
      <span className="text-muted-foreground justify-self-end font-mono text-sm tabular-nums md:row-start-2 md:justify-self-start">
        {project.date}
      </span>
      <p className="text-body col-span-2 text-base text-pretty md:col-span-1 md:col-start-2 md:row-start-1">
        {project.description}
      </p>
      <span className="text-muted-foreground group-hover:text-foreground col-span-2 inline-flex items-center gap-1 justify-self-start font-mono text-sm transition-colors md:col-span-1 md:col-start-2 md:row-start-2">
        <span className="underline decoration-current/40 underline-offset-4 group-hover:decoration-current">
          {displayUrl(project.url)}
        </span>
        <ArrowUpRight className="size-3.5" aria-hidden="true" />
      </span>
    </li>
  );
}
