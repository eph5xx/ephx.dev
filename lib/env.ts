// lib/env.ts
// Typed, fail-fast accessor over getCloudflareContext().env.
// Source: CONTEXT.md D-09, D-10, D-11
// Source: RESEARCH.md §Pattern 1

import { getCloudflareContext } from "@opennextjs/cloudflare";

// CloudflareEnv is globally augmented by `wrangler types` into
// worker-configuration.d.ts — consume, do not redefine.

const REQUIRED_SECRETS = [
  "ANTHROPIC_API_KEY",
  "AI_GATEWAY_TOKEN",
  "POSTHOG_API_KEY",
] as const satisfies readonly (keyof CloudflareEnv)[];

const REQUIRED_VARS = [
  "CF_ACCOUNT_ID",
  "AI_GATEWAY_NAME",
  "POSTHOG_HOST",
  "NEXT_PUBLIC_POSTHOG_KEY",
  "NEXT_PUBLIC_POSTHOG_HOST",
] as const satisfies readonly (keyof CloudflareEnv)[];

const REQUIRED_BINDINGS = [
  "TWEAKIDEA_KV",
] as const satisfies readonly (keyof CloudflareEnv)[];

function assertRequired(env: CloudflareEnv): void {
  for (const key of REQUIRED_SECRETS) {
    const value = env[key];
    if (value == null || value === "") {
      throw new Error(
        `[lib/env] Required secret '${key}' is missing. Set it via \`wrangler secret put ${key}\` (or add to .dev.vars for local dev). See SETUP.md.`,
      );
    }
  }
  for (const key of REQUIRED_VARS) {
    const value = env[key];
    if (value == null || value === "") {
      throw new Error(
        `[lib/env] Required var '${key}' is missing. Set it in wrangler.jsonc \`vars\` block. See SETUP.md.`,
      );
    }
  }
  for (const key of REQUIRED_BINDINGS) {
    const value = env[key];
    if (value == null) {
      throw new Error(
        `[lib/env] Required binding '${key}' is missing. Declare it in wrangler.jsonc. See SETUP.md.`,
      );
    }
  }
}

/**
 * Synchronous env accessor. Use in dynamic route handlers (POST handlers,
 * or GET handlers that read request-scoped values like headers/cookies).
 *
 * Do NOT call at module top level or inside a statically-analyzed GET
 * handler — use `getEnvAsync()` there instead (see RESEARCH.md Pitfall 2).
 *
 * Throws a named error if any required secret, var, or binding is missing.
 */
export function getEnv(): CloudflareEnv {
  const { env } = getCloudflareContext();
  assertRequired(env);
  return env;
}

/**
 * Async env accessor. Required for code paths that might run during
 * Next.js build-time static analysis — specifically the `/_relay/[...path]`
 * GET catch-all handler (Plan 01-07).
 *
 * Prefer `getEnv()` everywhere else (it's cheaper and synchronous).
 */
export async function getEnvAsync(): Promise<CloudflareEnv> {
  const { env } = await getCloudflareContext({ async: true });
  assertRequired(env);
  return env;
}
