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

Derived from confirmed facts, not yet stated by the owner in these words. Aleksandr has a background in large-scale infrastructure: the internal search platform at Yandex and the storage layer of Neon at Databricks. In 2026 Aleksandr turned to building small AI-agent tools that anyone can install with a single command or use on a live site. Most of the projects can be tried right away, so the work speaks for itself.

## Operating Context

- Visitors mostly arrive from a link: a social profile, a project README, or a shared article. Many will skim and leave quickly.
- AI agents read the same server-rendered HTML that people see. Content must be in the HTML response, not added by client-only JavaScript.
- Legacy articles (`/a/tweak-idea`, `/a/tweak-idea-v2`) stay reachable by URL. They are not listed anywhere on the site.
- Sample TweakIdea reports at `/reports/*` (airlock, mirror, giftwrap, tweak-idea-example) are linked from the TweakIdea README. These URLs must keep working.

## Capabilities and Constraints

- The site has one page (hero, About, Background, Projects, Links), plus the hidden articles and the static reports.
- It is deployed on Cloudflare Workers via OpenNext. PostHog analytics are proxied through `/_relay`.
- **The prose was rewritten on 2026-10-27.** The owner flagged the old tagline and About as untrue. The replacements use only confirmed facts. Never restore the old lines ("I love building things that actually help people", "searching for good problems to solve").
- **Current stance: building their own projects full-time** (confirmed 2026-10-27). The site does not say the owner is open to a job, looking for a cofounder, or seeking investors. Add none of those without the owner's word.
- **The site lists exactly five projects**: TweakIdea, Surf Skills, Tiebreaker, Touchless, and Fjords. The owner confirmed all five stay. Six unfinished projects (Foglight Connectivity, Biviu, Design Mascot, Foglight Agent Builder, Foglight Vibe Clustering, Foglight Jobs) were removed on 2026-10-27. Do not bring them back until the owner says they are done.
- Project links go out to each project's repo or live site. Projects get no pages on this site. A project with no public link is listed without one.

### Confirmed by the owner over repo evidence

The owner confirmed the site's descriptions and start months for these two projects (2026-10-27). Each current repo began later than the project itself, so do not "correct" the dates from commit history.

- **Fjords** (started 05.2026). The current private repo, from 2026-10, is an early MVP of a Telegram motivation-coach bot limited to two allowed users. The site's description is the owner's. The project has no public link.
- **Touchless** (started 07.2026). The current public repo is from 2026-10. It has one plugin (Vocabulary Coach), and its only release is an unpublished draft, so visitors can only build it from source. It has no license file.


## Brand Commitments

- Name: Aleksandr Sarantsev. Domain: ephx.dev. Handle: `eph5xx` on GitHub, LinkedIn, and X.
- Voice: minimal. Short, plain, first-person lines that state facts and leave the lists to do the talking. No enthusiasm words, no mission statements. Chosen by the owner on 2026-10-27, from three drafts.

## Evidence on Hand

### Background (confirmed)

- B.S., FEFU, Software Engineering, 2018–2022
- Founder, CODE work, 800+ volunteers, 2021–2022
- SWE, Yandex, Search as a Service, 2022–2025
- Student, YSDA (Yandex School of Data Analysis), Machine Learning, 2023–2024
- SWE, Databricks, Neon Storage, 2025–2026

### Projects (repo state verified 2026-10-27; start months confirmed by the owner)

| Project | What it is | State | How to try | Link | Started |
|---|---|---|---|---|---|
| TweakIdea | Agent skill that researches a startup idea and scores it 1–5 across 14 dimensions, with a GO / PIVOT / STOP verdict and an HTML report. Works in Claude Code, Codex, and Cursor. | Shipped. 11 releases, v3.0.1 on npm. 55 stars, MIT. | `npx skills add eph5xx/tweakidea` | github.com/eph5xx/tweakidea | 04.2026 |
| Surf Skills | Curated directory of open-source AI agent skills, each with a preview video of its output. | Live, free. About 41 skills in 26 collections. MIT (logos and screenshots excluded). | Visit the site | surfskills.surf | 06.2026 |
| Tiebreaker | Claude Code skill that settles a decision with a weighted scoring matrix. | Usable. No releases. 2 stars, MIT. | `npx skills add eph5xx/tiebreaker` | github.com/eph5xx/tiebreaker | 07.2026 |
| Touchless | macOS menu-bar voice-to-text app (ElevenLabs or local Whisper) with a plugin system; one plugin so far. | Working but rough. No public release. No license. | Build from source | github.com/eph5xx/touchless | 07.2026 |
| Fjords | AI cofounder (owner's description). The current repo is a Telegram motivation-coach bot. | Private early MVP | Not possible | None public | 05.2026 |

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
