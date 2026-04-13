# ephx.dev — Worker Setup for /tweakidea milestone

**Who runs this:** you (the human operator). Not Claude, not CI, not any
automation. This document exists because the `/tweakidea` milestone's
secrets workflow is intentionally manual — Claude writes the code, you
provision the secrets. Run every step in this file once per environment
(dev, staging, production).

**Time:** 15–20 minutes including account signups.

**Prerequisites:**

- **Cloudflare account — Workers Free plan is sufficient.** All three features we use run on Free:
  - Workers KV binding: 100k reads/day, 1k writes/day, 1 GB storage
  - Workers Rate Limiting binding (`ratelimits` in `wrangler.jsonc`, GA since 2025-09-19): free, in-process counter with no billing surface
  - AI Gateway (independent product): free tier includes authenticated mode, 10 gateways/account, **100k cumulative logs** (not monthly — disable request-body logging on the gateway to stay under the cap indefinitely, see §2 below)
- Anthropic API account (`console.anthropic.com`) — Anthropic charges per token, unrelated to Cloudflare
- PostHog Cloud account (`app.posthog.com`, free tier works)
- This repo cloned and `npm install` already run
- `npx wrangler whoami` shows you logged in to the right Cloudflare account

---

## 1. Create the KV namespace

The ephemeral bundle store (`TWEAKIDEA_KV`) holds generated survey bundles
under a 24h TTL. It must be created once per environment.

```bash
npx wrangler kv namespace create TWEAKIDEA_KV
```

Copy the `id` printed by the command and paste it into `wrangler.jsonc`,
replacing the `REPLACE_WITH_KV_NAMESPACE_ID` placeholder:

```jsonc
"kv_namespaces": [
  {
    "binding": "TWEAKIDEA_KV",
    "id": "<paste the id here>"
  }
]
```

---

## 2. Create the AI Gateway

The milestone routes Anthropic calls through Cloudflare AI Gateway in
authenticated mode for observability, rate limits, and caching control.

1. Open <https://dash.cloudflare.com/> → **AI** → **AI Gateway** → **Create Gateway**
2. Name it **`tweakidea`** (must match `wrangler.jsonc` vars.AI_GATEWAY_NAME exactly)
3. In the new gateway's **Settings** tab, toggle **Authenticated Gateway** ON
4. Click **Create Token** (scope: read + run), copy the token — you'll paste it
   into `wrangler secret put AI_GATEWAY_TOKEN` below
5. Note your **Cloudflare Account ID** from the right sidebar of the dashboard —
   paste it into `wrangler.jsonc` replacing `REPLACE_WITH_CLOUDFLARE_ACCOUNT_ID`

**Important (PITFALLS.md §Pitfall 5):** at gateway creation time, go to
**Settings** → **Caching** and set **Cache TTL** to **0** (or disable caching
entirely). The milestone also sets `cf-aig-skip-cache: true` as a default header
in `lib/tweakidea/ai-gateway.ts`, but disabling at the gateway layer is belt-and-suspenders.

Also **disable request/response body logging** on this gateway — AI Gateway
logs request bodies by default, and our request bodies contain user idea
text (API-12 requires this to never persist). Go to **Settings** → **Logging**
and toggle body logging OFF. This double-dip also keeps you under the Free
tier's **100k cumulative log cap** (it's not a monthly reset — once full,
you'd need to delete old logs or upgrade).

---

## 3. Create the PostHog project

1. Go to <https://app.posthog.com/signup> (or log in if you have an account)
2. Create a new project named **ephx.dev** (any name works; this is cosmetic)
3. From **Project Settings** → **Project API Key**, copy the `phc_...` key
4. Paste it into `.env.local` (local dev) or `.env.production` (prod build)
   under `NEXT_PUBLIC_POSTHOG_KEY`. **Do NOT put it in `wrangler.jsonc` vars.**
   Next.js inlines `NEXT_PUBLIC_*` at `next build` time from `.env*` files
   or shell — wrangler runtime env never reaches the client bundle.
   ```bash
   cp .env.example .env.local
   # Edit .env.local and paste your phc_... key into NEXT_PUBLIC_POSTHOG_KEY=
   ```
   Both `.env.local` and `.env.production` are gitignored (the `.env*` pattern
   with a `!.env.example` negation); only `.env.example` ships with the repo.
