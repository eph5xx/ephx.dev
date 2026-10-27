import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-start justify-center gap-4 px-4 py-20 md:px-6">
      <h1 className="text-foreground font-mono text-6xl font-medium tracking-tight md:text-7xl">
        404
      </h1>
      <p className="text-body text-base">
        This page wandered off. Let&apos;s get you back.
      </p>
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground font-mono text-sm transition-colors"
      >
        &larr; Home
      </Link>
    </div>
  );
}
