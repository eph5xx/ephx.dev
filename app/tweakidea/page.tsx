import type { Metadata } from "next";
import { TweakIdeaFlow } from "@/components/tweakidea/tweakidea-flow";

export const metadata: Metadata = {
  title: "Tweak your idea",
  description:
    "A live taste of Tweak Idea: split a raw startup idea into problem, solution, assumptions, and founder-fit questions — then run the full evaluation in Claude Code.",
  openGraph: {
    title: "Tweak your idea | ephx.dev",
    description:
      "A live taste of Tweak Idea — split a raw startup idea and hand off to the CLI.",
    images: ["/og-default.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tweak your idea",
    description:
      "A live taste of Tweak Idea — split a raw startup idea and hand off to the CLI.",
    images: ["/og-default.png"],
  },
};

export default function TweakIdeaPage() {
  return <TweakIdeaFlow />;
}
