import type { CSSProperties, ReactNode } from "react";

interface ListRowProps {
  /** Position in the list; drives the staggered entrance. */
  index: number;
  title: ReactNode;
  href: string;
}

export function ListRow({ index, title, href }: ListRowProps) {
  return (
    <li
      data-hover-item
      className="reveal relative -mx-2 list-none rounded-md"
      style={{ "--i": index } as CSSProperties}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground focus-visible:after:outline-ring flex rounded-md px-2 py-1 text-base font-medium outline-none after:absolute after:inset-0 after:rounded-md focus-visible:after:outline-2"
      >
        {title}
      </a>
    </li>
  );
}
