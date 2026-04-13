"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useInView } from "motion/react";
import * as m from "motion/react-m";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";

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
            Some of changes from <span className="font-semibold text-foreground">Tweak Idea 2.0.0</span>:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-lg leading-relaxed text-muted-foreground">
            <li>
              deterministic Python scripts to do most of the work that used to run inside the LLM
            </li>
            <li>
              new commands for browsing, comparing, and improving ideas
            </li>
            <li>new amazing report layout</li>
            <li>quality tiers</li>
            <li>multi-founder profiles</li>
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

      {/* Section 3: Hero — Speed / Pipeline Improvements */}
      <section className="mx-auto max-w-3xl px-4 pb-12 md:px-6">
        <FadeInSection>
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            How it got 3× faster — and more reliable
          </h2>
        </FadeInSection>
        <FadeInSection delay={0.1}>
          <p className="text-lg leading-relaxed text-muted-foreground">
            v1 asked the LLM to do too much. Not just the thinking, but also
            the typing. The merger stage wrote the whole report by itself —
            hundreds of lines of text, through Opus, on every run. The HTML
            version was written by the model word by word, not built by a
            program. On a 700-line report, that is a lot of model time spent
            just writing.
          </p>
        </FadeInSection>
        <FadeInSection delay={0.2}>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            In v2 I split the work. The LLM still does the thinking — the hard
            decisions — but now it has to answer in JSON, in a fixed format. A
            Python script takes that JSON and does the rest: writes the
            report, formats the sources, puts the sections together, passes
            clean data to the next stage.
          </p>
        </FadeInSection>
        <FadeInSection delay={0.3}>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            A standard run now takes about 10 minutes instead of 30. And
            because the LLM no longer decides how the report looks, the same
            result always looks the same way. That matters. In v1 it was hard
            to tell if two runs were really different, or if the model just
            wrote them in different words.
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
            v1 produced a long markdown report. It worked, but it was hard to
            scan, hard to diff across runs, and hard to share. v2 produces a
            structured JSON scorecard that a Python renderer turns into a{" "}
            <span className="font-semibold text-foreground">card layout</span>{" "}
            — each section of the report is its own self-contained block with
            a headline, a short body, and (where it helps) a small visual.
          </p>
        </FadeInSection>
        <FadeInSection delay={0.2}>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            The content is also better. The evidence is now written in plain
            words — no more{" "}
            <span className="font-mono text-sm">2V 3R 1F 5A</span> shorthand.
            The report includes an executive summary, a market map, an
            assumption tracker, and a small chart showing where your idea sits
            among competitors. And you can pass{" "}
            <span className="font-mono text-sm">--format html,pdf,png</span>{" "}
            to any run and get three shareable files alongside the JSON.
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

      {/* Section 5: Power-User Knobs */}
      <section className="mx-auto max-w-3xl px-4 pb-12 md:px-6">
        <FadeInSection>
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            Power-user knobs
          </h2>
        </FadeInSection>
        <FadeInSection delay={0.1}>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Three more things v2 added for people who want to push the tool
            further.
          </p>
        </FadeInSection>
        <FadeInSection delay={0.2}>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">
              Quality tiers.
            </span>{" "}
            Pass <span className="font-mono text-sm">--quality quick</span>,{" "}
            <span className="font-mono text-sm">standard</span>, or{" "}
            <span className="font-mono text-sm">deep</span>. Quick does a fast
            first pass with a smaller model and less research. Standard is the
            default. Deep runs a heavier model and allows each stage to do
            more research before handing off.
          </p>
        </FadeInSection>
        <FadeInSection delay={0.3}>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">
              Custom dimensions.
            </span>{" "}
            You can add your own scoring axes on top of the 14 defaults,
            change the weights, or replace the formula the final score uses.
            If one dimension matters much more to you than the others, you can
            push its weight up and down-weight the ones that don&apos;t.
          </p>
        </FadeInSection>
        <FadeInSection delay={0.4}>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">
              Multi-founder profile merging.
            </span>{" "}
            If you are working as a team, each founder writes their own{" "}
            <span className="font-mono text-sm">FOUNDER.md</span>. Tweak Idea
            merges them into a single team-level profile and runs the
            founder-fit stage against the merged view. You get one evaluation,
            not N separate ones.
          </p>
        </FadeInSection>
      </section>

      {/* Section 6: Closing — What's Next */}
      <section className="mx-auto max-w-3xl px-4 pb-12 md:px-6">
        <FadeInSection>
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            What&apos;s next
          </h2>
        </FadeInSection>
        <FadeInSection delay={0.1}>
          <p className="text-lg leading-relaxed text-muted-foreground">
            The features above are what shipped in v2. The next focus is on the
            web-native flow — a way to run the evaluation without Claude Code,
            directly from a browser. That&apos;s what the{" "}
            <a
              href="/tweakidea"
              className="text-accent underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Tweak Idea marketing page
            </a>{" "}
            is about. It&apos;s not live yet, but that&apos;s the direction.
          </p>
        </FadeInSection>
        <FadeInSection delay={0.2}>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            If you want to follow along or contribute,{" "}
            <a
              href="https://github.com/eph5xx/tweakidea"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Tweak Idea is open source on GitHub
            </a>
            . The v1 pipeline is documented in{" "}
            <Link
              href="/a/tweak-idea"
              className="text-accent underline underline-offset-4 transition-colors hover:text-foreground"
            >
              the original article
            </Link>{" "}
            if you want the full background on how the 14-dimension scoring
            method works.
          </p>
        </FadeInSection>
      </section>
    </article>
  );
}
