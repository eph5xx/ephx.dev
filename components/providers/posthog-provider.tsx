"use client";

// components/providers/posthog-provider.tsx
// Source: CONTEXT.md D-16, D-18, D-19, D-20, D-21
// Source: RESEARCH.md §Pattern 2
// Source: PITFALLS.md §Pitfall 4 (autocapture), §Pitfall 8 (strict-mode double init)
// Source: https://posthog.com/docs/libraries/next-js

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";

const SESSION_KEY = "ephx_ph_did";

function PostHogPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    if (typeof window === "undefined") return;
    let url = window.origin + pathname;
    const q = searchParams?.toString();
    if (q) url += `?${q}`;
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  // WR-02 race guard: React fires child useEffects BEFORE parent effects, so
  // PostHogPageview.capture() would run before posthog.init() unless we gate
  // the child on a post-init state flip. We only mount the pageview child
  // after init succeeds, so its first effect fires against an initialized
  // client and the initial $pageview is captured reliably.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Idempotency guard for React 19 strict-mode double-mounting (Pitfall 8).
    // If posthog is already initialized, just flip ready — don't re-init.
    if (posthog.__loaded) {
      setReady(true);
      return;
    }

    // Build-time inlined by Next.js from .env*/shell. If unset, skip init
    // entirely — posthog.init("") silently no-ops and masks the misconfiguration.
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "[PostHogProvider] NEXT_PUBLIC_POSTHOG_KEY is unset — skipping init. " +
            "Set it in .env.local (dev) or .env.production (prod). See .env.example + SETUP.md §3.",
        );
      }
      return;
    }

    // Session-scoped distinct_id (D-21) — cleared on tab close.
    let distinctId = sessionStorage.getItem(SESSION_KEY);
    if (!distinctId) {
      distinctId = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, distinctId);
    }

    posthog.init(key, {
      api_host: "/_relay", // D-17 reverse proxy path (ANLY-08)
      ui_host: "https://us.posthog.com",

      // --- Privacy lockdown (D-18, D-19) ---
      autocapture: false, // ANLY-02: never leak input contents
      capture_pageview: false, // manual — see PostHogPageview above (D-20, ANLY-04)
      capture_pageleave: false,
      disable_session_recording: true, // ANLY-03: permanent invariant
      mask_all_text: true, // D-16
      ip: false, // D-16
      persistence: "memory", // D-19: no cookies, no localStorage
      person_profiles: "identified_only",

      // Session-scoped identity (D-21)
      bootstrap: { distinctID: distinctId },
      loaded: (ph) => {
        if (distinctId) ph.identify(distinctId);
      },
    });

    setReady(true);
  }, []);

  return (
    <>
      {ready && (
        <Suspense fallback={null}>
          <PostHogPageview />
        </Suspense>
      )}
      {children}
    </>
  );
}
