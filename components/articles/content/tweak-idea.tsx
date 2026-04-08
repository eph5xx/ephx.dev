"use client";

import React, { useRef } from "react";
import { useInView } from "motion/react";
import * as m from "motion/react-m";
import { HoverEffect } from "@/components/ui/card-hover-effect";

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

// --- Dimension cards data ---

const dimensions = [
  { title: "Pain Intensity", weight: "12%", description: "How much does this problem hurt?" },
  { title: "Willingness to Pay", weight: "12%", description: "Will people actually pay to solve this?" },
  { title: "Solution Gap", weight: "12%", description: "Why hasn't this been solved already?" },
  { title: "Founder-Market Fit", weight: "12%", description: "Are YOU the right person to solve this?" },
  { title: "Urgency", weight: "8%", description: "Does this need solving NOW?" },
  { title: "Frequency", weight: "8%", description: "How often do people encounter this problem?" },
  { title: "Market Size", weight: "8%", description: "How big is the opportunity?" },
  { title: "Defensibility", weight: "8%", description: "Can you protect this business once built?" },
  { title: "Market Growth", weight: "4%", description: "Is the problem getting bigger or smaller?" },
  { title: "Scalability", weight: "4%", description: "Can this grow without proportional cost increase?" },
  { title: "Target Customer", weight: "4%", description: "Do you know exactly who you're building for?" },
  { title: "Behavior Change", weight: "4%", description: "How hard is it to get people to adopt?" },
  { title: "Mandatory Nature", weight: "2%", description: "Are people forced to solve this?" },
  { title: "Incumbent Indifference", weight: "2%", description: "Will big players try to crush you?" },
];

// --- Article ---

