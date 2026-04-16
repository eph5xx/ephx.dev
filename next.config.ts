import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Required for `getCloudflareContext()` to work inside `next dev` route handlers
// (TweakIdea API, KV reads, PostHog server-side capture).
initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
