"use client";

import { useRef, type ReactNode } from "react";
import { useInView, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

export function FadeInSection({
  children,
  className,
  delay = 0,
  y = 16,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: prefersReducedMotion ? 0.2 : 0.5,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}
