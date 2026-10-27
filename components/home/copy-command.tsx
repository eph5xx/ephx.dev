"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

/** Shell command with a copy button; sits above ListRow's stretched link. */
export function CopyCommand({ command }: { command: string }) {
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
    } catch {
      // Clipboard blocked: select the text so Cmd/Ctrl+C still works.
      if (codeRef.current) {
        window.getSelection()?.selectAllChildren(codeRef.current);
      }
    }
  }

  const Icon = copied ? Check : Copy;

  return (
    <span className="relative z-10 inline-flex items-baseline gap-0.5">
      <code ref={codeRef} className="font-mono">
        {command}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${command}`}
        className="hover:text-foreground focus-visible:outline-ring inline-flex size-6 items-center justify-center self-center rounded-md transition-colors focus-visible:outline-2"
      >
        <Icon className="size-3.5" aria-hidden="true" />
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied" : ""}
      </span>
    </span>
  );
}