export default function TweakIdeaArticle() {
  return (
    <article className="pb-24">
      {/* Section 1: The Problem */}
      <section className="mx-auto max-w-3xl px-4 pt-4 pb-12 md:px-6">
        <FadeInSection>
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            The Problem
          </h2>
        </FadeInSection>
        <FadeInSection delay={0.1}>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Before I write code, I want to know if the problem is real. Are
            people paying to solve it today? Is the market big enough? Can
            someone else build this faster?
          </p>
        </FadeInSection>
        <FadeInSection delay={0.2}>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Claude can help answer all of these — but each question is its own
            deep dive. Research the competitors, check the market data,
            pressure-test the assumptions. Do that and you&apos;re going to
            spend a lot of time and energy for one idea.
          </p>
        </FadeInSection>
        <FadeInSection delay={0.3}>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            I wanted to run all of that in parallel and get a single score at
            the end.
          </p>
        </FadeInSection>
      </section>

      {/* Section 2: The Solution */}
      <section className="mx-auto max-w-3xl px-4 pb-12 md:px-6">
        <FadeInSection>
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            The Solution
          </h2>
        </FadeInSection>
        <FadeInSection delay={0.1}>
          <p className="text-lg leading-relaxed text-muted-foreground">
            <a
              href="https://github.com/eph5xx/tweakidea"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Tweak Idea
            </a>{" "}
            is a Claude Code skillset. One command triggers the full pipeline:
          </p>
          <pre className="mt-4 rounded-lg bg-muted px-4 py-3">
            <code className="font-mono text-sm text-foreground whitespace-pre-wrap wrap-break-word">
              /tweak:evaluate &quot;A mobile app that lets restaurants sell
              unsold food at a discount 30 minutes before closing&quot;
            </code>
          </pre>
        </FadeInSection>
        <FadeInSection delay={0.2}>
          <p className="mt-6 mb-2 text-lg text-muted-foreground">
            The full schema:
          </p>
          <PipelineDiagram />
        </FadeInSection>
        <FadeInSection delay={0.3}>
          <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
            The pipeline runs in three stages:
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card/50 p-5">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                Research
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Captures your problem and solution, searches the web for
                competitors and market data, extracts testable hypotheses, and
                evaluates your founder-market fit — all in parallel.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-5">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                Evaluation
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                14 Sonnet agents score your idea independently, one per
                dimension. No agent sees another&apos;s results — preventing
                anchoring bias.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-5">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                Verdict
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                An Opus agent merges scores into a weighted report:{" "}
                <span className="font-semibold text-foreground">GO</span>,{" "}
                <span className="font-semibold text-foreground">PIVOT</span>,
                or{" "}
                <span className="font-semibold text-foreground">STOP</span>.
                Surfaces your top strengths and weaknesses, with concrete next
                steps ranked by score impact.
              </p>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* Section 3: How It Works */}
      <section className="mx-auto max-w-3xl px-4 pb-12 md:px-6">
        <FadeInSection>
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            How It Works
          </h2>
        </FadeInSection>

        {/* Research */}
        <FadeInSection delay={0.1}>
          <h3 className="mb-3 text-lg font-semibold text-foreground">
            Research
          </h3>
          <p className="text-lg leading-relaxed text-muted-foreground">
            When you submit an idea, three things happen in parallel.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            A research agent searches the web for competitors, market signals,
            and user complaints — building the evidence base that evaluators
            will draw from.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            A hypothesis extractor pulls out every testable claim in your pitch
            and flags each one for your review. Before scoring begins, you mark
            which claims you can actually back up —{" "}
            <span className="font-semibold text-foreground">
              confirmed ones get full scoring credit, unconfirmed ones are
              withheld
            </span>
            . This is what keeps the system honest — it won&apos;t inflate your
            score based on things you haven&apos;t verified.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            A founder-fit interview probes your specific advantages for this
            idea — domain expertise, customer access, technical ability — while
            building a persistent founder profile that gets sharper with each
            run.
          </p>
        </FadeInSection>

        {/* Evaluation */}
        <FadeInSection delay={0.2}>
          <h3 className="mb-3 mt-8 text-lg font-semibold text-foreground">
            Evaluation
          </h3>
          <p className="text-lg leading-relaxed text-muted-foreground">
            14 Sonnet agents evaluate simultaneously — one per dimension,
            completely isolated. No agent sees another&apos;s results.
          </p>
          <HoverEffect
            items={dimensions}
            className="py-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
          />
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Each dimension comes with a{" "}
            <span className="font-semibold text-foreground">signal table</span>{" "}
            — concrete indicators that separate strong evidence from weak.
            &ldquo;I can&apos;t stand this&rdquo; vs. &ldquo;it would be nice
            if&rdquo; for Pain Intensity. &ldquo;Budget already exists&rdquo;
            vs. &ldquo;requires multiple approvals&rdquo; for Willingness to
            Pay. The evaluator maps what it finds to these signals before
            scoring.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            If the shared research doesn&apos;t cover a dimension well enough,
            the evaluator{" "}
            <span className="font-semibold text-foreground">
              runs its own targeted searches
            </span>{" "}
            — looking for data points specific to its angle on the idea.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Each evaluator outputs a{" "}
            <span className="font-semibold text-foreground">Score</span> based
            on confirmed evidence and a{" "}
            <span className="font-semibold text-foreground">Potential</span> —
            where you&apos;d land if unconfirmed hypotheses hold. A dimension at
            2/5 with potential 4/5 tells you exactly what to validate — and how
            much it would move your total.
          </p>
        </FadeInSection>

        {/* Verdict */}
        <FadeInSection delay={0.3}>
          <h3 className="mb-3 mt-8 text-lg font-semibold text-foreground">
            Verdict
          </h3>
          <p className="text-lg leading-relaxed text-muted-foreground">
            An Opus agent merges all 14 evaluations into a{" "}
            <span className="font-semibold text-foreground">
              weighted scorecard
            </span>{" "}
            — your actual total and your potential side by side, with top
            strengths and weaknesses. The full report is also available as a{" "}
            <span className="font-semibold text-foreground">
              self-contained HTML page
            </span>{" "}
            with a radar chart of all 14 dimensions.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            The best part is the{" "}
            <span className="font-semibold text-foreground">
              recommended next steps
            </span>
            . Each one targets a specific dimension, tells you exactly what to
            do, and shows the expected score impact:
          </p>
          <pre className="mt-4 rounded-lg bg-muted px-4 py-3">
            <code className="font-mono text-sm leading-relaxed text-foreground whitespace-pre-wrap break-words">
              Secure one LOI or paid pilot at the $300/month price point from
              an identified TA lead — Willingness to Pay: 4/5 → 5/5 (+0.12
              weighted)
            </code>
          </pre>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            You know exactly what to validate, why, and how much it matters.
          </p>
        </FadeInSection>
      </section>

      {/* Section 4: Example */}
      <section className="mx-auto max-w-3xl px-4 pb-12 md:px-6">
        <FadeInSection>
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            Example
          </h2>
        </FadeInSection>
        <FadeInSection delay={0.1}>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Here&apos;s a real evaluation — an AI recruiting agent scored{" "}
            <span className="font-semibold text-foreground">
              PIVOT at 3.0/5.0
            </span>{" "}
            with potential 3.7/5.0. Strong pain but low defensibility.{" "}
            <a
              href="/reports/tweak-idea-example.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-4 transition-colors hover:text-foreground"
            >
              View the full report
            </a>
            .
          </p>
        </FadeInSection>
      </section>

      {/* Section 5: Try It Yourself */}
      <section className="mx-auto max-w-3xl px-4 pb-12 md:px-6">
        <FadeInSection>
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            Try It Yourself
          </h2>
        </FadeInSection>
        <FadeInSection delay={0.1}>
          <p className="text-lg leading-relaxed text-muted-foreground">
            <a
              href="https://github.com/eph5xx/tweakidea"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Tweak Idea
            </a>{" "}
            is open source and MIT licensed. You need{" "}
            <a
              href="https://docs.anthropic.com/en/docs/claude-code/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Claude Code
            </a>{" "}
            with access to Sonnet and Opus models.
          </p>
          <p className="mt-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Install
          </p>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-muted px-4 py-3">
            <code className="font-mono text-sm leading-relaxed text-foreground">
              npx tweakidea
            </code>
          </pre>
          <p className="mt-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Evaluate
          </p>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-muted px-4 py-3">
            <code className="font-mono text-sm leading-relaxed text-foreground">
              /tweak:evaluate
            </code>
          </pre>
        </FadeInSection>
        <FadeInSection delay={0.2}>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Each run saves a full snapshot to{" "}
            <span className="font-mono text-sm">~/.tweakidea/runs/</span>,
            including an HTML report with a radar chart of all 14 dimensions.
          </p>
        </FadeInSection>
        <FadeInSection delay={0.3}>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Found a bug or have an idea?{" "}
            <a
              href="https://github.com/eph5xx/tweakidea"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Open an issue on GitHub
            </a>
            .
          </p>
        </FadeInSection>
      </section>
    </article>
  );
}
