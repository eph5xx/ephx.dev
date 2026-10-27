"use client";

import { useRef } from "react";
import { useAnimate, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const SPRING = {
  type: "spring",
  stiffness: 600,
  damping: 42,
  mass: 0.6,
} as const;

/**
 * List with a single highlight that slides between hovered/focused rows.
 * Rows mark themselves with `data-hover-item` (see ListRow).
 */
export function HoverList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const [bgRef, animate] = useAnimate<HTMLSpanElement>();
  const activeItem = useRef<Element | null>(null);
  const reduceMotion = useReducedMotion();

  function moveTo(target: EventTarget) {
    const list = listRef.current;
    const bg = bgRef.current;
    if (!list || !bg || !(target instanceof Element)) return;

    const item = target.closest("[data-hover-item]");
    if (!item || !list.contains(item) || item === activeItem.current) return;

    const itemRect = item.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    const box = {
      x: itemRect.left - listRect.left,
      y: itemRect.top - listRect.top,
      width: itemRect.width,
      height: itemRect.height,
    };

    // First entry snaps into place and fades in; later moves slide.
    if (activeItem.current && !reduceMotion) {
      animate(bg, { ...box, opacity: 1 }, SPRING);
    } else {
      animate(bg, box, { duration: 0 });
      animate(bg, { opacity: 1 }, { duration: reduceMotion ? 0 : 0.12 });
    }
    activeItem.current = item;
  }

  function hide() {
    if (!bgRef.current) return;
    activeItem.current = null;
    animate(bgRef.current, { opacity: 0 }, { duration: 0.12 });
  }

  return (
    <ul
      ref={listRef}
      className={cn("relative isolate flex flex-col", className)}
      onMouseOver={(e) => moveTo(e.target)}
      onFocus={(e) => moveTo(e.target)}
      onMouseLeave={hide}
      onBlur={(e) => {
        if (!listRef.current?.contains(e.relatedTarget as Node | null)) hide();
      }}
    >
      <span
        ref={bgRef}
        className="bg-foreground/[0.06] pointer-events-none absolute top-0 left-0 -z-10 rounded-md opacity-0"
        aria-hidden="true"
      />
      {children}
    </ul>
  );
}
