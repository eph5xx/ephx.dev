"use client";

// components/tweakidea/tweakidea-flow.tsx
// Landing-style bento walkthrough. A hero strip explains what the flow is
// and what the user walks away with, then the 6-tile bento grid delivers
// the interactive stages, then a payoff card hands off to the CLI.
// All six stage tiles are visible from the start. The active tile expands
// to col-span-6 row-span-2, other tiles flow around via grid-auto-flow:
// row dense. Per-tile color tints, big ghost numeric watermarks, motion
// `layout` prop for magic-move between phases.

import { useEffect, useRef, useState, type Dispatch } from "react";
import { AnimatePresence, LayoutGroup, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import {
  ArrowRight,
  Check,
  Copy,
  Download,
  Lightbulb,
  Loader2,
  Share2,
  Sparkles,
  SplitSquareHorizontal,
  Target,
  UserCheck,
  X,
} from "lucide-react";

import { useTweakideaFlow } from "./use-tweakidea-flow";
import {
  type FlowAction,
  type FlowState,
  type StageName,
} from "./flow-state";
import type { FounderFitQuestion } from "@/lib/tweakidea/schema";
import { cn } from "@/lib/utils";

type TileStyle = {
  label: string;
  tint: string;
  textTint: string;
};

const TILE_STYLES: Record<StageName, TileStyle> = {
  idea: {
    label: "IDEA",
    tint: "oklch(0.62 0.04 260)",
    textTint: "text-foreground/80",
  },
  extraction: {
    label: "SPLIT",
    tint: "oklch(0.65 0.17 20)",
    textTint: "text-rose-300",
  },
  assumptions: {
    label: "ASSUMPTIONS",
    tint: "oklch(0.78 0.15 80)",
    textTint: "text-amber-300",
  },
  founder: {
    label: "FOUNDER",
    tint: "oklch(0.7 0.12 200)",
    textTint: "text-cyan-300",
  },
  "founder-fit": {
    label: "FIT",
    tint: "oklch(0.65 0.18 285)",
    textTint: "text-violet-300",
  },
  install: {
    label: "RUN",
    tint: "oklch(0.72 0.17 150)",
    textTint: "text-emerald-300",
  },
};

// Grid is 5 tiles (idea is owned by the hero, not the bento).
// Active tile: col-6 row-2 (12 cells). Other 4 tiles: col-3 each (12 cells).
// Total 24 cells in a 6-col grid = 4 clean rows.
// When no tile is active (user still on the idea phase in the hero), the
// 5 tiles lay out as row-1: 3×col-2, row-2: 2×col-3 — two clean 6-col rows.
function computeSpan(
  stage: StageName,
  current: StageName,
  gridStages: readonly StageName[],
): string {
  if (current === "idea") {
    const rank = gridStages.indexOf(stage);
    return rank < 3 ? "md:col-span-2" : "md:col-span-3";
  }
  if (stage === current) return "md:col-span-6 md:row-span-2";
  return "md:col-span-3";
}

const LOADING_PHASES: readonly FlowState["phase"][] = [
  "extracting-idea",
  "extracting-assumptions",
  "fetching-fit",
  "saving",
] as const;

function isLoadingPhase(phase: FlowState["phase"]): boolean {
  return (LOADING_PHASES as readonly string[]).includes(phase);
}

const WALKAWAY_BULLETS = [
  {
    icon: SplitSquareHorizontal,
    label: "Problem / solution split",
    hint: "The one-sentence version of what you're actually building.",
  },
  {
    icon: Lightbulb,
    label: "Assumptions to test first",
    hint: "The load-bearing claims your idea depends on.",
  },
  {
    icon: UserCheck,
    label: "Founder-fit questions",
    hint: "Three tailored questions that probe your edge.",
  },
] as const;

export function TweakIdeaFlow() {
  const flow = useTweakideaFlow();
  const isOnIdea = flow.current === "idea";
  const gridStages = flow.stageOrder.filter(
    (s): s is Exclude<StageName, "idea"> => s !== "idea",
  );

  return (
    <div>
      <HeroIdea flow={flow} compact={!isOnIdea} />

      <div className="mx-auto max-w-6xl px-4 pt-16 pb-24 md:px-6 md:pt-24">
        <LayoutGroup>
          <div className="grid auto-rows-[minmax(140px,auto)] grid-cols-1 gap-4 md:grid-cols-6 md:grid-flow-row-dense">
            {gridStages.map((stage) => (
              <Tile
                key={stage}
                stage={stage}
                flow={flow}
                gridStages={gridStages}
              />
            ))}
          </div>
        </LayoutGroup>

        <TweakIdeaPayoff />
      </div>
    </div>
  );
}

// --- HERO ----------------------------------------------------------------

function HeroIdea({
  flow,
  compact,
}: {
  flow: ReturnType<typeof useTweakideaFlow>;
  compact: boolean;
}) {
  const { state, dispatch, submitIdea, reset } = flow;
  const prefersReducedMotion = useReducedMotion();

  if (compact) {
    return (
      <m.section
        layout
        className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 md:px-6">
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:block">
            Your idea
          </span>
          <p className="flex-1 truncate text-sm text-foreground/80">
            {state.ideaRaw}
          </p>
          <button
            type="button"
            onClick={reset}
            className="flex-none cursor-pointer font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Start over
          </button>
        </div>
      </m.section>
    );
  }

  return (
    <section className="relative flex min-h-svh items-center overflow-hidden">
      <MeshBackdrop reduced={!!prefersReducedMotion} />
      {/* Fade the mesh into background at the bottom edge so the bento
          section below doesn't feel disconnected. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-background"
      />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-28 pb-20 md:px-6 md:pt-32 md:pb-28">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Tweak Idea &middot; live walkthrough
        </p>
        <h1 className="mt-5 text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl lg:text-[7.5rem]">
          Stress-test a startup idea
          <span className="block bg-linear-to-r from-foreground via-foreground/70 to-foreground/30 bg-clip-text pb-1 text-transparent">
            in two minutes.
          </span>
        </h1>
        <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-muted-foreground md:text-xl">
          Paste your raw idea. We&apos;ll split it into problem and solution,
          surface the assumptions it depends on, and generate three
          founder-fit questions tailored to you &mdash; all before you
          install a thing.
        </p>

        <div className="mt-10 max-w-3xl">
          <HeroIdeaInput
            state={state}
            dispatch={dispatch}
            onSubmit={submitIdea}
          />
        </div>

        <ul className="mt-12 grid max-w-4xl gap-3 sm:grid-cols-3">
          {WALKAWAY_BULLETS.map(({ icon: Icon, label, hint }) => (
            <li
              key={label}
              className="flex items-start gap-3 rounded-lg border border-border/60 bg-card/40 px-4 py-3 backdrop-blur-sm"
            >
              <Icon
                className="mt-0.5 h-4 w-4 flex-none text-foreground/80"
                aria-hidden="true"
              />
              <div>
                <div className="text-sm font-medium text-foreground">
                  {label}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {hint}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-16 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          <m.span
            animate={prefersReducedMotion ? undefined : { y: [0, 4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          >
            ↓
          </m.span>
          <span>The walkthrough continues below</span>
        </div>
      </div>
    </section>
  );
}

function HeroIdeaInput({
  state,
  dispatch,
  onSubmit,
}: {
  state: FlowState;
  dispatch: Dispatch<FlowAction>;
  onSubmit: () => void;
}) {
  const isLoading = state.phase === "extracting-idea";
  const chars = state.ideaRaw.trim().length;
  const canSubmit = chars >= 20 && chars <= 4000 && !isLoading;
  return (
    <div>
      <div className="relative rounded-xl border border-border/80 bg-background/60 backdrop-blur-md transition-colors focus-within:border-foreground/40">
        <textarea
          value={state.ideaRaw}
          onChange={(e) =>
            dispatch({ type: "setIdeaRaw", value: e.target.value })
          }
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && canSubmit) {
              onSubmit();
            }
          }}
          placeholder={IDEA_PLACEHOLDER}
          disabled={isLoading}
          className="block min-h-44 w-full resize-none rounded-xl bg-transparent px-5 py-4 text-lg leading-relaxed text-foreground outline-hidden placeholder:text-muted-foreground/50"
          aria-label="Raw idea"
        />
      </div>
      <div className="mt-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <span className="font-mono text-[11px] text-muted-foreground">
          {state.error ? (
            <span className="text-destructive">{state.error}</span>
          ) : chars < 20 ? (
            <>At least 20 characters &middot; ⌘ + Enter to submit</>
          ) : (
            <>
              ⌘ + Enter to submit &middot; {chars}/4000
            </>
          )}
        </span>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className={cn(
            "inline-flex cursor-pointer items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-base font-semibold text-background shadow-lg shadow-black/20 transition-colors hover:bg-foreground/90",
            !canSubmit &&
              "cursor-not-allowed opacity-40 hover:bg-foreground",
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Splitting your idea
            </>
          ) : (
            <>
              Split my idea
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function MeshBackdrop({ reduced }: { reduced: boolean }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Amber — top-left quadrant, behind the headline */}
      <m.div
        className="absolute -left-20 -top-20 h-160 w-160 rounded-full bg-amber-500/30 blur-[120px]"
        animate={reduced ? undefined : { x: [0, 60, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Rose — upper-right, warming the right margin */}
      <m.div
        className="absolute -right-24 top-10 h-140 w-140 rounded-full bg-rose-500/25 blur-[120px]"
        animate={reduced ? undefined : { x: [0, -40, 0], y: [0, -20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Violet — centered horizontally, behind the textarea */}
      <m.div
        className="absolute left-1/4 top-[45%] h-130 w-130 rounded-full bg-violet-500/25 blur-[130px]"
        animate={reduced ? undefined : { x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Emerald — bottom-left, previewing the RUN payoff color */}
      <m.div
        className="absolute -bottom-10 left-1/2 h-120 w-120 rounded-full bg-emerald-500/20 blur-[130px]"
        animate={reduced ? undefined : { x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Cyan — bottom-right, warming the walkaway bullets row */}
      <m.div
        className="absolute -bottom-16 -right-10 h-110 w-110 rounded-full bg-cyan-500/20 blur-[130px]"
        animate={reduced ? undefined : { x: [0, -30, 0], y: [0, -15, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function TweakIdeaPayoff() {
  return (
    <section
      aria-labelledby="tweakidea-payoff-heading"
      className="relative mt-16 overflow-hidden rounded-xl border border-emerald-400/30 bg-card/40 p-6 md:mt-20 md:p-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(70% 60% at 85% 0%, oklch(0.72 0.17 150 / 0.14), transparent 70%)",
        }}
      />
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-300">
        What&apos;s next &middot; the real thing
      </p>
      <h2
        id="tweakidea-payoff-heading"
        className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl"
      >
        Run the full evaluation in your terminal.
      </h2>
      <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-muted-foreground">
        This page is the warm-up — the first four stages. The{" "}
        <span className="font-mono text-foreground">npx tweakidea</span> CLI
        runs the scored 14-dimension evaluation: market size, pain intensity,
        willingness to pay, technical feasibility, founder-market fit, and
        nine more. It does web research, sanity-checks your assumptions, and
        returns a written verdict you can act on.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <code className="flex-1 rounded-md border border-border bg-background/60 px-4 py-3 font-mono text-sm text-foreground">
          $ npx tweakidea
        </code>
        <a
          href="https://github.com/eph5xx/tweakidea"
          target="_blank"
          rel="noreferrer"
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-foreground/40 hover:bg-foreground/5"
        >
          View on GitHub
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

function Tile({
  stage,
  flow,
  gridStages,
}: {
  stage: Exclude<StageName, "idea">;
  flow: ReturnType<typeof useTweakideaFlow>;
  gridStages: readonly Exclude<StageName, "idea">[];
}) {
  const { state, current, currentIdx } = flow;
  const idx = flow.stageOrder.indexOf(stage);
  // Display index within the bento (idea is owned by the hero, so the
  // grid renumbers from 01 — otherwise the first tile reads as "02" and
  // the sequence feels broken).
  const displayIdx = gridStages.indexOf(stage);
  const isActive = stage === current;
  const isFuture = idx > currentIdx;
  const isPast = idx < currentIdx;
  const style = TILE_STYLES[stage];

  const span = computeSpan(stage, current, gridStages);

  const loading = isActive && isLoadingPhase(state.phase);
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [hasMounted, setHasMounted] = useState(false);

  // Scroll the newly-active tile into view (skip the very first mount so we
  // don't auto-scroll on initial page load). Respect reduced-motion.
  useEffect(() => {
    if (!hasMounted) {
      setHasMounted(true);
      return;
    }
    if (!isActive || !ref.current) return;
    const top = ref.current.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({
      top,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
    // We intentionally depend only on isActive — the first render sets
    // hasMounted and won't scroll; subsequent activations will.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  return (
    <m.section
      ref={ref}
      layout
      layoutId={`tile-${stage}`}
      transition={{ type: "spring", stiffness: 240, damping: 28 }}
      aria-current={isActive ? "step" : undefined}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card/40 transition-colors",
        "p-5 md:p-6",
        isActive && "md:p-8",
        span,
        isFuture && "opacity-40",
        isActive && "shadow-2xl",
      )}
      style={{
        borderColor: isActive
          ? style.tint
          : "color-mix(in oklch, var(--border) 100%, transparent)",
      }}
    >
      {/* Soft radial backdrop glow when active */}
      {isActive && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: `radial-gradient(70% 60% at 15% 0%, color-mix(in oklch, ${style.tint} 16%, transparent), transparent 75%)`,
          }}
        />
      )}

      {/* Pulsing border overlay while this tile's LLM call is in flight */}
      {loading && (
        <m.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl border-2"
          style={{ borderColor: style.tint }}
          initial={{ opacity: 0.15 }}
          animate={
            prefersReducedMotion
              ? { opacity: 0.35 }
              : { opacity: [0.15, 0.55, 0.15] }
          }
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Big ghost numeric watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute select-none font-mono font-bold leading-[0.78] text-foreground/5"
        style={{
          right: "-0.5rem",
          top: "-0.75rem",
          fontSize: isActive
            ? "clamp(140px, 22vw, 280px)"
            : "clamp(72px, 10vw, 140px)",
        }}
      >
        {String(displayIdx + 1).padStart(2, "0")}
      </div>

      <header className="relative z-10 mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em]">
        <span className={style.textTint}>
          {String(displayIdx + 1).padStart(2, "0")}
        </span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">{style.label}</span>
        {isPast && (
          <Check
            className="ml-1 h-3 w-3 text-emerald-400"
            aria-hidden="true"
          />
        )}
      </header>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {isActive ? (
            <m.div
              key={`act-${stage}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <ActiveStage stage={stage} flow={flow} />
            </m.div>
          ) : (
            <m.div
              key={`prev-${stage}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <PreviewStage
                stage={stage}
                state={state}
                isFuture={isFuture}
              />
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </m.section>
  );
}

function PreviewStage({
  stage,
  state,
  isFuture,
}: {
  stage: StageName;
  state: FlowState;
  isFuture: boolean;
}) {
  if (isFuture) {
    return (
      <p className="text-sm italic text-muted-foreground/60">
        {FUTURE_HINTS[stage]}
      </p>
    );
  }
  switch (stage) {
    case "idea":
      return (
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {state.ideaRaw}
        </p>
      );
    case "extraction":
      return state.extraction ? (
        <div className="space-y-1.5 text-sm">
          <p className="line-clamp-2 text-rose-300/80">
            <span className="font-mono text-[10px] uppercase tracking-wider text-rose-300/70">
              problem ·
            </span>{" "}
            {state.extraction.problem}
          </p>
          <p className="line-clamp-2 text-emerald-300/80">
            <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-300/70">
              solution ·
            </span>{" "}
            {state.extraction.solution}
          </p>
        </div>
      ) : null;
    case "assumptions": {
      const kept = state.assumptions.filter((a) => a.keep).length;
      return (
        <p className="text-sm text-muted-foreground">
          {kept} of {state.assumptions.length} assumptions kept
        </p>
      );
    }
    case "founder":
      return (
        <p className="text-sm text-muted-foreground">
          {state.founder.primary_skill} &middot; {state.founder.commitment}
        </p>
      );
    case "founder-fit": {
      const answered = state.fitQuestions.filter(
        (q) => (state.fitAnswers[q.id] ?? "").trim().length >= 5,
      ).length;
      return (
        <p className="text-sm text-muted-foreground">
          {answered} of {state.fitQuestions.length} fit answers
        </p>
      );
    }
    case "install":
      return null;
  }
}

const FUTURE_HINTS: Record<StageName, string> = {
  idea: "Paste your raw idea — one paragraph is fine.",
  extraction: "Your idea, split into problem and solution.",
  assumptions: "Keep the load-bearing assumptions, drop the rest.",
  founder: "Three quick questions about you.",
  "founder-fit": "Three tailored founder-fit questions.",
  install: "Install the CLI and run the full evaluation.",
};

function ActiveStage({
  stage,
  flow,
}: {
  stage: StageName;
  flow: ReturnType<typeof useTweakideaFlow>;
}) {
  const { state, dispatch } = flow;
  switch (stage) {
    case "idea":
      return (
        <IdeaActive
          state={state}
          dispatch={dispatch}
          onSubmit={flow.submitIdea}
        />
      );
    case "extraction":
      return (
        <ExtractionActive
          state={state}
          dispatch={dispatch}
          onConfirm={flow.confirmExtraction}
        />
      );
    case "assumptions":
      return (
        <AssumptionsActive
          state={state}
          dispatch={dispatch}
          onConfirm={flow.confirmAssumptions}
        />
      );
    case "founder":
      return (
        <FounderActive
          state={state}
          dispatch={dispatch}
          onConfirm={flow.confirmFounder}
        />
      );
    case "founder-fit":
      return (
        <FounderFitActive
          state={state}
          dispatch={dispatch}
          onConfirm={flow.confirmFit}
        />
      );
    case "install":
      return <InstallActive state={state} onReset={flow.reset} />;
  }
}

// --- IDEA ---

const IDEA_PLACEHOLDER = `A tool that lets solo founders stress-test their raw idea against 14 startup dimensions using AI — problem, assumptions, founder-fit, then a scored verdict.`;

function IdeaActive({
  state,
  dispatch,
  onSubmit,
}: {
  state: FlowState;
  dispatch: Dispatch<FlowAction>;
  onSubmit: () => void;
}) {
  const isLoading = state.phase === "extracting-idea";
  const chars = state.ideaRaw.trim().length;
  const canSubmit = chars >= 20 && chars <= 4000 && !isLoading;
  return (
    <div>
      <p className="mb-1 text-xl font-semibold tracking-tight md:text-2xl">
        Start with your idea.
      </p>
      <p className="mb-4 max-w-[54ch] text-sm text-muted-foreground">
        One paragraph. Say what the product is and who it&apos;s for —
        don&apos;t worry about polish.
      </p>
      <textarea
        value={state.ideaRaw}
        onChange={(e) =>
          dispatch({ type: "setIdeaRaw", value: e.target.value })
        }
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && canSubmit) {
            onSubmit();
          }
        }}
        placeholder={IDEA_PLACEHOLDER}
        disabled={isLoading}
        className="block min-h-40 w-full resize-none rounded-md border border-border bg-background/50 px-4 py-3 text-base leading-relaxed text-foreground outline-hidden transition-colors placeholder:text-muted-foreground/50 focus:border-foreground/40"
        aria-label="Raw idea"
      />
      <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
        <span>
          {state.error ? (
            <span className="text-destructive">{state.error}</span>
          ) : chars < 20 ? (
            <>At least 20 characters &middot; ⌘ + Enter to submit</>
          ) : (
            <>⌘ + Enter to submit</>
          )}
        </span>
        <span>{chars}/4000</span>
      </div>
      <BentoButton onClick={onSubmit} disabled={!canSubmit}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Splitting
          </>
        ) : (
          <>
            Split my idea
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </BentoButton>
    </div>
  );
}

// --- EXTRACTION ---

function ExtractionActive({
  state,
  dispatch,
  onConfirm,
}: {
  state: FlowState;
  dispatch: Dispatch<FlowAction>;
  onConfirm: () => void;
}) {
  if (state.phase === "extracting-idea") return <SplitSkeleton />;
  if (!state.extraction) return null;
  const isLoading = state.phase === "extracting-assumptions";
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        <HalfTile
          icon={<Target className="h-3.5 w-3.5" />}
          label="Problem"
          tint="text-rose-300"
          border="border-rose-400/40"
        >
          <textarea
            value={state.extraction.problem}
            onChange={(e) =>
              dispatch({
                type: "editExtraction",
                field: "problem",
                value: e.target.value,
              })
            }
            disabled={isLoading}
            className="block min-h-24 w-full resize-none border-0 bg-transparent text-base leading-relaxed text-foreground outline-hidden"
            aria-label="Problem"
          />
        </HalfTile>
        <HalfTile
          icon={<Sparkles className="h-3.5 w-3.5" />}
          label="Solution"
          tint="text-emerald-300"
          border="border-emerald-400/40"
        >
          <textarea
            value={state.extraction.solution}
            onChange={(e) =>
              dispatch({
                type: "editExtraction",
                field: "solution",
                value: e.target.value,
              })
            }
            disabled={isLoading}
            className="block min-h-24 w-full resize-none border-0 bg-transparent text-base leading-relaxed text-foreground outline-hidden"
            aria-label="Solution"
          />
        </HalfTile>
      </div>
      {state.error && (
        <p className="mt-3 text-sm text-destructive">{state.error}</p>
      )}
      <BentoButton onClick={onConfirm} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Finding assumptions
          </>
        ) : (
          <>
            <Check className="h-4 w-4" aria-hidden="true" />
            Looks right
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </BentoButton>
    </div>
  );
}

function HalfTile({
  icon,
  label,
  tint,
  border,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  tint: string;
  border: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-md border bg-background/30 p-4", border)}>
      <div
        className={cn(
          "mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider",
          tint,
        )}
      >
        {icon}
        {label}
      </div>
      {children}
    </div>
  );
}

function SplitSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="rounded-md border border-border bg-background/30 p-4"
        >
          <div className="mb-3 h-3 w-20 animate-pulse rounded bg-foreground/10" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-foreground/10" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-foreground/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

// --- ASSUMPTIONS ---

const CATEGORY_LABELS: Record<string, string> = {
  market: "Market",
  "user-behavior": "User behavior",
  "technical-feasibility": "Feasibility",
  "willingness-to-pay": "Willingness to pay",
  competition: "Competition",
  "founder-fit": "Founder fit",
};

function AssumptionsActive({
  state,
  dispatch,
  onConfirm,
}: {
  state: FlowState;
  dispatch: Dispatch<FlowAction>;
  onConfirm: () => void;
}) {
  if (state.phase === "extracting-assumptions")
    return <AssumptionsSkeleton />;
  if (state.assumptions.length === 0) return null;
  const kept = state.assumptions.filter((a) => a.keep).length;

  return (
    <div>
      <p className="mb-1 text-xl font-semibold tracking-tight md:text-2xl">
        Which assumptions actually hold?
      </p>
      <p className="mb-4 max-w-[56ch] text-sm text-muted-foreground">
        Your idea only works if these are true. Tap to drop the ones that
        aren&apos;t load-bearing — keep the rest.
      </p>
      <ul className="space-y-2">
        {state.assumptions.map((a) => (
          <BentoAssumption
            key={a.id}
            assumption={a}
            dispatch={dispatch}
          />
        ))}
      </ul>
      <BentoButton onClick={onConfirm} disabled={kept === 0}>
        Keep {kept} and continue
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </BentoButton>
    </div>
  );
}

function BentoAssumption({
  assumption,
  dispatch,
}: {
  assumption: FlowState["assumptions"][number];
  dispatch: Dispatch<FlowAction>;
}) {
  const categoryLabel =
    CATEGORY_LABELS[assumption.category] ?? assumption.category;
  const toggle = () =>
    dispatch({ type: "toggleAssumptionKeep", id: assumption.id });
  return (
    <li>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={assumption.keep}
        aria-label={
          assumption.keep
            ? `Drop assumption: ${assumption.text}`
            : `Keep assumption: ${assumption.text}`
        }
        className={cn(
          "group flex w-full cursor-pointer items-start gap-3 rounded-md border bg-background/30 p-3 text-left transition-colors",
          assumption.keep
            ? "border-amber-400/40 hover:border-amber-300"
            : "border-border opacity-50 hover:opacity-80",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded border transition-colors",
            assumption.keep
              ? "border-amber-400 bg-amber-400/20 text-amber-200"
              : "border-border bg-transparent text-transparent",
          )}
        >
          <Check className="h-3.5 w-3.5" />
        </span>
        <div className="flex-1">
          <p
            className={cn(
              "text-sm leading-snug text-foreground",
              !assumption.keep && "line-through",
            )}
          >
            {assumption.text}
          </p>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {categoryLabel}
          </div>
        </div>
        <X
          aria-hidden="true"
          className={cn(
            "mt-1 h-3.5 w-3.5 flex-none text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100",
            !assumption.keep && "hidden",
          )}
        />
      </button>
    </li>
  );
}

function AssumptionsSkeleton() {
  return (
    <ul className="space-y-2">
      {[0, 1, 2, 3, 4].map((i) => (
        <li
          key={i}
          className="flex items-start gap-3 rounded-md border border-border bg-background/30 p-3"
        >
          <div className="mt-0.5 h-5 w-5 flex-none animate-pulse rounded border border-border bg-foreground/5" />
          <div className="flex-1">
            <div className="h-4 w-full animate-pulse rounded bg-foreground/10" />
            <div className="mt-2 h-3 w-24 animate-pulse rounded bg-foreground/10" />
          </div>
        </li>
      ))}
    </ul>
  );
}

// --- FOUNDER ---

const PRIMARY_SKILLS = [
  { value: "technical", label: "Technical" },
  { value: "product", label: "Product" },
  { value: "sales", label: "Sales" },
  { value: "design", label: "Design" },
  { value: "research", label: "Research" },
  { value: "ops", label: "Ops" },
  { value: "other", label: "Other" },
] as const;

const COMMITMENT_OPTIONS = [
  { value: "full-time", label: "Full-time" },
  { value: "nights-weekends", label: "Nights & weekends" },
  { value: "researching", label: "Still researching" },
] as const;

function FounderActive({
  state,
  dispatch,
  onConfirm,
}: {
  state: FlowState;
  dispatch: Dispatch<FlowAction>;
  onConfirm: () => void;
}) {
  const f = state.founder;
  const isLoading = state.phase === "fetching-fit";
  const canSubmit = f.background.trim().length >= 10 && !isLoading;

  return (
    <div>
      <p className="mb-1 text-xl font-semibold tracking-tight md:text-2xl">
        Quick — tell us who you are.
      </p>
      <p className="mb-5 max-w-[56ch] text-sm text-muted-foreground">
        Three fields. We&apos;ll use these to generate founder-fit questions
        tailored to <em>your</em> edge, not generic ones.
      </p>

      <div className="space-y-5">
        <div>
          <label
            htmlFor="founder-background"
            className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
          >
            Your background
          </label>
          <textarea
            id="founder-background"
            value={f.background}
            onChange={(e) =>
              dispatch({
                type: "setFounderField",
                field: "background",
                value: e.target.value,
              })
            }
            placeholder="e.g. 6 years building data tools at Stripe. Deep in the payments world, shipped the reporting pipeline used by 2M merchants. Left last year to go independent."
            className="block min-h-24 w-full resize-none rounded-md border border-border bg-background/50 px-4 py-3 text-sm leading-relaxed text-foreground outline-hidden transition-colors placeholder:text-muted-foreground/50 focus:border-foreground/40"
            maxLength={600}
            aria-describedby="founder-background-hint"
          />
          <p
            id="founder-background-hint"
            className="mt-1.5 font-mono text-[10px] text-muted-foreground"
          >
            Industry experience, years in the domain, and why this idea keeps
            pulling you back. Min 10 chars.
          </p>
        </div>

        <div>
          <div className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Your primary skill
          </div>
          <PillGroup
            value={f.primary_skill}
            options={PRIMARY_SKILLS}
            ariaLabel="Primary skill"
            onChange={(value) =>
              dispatch({
                type: "setFounderField",
                field: "primary_skill",
                value,
              })
            }
          />
        </div>

        <div>
          <div className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Your commitment
          </div>
          <PillGroup
            value={f.commitment}
            options={COMMITMENT_OPTIONS}
            ariaLabel="Commitment"
            onChange={(value) =>
              dispatch({
                type: "setFounderField",
                field: "commitment",
                value,
              })
            }
          />
        </div>
      </div>

      {state.error && (
        <p className="mt-3 text-sm text-destructive">{state.error}</p>
      )}

      <BentoButton onClick={onConfirm} disabled={!canSubmit}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Tailoring questions
          </>
        ) : (
          <>
            Generate my fit questions
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </BentoButton>
    </div>
  );
}

function PillGroup<T extends string>({
  value,
  options,
  ariaLabel,
  onChange,
}: {
  value: T;
  options: readonly { value: T; label: string }[];
  ariaLabel: string;
  onChange: (value: T) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="flex flex-wrap gap-2"
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={cn(
              "cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              selected
                ? "border-cyan-400 bg-cyan-400/15 text-cyan-100"
                : "border-border bg-background/30 text-muted-foreground hover:border-foreground/40 hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// --- FOUNDER FIT ---

function FounderFitActive({
  state,
  dispatch,
  onConfirm,
}: {
  state: FlowState;
  dispatch: Dispatch<FlowAction>;
  onConfirm: () => void;
}) {
  if (state.phase === "fetching-fit") return <FitSkeleton />;
  if (state.fitQuestions.length === 0) return null;
  const isLoading = state.phase === "saving";
  const answered = state.fitQuestions.filter(
    (q) => (state.fitAnswers[q.id] ?? "").trim().length >= 5,
  ).length;
  const canSubmit = answered === state.fitQuestions.length && !isLoading;

  return (
    <div>
      <div className="space-y-4">
        {state.fitQuestions.map((q, i) => (
          <BentoFitQ
            key={q.id}
            index={i + 1}
            question={q}
            value={state.fitAnswers[q.id] ?? ""}
            onChange={(v) =>
              dispatch({
                type: "setFitAnswer",
                questionId: q.id,
                value: v,
              })
            }
            disabled={isLoading}
          />
        ))}
      </div>
      {state.error && (
        <p className="mt-3 text-sm text-destructive">{state.error}</p>
      )}
      <BentoButton onClick={onConfirm} disabled={!canSubmit}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Saving
          </>
        ) : (
          <>
            Finish walkthrough
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </BentoButton>
    </div>
  );
}

function BentoFitQ({
  index,
  question,
  value,
  onChange,
  disabled,
}: {
  index: number;
  question: FounderFitQuestion;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="rounded-md border border-violet-400/30 bg-violet-500/3 p-4">
      <div className="mb-2 flex items-start gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-violet-300">
          Q{index}
        </span>
        <p className="text-sm font-medium text-foreground">
          {question.question}
        </p>
      </div>
      <p className="mb-3 ml-6 text-[11px] text-muted-foreground">
        {question.rationale}
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Your answer…"
        disabled={disabled}
        className="block min-h-18 w-full resize-none rounded-md border border-border bg-background/50 px-3 py-2 text-sm text-foreground outline-hidden transition-colors focus:border-violet-400/60"
        aria-label={`Answer ${index}`}
        maxLength={800}
      />
    </div>
  );
}

function FitSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-md border border-border bg-background/30 p-4"
        >
          <div className="h-4 w-full animate-pulse rounded bg-foreground/10" />
          <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-foreground/10" />
          <div className="mt-3 h-16 animate-pulse rounded bg-foreground/5" />
        </div>
      ))}
    </div>
  );
}

// --- INSTALL ---

function InstallActive({
  state,
  onReset,
}: {
  state: FlowState;
  onReset: () => void;
}) {
  const [copiedKind, setCopiedKind] = useState<"cmd" | "url" | null>(null);

  if (state.phase === "saving") {
    return (
      <div className="flex items-center gap-3 text-emerald-300">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        <span className="font-mono text-sm uppercase tracking-wider">
          Saving your walkthrough
        </span>
      </div>
    );
  }
  if (!state.save) return null;
  const command = `npx tweakidea`;

  async function copy(kind: "cmd" | "url", text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKind(kind);
      window.posthog?.capture?.("ONELINER_COPIED", {
        save_id: state.save!.id,
      });
      setTimeout(() => setCopiedKind(null), 2000);
    } catch {
      /* noop */
    }
  }

  return (
    <div>
      <p className="mb-1 text-xl font-semibold tracking-tight md:text-2xl">
        Saved. That&apos;s the warm-up.
      </p>
      <p className="mb-6 max-w-[56ch] text-sm text-muted-foreground">
        Your walkthrough is saved at the link below. Install the CLI to run
        the full scored evaluation — it expands on everything you just did.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <SubTile
          tint="text-emerald-300"
          border="border-emerald-400/40"
          label={copiedKind === "cmd" ? "Copied" : "Copy command"}
          icon={
            copiedKind === "cmd" ? (
              <Check className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Copy className="h-5 w-5" aria-hidden="true" />
            )
          }
          onClick={() => copy("cmd", command)}
        >
          <code className="block truncate font-mono text-xs text-muted-foreground">
            {command}
          </code>
        </SubTile>
        <SubTile
          tint="text-cyan-300"
          border="border-cyan-400/40"
          label="Download save"
          icon={<Download className="h-5 w-5" aria-hidden="true" />}
          href={`/api/tweakidea/s/${state.save.id}`}
          download={`tweakidea-${state.save.id}.json`}
        >
          <span className="block truncate text-xs text-muted-foreground">
            tweakidea-{state.save.id.slice(0, 8)}.json
          </span>
        </SubTile>
        <SubTile
          tint="text-violet-300"
          border="border-violet-400/40"
          label={copiedKind === "url" ? "Link copied" : "Share link"}
          icon={
            copiedKind === "url" ? (
              <Check className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Share2 className="h-5 w-5" aria-hidden="true" />
            )
          }
          onClick={() => copy("url", state.save!.url)}
        >
          <span className="block truncate text-xs text-muted-foreground">
            {state.save.url.replace(/^https?:\/\//, "")}
          </span>
        </SubTile>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
        <button
          type="button"
          onClick={onReset}
          className="cursor-pointer text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
        >
          Start over with a new idea
        </button>
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          Expires in 24h
        </span>
      </div>
    </div>
  );
}

function SubTile({
  label,
  icon,
  tint,
  border,
  children,
  onClick,
  href,
  download,
}: {
  label: string;
  icon: React.ReactNode;
  tint: string;
  border: string;
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  download?: string;
}) {
  const inner = (
    <>
      <div className={cn("mb-3 flex items-center gap-2", tint)}>
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      {children}
    </>
  );
  const className = cn(
    "block cursor-pointer rounded-md border bg-background/30 p-5 text-left transition-colors hover:bg-foreground/5",
    border,
  );
  if (href) {
    return (
      <a href={href} download={download} className={className}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {inner}
    </button>
  );
}

// --- Shared atoms ---

function BentoButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "inline-flex cursor-pointer items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90",
          disabled &&
            "cursor-not-allowed opacity-40 hover:bg-foreground",
        )}
      >
        {children}
      </button>
    </div>
  );
}
