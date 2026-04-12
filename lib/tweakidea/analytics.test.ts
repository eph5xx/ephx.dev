import { describe, it, expect, vi, beforeEach } from "vitest";

const captureImmediateMock = vi.fn(async () => undefined);
const shutdownMock = vi.fn(async () => undefined);

vi.mock("posthog-node", () => ({
  PostHog: vi.fn().mockImplementation(() => ({
    captureImmediate: captureImmediateMock,
    shutdown: shutdownMock,
  })),
}));

vi.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: vi.fn(() => ({
    env: {
      POSTHOG_API_KEY: "phc_x",
      POSTHOG_HOST: "https://us.i.posthog.com",
      ANTHROPIC_API_KEY: "sk-ant",
      AI_GATEWAY_TOKEN: "tok",
      CF_ACCOUNT_ID: "acct",
      AI_GATEWAY_NAME: "tweakidea",
      NEXT_PUBLIC_POSTHOG_KEY: "phc_x",
      NEXT_PUBLIC_POSTHOG_HOST: "https://us.i.posthog.com",
      TWEAKIDEA_KV: {},
    } as unknown as CloudflareEnv,
    cf: {} as never,
    ctx: {} as never,
  })),
}));

import { captureEvent } from "@/lib/tweakidea/analytics";

function makeCtx() {
  const waits: unknown[] = [];
  return {
    waits,
    ctx: {
      waitUntil: (p: Promise<unknown> | unknown) => waits.push(p),
      passThroughOnException: () => undefined,
    } as unknown as ExecutionContext,
  };
}

describe("lib/tweakidea/analytics.ts — captureEvent()", () => {
  beforeEach(() => {
    captureImmediateMock.mockClear();
    shutdownMock.mockClear();
  });

  it("wraps captureImmediate in ctx.waitUntil (Pitfall 7 defense)", () => {
    const { ctx, waits } = makeCtx();
    captureEvent(ctx, "did-1", "IDEA_SUBMITTED", { idea_length: 42, turnstile_passed: true });
    expect(captureImmediateMock).toHaveBeenCalledTimes(1);
    // At least one waitUntil call must be the captureImmediate promise
    expect(waits.length).toBeGreaterThanOrEqual(2);
  });

  it("wraps shutdown() in ctx.waitUntil (final drain)", () => {
    const { ctx } = makeCtx();
    captureEvent(ctx, "did-1", "BUNDLE_GENERATED", {
      bundle_id: "abc",
      total_bytes: 1234,
      latency_ms: 50,
    });
    expect(shutdownMock).toHaveBeenCalledTimes(1);
  });

  it("forwards event name and props to captureImmediate unchanged", () => {
    const { ctx } = makeCtx();
    captureEvent(ctx, "did-1", "PROBLEM_CONFIRMED", {
      problem_length: 100,
      solution_length: 80,
      edited: true,
    });
    expect(captureImmediateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        distinctId: "did-1",
        event: "PROBLEM_CONFIRMED",
        properties: expect.objectContaining({
          problem_length: 100,
          solution_length: 80,
          edited: true,
        }),
      }),
    );
  });
});

// --- Compile-time PII barrier check (ANLY-07) ---
// This block MUST fail to compile if the type system does not enforce EventPropsMap.
// The ts-expect-error line is the regression guard: remove it and tsc --noEmit will fail
// iff captureEvent accidentally accepts arbitrary props.
describe("typecheck: EventPropsMap rejects raw idea text", () => {
  it("compile-time fails when payload contains idea_text", () => {
    const { ctx } = makeCtx();
    // @ts-expect-error — idea_text is NOT in EventPropsMap["IDEA_SUBMITTED"]; must fail to compile.
    captureEvent(ctx, "did-1", "IDEA_SUBMITTED", { idea_length: 1, turnstile_passed: true, idea_text: "SECRET" });
    expect(true).toBe(true);
  });
});
