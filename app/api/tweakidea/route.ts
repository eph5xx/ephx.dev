// app/api/tweakidea/route.ts
// Single POST handler for the /tweakidea interactive flow.
//
// Four actions via a discriminated-union envelope:
//   extract-idea            → LLM splits raw idea into problem + solution
//   extract-assumptions     → LLM extracts testable hypotheses
//   founder-fit-questions   → LLM tailors 2–4 questions to founder + idea
//   save                    → writes the completed bundle to KV, returns url
//
// Shared concerns (env, rate limit, Anthropic client, canary defense,
// PostHog analytics) live here once.

import { NextResponse } from "next/server";
import { z } from "zod";
import type Anthropic from "@anthropic-ai/sdk";
import { getCloudflareContext } from "@opennextjs/cloudflare";

import { createAnthropicClient } from "@/lib/tweakidea/ai-gateway";
import { captureEvent } from "@/lib/tweakidea/analytics";
import {
  CANARY,
  IdeaExtractionSchema,
  AssumptionSchema,
  AssumptionListSchema,
  FounderProfileSchema,
  FounderFitQuestionListSchema,
  SaveRequestSchema,
  type Assumption,
  type FounderProfile,
  type IdeaExtraction,
  type SaveRequest,
  type SaveResponse,
} from "@/lib/tweakidea/schema";
import {
  EXTRACT_IDEA_SYSTEM,
  extractIdeaUser,
  EXTRACT_ASSUMPTIONS_SYSTEM,
  extractAssumptionsUser,
  FOUNDER_FIT_QUESTIONS_SYSTEM,
  founderFitQuestionsUser,
} from "@/lib/tweakidea/prompts";

const MODEL = "claude-sonnet-4-6";

const TweakIdeaRequestSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("extract-idea"),
    payload: z.object({
      idea_raw: z.string().trim().min(20).max(4000),
    }),
  }),
  z.object({
    action: z.literal("extract-assumptions"),
    payload: z.object({
      idea_raw: z.string().trim().min(20).max(4000),
      extraction: IdeaExtractionSchema.omit({ canary: true }),
    }),
  }),
  z.object({
    action: z.literal("founder-fit-questions"),
    payload: z.object({
      extraction: IdeaExtractionSchema.omit({ canary: true }),
      kept_assumptions: z.array(AssumptionSchema).min(1).max(12),
      founder: FounderProfileSchema,
    }),
  }),
  z.object({
    action: z.literal("save"),
    payload: SaveRequestSchema,
  }),
]);

// --- Helpers ---------------------------------------------------------------

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json(
    { error: { code, message } },
    { status },
  );
}

function textFromResponse(msg: Anthropic.Messages.Message): string {
  const first = msg.content[0];
  if (first && first.type === "text") return first.text;
  return "";
}

function stripJSONFences(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    return trimmed
      .replace(/^```(?:json)?\s*\n?/, "")
      .replace(/\n?```\s*$/, "")
      .trim();
  }
  return trimmed;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function generateSaveId(): string {
  // 16 random bytes → base64url (22 chars), ≥ 128 bits entropy.
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const bin = Array.from(bytes, (b) => String.fromCharCode(b)).join("");
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function randomAssumptionId(): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return `a_${bytesToHex(bytes)}`;
}

function randomFitQuestionId(): string {
  const bytes = new Uint8Array(3);
  crypto.getRandomValues(bytes);
  return `fq_${bytesToHex(bytes)}`;
}

function parseJsonSafe(text: string): unknown | null {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// --- Handler ---------------------------------------------------------------

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return errorResponse(400, "invalid_json", "Request body is not valid JSON.");
  }

  const parsed = TweakIdeaRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return errorResponse(400, "invalid_payload", parsed.error.message);
  }
  const request = parsed.data;

  const { env, ctx } = getCloudflareContext();
  const distinctId =
    req.headers.get("x-tweakidea-did") ?? "tweakidea-anon";

  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for") ??
    "unknown";

  // Rate-limit every action. The binding is declared in wrangler.jsonc but
  // is not always present in dev; fall through silently if unavailable.
  try {
    const rl = (env as unknown as {
      TWEAKIDEA_LLM_RATE_LIMIT?: { limit: (args: { key: string }) => Promise<{ success: boolean }> };
    }).TWEAKIDEA_LLM_RATE_LIMIT;
    if (rl?.limit) {
      const { success } = await rl.limit({ key: ip });
      if (!success) {
        return errorResponse(
          429,
          "rate_limited",
          "Too many requests. Try again in a minute.",
        );
      }
    }
  } catch (e) {
    console.warn("[/api/tweakidea] rate limiter unavailable:", e);
  }

  try {
    switch (request.action) {
      case "extract-idea":
        return await handleExtractIdea(request.payload, ctx, distinctId);
      case "extract-assumptions":
        return await handleExtractAssumptions(request.payload, ctx, distinctId);
      case "founder-fit-questions":
        return await handleFounderFitQuestions(request.payload, ctx, distinctId);
      case "save":
        return await handleSave(request.payload, env, ctx, distinctId, req);
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[/api/tweakidea] handler error:", e);
    return errorResponse(500, "internal_error", message);
  }
}

// --- Action handlers -------------------------------------------------------

