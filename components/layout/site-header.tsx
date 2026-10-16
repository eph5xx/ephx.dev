import Link from "next/link";
import { PROFILE } from "@/lib/constants";

export function SiteHeader() {
  return (
    <header className="flex items-center px-4 md:px-6">
      <Link
        href="/"
        className="text-foreground flex items-center gap-2.5"
        aria-label={`${PROFILE.name} — home`}
      >
        <span
          className="pulse-dot bg-success/80 text-success/80 relative inline-flex size-2 shrink-0 rounded-full"
          aria-hidden="true"
        />
        <span className="font-medium tracking-tight">{PROFILE.name}</span>
      </Link>
    </header>
  );
}
