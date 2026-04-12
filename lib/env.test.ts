import { describe, it, expect, vi, beforeEach } from "vitest";

// Mocked before any import of lib/env so the inner getCloudflareContext call is stubbed.
vi.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: vi.fn(),
}));

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getEnv } from "@/lib/env";

describe("lib/env.ts — getEnv()", () => {
  beforeEach(() => {
    vi.mocked(getCloudflareContext).mockReset();
  });

  it("throws on missing secret", () => {
    vi.mocked(getCloudflareContext).mockReturnValue({
      env: {
        TWEAKIDEA_KV: {} as unknown,
        ANTHROPIC_API_KEY: "",
        AI_GATEWAY_TOKEN: "token",
        POSTHOG_API_KEY: "phc_x",
        CF_ACCOUNT_ID: "acct",
        AI_GATEWAY_NAME: "tweakidea",
        POSTHOG_HOST: "https://us.i.posthog.com",
        NEXT_PUBLIC_POSTHOG_KEY: "phc_x",
        NEXT_PUBLIC_POSTHOG_HOST: "https://us.i.posthog.com",
      } as unknown as CloudflareEnv,
      cf: {} as never,
      ctx: {} as never,
    });
    expect(() => getEnv()).toThrowError(/ANTHROPIC_API_KEY/);
  });

  it("returns typed env on happy path", () => {
    vi.mocked(getCloudflareContext).mockReturnValue({
      env: {
        TWEAKIDEA_KV: { get: vi.fn(), put: vi.fn() } as unknown,
        ANTHROPIC_API_KEY: "sk-ant-test",
        AI_GATEWAY_TOKEN: "token",
        POSTHOG_API_KEY: "phc_x",
        CF_ACCOUNT_ID: "acct",
        AI_GATEWAY_NAME: "tweakidea",
        POSTHOG_HOST: "https://us.i.posthog.com",
        NEXT_PUBLIC_POSTHOG_KEY: "phc_x",
        NEXT_PUBLIC_POSTHOG_HOST: "https://us.i.posthog.com",
      } as unknown as CloudflareEnv,
      cf: {} as never,
      ctx: {} as never,
    });
    const env = getEnv();
    expect(env.ANTHROPIC_API_KEY).toBe("sk-ant-test");
  });

  it.todo("getEnvAsync() awaits getCloudflareContext({ async: true })");
});
