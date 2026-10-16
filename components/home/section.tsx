interface SectionProps {
  title: string;
  id?: string;
  children: React.ReactNode;
}

export function Section({ title, id, children }: SectionProps) {
  return (
    <section id={id} className="flex flex-col gap-3">
      <h2 className="text-muted-foreground font-mono text-sm">{title}</h2>
      {children}
    </section>
  );
}