5. Under **Project Settings** → **Recordings**, confirm **Session Recording**
   is OFF (it should be by default). This is the D-19 / ANLY-03 privacy invariant.
6. You'll also use this same key as `POSTHOG_API_KEY` in step 5 (server-side
   secret — rotated independently from the client ingest key). The server
   secret goes through `wrangler secret put`; the client key goes through `.env.*`.

---

## 4. Create the Anthropic API key

1. Go to <https://console.anthropic.com/settings/keys>
2. Click **Create Key**, name it `ephx-dev-tweakidea` (or similar)
3. Copy the `sk-ant-...` key — you'll paste it into `wrangler secret put ANTHROPIC_API_KEY` below
4. Store it in your password manager — once you leave the dashboard, you cannot view it again

---

## 5. Set production secrets via `wrangler secret put`

Run these three commands one at a time. Each will prompt you to paste the secret
value; paste the value from the corresponding step above and press Enter.

**Do not share these values with anyone, including AI assistants.**

```bash
# From step 4 above
npx wrangler secret put ANTHROPIC_API_KEY

# From step 2 above (the "Create Token" output)
npx wrangler secret put AI_GATEWAY_TOKEN

# From step 3 above (same value as NEXT_PUBLIC_POSTHOG_KEY)
npx wrangler secret put POSTHOG_API_KEY
```

Verify they're set:

```bash
npx wrangler secret list
```

You should see all three names listed. Wrangler never shows values — only names.

---

## 6. Set up local development secrets

For `wrangler dev` / `npm run preview`, Wrangler reads secrets from a local
`.dev.vars` file (which is gitignored — never commit it).

```bash
cp .dev.vars.example .dev.vars
# Edit .dev.vars and fill in the real values from steps 2–4 above.
```

`.dev.vars` format is identical to `.env`:

```dotenv
ANTHROPIC_API_KEY="sk-ant-..."
AI_GATEWAY_TOKEN="..."
POSTHOG_API_KEY="phc_..."
```

Confirm `.dev.vars` is gitignored:

```bash
git check-ignore .dev.vars
# Should print `.dev.vars` and exit 0.
```

---

## 7. Verify the setup end-to-end

Run wrangler's dry-run deploy. It validates that every secret listed in
`wrangler.jsonc` `secrets.required` is actually set, that every binding
resolves, and that the Worker compiles.

```bash
npx wrangler deploy --dry-run
```

Expected output:

- Zero `MISSING` warnings about secrets
- `Total Upload: ... Worker Startup Time: ...`
- `Your worker has access to the following bindings:`
  - `ASSETS` (static assets)
  - `TWEAKIDEA_KV` (KV namespace)
  - `TWEAKIDEA_LLM_RATE_LIMIT` (rate limiter — pre-declared for Phase 4)

If you see `MISSING`, re-run the corresponding `wrangler secret put` command.

### Final local smoke test

```bash
npx wrangler types --env-interface CloudflareEnv
npx vitest run
npm run lint
npm run build
```

All four commands should exit 0. `wrangler types` regenerates
`worker-configuration.d.ts` from `wrangler.jsonc` — commit the regenerated
file if it differs (which it will after step 1 above pastes the real KV id).

---

## 8. Values to fill

Two files hold the operator-provisioned config. After completing all steps,
both should have NO `REPLACE_WITH_*` placeholders left.

### `wrangler.jsonc` — Worker runtime config

| Placeholder | Where it comes from | Step |
|---|---|---|
| `REPLACE_WITH_KV_NAMESPACE_ID` | `wrangler kv namespace create` output | 1 |
| `REPLACE_WITH_CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard sidebar | 2 |

```bash
grep REPLACE_WITH wrangler.jsonc
# Should return 0 lines.
```

### `.env.local` / `.env.production` — Next.js build-time inlines

`NEXT_PUBLIC_*` variables are consumed by `next build`, NOT by the Worker
runtime. They must live in `.env*` files (or the shell environment) because
Next.js inlines them into the client bundle at build time.

| Variable | Where it comes from | Step |
|---|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog Project Settings | 3 |
| `NEXT_PUBLIC_POSTHOG_HOST` | Usually `https://us.i.posthog.com` (default) | 3 |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | **Leave blank** — Phase 4 fills it | (Phase 4) |

