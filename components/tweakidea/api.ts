// components/tweakidea/api.ts
// Thin typed client for POST /api/tweakidea.

import type {
  Assumption,
  FounderFitQuestion,
  FounderProfile,
  SaveResponse,
} from "@/lib/tweakidea/schema";
import type { Extraction } from "./flow-state";

const POSTHOG_SESSION_KEY = "ephx_ph_did";

function did(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(POSTHOG_SESSION_KEY);
  } catch {
    return null;
  }
}

async function post<T>(
  action: string,
  payload: unknown,
  signal?: AbortSignal,
): Promise<T> {
  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  const d = did();
  if (d) headers["x-tweakidea-did"] = d;

  const res = await fetch("/api/tweakidea", {
    method: "POST",
    headers,
    body: JSON.stringify({ action, payload }),
    signal,
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      (body as { error?: { message?: string } } | null)?.error?.message ??
      `Request failed (${res.status})`;
    throw new Error(message);
  }
  return (body as { result: T }).result;
}

export function extractIdea(
  ideaRaw: string,
  signal?: AbortSignal,
): Promise<Extraction> {
  return post<Extraction>("extract-idea", { idea_raw: ideaRaw }, signal);
}

export function extractAssumptions(
  ideaRaw: string,
  extraction: Extraction,
  signal?: AbortSignal,
): Promise<Assumption[]> {
  return post<Assumption[]>(
    "extract-assumptions",
    { idea_raw: ideaRaw, extraction },
    signal,
  );
}

export function founderFitQuestions(
  extraction: Extraction,
  keptAssumptions: Assumption[],
  founder: FounderProfile,
  signal?: AbortSignal,
): Promise<FounderFitQuestion[]> {
  return post<FounderFitQuestion[]>(
    "founder-fit-questions",
    { extraction, kept_assumptions: keptAssumptions, founder },
    signal,
  );
}

export function saveBundle(
  payload: {
    idea_raw: string;
    extraction: Extraction;
    assumptions: (Assumption & { keep: boolean })[];
    founder: FounderProfile;
    founder_fit_answers: { question_id: string; question: string; answer: string }[];
  },
  signal?: AbortSignal,
): Promise<SaveResponse> {
  return post<SaveResponse>("save", payload, signal);
}
