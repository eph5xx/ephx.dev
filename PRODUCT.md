# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Five audiences, all confirmed by the owner, none ranked above the others:

- **Hiring teams**: recruiters and engineering managers sizing Aleksandr up for a role.
- **Cofounders and collaborators**: people deciding whether to build something together.
- **Investors**: people judging Aleksandr as a founder.
- **Fellow engineers**: peers arriving from GitHub, X, LinkedIn, or a project README (the TweakIdea README links to this site's sample reports).
- **AI agents**: agents reading the site on someone's behalf. They get the same page as humans; no separate machine-readable profile is planned.

## Product Purpose

The personal site of Aleksandr Sarantsev at ephx.dev. A visit succeeds when the visitor does one of three things:

1. **Follows** Aleksandr on GitHub, LinkedIn, or X.
2. **Gets in touch** through social DMs (X or LinkedIn). There is no email and no contact form, by choice.
3. **Tries a project**. Each project links out to its repo or live site.

## Positioning

Derived from confirmed facts, not yet stated by the owner in these words. Aleksandr has a background in large-scale infrastructure: the internal search platform at Yandex and the storage layer of Neon at Databricks. In 2026 Aleksandr turned to building small AI-agent tools that anyone can install with a single command or use on a live site. Most of the projects can be tried right away, so the work speaks for itself. The hero names no past employers: the owner does not want to be framed by where they used to work (owner, 2026-10-27). Employers appear only in Background.

## Operating Context

- Visitors mostly arrive from a link: a social profile, a project README, or a shared article. Many will skim and leave quickly.
- AI agents read the same server-rendered HTML that people see. Content must be in the HTML response, not added by client-only JavaScript.
- Legacy articles (`/a/tweak-idea`, `/a/tweak-idea-v2`) stay reachable by URL. They are not listed anywhere on the site.
- Sample TweakIdea reports at `/reports/*` (airlock, mirror, giftwrap, tweak-idea-example) are linked from the TweakIdea README. These URLs must keep working.

## Capabilities and Constraints

- The site has one page (hero, About, Projects, Background, Links), plus the hidden articles and the static reports. About sits above Projects (owner, 2026-10-27).
- **Each project row is two lines**: name and description, then start month and the way in. The way in is the address the row opens (repo, live site, or bot), styled as a link. No install commands on the site (owner, 2026-10-27). No status notes like "Build from source" or "Private for now", and no star counts or other numbers that drift (owner, 2026-10-27). Projects are ordered oldest first by start month (owner, 2026-10-27).
- **Background is a short paragraph**, not a list, with no acronyms (owner, 2026-10-27). Its entities (Yandex, Databricks, CODE work, and both schools) are semibold. The owner chose the work line: "I worked on search infrastructure at Yandex and on Neon storage at Databricks." The FEFU line names the bachelor's degree.
- It is deployed on Cloudflare Workers via OpenNext. PostHog analytics run on the home page only, in cookieless mode (no cookies or browser storage), and are proxied through `/_relay`.
- **The prose was rewritten on 2026-10-27.** The owner flagged the old tagline and About as untrue. The replacements use only confirmed facts. Never restore the old lines ("I love building things that actually help people", "searching for good problems to solve").
- **Current stance: building their own projects full-time for the next couple of months** (confirmed 2026-10-27). The owner is happy to talk about building something together or a good opportunity, and the About section says so. The owner is not taking paid work right now. The site does not say the owner is seeking investors. Add nothing beyond this without the owner's word.
- **The Links section holds only the links**, with no sentence above them (owner, 2026-10-27). The owner posts each launch on X and LinkedIn; if a follow line ever returns, don't promise anything the feed doesn't deliver (weekly updates, tutorials).
- **The site lists exactly five projects**: TweakIdea, Surf Skills, Tiebreaker, Touchless, and Fjords. The owner confirmed all five stay. Six unfinished projects (Foglight Connectivity, Biviu, Design Mascot, Foglight Agent Builder, Foglight Vibe Clustering, Foglight Jobs) were removed on 2026-10-27. Do not bring them back until the owner says they are done.
- Project links go out to each project's repo, live site, or bot. Projects get no pages on this site.

### Confirmed by the owner over repo evidence

The owner confirmed the site's descriptions and start months for these two projects (2026-10-27), and wrote all five project descriptions on the site. Each current repo began later than the project itself, so do not "correct" the dates from commit history.

- **Fjords** (started 05.2026). An agent that helps you achieve your goals, running as the Telegram bot t.me/fjordsgoalbot. The owner says it is not private. The repo (private, from 2026-10) still lets only listed users in and sends everyone else to a waitlist. The hero says "Try any of them in a minute" (owner's wording, 2026-10-27).
- **Touchless** (started 07.2026). The current public repo is from 2026-10. It has one plugin (Vocabulary Coach), and its only release is an unpublished draft, so visitors can only build it from source. The site does not say so; it shows the repo address. It has no license file. The site's description is "macOS voice-to-text app, plugin-friendly" (owner, 2026-10-27).


## Brand Commitments

- Name: Aleksandr Sarantsev. Domain: ephx.dev. Handle: `eph5xx` on GitHub, LinkedIn, and X.
- Voice: minimal. Short, plain, first-person lines that state facts and leave the lists to do the talking. No enthusiasm words, no mission statements. Chosen by the owner on 2026-10-27, from three drafts.

## Evidence on Hand

### Background (confirmed)

- B.S., FEFU, Software Engineering, 2018–2022
- Founder, CODE work, a student volunteer organization with 800+ participants, 2021–2022
- SWE, Yandex, Search as a Service, 2022–2025: internal search and database (DBaaS) infrastructure, per the owner's profile notes
- Student, YSDA (Yandex School of Data Analysis), Big Data Infrastructure, 2023–2024 (not Machine Learning; corrected by the owner on 2026-10-27)
- SWE, Databricks, Neon Storage, 2025–2026

### Projects (repo state verified 2026-10-27; start months confirmed by the owner)

| Project | What it is | State | How to try | Link | Started |
|---|---|---|---|---|---|
| TweakIdea | Agent skill that researches a startup idea and scores it 1–5 across 14 dimensions, with a GO / PIVOT / STOP verdict and an HTML report. Works in Claude Code, Codex, and Cursor. | Shipped. 11 releases, v3.0.1 on npm. 55 stars, MIT. | `npx skills add eph5xx/tweakidea` | github.com/eph5xx/tweakidea | 04.2026 |
| Surf Skills | Curated directory of open-source AI agent skills, each with a preview video of its output. | Live, free. About 41 skills in 26 collections. MIT (logos and screenshots excluded). | Visit the site | surfskills.surf | 06.2026 |
| Tiebreaker | Claude Code skill that settles a decision with a weighted scoring matrix. | Usable. No releases. 2 stars, MIT. | `npx skills add eph5xx/tiebreaker` | github.com/eph5xx/tiebreaker | 07.2026 |
| Touchless | macOS menu-bar voice-to-text app (ElevenLabs or local Whisper) with a plugin system; one plugin so far. | Working but rough. No public release. No license. | Build from source | github.com/eph5xx/touchless | 07.2026 |
| Fjords | Agent that helps you achieve your goals (owner's description). Runs as a Telegram bot. | Early MVP; repo admits listed users, others get a waitlist | Open the bot | t.me/fjordsgoalbot | 05.2026 |

### Proof assets

- Avatar: `public/ava.jpg`. Default OG image: `public/og-default.png`.
- Logos: `public/logo-ghost.svg` and `public/logo-gradient.svg`. Neither is used in the app code yet.
- TweakIdea sample reports: `public/reports/*.html`. Screenshot `assets/report.png` in the TweakIdea repo.
- Surf Skills demo video embedded in its README. Per-skill videos are hosted at media.surfskills.surf.
- Worked examples in the Tiebreaker repo: `examples/laptop-column-web.md` and `examples/job-offer-reasoning.md`.
- Two legacy articles about TweakIdea.

### Not on hand

None of these exist, and none may be invented:

- testimonials
- press
- user counts
- revenue
- employer endorsements
- a public email address

## Product Principles

1. **Only true claims.** Every line must be backed by a fact the owner confirmed or a repo can show. If something isn't verified, leave it out.
2. **Every visit should be able to end in one of the three actions:** follow, DM, or try a project.
3. **Show what exists.** Point to live sites, install commands, and repos rather than describing ambitions.
4. **One page serves people and agents.** Semantic, server-rendered content that is useful without scripts or interaction.
5. **Old links keep working.** Article and report URLs that other places link to keep working.
