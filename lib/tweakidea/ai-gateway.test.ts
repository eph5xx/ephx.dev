// @vitest-environment node
// ai-gateway.ts is server-only (imports @/lib/env → @opennextjs/cloudflare).
// The Anthropic SDK refuses to construct under jsdom because it detects the
// "browser-like" environment and guards against API key exposure. Override
// to node here — this matches the real Worker runtime, not jsdom.
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: vi.fn(() => ({
    env: {
      ANTHROPIC_API_KEY: "sk-ant-test",
      AI_GATEWAY_TOKEN: "gw-token",
      POSTHOG_API_KEY: "phc_x",
      CF_ACCOUNT_ID: "acct-123",
      AI_GATEWAY_NAME: "tweakidea",
      POSTHOG_HOST: "https://us.i.posthog.com",
      NEXT_PUBLIC_POSTHOG_KEY: "phc_x",
      NEXT_PUBLIC_POSTHOG_HOST: "https://us.i.posthog.com",
      TWEAKIDEA_KV: {},
    } as unknown as CloudflareEnv,
    cf: {} as never,
    ctx: {} as never,
  })),
}));

import { createAnthropicClient } from "@/lib/tweakidea/ai-gateway";

describe("lib/tweakidea/ai-gateway.ts", () => {
  it("returns an Anthropic client instance", () => {
    const client = createAnthropicClient();
    expect(client).toBeDefined();
    expect(typeof client).toBe("object");
  });

  it("sets baseURL pointing at Cloudflare AI Gateway", () => {
    const client = createAnthropicClient();
    // @anthropic-ai/sdk stores baseURL on the instance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const baseURL = (client as any).baseURL as string;
    expect(baseURL).toContain("gateway.ai.cloudflare.com");
    expect(baseURL).toContain("acct-123");
    expect(baseURL).toContain("tweakidea");
    expect(baseURL).toContain("anthropic");
  });

  it("sets cf-aig-skip-cache: true in default headers", () => {
    const client = createAnthropicClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const headers = (client as any).defaultHeaders?.() ?? (client as any)._options?.defaultHeaders ?? {};
    // Accept either spelling — SDK internal layout varies
    const skip = headers["cf-aig-skip-cache"] ?? headers["Cf-Aig-Skip-Cache"];
    expect(skip).toBe("true");
  });

  it("sets cf-aig-authorization Bearer header from AI_GATEWAY_TOKEN", () => {
    const client = createAnthropicClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const headers = (client as any).defaultHeaders?.() ?? (client as any)._options?.defaultHeaders ?? {};
    const auth = headers["cf-aig-authorization"] ?? headers["Cf-Aig-Authorization"];
    expect(auth).toBe("Bearer gw-token");
  });

  it("constructs baseURL from CF_ACCOUNT_ID and AI_GATEWAY_NAME env vars", () => {
    const client = createAnthropicClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const baseURL = (client as any).baseURL as string;
    expect(baseURL).toBe("https://gateway.ai.cloudflare.com/v1/acct-123/tweakidea/anthropic");
  });

  it("creates a fresh client per invocation (no module-level singleton)", () => {
    const a = createAnthropicClient();
    const b = createAnthropicClient();
    expect(a).not.toBe(b);
  });
});
