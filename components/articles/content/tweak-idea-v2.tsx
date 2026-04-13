"use client";

import React, { useRef } from "react";
import Link from "next/link";
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
        aria-label="TweakIdea evaluation pipeline: founder profile and raw idea flow through capture, parallel founder fit evaluation, hypothesis extraction and market research, 14 dimension scoring, then report generation."
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

// --- Parallel Speed Diagram ---
//
// Visualizes the v2 parallel evaluation model: multiple dimension agents
// running simultaneously rather than serially.

function ParallelSpeedDiagram() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-card/50">
      <svg
        viewBox="0 0 800 200"
        className="h-auto w-full"
        role="img"
        aria-label="v2 parallel pipeline: a single scoring input fans out to 14 dimension agents running simultaneously, all feeding into a single merge step, dramatically reducing total wall-clock time compared to sequential execution."
      >
        <defs>
          <marker
            id="arrow-v2"
            viewBox="0 0 10 6"
            refX="9"
            refY="3"
            markerWidth="7"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 3 L 0 6 Z" fill="var(--color-muted-foreground)" />
          </marker>
        </defs>
        <style>{`
          @keyframes flow-v2 {
            0% { stroke-dashoffset: 16; }
            100% { stroke-dashoffset: 0; }
          }
          .flow-v2 {
            fill: none;
            stroke: var(--color-border);
            stroke-width: 1.2;
            stroke-dasharray: 4 4;
            animation: flow-v2 1s linear infinite;
            marker-end: url(#arrow-v2);
          }
          .flow-accent {
            fill: none;
            stroke: oklch(0.65 0.15 250 / 0.5);
            stroke-width: 1.5;
            stroke-dasharray: 4 4;
            animation: flow-v2 1s linear infinite;
            marker-end: url(#arrow-v2);
          }
          .node-v2 { fill: var(--color-card); stroke: var(--color-border); stroke-width: 1; }
          .node-v2-accent { fill: oklch(0.65 0.15 250 / 0.1); stroke: oklch(0.65 0.15 250 / 0.4); stroke-width: 1.5; }
          .node-v2-merge { fill: var(--color-card); stroke: oklch(0.65 0.15 250 / 0.4); stroke-width: 1.5; }
          .lbl { fill: var(--color-foreground); font-size: 12px; font-family: var(--font-sans); text-anchor: middle; dominant-baseline: central; }
          .lbl-sm { fill: var(--color-muted-foreground); font-size: 11px; font-family: var(--font-sans); text-anchor: middle; dominant-baseline: central; }
          .lbl-bold { fill: var(--color-foreground); font-size: 12px; font-weight: 600; font-family: var(--font-sans); text-anchor: middle; dominant-baseline: central; }
        `}</style>

        {/* Input node */}
        <g>
          <rect x={20} y={84} width={110} height={32} rx={8} className="node-v2-accent" />
          <text x={75} y={100} className="lbl-bold">Score input</text>
        </g>

        {/* Fan-out lines to 5 agent rows (representing all 14 in groups) */}
        {/* Row 1 (top) */}
        <path className="flow-accent" d="M 130,100 C 180,100 200,40 240,40" style={{ animationDelay: "0s" }} />
        {/* Row 2 */}
        <path className="flow-v2" d="M 130,100 C 180,100 200,70 240,70" style={{ animationDelay: "0.1s" }} />
        {/* Row 3 (center) */}
        <path className="flow-v2" d="M 130,100 L 240,100" style={{ animationDelay: "0.2s" }} />
        {/* Row 4 */}
        <path className="flow-v2" d="M 130,100 C 180,100 200,130 240,130" style={{ animationDelay: "0.3s" }} />
        {/* Row 5 (bottom) */}
        <path className="flow-v2" d="M 130,100 C 180,100 200,160 240,160" style={{ animationDelay: "0.4s" }} />

        {/* Agent nodes (5 rows, representing 14 parallel agents) */}
        {[
          { y: 24, label: "Pain · WTP", sub: "2 agents" },
          { y: 54, label: "Gap · Fit", sub: "2 agents" },
          { y: 84, label: "Urgency · Freq", sub: "2 agents" },
          { y: 114, label: "Market · Def", sub: "2 agents" },
          { y: 144, label: "+ 6 more", sub: "6 agents" },
        ].map(({ y, label, sub }) => (
          <g key={label}>
            <rect x={240} y={y} width={160} height={32} rx={6} className="node-v2" />
            <text x={320} y={y + 11} className="lbl">
              {label}
            </text>
            <text x={320} y={y + 23} className="lbl-sm">
              {sub}
            </text>
          </g>
        ))}

        {/* Fan-in lines to merge */}
        <path className="flow-v2" d="M 400,40 C 460,40 480,90 520,90" style={{ animationDelay: "0.5s" }} />
        <path className="flow-v2" d="M 400,70 C 460,70 480,92 520,92" style={{ animationDelay: "0.6s" }} />
        <path className="flow-v2" d="M 400,100 L 520,100" style={{ animationDelay: "0.7s" }} />
        <path className="flow-v2" d="M 400,130 C 460,130 480,108 520,108" style={{ animationDelay: "0.8s" }} />
        <path className="flow-v2" d="M 400,160 C 460,160 480,110 520,110" style={{ animationDelay: "0.9s" }} />

        {/* Merge / verdict node */}
        <g>
          <rect x={520} y={74} width={130} height={52} rx={8} className="node-v2-merge" />
          <text x={585} y={96} className="lbl-bold">Merge &amp; score</text>
          <text x={585} y={112} className="lbl-sm">weighted verdict</text>
        </g>

        {/* Output arrow */}
        <path className="flow-accent" d="M 650,100 L 710,100" style={{ animationDelay: "1s" }} />

        {/* Output node */}
        <g>
          <rect x={710} y={84} width={70} height={32} rx={8} className="node-v2-accent" />
          <text x={745} y={100} className="lbl-bold">Report</text>
        </g>

        {/* "All parallel" label */}
        <text x={320} y={188} className="lbl-sm" style={{ fontSize: "10px" }}>
          14 agents run simultaneously — no sequential bottlenecks
        </text>
      </svg>
    </div>
  );
}

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
            A few months ago I shipped TweakIdea — a Claude Code skillset that
            evaluates startup ideas across 14 weighted dimensions and returns a{" "}
            <span className="font-semibold text-foreground">GO / PIVOT / STOP</span>{" "}
            verdict.{" "}
            <Link
              href="/a/tweak-idea"
              className="text-accent underline underline-offset-4 transition-colors hover:text-foreground"
            >
              The v1 article
            </Link>{" "}
            walks through the original pipeline in full — the research stage, the
            14 independent scoring agents, the hypothesis system. I won&apos;t
            repeat that here. This post is about what changed.
          </p>
        </FadeInSection>
        <FadeInSection delay={0.2}>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            The original pipeline I shipped first:
          </p>
        </FadeInSection>
        <FadeInSection delay={0.3}>
          <div className="mt-4">
            <PipelineDiagram />
          </div>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            The v1 pipeline — still the foundation in v2
          </p>
        </FadeInSection>
        <FadeInSection delay={0.4}>
          <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
            v2 keeps this foundation and adds new commands, a faster parallel
            evaluation engine, structured JSON scorecards with cleaner report
            output, quality tiers, multi-founder support, and custom dimension
            weights. Here&apos;s what each of those actually means.
          </p>
        </FadeInSection>
      </section>

      {/* Section 2: Hero — New Commands */}
      <section className="mx-auto max-w-3xl px-4 pb-12 md:px-6">
        <FadeInSection>
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            The new commands
          </h2>
        </FadeInSection>
        <FadeInSection delay={0.1}>
          <p className="text-lg leading-relaxed text-muted-foreground">
            v1 had one command:{" "}
            <span className="font-mono text-sm">/tweak:evaluate</span>. You ran
            it, got a report, and that was it. There was no way to look back at
            past runs, compare two ideas side by side, or iterate on a run after
            you&apos;d done some validation work. v2 fixes all of that.
          </p>
        </FadeInSection>
        <FadeInSection delay={0.2}>
          <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
            <span className="font-mono text-sm">/tweak:list</span> shows every
            past run — date, idea summary, final verdict, and score. It&apos;s the
            first thing I open when I want to remember which ideas I&apos;ve already
            evaluated and what happened to them.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg bg-muted px-4 py-3">
            <code className="font-mono text-sm leading-relaxed text-foreground whitespace-pre-wrap break-words">
              /tweak:list
            </code>
          </pre>
        </FadeInSection>
        <FadeInSection delay={0.3}>
          <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
            <span className="font-mono text-sm">/tweak:show</span> opens a
            single run by ID or fuzzy name match. Useful when you want to re-read
            the full scorecard without re-running the evaluation.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg bg-muted px-4 py-3">
            <code className="font-mono text-sm leading-relaxed text-foreground whitespace-pre-wrap break-words">
              /tweak:show restaurant-food-waste
            </code>
          </pre>
        </FadeInSection>
        <FadeInSection delay={0.4}>
          <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
            <span className="font-mono text-sm">/tweak:compare</span> diffs two
            runs. This is the one I use most now — you evaluate an idea, do a few
            weeks of customer interviews, update your{" "}
            <span className="font-mono text-sm">FOUNDER.md</span> with what you
            learned, re-run, and then compare to see exactly which dimensions
            moved and by how much. It also works well for{" "}
            <span className="font-semibold text-foreground">
              multi-founder teams
            </span>
            : each co-founder runs the same idea independently with their own{" "}
            <span className="font-mono text-sm">FOUNDER.md</span>, and{" "}
            <span className="font-mono text-sm">/tweak:compare</span> surfaces
            where the two profiles score the same idea differently — useful for
            surfacing blind spots before you commit.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg bg-muted px-4 py-3">
            <code className="font-mono text-sm leading-relaxed text-foreground whitespace-pre-wrap break-words">
              /tweak:compare restaurant-food-waste-jan restaurant-food-waste-mar
            </code>
          </pre>
        </FadeInSection>
        <FadeInSection delay={0.5}>
          <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
            <span className="font-mono text-sm">/tweak:improve</span> re-runs
            an existing evaluation with updated hypotheses. Instead of starting
            from scratch, it picks up the prior research artifacts, applies your
            updated assumptions, and re-scores only the dimensions affected.
            Faster and cheaper than a full re-run.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg bg-muted px-4 py-3">
            <code className="font-mono text-sm leading-relaxed text-foreground whitespace-pre-wrap break-words">
              /tweak:improve restaurant-food-waste
            </code>
          </pre>
        </FadeInSection>
        <FadeInSection delay={0.6}>
          <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
            <span className="font-mono text-sm">/tweak:browse-hn</span> is
            different — it pulls recent Show HN posts and scores them as if they
            were your own ideas. Good for getting a feel for the scoring range,
            and occasionally for spotting a pattern in the kinds of ideas that
            score well.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg bg-muted px-4 py-3">
            <code className="font-mono text-sm leading-relaxed text-foreground whitespace-pre-wrap break-words">
              /tweak:browse-hn
            </code>
          </pre>
        </FadeInSection>
      </section>

      {/* Section 3: Hero — Speed / Pipeline Improvements */}
      <section className="mx-auto max-w-3xl px-4 pb-12 md:px-6">
        <FadeInSection>
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            Faster runs
          </h2>
        </FadeInSection>
        <FadeInSection delay={0.1}>
          <p className="text-lg leading-relaxed text-muted-foreground">
            The v1 pipeline had a bottleneck: the 14 scoring agents ran in a
            fixed sequence, each waiting for the previous one to finish before
            starting. That made runs slow — several minutes per idea, which is
            fine once but gets painful when you&apos;re iterating.
          </p>
        </FadeInSection>
        <FadeInSection delay={0.2}>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            v2 runs all 14 agents simultaneously. They share the research context
            from the earlier pipeline stage but score independently. There are no
            serial bottlenecks in the evaluation phase — the total wall-clock time
            is now bounded by the slowest single agent, not the sum of all of
            them. In practice that cuts evaluation time by 60–70% on a standard
            run.
          </p>
        </FadeInSection>
        <FadeInSection delay={0.3}>
          <div className="mt-8">
            <ParallelSpeedDiagram />
          </div>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            All 14 agents run in parallel — wall-clock time drops to the slowest
            single agent
          </p>
        </FadeInSection>
        <FadeInSection delay={0.4}>
          <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
            v2 also introduces three{" "}
            <span className="font-semibold text-foreground">quality tiers</span>{" "}
            — <span className="font-mono text-sm">quick</span>,{" "}
            <span className="font-mono text-sm">standard</span>, and{" "}
            <span className="font-mono text-sm">deep</span> — that control how
            much research each agent does before scoring. Quick runs skip
            supplemental web searches and use only the shared research base;
            deep runs allow each agent to do extensive targeted searches. The
            standard tier (the default) is a reasonable middle ground for most
            ideas. More detail on tiers in the section below.
          </p>
        </FadeInSection>
      </section>

      {/* Section 4: Hero — Structured Reports */}
      <section className="mx-auto max-w-3xl px-4 pb-12 md:px-6">
        <FadeInSection>
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            Structured reports
          </h2>
        </FadeInSection>
        <FadeInSection delay={0.1}>
          <p className="text-lg leading-relaxed text-muted-foreground">
            v1 produced a long markdown report. Readable, but hard to diff
            across runs and awkward to pipe into other tools. v2 agents output
            structured JSON scorecards — every dimension score, confidence
            interval, evidence citations, and the potential-vs-actual split, all
            in a consistent schema.
          </p>
        </FadeInSection>
        <FadeInSection delay={0.2}>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            The structured output drives the new report renderer. Each run now
            produces:
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card/50 p-5">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                Executive summary
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                A one-page overview: overall score, verdict, top three strengths
                and weaknesses, and the single highest-leverage next step.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-5">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                Market map
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                A structured view of competitors and market positioning extracted
                from the research phase — rendered as a sortable table with
                source citations.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-5">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                PDF / PNG export
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                The full scorecard and radar chart exported as a shareable file —
                useful for sharing with co-founders or advisors without
                sharing terminal access.
              </p>
            </div>
          </div>
        </FadeInSection>
        <FadeInSection delay={0.3}>
          <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
            The JSON schema also makes{" "}
            <span className="font-mono text-sm">/tweak:compare</span> possible —
            structured output is what lets the diff render cleanly rather than
            doing a line-by-line text diff of two unstructured reports.
          </p>
        </FadeInSection>
      </section>

      {/* Section 5: Quality Tiers + Custom Dimensions */}
      <section className="mx-auto max-w-3xl px-4 pb-12 md:px-6">
        <FadeInSection>
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            Quality tiers and custom dimensions
          </h2>
        </FadeInSection>
        <FadeInSection delay={0.1}>
          <p className="text-lg leading-relaxed text-muted-foreground">
            The three quality tiers —{" "}
            <span className="font-mono text-sm">quick</span>,{" "}
            <span className="font-mono text-sm">standard</span>,{" "}
            <span className="font-mono text-sm">deep</span> — let you trade off
            speed against research depth. Quick is good for a first pass on a
            raw idea; deep is worth the extra time when you&apos;re close to a
            decision and want the most thorough evidence the agents can find.
            Standard is the default and covers most everyday use cases well.
          </p>
        </FadeInSection>
        <FadeInSection delay={0.2}>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Custom dimensions let you add your own scoring axes on top of the
            14 defaults, or adjust the weights of existing ones. If your
            opportunity is in a regulated industry, you might increase the weight
            on regulatory risk. If you&apos;re already a subject-matter expert and
            founder-market fit is a given, you can down-weight that dimension
            and redistribute to the ones that matter more for your specific
            context. The weighting math is the same — your custom weights just
            replace or extend the defaults.
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
              TweakIdea marketing page
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
              TweakIdea is open source on GitHub
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
