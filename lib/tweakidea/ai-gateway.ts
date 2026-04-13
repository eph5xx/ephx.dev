// lib/tweakidea/ai-gateway.ts
// Skeleton factory for the Anthropic SDK configured via Cloudflare AI Gateway
// (authenticated mode, cross-session caching disabled).
//
// Phase 1 ships only this factory; Phase 4 adds the actual
// `anthropic.messages.create(...)` call sites in extract-idea and
// extract-assumptions route handlers.
//
// Source: CONTEXT.md D-04, D-05, D-06
// Source: RESEARCH.md §Pattern 6
// Source: https://developers.cloudflare.com/ai-gateway/usage/providers/anthropic/
// Source: https://developers.cloudflare.com/ai-gateway/features/caching/ (cf-aig-skip-cache)
// Source: https://developers.cloudflare.com/ai-gateway/configuration/authentication/
// Source: PITFALLS.md §Pitfall 5 (cross-user cache leak — cf-aig-skip-cache is MANDATORY)

import Anthropic from "@anthropic-ai/sdk";
import { getEnv } from "@/lib/env";

/**
 * Creates a fresh Anthropic SDK client routed through Cloudflare AI Gateway
 * in authenticated mode. Every outbound request inherits:
 *
 *   - `cf-aig-authorization: Bearer <AI_GATEWAY_TOKEN>` (D-04)
 *   - `cf-aig-skip-cache: true` (D-06, API-04 — NEVER cache user-derived content)
 *
 * IMPORTANT: Create a new client per request. Do NOT memoize at module
 * top-level — workerd may reuse globals across requests but offers no
 * lifecycle guarantees (see RESEARCH.md §Anti-Patterns).
 */
export function createAnthropicClient(): Anthropic {
  const env = getEnv();

  const baseURL = `https://gateway.ai.cloudflare.com/v1/${env.CF_ACCOUNT_ID}/${env.AI_GATEWAY_NAME}/anthropic`;

  return new Anthropic({
    apiKey: env.ANTHROPIC_API_KEY,
    baseURL,
    defaultHeaders: {
      "cf-aig-authorization": `Bearer ${env.AI_GATEWAY_TOKEN}`,
      "cf-aig-skip-cache": "true",
    },
  });
}
