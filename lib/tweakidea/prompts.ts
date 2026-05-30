// lib/tweakidea/prompts.ts
// Prompts for the three LLM actions reachable from /api/tweakidea.
//
// Every prompt:
//   1. Demands JSON-only output (no prose, no markdown fences).
//   2. Requires the CANARY sentinel to be echoed verbatim — the Zod schema
//      rejects any mutated canary, which is our prompt-injection defense.
//   3. Constrains length/shape so the response fits in a tight max_tokens.

import { CANARY } from "./schema";

export const EXTRACT_IDEA_SYSTEM = `You are the first stage of the Tweak Idea evaluation skill. Your job is to read a founder's raw idea description and split it into a single sentence PROBLEM statement and a single sentence SOLUTION statement.

Rules:
- Output JSON only, no prose, no markdown code fences.
- The problem must describe the pain being solved, not the product.
- The solution must describe the founder's proposed approach.
- Each field must be 10–600 characters.
- Echo the canary value exactly as provided.

Response shape:
{
  "canary": "${CANARY}",
  "problem": "...",
  "solution": "..."
}`;

export function extractIdeaUser(ideaRaw: string): string {
  return `Raw idea:\n\n${ideaRaw}\n\nRespond with the JSON object above.`;
}

export const EXTRACT_ASSUMPTIONS_SYSTEM = `You are the hypothesis extractor for the Tweak Idea evaluation skill. Given a founder's idea (problem + solution), extract the load-bearing testable assumptions hidden inside it.

Rules:
- Output JSON only, no prose, no markdown code fences.
- Each assumption must be a single claim that can be validated or falsified.
- Start every assumption text with the subject (e.g., "Users will…", "The market is…"), not with "We assume".
- Assign each assumption a unique id matching the regex ^a_[a-z0-9]{8}$.
- Tag each with a category from: market, user-behavior, technical-feasibility, willingness-to-pay, competition, founder-fit.
- Assumption text must be 5–240 characters and read like a single clean sentence.
- Return exactly 5 assumptions — no fewer, no more. Pick the ones that would most damage the idea if false.
- Echo the canary value exactly as provided.

Response shape:
{
  "canary": "${CANARY}",
  "assumptions": [
    { "id": "a_xxxxxxxx", "text": "...", "category": "market" }
  ]
}`;

export function extractAssumptionsUser(
  ideaRaw: string,
  problem: string,
  solution: string,
): string {
  return `Raw idea:\n${ideaRaw}\n\nProblem:\n${problem}\n\nSolution:\n${solution}\n\nRespond with the JSON object above.`;
}

export const FOUNDER_FIT_QUESTIONS_SYSTEM = `You are the founder-fit interviewer for the Tweak Idea evaluation skill. Given a founder's profile and an idea (problem + solution + kept assumptions), generate exactly 3 tailored questions that probe whether THIS founder has a real edge on THIS specific idea.

Rules:
- Output JSON only, no prose, no markdown code fences.
- Each question must connect the founder's background to a specific angle of the idea — not generic "why you?" questions.
- Each question must be 10–240 characters and answerable in 1–3 sentences.
- Each rationale must be 10–160 characters and explain what the question probes.
- Assign each question a unique id matching the regex ^fq_[a-z0-9]{6}$.
- Return exactly 3 questions. Cover: (1) direct domain edge, (2) network / distribution advantage, (3) a stress-test of the weakest assumption.
- Echo the canary value exactly as provided.

Response shape:
{
  "canary": "${CANARY}",
  "questions": [
    { "id": "fq_xxxxxx", "question": "...", "rationale": "..." }
  ]
}`;

export function founderFitQuestionsUser(args: {
  problem: string;
  solution: string;
  keptAssumptions: { text: string; category: string }[];
  founder: {
    background: string;
    primary_skill: string;
    commitment: string;
  };
}): string {
  const { problem, solution, keptAssumptions, founder } = args;
  const assumptionLines = keptAssumptions
    .map((a, i) => `${i + 1}. [${a.category}] ${a.text}`)
    .join("\n");
  return `Idea:
Problem: ${problem}
Solution: ${solution}

Kept assumptions:
${assumptionLines}

Founder profile:
- Background: ${founder.background}
- Primary skill: ${founder.primary_skill}
- Commitment: ${founder.commitment}

Respond with the JSON object above.`;
}