async function handleExtractIdea(
  payload: { idea_raw: string },
  ctx: ExecutionContext,
  distinctId: string,
) {
  const client = createAnthropicClient();
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 500,
    system: EXTRACT_IDEA_SYSTEM,
    messages: [
      { role: "user", content: extractIdeaUser(payload.idea_raw) },
    ],
  });
  const text = stripJSONFences(textFromResponse(msg));
  const json = parseJsonSafe(text);
  if (json === null) {
    return errorResponse(502, "invalid_model_output", "Model did not return JSON.");
  }
  const parsed = IdeaExtractionSchema.safeParse(json);
  if (!parsed.success) {
    return errorResponse(502, "canary_or_schema_fail", "Model response failed validation.");
  }

  captureEvent(ctx, distinctId, "IDEA_SUBMITTED", {
    idea_length: payload.idea_raw.length,
    turnstile_passed: false,
  });

  const { canary: _canary, ...result } = parsed.data;
  void _canary;
  return NextResponse.json({ action: "extract-idea" as const, result });
}

async function handleExtractAssumptions(
  payload: {
    idea_raw: string;
    extraction: Omit<IdeaExtraction, "canary">;
  },
  ctx: ExecutionContext,
  distinctId: string,
) {
  const client = createAnthropicClient();
  const start = Date.now();
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 900,
    system: EXTRACT_ASSUMPTIONS_SYSTEM,
    messages: [
      {
        role: "user",
        content: extractAssumptionsUser(
          payload.idea_raw,
          payload.extraction.problem,
          payload.extraction.solution,
        ),
      },
    ],
  });
  const text = stripJSONFences(textFromResponse(msg));
  const json = parseJsonSafe(text);
  if (json === null) {
    return errorResponse(502, "invalid_model_output", "Model did not return JSON.");
  }

  // First attempt: strict parse.
  let assumptions: Assumption[] | null = null;
  const strict = AssumptionListSchema.safeParse(json);
  if (strict.success) {
    assumptions = strict.data.assumptions;
  } else {
    // Salvage: models sometimes make up non-conforming ids — rewrite them.
    const maybe = (json as { assumptions?: unknown[]; canary?: unknown }).assumptions;
    if (Array.isArray(maybe)) {
      const regenerated = {
        canary: CANARY,
        assumptions: maybe.map((a) =>
          typeof a === "object" && a !== null
            ? { ...(a as Record<string, unknown>), id: randomAssumptionId() }
            : { id: randomAssumptionId() },
        ),
      };
      const reparse = AssumptionListSchema.safeParse(regenerated);
      if (reparse.success) assumptions = reparse.data.assumptions;
    }
  }

  if (!assumptions) {
    return errorResponse(502, "canary_or_schema_fail", "Model response failed validation.");
  }

  captureEvent(ctx, distinctId, "ASSUMPTIONS_LOADED", {
    count: assumptions.length,
    latency_ms: Date.now() - start,
  });
  return NextResponse.json({
    action: "extract-assumptions" as const,
    result: assumptions,
  });
}

async function handleFounderFitQuestions(
  payload: {
    extraction: Omit<IdeaExtraction, "canary">;
    kept_assumptions: Assumption[];
    founder: FounderProfile;
  },
  ctx: ExecutionContext,
  distinctId: string,
) {
  const client = createAnthropicClient();
  const start = Date.now();
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 900,
    system: FOUNDER_FIT_QUESTIONS_SYSTEM,
    messages: [
      {
        role: "user",
        content: founderFitQuestionsUser({
          problem: payload.extraction.problem,
          solution: payload.extraction.solution,
          keptAssumptions: payload.kept_assumptions.map((a) => ({
            text: a.text,
            category: a.category,
          })),
          founder: {
            background: payload.founder.background,
            primary_skill: payload.founder.primary_skill,
            commitment: payload.founder.commitment,
          },
        }),
      },
    ],
  });
  const text = stripJSONFences(textFromResponse(msg));
  const json = parseJsonSafe(text);
  if (json === null) {
    return errorResponse(502, "invalid_model_output", "Model did not return JSON.");
  }

  let questions: { id: string; question: string; rationale: string }[] | null = null;
  const strict = FounderFitQuestionListSchema.safeParse(json);
  if (strict.success) {
    questions = strict.data.questions;
  } else {
    const maybe = (json as { questions?: unknown[] }).questions;
    if (Array.isArray(maybe)) {
      const regenerated = {
        canary: CANARY,
        questions: maybe.map((q) =>
          typeof q === "object" && q !== null
            ? { ...(q as Record<string, unknown>), id: randomFitQuestionId() }
            : { id: randomFitQuestionId() },
        ),
      };
      const reparse = FounderFitQuestionListSchema.safeParse(regenerated);
      if (reparse.success) questions = reparse.data.questions;
    }
  }

  if (!questions) {
    return errorResponse(502, "canary_or_schema_fail", "Model response failed validation.");
  }

  captureEvent(ctx, distinctId, "FOUNDER_FIT_QUESTIONS_LOADED", {
    count: questions.length,
    latency_ms: Date.now() - start,
  });
  return NextResponse.json({
    action: "founder-fit-questions" as const,
    result: questions,
  });
}

async function handleSave(
  payload: SaveRequest,
  env: CloudflareEnv,
  ctx: ExecutionContext,
  distinctId: string,
  req: Request,
) {
  const start = Date.now();
  const id = generateSaveId();
  const serialized = JSON.stringify(payload);
  const totalBytes = new TextEncoder().encode(serialized).length;

  await env.TWEAKIDEA_KV.put(id, serialized, { expirationTtl: 60 * 60 * 24 });

  const origin = new URL(req.url).origin;
  const response: SaveResponse = {
    id,
    url: `${origin}/tweakidea/s/${id}`,
    expires_at: new Date(Date.now() + 60 * 60 * 24 * 1000).toISOString(),
  };

  captureEvent(ctx, distinctId, "SAVE_GENERATED", {
    save_id: id,
    total_bytes: totalBytes,
    latency_ms: Date.now() - start,
  });

  return NextResponse.json({ action: "save" as const, result: response });
}
