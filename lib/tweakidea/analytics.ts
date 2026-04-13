// lib/tweakidea/analytics.ts
// Typed whitelist server-side event capture helper.
//
// Two invariants this file enforces:
//   1. ANLY-07 — no raw user idea text in event payloads (compile-time
//      via EventPropsMap discriminated union).
//   2. ANLY-05 + RESEARCH.md Refinement #1 — dual-waitUntil pattern so
//      events are not silently dropped under Workers (PostHog issue #2225).
//
// Source: CONTEXT.md D-22, D-23, D-24
// Source: RESEARCH.md §Pattern 4, §Pitfall 1
// Source: PITFALLS.md §Pitfall 7
// Source: https://posthog.com/docs/libraries/cloudflare-workers (canonical dual-waitUntil doc)
// Source: https://github.com/PostHog/posthog-js/issues/2225 (silent drop bug)

import { PostHog } from "posthog-node";
import { getEnv } from "@/lib/env";

// --- Single source of truth for server + client event shapes (D-24) ---
// Event names come from REQUIREMENTS.md §ANLY-06. Client-side event
// emitters (Phase 6) MUST import this same map so client and server
// emit structurally-identical events.

export type EventPropsMap = {
  PAGEVIEW_TWEAKIDEA: { $current_url: string };
  IDEA_SUBMITTED: { idea_length: number; turnstile_passed: boolean };
  PROBLEM_CONFIRMED: {
    problem_length: number;
    solution_length: number;
    edited: boolean;
  };
  ASSUMPTIONS_LOADED: { count: number; latency_ms: number };
  ASSUMPTIONS_CONFIRMED: {
    kept: number;
    edited: number;
    removed: number;
  };
  FOUNDER_SUBMITTED: { answered_count: number };
  BUNDLE_GENERATED: {
    bundle_id: string;
    total_bytes: number;
    latency_ms: number;
  };
  ONELINER_COPIED: { bundle_id: string };
};

export type EventName = keyof EventPropsMap;

/**
 * Server-side PostHog event capture with compile-time PII barrier and
 * dual-waitUntil drop defense.
 *
 * Compile-time: the generic `E extends EventName` constraint, combined
 * with `props: EventPropsMap[E]`, means TypeScript rejects any property
 * name not in the explicit whitelist — TS2322 / TS2353 is raised before
 * the code ever runs. ANLY-07 is enforced by the type system itself.
 *
 * Runtime: per the PostHog Cloudflare Workers docs, the immediate-capture
 * path resolves BEFORE its underlying fetch() settles. Wrapping ONLY the
 * final flush leaves the in-flight network request unprotected — the
 * runtime can kill it as the isolate releases (~30–70% silent drop rate).
 * Wrapping BOTH is the canonical fix (RESEARCH.md Refinement #1).
 *
 * Never construct PostHog directly elsewhere — this helper is the only
 * sanctioned server-side event path. The ANLY-07 barrier is bypassed if a
 * caller skips it (T-01-08-05 — accepted, code-review enforced).
 */
export function captureEvent<E extends EventName>(
  ctx: ExecutionContext,
  distinctId: string,
  event: E,
  props: EventPropsMap[E],
): void {
  const env = getEnv();

  // Fresh client per call — workerd may reuse globals across requests
  // but offers no lifecycle guarantees. Do NOT memoize at module top-level.
  const posthog = new PostHog(env.POSTHOG_API_KEY, {
    host: env.POSTHOG_HOST,
    flushAt: 1, // PostHog CF Workers doc: send immediately, no batching.
    flushInterval: 0,
  });

  // Pitfall 1 / Refinement #1: wrap the immediate capture so its fetch()
  // stays alive past handler return.
  ctx.waitUntil(
    posthog.captureImmediate({
      distinctId,
      event,
      properties: props as Record<string, unknown>,
    }),
  );

  // Final flush (D-23). Required to drain any remaining batch state.
  ctx.waitUntil(posthog.shutdown());
}
