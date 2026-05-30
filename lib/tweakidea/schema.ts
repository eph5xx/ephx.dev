// lib/tweakidea/schema.ts
// Single source of truth for Zod schemas consumed by Phases 2–7.
// Source: CONTEXT.md D-12, D-13, D-14, D-15
// Source: RESEARCH.md §Pattern 5
// Source: REQUIREMENTS.md §Backend/API + §Bundle Delivery

import { z } from "zod";

// Canary sentinel — the prompt-injection defense for every LLM response
// schema. Phase 4 prompts will instruct the model to echo this exact string
// verbatim; if Claude mutates it, IdeaExtractionSchema.parse() throws.
export const CANARY = "tweakidea:canary:v1" as const;
const CanaryField = z.literal(CANARY);

// --- Idea extraction (Phase 4 extract-idea response) -----------------------

export const IdeaExtractionSchema = z.object({
  canary: CanaryField,
  problem: z.string().trim().min(10).max(600),
  solution: z.string().trim().min(10).max(600),
});
export type IdeaExtraction = z.infer<typeof IdeaExtractionSchema>;

// --- Single assumption -----------------------------------------------------
// Simplified: no user-editable confidence or category. The LLM still tags
// each assumption with a category label (shown as read-only context), but
// the user only decides keep-or-drop.

export const AssumptionSchema = z.object({
  id: z.string().regex(/^a_[a-z0-9]{8}$/),
  text: z.string().trim().min(5).max(400),
  category: z.enum([
    "market",
    "user-behavior",
    "technical-feasibility",
    "willingness-to-pay",
    "competition",
    "founder-fit",
  ]),
});
export type Assumption = z.infer<typeof AssumptionSchema>;

// --- Assumption extraction response (Phase 4 extract-assumptions) ----------

export const AssumptionListSchema = z.object({
  canary: CanaryField,
  assumptions: z.array(AssumptionSchema).min(3).max(8),
});
export type AssumptionList = z.infer<typeof AssumptionListSchema>;

// --- Founder profile (Phase 6 stage 3 output) ------------------------------
// Simplified to 3 fields. Background absorbs "why this idea" + years of
// domain experience as free text. Primary skill + commitment remain as
// quick pills so the LLM can tailor fit questions to the founder's edge.

export const FounderProfileSchema = z.object({
  background: z.string().trim().min(10).max(600),
  primary_skill: z.enum([
    "technical",
    "product",
    "sales",
    "design",
    "research",
    "ops",
    "other",
  ]),
  commitment: z.enum(["full-time", "nights-weekends", "researching"]),
});
export type FounderProfile = z.infer<typeof FounderProfileSchema>;

// --- Founder-idea fit questions (new — LLM-generated, Stage 3) -------------
// Exactly 3 questions tailored to the founder's profile + the extracted idea.
// Stored in the save bundle as Q/A pairs so the CLI can consume them.

export const FOUNDER_FIT_QUESTION_COUNT = 3;

export const FounderFitQuestionSchema = z.object({
  id: z.string().regex(/^fq_[a-z0-9]{6}$/),
  question: z.string().trim().min(10).max(300),
  rationale: z.string().trim().min(10).max(200),
});
export type FounderFitQuestion = z.infer<typeof FounderFitQuestionSchema>;

export const FounderFitQuestionListSchema = z.object({
  canary: CanaryField,
  questions: z
    .array(FounderFitQuestionSchema)
    .length(FOUNDER_FIT_QUESTION_COUNT),
});
export type FounderFitQuestionList = z.infer<typeof FounderFitQuestionListSchema>;

export const FounderFitAnswerSchema = z.object({
  question_id: z.string().regex(/^fq_[a-z0-9]{6}$/),
  question: z.string().trim().min(10).max(300),
  answer: z.string().trim().min(5).max(800),
});
export type FounderFitAnswer = z.infer<typeof FounderFitAnswerSchema>;

// --- Save request (Phase 5 POST body — renamed from BundleRequest) ---------
// idea_raw uses the API-07 hard cap at 4000 chars.
// extraction drops the canary because the user has already confirmed it.

export const SaveRequestSchema = z.object({
  idea_raw: z.string().trim().min(20).max(4000),
  extraction: IdeaExtractionSchema.omit({ canary: true }),
  assumptions: z
    .array(AssumptionSchema.extend({ keep: z.boolean() }))
    .min(1)
    .max(8),
  founder: FounderProfileSchema,
  founder_fit_answers: z
    .array(FounderFitAnswerSchema)
    .length(FOUNDER_FIT_QUESTION_COUNT)
    .optional(),
});
export type SaveRequest = z.infer<typeof SaveRequestSchema>;

// --- Save response (renamed from BundleResponse) --------------------------
// id regex enforces BNDL-02 (>= 95-bit random).
// expires_at is ISO 8601 so clients + the /tweakidea/s/[id] route
// can compare against Date.now() for the application-layer 24h expiry.

export const SaveResponseSchema = z.object({
  id: z.string().regex(/^[A-Za-z0-9_-]{16,32}$/),
  url: z.string().url(),
  expires_at: z.string().datetime(),
});
export type SaveResponse = z.infer<typeof SaveResponseSchema>;
