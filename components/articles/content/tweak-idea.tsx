"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import * as m from "motion/react-m";

function FadeInSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </m.div>
  );
}

export default function TweakIdeaArticle() {
  return (
    <article className="pb-24">
      <section className="mx-auto max-w-3xl px-4 pt-4 pb-12 md:px-6">
        <FadeInSection>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Content will be available soon.
          </p>
        </FadeInSection>
      </section>
    </article>
  );
}
