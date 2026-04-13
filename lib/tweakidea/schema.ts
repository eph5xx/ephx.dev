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
  confidence: z.enum(["low", "medium", "high"]),
});
export type Assumption = z.infer<typeof AssumptionSchema>;

// --- Assumption extraction response (Phase 4 extract-assumptions) ----------

export const AssumptionListSchema = z.object({
  canary: CanaryField,
  assumptions: z.array(AssumptionSchema).min(3).max(12),
});
export type AssumptionList = z.infer<typeof AssumptionListSchema>;

// --- Founder profile (Phase 6 stage 3 output) ------------------------------
// Web-native schema — NOT ported from the TweakIdea CLI repo, per
// CONTEXT.md §specifics and REQUIREMENTS.md §SRVY-06.

export const FounderProfileSchema = z.object({
  name: z.string().trim().max(120).optional(),
  background: z.string().trim().min(10).max(500),
  domain_expertise_years: z.number().int().min(0).max(60),
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
  why_this_idea: z.string().trim().min(10).max(500),
});
export type FounderProfile = z.infer<typeof FounderProfileSchema>;

// --- Bundle generation request (Phase 5 POST body) -------------------------
// idea_raw uses the API-07 hard cap at 4000 chars.
// extraction drops the canary because the user has already confirmed it.

export const BundleRequestSchema = z.object({
  idea_raw: z.string().trim().min(20).max(4000),
  extraction: IdeaExtractionSchema.omit({ canary: true }),
  assumptions: z
    .array(AssumptionSchema.extend({ keep: z.boolean() }))
    .min(1)
    .max(12),
  founder: FounderProfileSchema,
});
export type BundleRequest = z.infer<typeof BundleRequestSchema>;

// --- Bundle generation response --------------------------------------------
// id regex enforces BNDL-02 (>= 95-bit random).
// expires_at is ISO 8601 so clients + the /tweakidea/bundle/[id] route
// can compare against Date.now() for the application-layer 24h expiry.

export const BundleResponseSchema = z.object({
  id: z.string().regex(/^[A-Za-z0-9_-]{16,32}$/),
  url: z.string().url(),
  expires_at: z.string().datetime(),
});
export type BundleResponse = z.infer<typeof BundleResponseSchema>;
