import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchVideoCount } from "@/lib/surf-stats";

const url = "https://surfskills.surf/stats.json";

function mockFetch(response: Partial<Response> | Error) {
  vi.stubGlobal(
    "fetch",
    response instanceof Error
      ? vi.fn().mockRejectedValue(response)
      : vi.fn().mockResolvedValue(response)
  );
}

describe("fetchVideoCount", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("returns the catalog's video count", async () => {
    mockFetch({
      ok: true,
      json: async () => ({ videos: 50 }),
    });
    await expect(fetchVideoCount(url)).resolves.toBe(50);
  });

  it("returns null when the catalog refuses", async () => {
    mockFetch({ ok: false });
    await expect(fetchVideoCount(url)).resolves.toBeNull();
  });

  it("returns null when the request fails", async () => {
    mockFetch(new Error("offline"));
    await expect(fetchVideoCount(url)).resolves.toBeNull();
  });

  it("returns null when the response has no count", async () => {
    mockFetch({ ok: true, json: async () => ({}) });
    await expect(fetchVideoCount(url)).resolves.toBeNull();
  });
});
