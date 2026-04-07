import type { Metadata } from "next";
import Image from "next/image";
import { SOCIAL_LINKS } from "@/lib/constants";
import { GitHubIcon } from "@/components/icons/github";
import { LinkedInIcon } from "@/components/icons/linkedin";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About | ephx.dev",
  description:
    "Aleksandr Sarantsev — software engineer. Previously Databricks (Lakebase) and Yandex Search.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      {/* Hero: photo + intro */}
      <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
        <Image
          src="/ava.jpg"
          alt="Aleksandr Sarantsev"
          width={160}
          height={160}
          className="shrink-0 rounded-2xl object-cover"
          priority
        />
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Hey, I&apos;m Aleksandr
          </h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            I love building things that actually help people. Right now
            I&apos;m searching for good problems to solve.
          </p>
        </div>
      </div>

      {/* Experience */}
      <h2 className="mt-14 text-lg font-semibold text-foreground">
        What I&apos;ve Built
      </h2>
      <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">
        <p>
          Most recently I was at{" "}
          <strong className="text-foreground">Databricks</strong> on the
          Lakebase team, building the core storage layer of a serverless
          Postgres platform &mdash; distributed infrastructure designed for
          low-latency storage at scale.
        </p>
        <p>
          Before that, I spent nearly three years at{" "}
          <strong className="text-foreground">Yandex</strong> building their
          internal search platform &mdash; a service used by hundreds of teams
          for full-text search, key-value storage, and KNN lookups.
        </p>
      </div>

      {/* Background */}
      <h2 className="mt-14 text-lg font-semibold text-foreground">
        Background
      </h2>
      <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">
        <p>
          I studied software engineering at{" "}
          <strong className="text-foreground">
            Far Eastern Federal University
          </strong> and
          later went through the{" "}
          <strong className="text-foreground">
            Yandex School of Data Analysis
          </strong>
          . During university I also founded{" "}
          <strong className="text-foreground">CODE work</strong>, a student
          volunteer organization that grew to 800+ participants.
        </p>
      </div>

      {/* This site */}
      <h2 className="mt-14 text-lg font-semibold text-foreground">
        About This Site
      </h2>
      <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">
        <p>
          ephx.dev is where I write about things that don&apos;t fit in a
          LinkedIn post. Each article is hand-crafted with its own visual
          identity &mdash; no templates, no markdown. Just React components and
          creative freedom.
        </p>
      </div>

      {/* Connect */}
      <h2 className="mt-14 text-lg font-semibold text-foreground">Connect</h2>
      <p className="mt-3 text-muted-foreground">
        Best way to reach me is LinkedIn. Always happy to chat.
      </p>
      <div className="mt-4 flex items-center gap-2">
        <Button
          variant="outline"
          nativeButton={false}
          render={
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          <GitHubIcon className="size-4" />
          GitHub
        </Button>
        <Button
          variant="outline"
          nativeButton={false}
          render={
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          <LinkedInIcon className="size-4" />
          LinkedIn
        </Button>
      </div>
    </div>
  );
}
