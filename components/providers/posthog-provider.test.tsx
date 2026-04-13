import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";

const { initMock, captureMock, identifyMock, posthogStub } = vi.hoisted(() => {
  const initMock = vi.fn();
  const captureMock = vi.fn();
  const identifyMock = vi.fn();
  const posthogStub = {
    init: initMock,
    capture: captureMock,
    identify: identifyMock,
    __loaded: false,
    config: {} as Record<string, unknown>,
  };
  return { initMock, captureMock, identifyMock, posthogStub };
});

vi.mock("posthog-js", () => ({ default: posthogStub }));

vi.mock("next/navigation", () => ({
  usePathname: () => "/about",
  useSearchParams: () => new URLSearchParams("ref=test"),
}));

import { PostHogProvider } from "@/components/providers/posthog-provider";

describe("components/providers/posthog-provider.tsx", () => {
  beforeEach(() => {
    initMock.mockClear();
    captureMock.mockClear();
    identifyMock.mockClear();
    posthogStub.__loaded = false;
    posthogStub.config = {};
    sessionStorage.clear();
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_test_key");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("initializes posthog-js on mount", () => {
    render(<PostHogProvider>child</PostHogProvider>);
    expect(initMock).toHaveBeenCalledTimes(1);
  });

  it("disables autocapture (ANLY-02)", () => {
    render(<PostHogProvider>child</PostHogProvider>);
    const opts = initMock.mock.calls[0][1] as Record<string, unknown>;
    expect(opts.autocapture).toBe(false);
  });

  it("disables session recording (ANLY-03)", () => {
    render(<PostHogProvider>child</PostHogProvider>);
    const opts = initMock.mock.calls[0][1] as Record<string, unknown>;
    expect(opts.disable_session_recording).toBe(true);
  });

  it("sets manual pageview mode (capture_pageview: false)", () => {
    render(<PostHogProvider>child</PostHogProvider>);
    const opts = initMock.mock.calls[0][1] as Record<string, unknown>;
    expect(opts.capture_pageview).toBe(false);
  });

  it("points api_host at /_relay reverse proxy (ANLY-08)", () => {
    render(<PostHogProvider>child</PostHogProvider>);
    const opts = initMock.mock.calls[0][1] as Record<string, unknown>;
    expect(opts.api_host).toBe("/_relay");
  });

  it("sets persistence to memory, ip false, mask_all_text true", () => {
    render(<PostHogProvider>child</PostHogProvider>);
    const opts = initMock.mock.calls[0][1] as Record<string, unknown>;
    expect(opts.persistence).toBe("memory");
    expect(opts.ip).toBe(false);
    expect(opts.mask_all_text).toBe(true);
  });

  it("fires $pageview via capture() on mount (ANLY-04)", async () => {
    render(<PostHogProvider>child</PostHogProvider>);
    // Child is gated on ready state — wait for re-render after setReady(true).
    await vi.waitFor(() => {
      expect(captureMock).toHaveBeenCalledWith(
        "$pageview",
        expect.objectContaining({ $current_url: expect.any(String) }),
      );
    });
  });

  it("fires init BEFORE the first $pageview capture (WR-02 race guard)", async () => {
    render(<PostHogProvider>child</PostHogProvider>);
    await vi.waitFor(() => {
      expect(captureMock).toHaveBeenCalled();
    });
    const initOrder = initMock.mock.invocationCallOrder[0];
    const captureOrder = captureMock.mock.invocationCallOrder[0];
    expect(initOrder).toBeLessThan(captureOrder);
  });

  it("stores distinct_id in sessionStorage not localStorage (D-21)", () => {
    render(<PostHogProvider>child</PostHogProvider>);
    const keys = Object.keys(sessionStorage);
    expect(keys.some((k) => k.includes("ph") || k.includes("did"))).toBe(true);
  });

  it("skips posthog.init when NEXT_PUBLIC_POSTHOG_KEY is unset (WR-01 guard)", () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "");
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<PostHogProvider>child</PostHogProvider>);
    expect(initMock).not.toHaveBeenCalled();
    // Dev-mode warning only fires when NODE_ENV !== production; vitest sets NODE_ENV=test.
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("NEXT_PUBLIC_POSTHOG_KEY is unset"),
    );
    warnSpy.mockRestore();
  });
});
