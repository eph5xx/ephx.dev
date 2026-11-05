import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchStars } from "@/lib/github-stars";

function mockFetch(response: Partial<Response> | Error) {
  vi.stubGlobal(
    "fetch",
    response instanceof Error
      ? vi.fn().mockRejectedValue(response)
      : vi.fn().mockResolvedValue(response)
  );
}

describe("fetchStars", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("returns the repo's star count", async () => {
    mockFetch({
      ok: true,
      json: async () => ({ stargazers_count: 56 }),
    });
    await expect(fetchStars("eph5xx/tweakidea")).resolves.toBe(56);
  });

  it("returns null when GitHub refuses", async () => {
    mockFetch({ ok: false });
    await expect(fetchStars("eph5xx/tweakidea")).resolves.toBeNull();
  });

  it("returns null when the request fails", async () => {
    mockFetch(new Error("offline"));
    await expect(fetchStars("eph5xx/tweakidea")).resolves.toBeNull();
  });

  it("returns null when the response has no count", async () => {
    mockFetch({ ok: true, json: async () => ({}) });
    await expect(fetchStars("eph5xx/tweakidea")).resolves.toBeNull();
  });
});
