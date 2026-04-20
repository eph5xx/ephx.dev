import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { SaveRequestSchema, type SaveRequest } from "@/lib/tweakidea/schema";

export const dynamic = "force-dynamic";

const ID_REGEX = /^[A-Za-z0-9_-]{16,32}$/;

export const metadata: Metadata = {
  title: "Saved walkthrough",
  description: "A saved Tweak Idea walkthrough.",
  robots: { index: false, follow: false },
};

async function loadSave(id: string): Promise<SaveRequest | null> {
  if (!ID_REGEX.test(id)) return null;
  const { env } = getCloudflareContext();
  const raw = await env.TWEAKIDEA_KV.get(id);
  if (raw === null) return null;
  try {
    const json = JSON.parse(raw);
    const parsed = SaveRequestSchema.safeParse(json);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  market: "Market",
  "user-behavior": "User behavior",
  "technical-feasibility": "Technical feasibility",
  "willingness-to-pay": "Willingness to pay",
  competition: "Competition",
  "founder-fit": "Founder fit",
};

const SKILL_LABELS: Record<string, string> = {
  technical: "Technical",
  product: "Product",
  sales: "Sales",
  design: "Design",
  research: "Research",
  ops: "Ops",
  other: "Other",
};

const COMMITMENT_LABELS: Record<string, string> = {
  "full-time": "Full-time",
  "nights-weekends": "Nights & weekends",
  researching: "Still researching",
};

export default async function SavedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const save = await loadSave(id);
  if (!save) notFound();

  const keptAssumptions = save.assumptions.filter((a) => a.keep);

  return (
    <article className="mx-auto max-w-3xl px-4 pt-12 pb-24 md:px-6">
      <div className="mb-8 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Saved walkthrough · {id.slice(0, 8)}
      </div>

      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
        Your Tweak Idea walkthrough
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Read-only snapshot. Feed it into the Tweak Idea CLI to run the full
        14-dimension evaluation.
      </p>

      {/* Raw idea */}
      <section className="mt-12">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          The raw idea
        </h2>
        <p className="whitespace-pre-wrap text-lg leading-relaxed">
          {save.idea_raw}
        </p>
      </section>

      {/* Problem / Solution */}
      <section className="mt-12 space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Problem & solution
        </h2>
        <div className="rounded-lg border-l-2 border-rose-400/60 bg-rose-500/4 py-4 pl-5 pr-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-rose-400/80">
            Problem
          </div>
          <p className="text-lg leading-relaxed">{save.extraction.problem}</p>
        </div>
        <div className="rounded-lg border-l-2 border-emerald-400/60 bg-emerald-500/4 py-4 pl-5 pr-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-400/80">
            Solution
          </div>
          <p className="text-lg leading-relaxed">{save.extraction.solution}</p>
        </div>
      </section>

      {/* Assumptions */}
      <section className="mt-12">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Assumptions ({keptAssumptions.length} kept, {save.assumptions.length - keptAssumptions.length} dropped)
        </h2>
        <ul className="divide-y divide-border/60">
          {save.assumptions.map((a) => (
            <li
              key={a.id}
              className={`flex items-start gap-3 py-3 ${
                a.keep ? "" : "opacity-40"
              }`}
            >
              <span
                className={`mt-1 inline-flex h-4 w-4 flex-none items-center justify-center rounded-sm border text-[10px] ${
                  a.keep
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border"
                }`}
                aria-hidden="true"
              >
                {a.keep ? "✓" : ""}
              </span>
              <div className="flex-1">
                <div className={`text-base leading-relaxed ${a.keep ? "" : "line-through"}`}>
                  {a.text}
                </div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {CATEGORY_LABELS[a.category] ?? a.category}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Founder */}
      <section className="mt-12">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Founder profile
        </h2>
        <dl className="divide-y divide-border/60">
          <div className="grid grid-cols-[140px_1fr] gap-4 py-3">
            <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Background
            </dt>
            <dd className="whitespace-pre-wrap text-base leading-relaxed">
              {save.founder.background}
            </dd>
          </div>
          <div className="grid grid-cols-[140px_1fr] gap-4 py-3">
            <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Primary skill
            </dt>
            <dd className="text-base">
              {SKILL_LABELS[save.founder.primary_skill] ?? save.founder.primary_skill}
            </dd>
          </div>
          <div className="grid grid-cols-[140px_1fr] gap-4 py-3">
            <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Commitment
            </dt>
            <dd className="text-base">
              {COMMITMENT_LABELS[save.founder.commitment] ?? save.founder.commitment}
            </dd>
          </div>
        </dl>
      </section>

      {/* Fit Q&A */}
      {save.founder_fit_answers && save.founder_fit_answers.length > 0 && (
        <section className="mt-12 space-y-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Founder-fit answers
          </h2>
          {save.founder_fit_answers.map((qa) => (
            <div key={qa.question_id}>
              <blockquote className="border-l-2 border-accent/60 pl-4 text-base italic text-foreground/90">
                {qa.question}
              </blockquote>
              <p className="mt-3 whitespace-pre-wrap text-lg leading-relaxed">
                {qa.answer}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* Install CTA */}
      <section className="mt-16 rounded-xl border border-accent/30 bg-accent/4 p-6 md:p-8">
        <h2 className="text-xl font-semibold">Run the full evaluation</h2>
        <p className="mt-2 text-muted-foreground">
          Install Tweak Idea and feed this saved walkthrough into the CLI to get
          a complete 14-dimension scored report.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-md bg-muted px-4 py-3">
          <code className="font-mono text-sm">npx tweakidea</code>
        </pre>
        <p className="mt-4 text-sm text-muted-foreground">
          Learn more about how Tweak Idea works in{" "}
          <Link
            href="/a/tweak-idea-v2"
            className="text-accent underline underline-offset-4 transition-colors hover:text-foreground"
          >
            the latest article
          </Link>
          .
        </p>
      </section>
    </article>
  );
}
