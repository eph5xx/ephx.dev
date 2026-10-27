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
        CF_ACCOUNT_ID: "acct",
        AI_GATEWAY_NAME: "tweakidea",
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
        CF_ACCOUNT_ID: "acct",
        AI_GATEWAY_NAME: "tweakidea",
      } as unknown as CloudflareEnv,
      cf: {} as never,
      ctx: {} as never,
    });
    const env = getEnv();
    expect(env.ANTHROPIC_API_KEY).toBe("sk-ant-test");
  });

  it("getEnvAsync() awaits getCloudflareContext({ async: true })", async () => {
    vi.mocked(getCloudflareContext).mockImplementation(
      ((opts?: { async?: boolean }) => {
        const env = {
          TWEAKIDEA_KV: { get: vi.fn() } as unknown,
          ANTHROPIC_API_KEY: "sk-ant-test",
          AI_GATEWAY_TOKEN: "tok",
            CF_ACCOUNT_ID: "acct",
          AI_GATEWAY_NAME: "tweakidea",
          } as unknown as CloudflareEnv;
        return opts?.async
          ? Promise.resolve({ env, cf: {}, ctx: {} })
          : ({ env, cf: {}, ctx: {} } as never);
      }) as typeof getCloudflareContext,
    );
    const { getEnvAsync } = await import("@/lib/env");
    const env = await getEnvAsync();
    expect(env.ANTHROPIC_API_KEY).toBe("sk-ant-test");
  });

  it("throws on missing var (not secret)", () => {
    vi.mocked(getCloudflareContext).mockReturnValue({
      env: {
        TWEAKIDEA_KV: {} as unknown,
        ANTHROPIC_API_KEY: "sk-ant-test",
        AI_GATEWAY_TOKEN: "tok",
        CF_ACCOUNT_ID: "",
        AI_GATEWAY_NAME: "tweakidea",
      } as unknown as CloudflareEnv,
      cf: {} as never,
      ctx: {} as never,
    });
    expect(() => getEnv()).toThrowError(/CF_ACCOUNT_ID/);
  });

  it("throws on missing binding", () => {
    vi.mocked(getCloudflareContext).mockReturnValue({
      env: {
        TWEAKIDEA_KV: null as unknown,
        ANTHROPIC_API_KEY: "sk-ant-test",
        AI_GATEWAY_TOKEN: "tok",
        CF_ACCOUNT_ID: "acct",
        AI_GATEWAY_NAME: "tweakidea",
      } as unknown as CloudflareEnv,
      cf: {} as never,
      ctx: {} as never,
    });
    expect(() => getEnv()).toThrowError(/TWEAKIDEA_KV/);
  });

  it("error message never includes the expected value shape", () => {
    vi.mocked(getCloudflareContext).mockReturnValue({
      env: {
        TWEAKIDEA_KV: {} as unknown,
        ANTHROPIC_API_KEY: "",
        AI_GATEWAY_TOKEN: "tok",
        CF_ACCOUNT_ID: "acct",
        AI_GATEWAY_NAME: "tweakidea",
      } as unknown as CloudflareEnv,
      cf: {} as never,
      ctx: {} as never,
    });
    try {
      getEnv();
      throw new Error("should have thrown");
    } catch (e) {
      const msg = (e as Error).message;
      // Must name the key but never leak what a valid value looks like
      expect(msg).toContain("ANTHROPIC_API_KEY");
      expect(msg).not.toContain("sk-ant-");
    }
  });
});