```bash
cp .env.example .env.local         # local dev
cp .env.example .env.production    # production build
# Edit both files with your real values.
```

Verify build-time inlining:

```bash
npm run build
grep -r "phc_" .open-next/assets/_next/static/chunks/ 2>/dev/null | head -3
# Should print at least one match — your NEXT_PUBLIC_POSTHOG_KEY is inlined.
# Zero matches = key is empty; PostHogProvider will early-return and warn in dev.
```

---

## Security notes

- **Never commit `.dev.vars`.** It's in `.gitignore`; verify before every commit:
  `git status | grep -q '\.dev\.vars' && echo "STOP — do not commit"`
- **Never share secrets with any AI assistant.** Claude/GPT/etc. are specifically
  forbidden from requesting or handling production secret values in this workflow.
- **Rotate secrets if they leak.** Anthropic: dashboard → revoke + new. PostHog:
  Project Settings → regenerate. AI Gateway: dashboard → create new token, update
  via `wrangler secret put`, old token auto-invalidates when you revoke in dashboard.
- **`worker-configuration.d.ts` contains zero secret values** — only type declarations
  (e.g. `ANTHROPIC_API_KEY: string`). Safe to commit.
- **Cloudflare Account ID is NOT a secret** — it's in every dashboard URL and
  safe to commit in `wrangler.jsonc vars`. Don't confuse it with the Account API Token.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `wrangler deploy --dry-run` says `MISSING: ANTHROPIC_API_KEY` | Secret wasn't set, or set on a different Cloudflare account | Re-run `wrangler secret put ANTHROPIC_API_KEY` after `wrangler whoami` confirms correct account |
| `lib/env.ts` throws `Required secret 'POSTHOG_API_KEY' is missing` at runtime | `.dev.vars` not populated, or running in prod without `wrangler secret put` | Populate `.dev.vars` (dev) or run `wrangler secret put POSTHOG_API_KEY` (prod) |
| `wrangler types` fails with "invalid KV namespace id" | `wrangler.jsonc` still contains `REPLACE_WITH_KV_NAMESPACE_ID` | Run step 1 and paste the real id |
| Browser console warns `[PostHogProvider] NEXT_PUBLIC_POSTHOG_KEY is unset` | Key missing from `.env.local`/`.env.production`, or `next build` ran before the file existed | Populate `.env.local` (dev) or `.env.production` (prod) and rebuild. The key is inlined at build time, not at runtime — editing the file after `next build` does nothing until you rebuild. |
| `npm run build` succeeds but grepping `.open-next/assets/_next/static/chunks/` for `phc_` returns zero matches | `NEXT_PUBLIC_POSTHOG_KEY` was not set in the shell OR `.env.production` when `next build` ran | Ensure the variable is set before `next build` — either export it in the shell or commit it to `.env.production` (gitignored) |
| Browser network tab shows `/_relay/capture` returning 500 | PostHog ingest host unreachable, or relay route not deployed | Check Cloudflare Workers logs via `wrangler tail`; verify `POSTHOG_HOST` in `wrangler.jsonc vars` matches your PostHog region (us.i.posthog.com vs eu.i.posthog.com) |
| PostHog live events feed is empty after completing a test flow | Adblocker or `/_relay` route handler not deployed | Disable adblocker to confirm the proxy is the issue; check `wrangler dev` output for any 404s on `/_relay/*` paths |

---

## What Claude does NOT do

This document is explicit about division of labor:

- **Claude writes:** source code, tests, config file shapes, type declarations, documentation
- **Operator (you) runs:** `wrangler secret put`, dashboard-based resource creation, `.dev.vars` population, rotation
- **Neither Claude nor automation:** ever sees, logs, or prints a real secret value. The fail-fast error in `lib/env.ts` names MISSING keys but never the expected value format — see `lib/env.test.ts` for the regression guard.
