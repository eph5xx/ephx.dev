"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useInView } from "motion/react";
import * as m from "motion/react-m";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GitHubIcon } from "@/components/icons/github";

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

// --- Pure SVG Pipeline Diagram ---
//
// Layout (viewBox 0 0 880 320):
//
//   FOUNDER.md (80,70)                         Founder fit (450,70)
//                          Capture (260,150)    Assumptions (450,150)   14 dimensions (650,150)   Report (820,150)
//   Raw idea (80,230)                          Research (450,230)
//
// FOUNDER.md and Raw idea are inputs. Founder eval removed.
// FOUNDER.md -> Capture and FOUNDER.md -> Founder fit (direct).
// Founder fit is in the same column as Assumptions/Research.

function PipelineDiagram() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-card/50">
      <svg
        viewBox="0 0 1000 310"
        className="h-auto w-full"
        role="img"
        aria-label="Tweak Idea evaluation pipeline: founder profile and raw idea flow through capture, parallel founder fit evaluation, hypothesis extraction and market research, 14 dimension scoring, then report generation."
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 6"
            refX="9"
            refY="3"
            markerWidth="8"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 3 L 0 6 Z" fill="var(--color-muted-foreground)" />
          </marker>
        </defs>
        <style>{`
          @keyframes flow {
            0% { stroke-dashoffset: 16; }
            100% { stroke-dashoffset: 0; }
          }
          .flow-line {
            fill: none;
            stroke: var(--color-border);
            stroke-width: 1.5;
            stroke-dasharray: 4 4;
            animation: flow 1.2s linear infinite;
            marker-end: url(#arrow);
          }
          .node-bg { fill: var(--color-card); stroke: var(--color-border); stroke-width: 1; }
          .node-accent { fill: oklch(0.65 0.15 250 / 0.1); stroke: oklch(0.65 0.15 250 / 0.4); stroke-width: 1.5; }
          .node-input { fill: oklch(0.65 0.15 250 / 0.1); stroke: var(--color-border); stroke-width: 1; }
          .label { fill: var(--color-foreground); font-size: 14px; font-family: var(--font-sans); text-anchor: middle; dominant-baseline: central; }
          .label-bold { fill: var(--color-foreground); font-size: 14px; font-weight: 600; font-family: var(--font-sans); text-anchor: middle; dominant-baseline: central; }
        `}</style>

        {/* --- Connections (behind nodes) --- */}
        {/* Raw idea -> Capture problem (straight horizontal) */}
        <path className="flow-line" d="M 140,155 L 220,155" style={{ animationDelay: "0.1s" }} />
        {/* FOUNDER.md -> Evaluate founder fit (straight horizontal) */}
        <path className="flow-line" d="M 150,70 L 460,70" style={{ animationDelay: "0.2s" }} />
        {/* Capture -> Extract hypotheses */}
        <path className="flow-line" d="M 390,155 L 460,155" style={{ animationDelay: "0.4s" }} />
        {/* Capture -> Research market */}
        <path className="flow-line" d="M 390,155 C 420,165 440,220 460,240" style={{ animationDelay: "0.5s" }} />
        {/* Evaluate founder fit -> Score 14 dimensions */}
        <path className="flow-line" d="M 630,70 C 680,70 700,105 730,130" style={{ animationDelay: "0.8s" }} />
        {/* Extract hypotheses -> Score 14 dimensions */}
        <path className="flow-line" d="M 630,155 L 680,155" style={{ animationDelay: "0.9s" }} />
        {/* Research market -> Score 14 dimensions */}
        <path className="flow-line" d="M 630,240 C 680,240 700,195 730,175" style={{ animationDelay: "1.0s" }} />
        {/* Score 14 dimensions -> Build report */}
        <path className="flow-line" d="M 830,155 L 880,155" style={{ animationDelay: "1.3s" }} />

        {/* --- Nodes --- */}
        {/* FOUNDER.md */}
        <g>
          <rect x={15} y={52} width={135} height={36} rx={10} className="node-input" />
          <text x={82} y={70} className="label">FOUNDER.md</text>
        </g>
        {/* Raw idea */}
        <g>
          <rect x={25} y={137} width={115} height={36} rx={10} className="node-input" />
          <text x={82} y={155} className="label">Raw idea</text>
        </g>
        {/* Capture problem and solution */}
        <g>
          <rect x={220} y={127} width={170} height={56} rx={10} className="node-bg" />
          <text x={305} y={148} className="label">Capture problem</text>
          <text x={305} y={166} className="label">and solution</text>
        </g>
        {/* Evaluate founder fit */}
        <g>
          <rect x={460} y={52} width={170} height={36} rx={10} className="node-bg" />
          <text x={545} y={70} className="label">Evaluate founder fit</text>
        </g>
        {/* Extract hypotheses */}
        <g>
          <rect x={460} y={137} width={170} height={36} rx={10} className="node-bg" />
          <text x={545} y={155} className="label">Extract hypotheses</text>
        </g>
        {/* Research market */}
        <g>
          <rect x={460} y={222} width={170} height={36} rx={10} className="node-bg" />
          <text x={545} y={240} className="label">Research market</text>
        </g>
        {/* Score 14 dimensions (accent, larger) */}
        <g>
          <rect x={680} y={130} width={150} height={50} rx={10} className="node-accent" />
          <text x={755} y={155} className="label-bold">Score 14 dimensions</text>
        </g>
        {/* Build report */}
        <g>
          <rect x={880} y={137} width={105} height={36} rx={10} className="node-input" />
          <text x={932} y={155} className="label">Build report</text>
        </g>
      </svg>
    </div>
  );
}

