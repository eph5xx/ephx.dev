"use client";
import React, { useEffect, useRef } from "react";
import * as m from "motion/react-m";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const paneRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateActive = () => {
      const containerRect = container.getBoundingClientRect();
      const card0 = cardRefs.current[0];
      if (!card0) return;
      const card0Rect = card0.getBoundingClientRect();
      const activeLine =
        card0Rect.top -
        containerRect.top +
        container.scrollTop +
        card0Rect.height / 2;

      let closest = 0;
      let closestDist = Infinity;
      cardRefs.current.forEach((el, idx) => {
        if (!el) return;
        const cardRect = el.getBoundingClientRect();
        const cardMid =
          cardRect.top - containerRect.top + cardRect.height / 2;
        const dist = Math.abs(cardMid - activeLine);
        if (dist < closestDist) {
          closestDist = dist;
          closest = idx;
        }
      });
      setActiveCard(closest);
    };

    updateActive();
    container.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      container.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex h-128 flex-col gap-10 overflow-y-auto rounded-xl border border-border bg-background/40 p-6 lg:flex-row lg:justify-center lg:p-10"
    >
      <div className="relative flex items-start px-4">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div
              key={item.title + index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="my-16 lg:my-20"
            >
              <m.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.35 }}
                transition={{ duration: 0.3 }}
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                {item.title}
              </m.h2>
              <m.p
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.35 }}
                transition={{ duration: 0.3 }}
                className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground"
              >
                {item.description}
              </m.p>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>
      <div
        ref={paneRef}
        className={cn(
          "order-first z-10 sticky top-0 h-56 w-full shrink-0 overflow-hidden rounded-xl border border-border bg-muted lg:order-0 lg:top-10 lg:h-72 lg:w-96 lg:bg-muted/50",
          contentClassName,
        )}
      >
        {content[activeCard]?.content ?? null}
      </div>
    </div>
  );
};
