import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ListRowProps {
  /** Position in the list; drives the staggered entrance. */
  index: number;
  title: ReactNode;
  detail?: ReactNode;
  meta?: ReactNode;
  /**
   * Second line under the row. The row link covers the whole item, so
   * interactive children need `relative z-10` to stay clickable.
   */
  sub?: ReactNode;
  href?: string;
}

export function ListRow({
  index,
  title,
  detail,
  meta,
  sub,
  href,
}: ListRowProps) {
  const content = (
    <>
      <span className="min-w-0 flex-1 text-pretty">
        <span className="font-medium">{title}</span>
        {detail && (
          <>
            {" "}
            <span className="text-muted-foreground text-sm">{detail}</span>
          </>
        )}
      </span>
      {meta && (
        <span className="text-muted-foreground shrink-0 font-mono text-sm whitespace-nowrap tabular-nums">
          {meta}
        </span>
      )}
    </>
  );

  const rowClass = cn(
    "flex items-baseline gap-x-4 rounded-md px-2 pt-1 text-base text-foreground",
    sub ? "pb-0.5" : "pb-1"
  );

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
          className={cn(
            rowClass,
            "focus-visible:after:outline-ring outline-none after:absolute after:inset-0 after:rounded-md focus-visible:after:outline-2"
          )}
        >
          {content}
        </a>
      ) : (
        <div className={rowClass}>{content}</div>
      )}
      {sub && (
        <div className="text-muted-foreground px-2 pb-1 text-sm">{sub}</div>
      )}
    </li>
  );
}
