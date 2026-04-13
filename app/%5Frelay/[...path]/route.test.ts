import { describe, it, expect, vi, beforeEach } from "vitest";

// Intercept the global fetch that the relay handler calls
const fetchMock = vi.fn(async () => new Response("ok", { status: 200 }));
vi.stubGlobal("fetch", fetchMock);

// IMPORTANT: source folder is `%5Frelay` (URL-encoded `_`) so Next.js
// surfaces the literal `/_relay` URL path instead of treating an
// underscore-prefixed folder as a private (non-routable) folder.
// See SUMMARY.md "Deviations" for the full deviation note.
import { GET, POST } from "@/app/%5Frelay/[...path]/route";

function makeReq(url: string, init?: RequestInit) {
  return new Request(url, init) as unknown as import("next/server").NextRequest;
}

function makeCtx(path: string[]) {
  return { params: Promise.resolve({ path }) };
}

describe("app/%5Frelay/[...path]/route.ts — PostHog reverse proxy", () => {
  beforeEach(() => {
    fetchMock.mockClear();
  });

  it("forwards POST /_relay/capture to us.i.posthog.com", async () => {
    await POST(makeReq("https://ephx.dev/_relay/capture", { method: "POST", body: JSON.stringify({ a: 1 }) }), makeCtx(["capture"]));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain("us.i.posthog.com");
    expect(url).toContain("/capture");
  });

  it("routes static/ and array/ paths to us-assets.i.posthog.com", async () => {
    await GET(makeReq("https://ephx.dev/_relay/static/array.js"), makeCtx(["static", "array.js"]));
    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain("us-assets.i.posthog.com");
  });

  it("strips cf-connecting-ip and host headers", async () => {
    await POST(
      makeReq("https://ephx.dev/_relay/capture", {
        method: "POST",
        headers: { "cf-connecting-ip": "1.2.3.4", host: "ephx.dev", "x-forwarded-for": "1.2.3.4" },
        body: "{}",
      }),
      makeCtx(["capture"]),
    );
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    const headers = init.headers as Headers;
    expect(headers.get("cf-connecting-ip")).toBeNull();
    expect(headers.get("host")).toBeNull();
    expect(headers.get("x-forwarded-for")).toBeNull();
  });

  it("strips set-cookie from response (cookieless D-19)", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response("ok", {
        status: 200,
        headers: { "set-cookie": "ph_key=1", "content-type": "application/json" },
      }),
    );
    const res = await POST(makeReq("https://ephx.dev/_relay/capture", { method: "POST", body: "{}" }), makeCtx(["capture"]));
    expect(res.headers.get("set-cookie")).toBeNull();
  });

  it("passes through upstream status codes", async () => {
    fetchMock.mockResolvedValueOnce(new Response("", { status: 418 }));
    const res = await POST(makeReq("https://ephx.dev/_relay/capture", { method: "POST", body: "{}" }), makeCtx(["capture"]));
    expect(res.status).toBe(418);
  });

  it("preserves query string when forwarding", async () => {
    await POST(
      makeReq("https://ephx.dev/_relay/capture?_=1712345678&v=123", {
        method: "POST",
        body: "{}",
      }),
      makeCtx(["capture"]),
    );
    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain("_=1712345678");
    expect(url).toContain("v=123");
  });

  it("handles OPTIONS preflight requests", async () => {
    const { OPTIONS } = await import("@/app/%5Frelay/[...path]/route");
    const res = await OPTIONS(
      makeReq("https://ephx.dev/_relay/capture", { method: "OPTIONS" }),
      makeCtx(["capture"]),
    );
    expect(res).toBeInstanceOf(Response);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
