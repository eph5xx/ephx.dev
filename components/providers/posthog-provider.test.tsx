import { describe, it, expect, vi, beforeEach } from "vitest";
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

  it("fires $pageview via capture() on mount (ANLY-04)", () => {
    render(<PostHogProvider>child</PostHogProvider>);
    expect(captureMock).toHaveBeenCalledWith("$pageview", expect.objectContaining({ $current_url: expect.any(String) }));
  });

  it("stores distinct_id in sessionStorage not localStorage (D-21)", () => {
    render(<PostHogProvider>child</PostHogProvider>);
    const keys = Object.keys(sessionStorage);
    expect(keys.some((k) => k.includes("ph") || k.includes("did"))).toBe(true);
  });
});
