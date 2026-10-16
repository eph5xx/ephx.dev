import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ListRowProps {
  /** Position in the list; drives the staggered entrance. */
  index: number;
  title: ReactNode;
  detail?: ReactNode;
  /** Hide the detail text below the sm breakpoint. */
  hideDetailOnMobile?: boolean;
  meta?: ReactNode;
  /** Muted second line under the title row. */
  description?: ReactNode;
  href?: string;
}

export function ListRow({
  index,
  title,
  detail,
  hideDetailOnMobile = false,
  meta,
  description,
  href,
}: ListRowProps) {
  const content = (
    <>
      <span className="font-medium">{title}</span>
      {detail && (
        <span
          className={cn(
            "text-muted-foreground text-sm",
            hideDetailOnMobile && "hidden sm:inline"
          )}
        >
          {detail}
        </span>
      )}
      {meta && (
        <span className="text-muted-foreground ml-auto shrink-0 font-mono text-sm whitespace-nowrap tabular-nums">
          {meta}
        </span>
      )}
      {description && (
        <span className="text-muted-foreground basis-full text-sm leading-relaxed text-pretty">
          {description}
        </span>
      )}
    </>
  );

  const rowClass =
    "flex flex-wrap items-baseline gap-x-2 rounded-md px-2 py-1 text-base text-foreground";

  return (
    <li
      data-hover-item
      className="reveal relative -mx-2 list-none rounded-md"
      style={{ "--i": index } as CSSProperties}
    >
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={rowClass}
        >
          {content}
        </a>
      ) : (
        <div className={rowClass}>{content}</div>
      )}
    </li>
  );
}
