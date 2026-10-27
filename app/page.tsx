import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { HoverList } from "@/components/home/hover-list";
import { ListRow } from "@/components/home/list-row";
import { ProjectRow } from "@/components/home/project-row";
import { Section } from "@/components/home/section";
import { LINKS, PROFILE, PROJECTS, SOCIAL } from "@/lib/constants";

export const metadata: Metadata = {
  title: { absolute: PROFILE.name },
  description: PROFILE.description,
};

const entity = "text-foreground font-semibold";

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
            {PROFILE.tagline}{" "}
            <a
              href="#projects"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 whitespace-nowrap transition-colors"
            >
              Try any of them in a minute
              <ArrowDown className="size-3.5" aria-hidden="true" />
            </a>
          </p>
        </div>
      </section>

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

      <Section title="Projects" id="projects">
        <HoverList>
          {PROJECTS.map((project, i) => (
            <ProjectRow key={project.name} project={project} index={i} />
          ))}
        </HoverList>
      </Section>

      <Section title="Background" id="background">
        <div className="text-body flex flex-col gap-4 text-base leading-relaxed text-pretty">
          <p>
            I worked on search infrastructure at{" "}
            <strong className={entity}>Yandex</strong> and on Neon storage at{" "}
            <strong className={entity}>Databricks</strong>. In university I
            founded <strong className={entity}>CODE work</strong>, a student
            volunteer organization that grew to 800+ people.
          </p>
          <p>
            I have a bachelor&rsquo;s degree in software engineering from{" "}
            <strong className={entity}>Far Eastern Federal University</strong>{" "}
            and studied big data infrastructure at the{" "}
            <strong className={entity}>Yandex School of Data Analysis</strong>.
          </p>
        </div>
      </Section>

      <Section title="Links" id="links">
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
