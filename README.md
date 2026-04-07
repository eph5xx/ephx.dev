# ephx.dev

**[ephx.dev](https://ephx.dev)** -- a personal article site where each piece is a hand-crafted Next.js page with its own visual identity.

Articles are React components, not markdown poured into a template. Each one uses a mix of component libraries for unique creative effects within a shared navigation shell.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js](https://nextjs.org) 15 | Framework (static export) |
| [React](https://react.dev) 19 | UI rendering |
| [TypeScript](https://www.typescriptlang.org) 5 | Type safety |
| [Tailwind CSS](https://tailwindcss.com) 4 | Styling |
| [Motion](https://motion.dev) 12 | Animation |
| [shadcn/ui](https://ui.shadcn.com) | Base components |
| [Magic UI](https://magicui.design) | Animated effects |
| [Motion Primitives](https://motion-primitives.com) | Micro-interactions |

## Local Development

Requires Node.js 18.18+.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
```

Static output goes to `out/` for deployment to Cloudflare Pages.

## License

[MIT](LICENSE)
