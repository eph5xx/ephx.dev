# ephx.dev

Personal article website. Each article is a hand-crafted React page with unique creative content — not markdown/CMS. Companion to social media posts with detailed articles linked from social content.

## Commands

- `npm run dev` — local dev server (Turbopack)
- `npm run build` — build Next.js app (standalone)
- `npm run build:worker` — build OpenNext Cloudflare Worker
- `npm run preview` — build worker + local preview via Wrangler
- `npm run deploy` — build worker + deploy to Cloudflare Workers
- `npm run lint` — ESLint
- `npx shadcn@latest add [component]` — add shadcn/ui component
- `npx shadcn@latest add "https://magicui.design/r/[component]"` — add Magic UI component

## Constraints

- **Cloudflare Workers** via OpenNext (`output: 'standalone'` in next.config.ts)
- **Dark mode only** — `<html className="dark">` hardcoded in root layout
- Each article = custom React component (no markdown, no MDX, no CMS)
- Mobile-responsive required

## Project Structure

```
open-next.config.ts   OpenNext configuration (incremental cache, cache interception)
wrangler.jsonc        Cloudflare Workers config (entry point, assets, compat flags)
app/
  layout.tsx            Root layout: GeistSans + GeistMono fonts, dark mode, SiteHeader/SiteFooter
  page.tsx              Home page: article grid from getPublishedArticles()
  globals.css           Tailwind v4 CSS-first config (@theme), OKLCH color palette
  about/page.tsx        About page
  a/[slug]/page.tsx     Article route: generateStaticParams + generateMetadata
  not-found.tsx         Animated 404
  sitemap.ts            Dynamic sitemap from articles registry
components/
  layout/               site-header, site-footer, mobile-nav (Sheet-based)
  home/                 article-card, gradient-mesh
  articles/             article-header, reading-progress
  articles/content/     Per-article content components (one .tsx per article)
  ui/                   shadcn/ui + Magic UI components (button, sheet, etc.)
  icons/                github, linkedin SVG icons
  providers/            motion-provider (LazyMotion wrapper)
lib/
  articles.ts           Article registry + content loader map — SINGLE SOURCE OF TRUTH
  constants.ts          SITE_NAME, SOCIAL_LINKS, NAV_ITEMS
  utils.ts              cn() utility (clsx + twMerge)
```

## Adding a New Article

1. Add metadata to `articles[]` in `lib/articles.ts`:
   ```ts
   { title: "...", slug: "my-slug", description: "...", date: "2026-01-01", published: true }
   ```
2. Create `components/articles/content/my-slug.tsx` — export default component with `"use client"` directive
3. Add dynamic import to `articleContent` map in `lib/articles.ts`:
   ```ts
   "my-slug": () => import("@/components/articles/content/my-slug"),
   ```

That's it. Routing (`/a/my-slug`), metadata, OG tags, sitemap, and home page grid all derive from the registry automatically.

### Article Content Component Pattern

- `"use client"` directive required (animations need client-side rendering)
- Default export: `export default function MySlugArticle()`
- Wrap content in `<article>`, sections use `mx-auto max-w-3xl px-4 md:px-6`
- Import motion: `import * as m from "motion/react-m"` for animated elements, `import { useInView } from "motion/react"` for hooks
- Use `FadeInSection` pattern for scroll-triggered reveals (see tweak-idea.tsx for reference)
- Free to use any installed UI component creatively — each article has its own visual identity

## Tech Stack

| Package | Purpose |
|---------|---------|
| next 15.5.x | Framework (standalone mode via OpenNext) |
| react 19.1.x | UI rendering |
| tailwindcss v4 | Styling (CSS-first @theme config, OKLCH colors) |
| motion ^12.38 | Animation engine (`motion/react`, `motion/react-m`) |
| shadcn ^4.1 | Component CLI (style: base-nova) |
| @base-ui/react | Headless primitives (used by shadcn base-nova components) |
| clsx + tailwind-merge | `cn()` utility for conditional class merging |
| class-variance-authority | Typed component variants (cva) |
| tw-animate-css | CSS animation utilities |
| lucide-react | Icons |
| geist | Typography (GeistSans + GeistMono via next/font) |
| @opennextjs/cloudflare | Cloudflare Workers adapter for Next.js |

## Conventions

- **Imports**: use `@/` path alias (maps to project root)
- **Animation**: import from `motion/react` or `motion/react-m` — never `framer-motion`
- **Styling**: Tailwind utility classes only; use `cn()` for conditional/merged classes
- **Metadata**: every page.tsx exports `metadata` or `generateMetadata` for SEO + OG tags
- **Formatting**: Prettier with tailwindcss plugin — double quotes, semicolons, 2-space indent, trailing commas (es5)