// --- Commands data for Sticky Scroll Reveal ---

function CommandExample({
  invocation,
  output,
}: {
  invocation: string;
  output: string;
}) {
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-5">
      <pre className="overflow-x-auto rounded-lg bg-background px-4 py-3">
        <code className="font-mono text-sm leading-relaxed text-foreground whitespace-pre-wrap break-words">
          {invocation}
        </code>
      </pre>
      <div className="flex items-start gap-2 px-1 text-sm leading-relaxed text-muted-foreground">
        <span aria-hidden className="shrink-0 text-foreground/60">
          →
        </span>
        <span>{output}</span>
      </div>
    </div>
  );
}

const commandsContent = [
  {
    title: "/tweak:evaluate",
    description:
      "Start here. Pass an idea, get a full 14-dimension report back.",
    content: (
      <CommandExample
        invocation='/tweak:evaluate "an app that helps restaurants reduce food waste"'
        output="Your HTML report is ready. Want me to open it?"
      />
    ),
  },
  {
    title: "/tweak:list",
    description: "Shows every idea that was evaluated so far.",
    content: (
      <CommandExample
        invocation="/tweak:list"
        output="Found 12 past runs. Which one should I open?"
      />
    ),
  },
  {
    title: "/tweak:show",
    description:
      "Opens a specific report in your browser. No re-running, just re-reading.",
    content: (
      <CommandExample
        invocation="/tweak:show restaurant-food-waste"
        output="Opening the report now."
      />
    ),
  },
  {
    title: "/tweak:compare",
    description:
      "Diffs two runs side by side. It shows exactly what moved after you've iterated on an idea.",
    content: (
      <CommandExample
        invocation="/tweak:compare restaurant-food-waste-jan restaurant-food-waste-mar"
        output="Your comparison is ready. Want me to open it?"
      />
    ),
  },
  {
    title: "/tweak:improve",
    description:
      "Reads your latest report and hands back concrete tweaks for the weakest dimensions.",
    content: (
      <CommandExample
        invocation="/tweak:improve restaurant-food-waste"
        output="Here are 5 ways to address your dealbreakers. Walk through them?"
      />
    ),
  },
  {
    title: "/tweak:browse-hn",
    description:
      "Scans Hacker News and surfaces posts describing real technology shifts. Feed the good ones into /tweak:suggest-from-hn.",
    content: (
      <CommandExample
        invocation="/tweak:browse-hn"
        output="Found 5 posts worth a closer look. Open the first?"
      />
    ),
  },
  {
    title: "/tweak:suggest-from-hn",
    description:
      "Reads an HN post and generates startup ideas built on the shift it describes.",
    content: (
      <CommandExample
        invocation="/tweak:suggest-from-hn <hn-post-url>"
        output="I turned it into 5 idea seeds. Ready to evaluate one?"
      />
    ),
  },
];

