import posthog from "posthog-js";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (!key) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[posthog] NEXT_PUBLIC_POSTHOG_KEY is unset; analytics disabled."
    );
  }
} else if (window.location.pathname === "/") {
  // Home page only: articles, the 404 page, and static reports send nothing.
  posthog.init(key, {
    api_host: "/_relay",
    ui_host: "https://us.posthog.com",
    defaults: "2026-01-30",
    cookieless_mode: "always",
    person_profiles: "never",
    disable_session_recording: true,
  });

  document.addEventListener("click", (event) => {
    const link = (event.target as Element | null)?.closest?.("a[href]");
    if (
      !(link instanceof HTMLAnchorElement) ||
      link.host === window.location.host
    ) {
      return;
    }
    posthog.capture("outbound_link_clicked", {
      url: link.href,
      link_text: link.textContent?.trim(),
      section: link.closest("section[id]")?.id,
    });
  });
}
