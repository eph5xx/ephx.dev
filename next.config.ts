import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [{ source: "/about", destination: "/", permanent: true }];
  },
};

export default function config(phase: string): NextConfig {
  // NEXT_PUBLIC_* values are inlined at build time, so a build without the
  // key would ship a site that silently sends no analytics.
  if (phase === PHASE_PRODUCTION_BUILD && !process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    throw new Error(
      "NEXT_PUBLIC_POSTHOG_KEY is not set. Add it to .env.local / .env.production, " +
        "or as a build variable on the Cloudflare Worker. See SETUP.md."
    );
  }
  return nextConfig;
}