// --- Article ---

export default function TweakIdeaV2Article() {
  return (
    <article className="pb-24">
      {/* Section 1: Opening — what's this about */}
      <section className="mx-auto max-w-3xl px-4 pt-4 pb-12 md:px-6">
        <FadeInSection>
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            What changed in v2
          </h2>
        </FadeInSection>
        <FadeInSection delay={0.1}>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Last week I shipped Tweak Idea — a Claude Code skillset that
            evaluates startup ideas across 14 weighted dimensions and gives you
            a scored report with concrete next steps for developing the idea.{" "}
            <Link
              href="/a/tweak-idea"
              className="text-accent underline underline-offset-4 transition-colors hover:text-foreground"
            >
              The v1 article
            </Link>{" "}
            walks through the original pipeline in full: the research stage,
            the 14 independent scoring agents, the hypothesis system.
          </p>
        </FadeInSection>
        <FadeInSection delay={0.2}>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            The original pipeline — still the foundation in v2:
          </p>
        </FadeInSection>
        <FadeInSection delay={0.3}>
          <div className="mt-4">
            <PipelineDiagram />
          </div>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Tweak Idea pipeline
          </p>
        </FadeInSection>
        <FadeInSection delay={0.4}>
          <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
            Some of the changes in <span className="font-semibold text-foreground">Tweak Idea 2.0.0</span>:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-lg leading-relaxed text-muted-foreground">
            <li>
              deterministic Python scripts to do most of the work that used to run inside the LLM
            </li>
            <li>
              new commands for browsing, comparing, and improving ideas
            </li>
            <li>new amazing report layout</li>
            <li>profiles for your potential co-founders</li>
          </ul>
        </FadeInSection>
      </section>

      {/* Section 2: Hero — New Commands */}
      <section className="mx-auto max-w-3xl px-4 pb-12 md:px-6">
        <FadeInSection>
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            The commands
          </h2>
        </FadeInSection>
        <FadeInSection delay={0.15}>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            In v2 the one <span className="font-mono text-sm">/tweak:evaluate</span> command becomes a family. Each new one is a step in
            the real loop of working on an idea: run it, look at it later,
            compare versions, get suggestions, find new things to try.
          </p>
        </FadeInSection>
        <FadeInSection delay={0.2} className="mt-8">
          <StickyScroll content={commandsContent} />
        </FadeInSection>
      </section>

      {/* Section 3: Hero — JSON in, JSON out */}
      <section className="mx-auto max-w-3xl px-4 pb-12 md:px-6">
        <FadeInSection>
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            JSON in, JSON out
          </h2>
        </FadeInSection>
        <FadeInSection delay={0.1}>
          <p className="text-lg leading-relaxed text-muted-foreground">
            In v1, the LLM did everything. It wrote the whole report
            in prose, hundreds of lines, on every run. It generated the HTML
            output word by word. Every stage picked its own format.
          </p>
        </FadeInSection>
        <FadeInSection delay={0.2}>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            In v2, the LLM reads JSON files and writes JSON files.
            The shape is fixed up front by a schema.
            Once a JSON file is written, nothing can change it.
            This workflow is great for Python: we can use scripts
            wherever the LLM is not necessary, for example to build
            different report formats.
          </p>
        </FadeInSection>
        <FadeInSection delay={0.3}>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Three things change:
          </p>
        </FadeInSection>
        <FadeInSection delay={0.4}>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-lg leading-relaxed text-muted-foreground">
            <li>
              <span className="font-semibold text-foreground">
                Reliability.
              </span>{" "}
              Claude Code struggles with agent invocations that have to
              write a 700-line file. A 30-minute run no longer crashes
              halfway through a free-form report.
            </li>
            <li>
              <span className="font-semibold text-foreground">Speed.</span>{" "}
              A full run takes about 10 minutes now, down from 30. What
              the LLM does in 20 seconds, Python does in 20 milliseconds.
            </li>
            <li>
              <span className="font-semibold text-foreground">
                Bounded failures.
              </span>{" "}
              When one JSON file comes back broken, you point the LLM at
              that one file and ask it to fix it. Nothing else re-runs.
            </li>
          </ul>
        </FadeInSection>
        <FadeInSection delay={0.5}>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            That last point is the one that matters most for serious Claude
            Code skills. The model is fast and creative, but it is not a
            replacement for code. Treat each LLM call in your skill as a function. Let code drive the pipeline. When the model fails, the
            failure stays in one place, and so does the fix. That is the
            pattern that made v2 work.
          </p>
        </FadeInSection>
      </section>

      {/* Section 4: Hero — Cleaner Reports */}
      <section className="mx-auto max-w-3xl px-4 pb-12 md:px-6">
        <FadeInSection>
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            Cleaner reports
          </h2>
        </FadeInSection>
        <FadeInSection delay={0.1}>
          <p className="text-lg leading-relaxed text-muted-foreground">
            v2 makes the HTML report beautiful. It is something you would
            want to share. Take a look at the examples below.
          </p>
        </FadeInSection>
        <FadeInSection delay={0.3}>
          {/* TODO: replace with Aceternity Bento Grid + real example report links in next session */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2">
            <div className="flex min-h-40 flex-col justify-between rounded-xl border border-border bg-card/50 p-6 transition-colors hover:bg-card md:col-span-2 md:row-span-2 md:min-h-80">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Example report 1
              </div>
              <div className="text-sm text-muted-foreground">
                Placeholder — real link goes here
              </div>
            </div>
            <div className="flex min-h-40 flex-col justify-between rounded-xl border border-border bg-card/50 p-6 transition-colors hover:bg-card">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Example report 2
              </div>
              <div className="text-sm text-muted-foreground">
                Placeholder
              </div>
            </div>
            <div className="flex min-h-40 flex-col justify-between rounded-xl border border-border bg-card/50 p-6 transition-colors hover:bg-card">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Example report 3
              </div>
              <div className="text-sm text-muted-foreground">
                Placeholder
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* Section 5: Profiling co-founders */}
      <section className="mx-auto max-w-3xl px-4 pb-12 md:px-6">
        <FadeInSection>
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            Profiling co-founders
          </h2>
        </FadeInSection>
        <FadeInSection delay={0.1}>
          <p className="text-lg leading-relaxed text-muted-foreground">
            You can keep a profile for anyone you
            might team up with: a current co-founder, a candidate you are
            talking to, a friend you are considering. Then you can pull any
            of them into an evaluation.
          </p>
        </FadeInSection>
        <FadeInSection delay={0.2}>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Each profile is its own{" "}
            <span className="font-mono text-sm">FOUNDER.md</span>, written in
            your words: what they have done, what they are good at, what
            they would bring. When you run{" "}
            <span className="font-mono text-sm">/tweak:evaluate</span>, you can
            pick which profiles to include, and the idea gets scored against
            all of them together instead of against you alone.
          </p>
        </FadeInSection>
        <FadeInSection delay={0.3}>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            It is a small change, but it shifts the question from &quot;is
            this idea right for me?&quot; to &quot;is this idea right for
            the team I could build to ship it?&quot;
          </p>
        </FadeInSection>
      </section>

      {/* Section 6: Try it */}
      <section className="mx-auto max-w-3xl px-4 pb-12 md:px-6">
        <FadeInSection>
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            Try it
          </h2>
        </FadeInSection>
        <FadeInSection delay={0.1}>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Tweak Idea is open source. Clone the repo, drop the skill into
            Claude Code, and run{" "}
            <span className="font-mono text-sm">/tweak:evaluate</span> on an
            idea you have been chewing on. Or start with the web version
            below, no Claude Code needed.
          </p>
        </FadeInSection>
        <FadeInSection delay={0.2}>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="https://github.com/eph5xx/tweakidea"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" })
              )}
            >
              <GitHubIcon className="size-4" />
              View on GitHub
            </Link>
            <Link
              href="/tweakidea"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" })
              )}
            >
              Try Tweak Idea
            </Link>
          </div>
        </FadeInSection>
      </section>
    </article>
  );
}
