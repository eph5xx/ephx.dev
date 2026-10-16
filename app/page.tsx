import type { Metadata } from "next";
import Image from "next/image";
import { HoverList } from "@/components/home/hover-list";
import { ListRow } from "@/components/home/list-row";
import { Section } from "@/components/home/section";
import { BACKGROUND, LINKS, PROFILE, PROJECTS } from "@/lib/constants";

export const metadata: Metadata = {
  title: { absolute: PROFILE.name },
  description: PROFILE.description,
};

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
        </div>
      </section>

      <Section title="About" id="about">
        <div className="text-body flex flex-col gap-4 text-base leading-relaxed text-pretty">
          <p>
            Most recently I worked on the core storage layer of a serverless
            Postgres platform at{" "}
            <strong className="text-foreground font-medium">Databricks</strong>.
            Before that I spent nearly three years building the internal search
            platform at{" "}
            <strong className="text-foreground font-medium">Yandex</strong>.
          </p>
          <p>Right now I&apos;m searching for good problems to solve.</p>
        </div>
      </Section>

      <Section title="Background" id="background">
        <HoverList>
          {BACKGROUND.map((item, i) => (
            <ListRow
              key={`${item.role}-${item.company}`}
              index={i}
              href={item.url}
              title={item.role}
              detail={
                <>
                  &middot; {item.company} &middot; {item.focus}
                </>
              }
              meta={item.period}
            />
          ))}
        </HoverList>
      </Section>

      <Section title="Projects" id="projects">
        <HoverList>
          {PROJECTS.map((project, i) => (
            <ListRow
              key={project.name}
              index={i}
              href={project.url}
              title={project.name}
              detail={<>&mdash; {project.description}</>}
              hideDetailOnMobile
              meta={project.date}
            />
          ))}
        </HoverList>
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
