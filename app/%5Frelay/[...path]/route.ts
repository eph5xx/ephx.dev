// app/_relay/[...path]/route.ts
// PostHog reverse proxy. Adblocker-safe path; forwards ingest traffic
// to PostHog's US cluster. Forwards the visitor IP as x-forwarded-for so
// PostHog's GeoIP can find the visitor's location (the project discards the
// IP after GeoIP). Strips cookies, auth, Cloudflare headers, and PostHog's
// set-cookie response.
//
// Source: CONTEXT.md D-17, D-19
// Source: RESEARCH.md §Pattern 3, §Pitfall 2, §Pitfall 6
// Source: PITFALLS.md §Pitfall 7
// Source: https://posthog.com/docs/advanced/proxy/nextjs

import type { NextRequest } from "next/server";

// D-03: Node.js runtime (OpenNext under nodejs_compat). Do NOT set edge.
export const runtime = "nodejs";

// Pitfall 2: prevent Next build from statically analyzing the GET handler.
// Belt-and-suspenders with the getCloudflareContext({ async: true }) below.
export const dynamic = "force-dynamic";

const PH_HOST = "https://us.i.posthog.com";
const PH_ASSETS_HOST = "https://us-assets.i.posthog.com";

async function relay(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
): Promise<Response> {
  const { path } = await params; // params is a Promise (Next 15+)
  const joined = path.join("/");

  // PostHog splits static assets (array.js, surveys) onto us-assets.
  const upstreamBase =
    joined.startsWith("static/") || joined.startsWith("array/")
      ? PH_ASSETS_HOST
      : PH_HOST;

  const upstreamUrl = new URL(`/${joined}`, upstreamBase);
  upstreamUrl.search = new URL(req.url).search;

  const headers = new Headers(req.headers);
  const visitorIp = headers.get("cf-connecting-ip");
  for (const name of [...headers.keys()]) {
    if (name.startsWith("cf-")) headers.delete(name);
  }
  headers.delete("host");
  headers.delete("cookie");
  headers.delete("authorization");
  headers.delete("x-forwarded-host");
  headers.delete("x-forwarded-proto");
  // Replace, never append: a client-supplied x-forwarded-for is untrusted.
  headers.delete("x-forwarded-for");
  if (visitorIp) headers.set("x-forwarded-for", visitorIp);

  const init: RequestInit = {
    method: req.method,
    headers,
    body: req.body,
    // @ts-expect-error — `duplex` is required by undici for streaming
    //                    request bodies but is not yet in lib.dom's
    //                    RequestInit type. See RESEARCH.md Pitfall 6.
    duplex: "half",
    redirect: "manual",
  };

  const upstream = await fetch(upstreamUrl.toString(), init);

  // The site is cookieless; never let PostHog set one through our origin.
  const responseHeaders = new Headers(upstream.headers);
  responseHeaders.delete("set-cookie");

  return new Response(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export const GET = relay;
export const POST = relay;
export const OPTIONS = relay;
