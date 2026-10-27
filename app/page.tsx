import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { CopyCommand } from "@/components/home/copy-command";
import { HoverList } from "@/components/home/hover-list";
import { ListRow } from "@/components/home/list-row";
import { Section } from "@/components/home/section";
import { LINKS, PROFILE, PROJECTS, SOCIAL } from "@/lib/constants";

export const metadata: Metadata = {
  title: { absolute: PROFILE.name },
  description: PROFILE.description,
};

const proseLink =
  "text-foreground decoration-foreground/30 hover:decoration-foreground underline underline-offset-4 transition-colors";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12 px-4 md:px-6">
      <section
        className="reveal flex items-start gap-5"
        style={{ "--i": 0 } as React.CSSProperties}
      >
        <Image
          src={PROFILE.avatar}
          alt={PROFILE.name}
          width={160}
          height={160}
          priority
          className="ring-border size-16 shrink-0 rounded-full object-cover ring-1 md:size-20"
        />
        <div className="flex flex-col gap-1.5">
          <h1 className="text-foreground text-lg font-semibold tracking-tight md:text-xl">
            {PROFILE.name}
          </h1>
          <p className="text-body text-base leading-relaxed text-pretty">
            {PROFILE.tagline}
          </p>
          <a
            href="#projects"
            className="text-muted-foreground hover:text-foreground mt-1 inline-flex items-center gap-1 self-start text-sm transition-colors"
          >
            Three you can try in a minute
            <ArrowDown className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </section>

      <Section title="Projects" id="projects">
        <HoverList className="gap-1.5">
          {PROJECTS.map((project, i) => (
            <ListRow
              key={project.name}
              index={i}
              href={project.url}
              title={project.name}
              detail={<>&mdash; {project.description}</>}
              meta={project.date}
              sub={
                <span className="flex flex-wrap items-baseline gap-x-3">
                  {project.install ? (
                    <CopyCommand command={project.install} />
                  ) : (
                    <span>{project.note}</span>
                  )}
                  {project.proof && <span>{project.proof}</span>}
                </span>
              }
            />
          ))}
        </HoverList>
      </Section>

      <Section title="About" id="about">
        <div className="text-body flex flex-col gap-4 text-base leading-relaxed text-pretty">
          <p>
            I&rsquo;m building my own projects full-time for now. Still happy to
            talk about building something together or a good opportunity.
            Message me on{" "}
            <a
              href={SOCIAL.x.href}
              target="_blank"
              rel="noopener noreferrer"
              className={proseLink}
            >
              X
            </a>{" "}
            or{" "}
            <a
              href={SOCIAL.linkedin.href}
              target="_blank"
              rel="noopener noreferrer"
              className={proseLink}
            >
              LinkedIn
            </a>
            .
          </p>
        </div>
      </Section>

      <Section title="Background" id="background">
        <div className="text-body flex flex-col gap-4 text-base leading-relaxed text-pretty">
          <p>
            I was a software engineer on Neon storage at{" "}
            <strong className="text-foreground font-medium">Databricks</strong>,
            and on the search platform at{" "}
            <strong className="text-foreground font-medium">Yandex</strong>{" "}
            before that. Earlier I founded{" "}
            <strong className="text-foreground font-medium whitespace-nowrap">
              CODE work
            </strong>
            , a volunteer group of 800+.
          </p>
          <p>
            I studied software engineering at Far Eastern Federal University and
            machine learning at the Yandex School of Data Analysis.
          </p>
        </div>
      </Section>

      <Section title="Links" id="links">
        <p className="text-body text-base leading-relaxed text-pretty">
          Follow on X or LinkedIn to see each new tool when it ships.
        </p>
        <HoverList>
          {LINKS.map((link, i) => (
            <ListRow
              key={link.href}
              index={i}
              href={link.href}
              title={
                <>
                  <span className="text-muted-foreground">{link.prefix}</span>
                  {link.handle}
                </>
              }
            />
          ))}
        </HoverList>
      </Section>
    </div>
  );
}
