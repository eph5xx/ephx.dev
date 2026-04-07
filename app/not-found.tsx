"use client";

import * as m from "motion/react-m";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 py-20">
      <m.h1
        className="text-[120px] font-bold leading-none tracking-tighter text-accent md:text-[180px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: [0, -8, 0],
        }}
        transition={{
          opacity: { duration: 0.5 },
          y: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        404
      </m.h1>
      <p className="text-lg text-muted-foreground">
        This page wandered off. Let&apos;s get you back.
      </p>
      <Link
        href="/"
        className="text-accent underline underline-offset-4 transition-colors hover:text-accent/80"
      >
        Go home
      </Link>
    </div>
  );
}
