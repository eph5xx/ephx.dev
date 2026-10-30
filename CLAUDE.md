# ephx.dev

Personal website with a single-column home page (hero, About, Projects, Background, Links). Legacy articles are hand-crafted React pages (not markdown/CMS) that stay reachable at `/a/[slug]` but are not listed anywhere on the site.

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
- **System theme** — follows the system light/dark setting via `prefers-color-scheme`, with the light palette in `:root` and the dark palette in a media query
- Each article = custom React component (no markdown, no MDX, no CMS)
- Mobile-responsive required
- One `max-w-3xl` column for every page (home, articles, footer); blocks inside it use `px-4 md:px-6`. No site header: pages start with their own content
- **Analytics** — PostHog, home page (`/`) only, no cookies or browser storage (memory persistence); location from PostHog GeoIP via the IP forwarded by `/_relay`. Set up in `instrumentation-client.ts` (pageviews, autocapture, `outbound_link_clicked`) and sent through the `/_relay` proxy. `next build` fails without `NEXT_PUBLIC_POSTHOG_KEY`
- Fonts: IBM Plex Sans (`font-sans`) for text and IBM Plex Mono (`font-mono`) for code, dates, labels, and addresses, both via `next/font/google` (self-hosted at build time)

## Project Structure

```
open-next.config.ts   OpenNext configuration (incremental cache, cache interception)
wrangler.jsonc        Cloudflare Workers config (entry point, assets, compat flags)
instrumentation-client.ts  PostHog init (home page only, memory persistence) + outbound link event
app/
  layout.tsx            Root layout: fonts, system theme, max-w-3xl column, SiteFooter
  fonts.ts              IBM Plex Sans + IBM Plex Mono (next/font/google)
  page.tsx              Home page: hero, About, Projects, Background, Links
  globals.css           Tailwind v4 CSS-first config (@theme), OKLCH palette, .reveal animation
  a/[slug]/page.tsx     Article route: generateStaticParams + generateMetadata
  not-found.tsx         404
  sitemap.ts            Dynamic sitemap (home + articles)
components/
  layout/               site-footer
  home/                 section, hover-list (sliding highlight), project-row, list-row
  articles/             article-header, reading-progress
  articles/content/     Per-article content components (one .tsx per article)
  ui/                   shadcn/ui + Magic UI components (button, sheet, etc.)
  icons/                github SVG icon
  providers/            motion-provider (LazyMotion wrapper)
lib/
  articles.ts           Article registry + content loader map — SINGLE SOURCE OF TRUTH
  constants.ts          SITE_NAME + home page data: PROFILE, PROJECTS, SOCIAL, LINKS
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

That's it. Routing (`/a/my-slug`), metadata, OG tags, and sitemap derive from the registry automatically. Articles are not listed on the home page.

## Updating Home Page Content

- Projects (oldest first; each shows its URL) and Links: edit the arrays in `lib/constants.ts`
- Tagline and description: `PROFILE` in `lib/constants.ts`
- About and Background paragraphs: hand-written JSX in `app/page.tsx`

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
| next 16.4.x | Framework (standalone mode via OpenNext) |
| react 19.1.x | UI rendering |
| tailwindcss v4 | Styling (CSS-first @theme config, OKLCH colors) |
| motion ^12.38 | Animation engine (`motion/react`, `motion/react-m`) |
| shadcn ^4.1 | Component CLI (style: base-nova) |
| @base-ui/react | Headless primitives (used by shadcn base-nova components) |
| clsx + tailwind-merge | `cn()` utility for conditional class merging |
| class-variance-authority | Typed component variants (cva) |
| tw-animate-css | CSS animation utilities |
| lucide-react | Icons |
| IBM Plex Sans + Mono | Text and mono typography (`next/font/google`, self-hosted at build time, OFL-1.1) |
| @opennextjs/cloudflare | Cloudflare Workers adapter for Next.js |

## Conventions

- **Imports**: use `@/` path alias (maps to project root)
- **Animation**: import from `motion/react` or `motion/react-m` — never `framer-motion`
- **Styling**: Tailwind utility classes only; use `cn()` for conditional/merged classes
- **Metadata**: every page.tsx exports `metadata` or `generateMetadata` for SEO + OG tags
- **Formatting**: Prettier with tailwindcss plugin — double quotes, semicolons, 2-space indent, trailing commas (es5)
