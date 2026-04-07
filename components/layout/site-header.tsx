"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { SITE_NAME, NAV_ITEMS, SOCIAL_LINKS } from "@/lib/constants"
import { GitHubIcon } from "@/components/icons/github"
import { LinkedInIcon } from "@/components/icons/linkedin"
import { MobileNav } from "@/components/layout/mobile-nav"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 md:px-6">
        {/* Left: Site name */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground"
        >
          <img
            src="/logo-gradient.svg"
            alt=""
            aria-hidden="true"
            width={48}
            height={48}
            className="size-12"
          />
          {SITE_NAME}
        </Link>

        {/* Right: Desktop nav (hidden below md) */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm transition-colors",
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
          >
            <GitHubIcon className="size-[18px]" />
            <span className="sr-only">GitHub</span>
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
          >
            <LinkedInIcon className="size-[18px]" />
            <span className="sr-only">LinkedIn</span>
          </a>
        </nav>

        {/* Right: Mobile nav (hidden at md+) */}
        <MobileNav />
      </div>
    </header>
  )
}
