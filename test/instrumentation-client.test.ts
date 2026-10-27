import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const { initMock, captureMock } = vi.hoisted(() => ({
  initMock: vi.fn(),
  captureMock: vi.fn(),
}));

vi.mock("posthog-js", () => ({
  default: { init: initMock, capture: captureMock },
}));

// Each import of the module registers a click listener; track and remove
// them so one test's listener cannot fire in the next.
const listeners: EventListenerOrEventListenerObject[] = [];
const realAdd = document.addEventListener.bind(document);

async function load(path: string) {
  window.history.pushState({}, "", path);
  vi.resetModules();
  await import("@/instrumentation-client");
}

function clickLink(href: string, sectionId = "links") {
  document.body.innerHTML = `<section id="${sectionId}"><a href="${href}"><span>GitHub</span></a></section>`;
  const span = document.querySelector("span")!;
  span.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
}

describe("instrumentation-client.ts", () => {
  beforeEach(() => {
    initMock.mockClear();
    captureMock.mockClear();
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_test_key");
    vi.spyOn(document, "addEventListener").mockImplementation(
      (type: string, listener: EventListenerOrEventListenerObject, opts?: boolean | AddEventListenerOptions) => {
        if (type === "click") listeners.push(listener);
        realAdd(type, listener, opts);
      }
    );
    // Prevent jsdom from attempting navigation on anchor clicks.
    realAdd("click", (e) => e.preventDefault());
  });

  afterEach(() => {
    for (const l of listeners.splice(0)) document.removeEventListener("click", l);
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    document.body.innerHTML = "";
  });

  it("initializes on / with the cookieless config", async () => {
    await load("/");
    expect(initMock).toHaveBeenCalledTimes(1);
    expect(initMock).toHaveBeenCalledWith("phc_test_key", {
      api_host: "/_relay",
      ui_host: "https://us.posthog.com",
      defaults: "2026-01-30",
      cookieless_mode: "always",
      person_profiles: "never",
      disable_session_recording: true,
    });
  });

  it("does not initialize on an article page", async () => {
    await load("/a/tweak-idea");
    expect(initMock).not.toHaveBeenCalled();
    clickLink("https://github.com/eph5xx");
    expect(captureMock).not.toHaveBeenCalled();
  });

  it("does not initialize and warns when the key is missing", async () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    await load("/");
    expect(initMock).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("NEXT_PUBLIC_POSTHOG_KEY is unset")
    );
  });

  it("captures outbound_link_clicked for an external link", async () => {
    await load("/");
    clickLink("https://github.com/eph5xx", "links");
    expect(captureMock).toHaveBeenCalledWith("outbound_link_clicked", {
      url: "https://github.com/eph5xx",
      link_text: "GitHub",
      section: "links",
    });
  });

  it("ignores internal and hash links", async () => {
    await load("/");
    clickLink("/a/tweak-idea");
    clickLink("#projects");
    expect(captureMock).not.toHaveBeenCalled();
  });
});
