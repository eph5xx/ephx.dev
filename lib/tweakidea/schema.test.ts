import { describe, it, expect } from "vitest";
import {
  CANARY,
  IdeaExtractionSchema,
  AssumptionSchema,
  AssumptionListSchema,
  FounderProfileSchema,
  BundleRequestSchema,
  BundleResponseSchema,
} from "@/lib/tweakidea/schema";

describe("lib/tweakidea/schema.ts", () => {
  it("exports CANARY literal", () => {
    expect(typeof CANARY).toBe("string");
    expect(CANARY.length).toBeGreaterThan(0);
  });

  it("IdeaExtractionSchema rejects mutated canary", () => {
    const result = IdeaExtractionSchema.safeParse({
      canary: "WRONG",
      problem: "some problem statement long enough",
      solution: "some solution statement long enough",
    });
    expect(result.success).toBe(false);
  });

  it("IdeaExtractionSchema rejects over-max problem", () => {
    const result = IdeaExtractionSchema.safeParse({
      canary: CANARY,
      problem: "x".repeat(10_000),
      solution: "some solution statement long enough",
    });
    expect(result.success).toBe(false);
  });

  it("IdeaExtractionSchema accepts valid input with correct canary", () => {
    const result = IdeaExtractionSchema.safeParse({
      canary: CANARY,
      problem: "Founders lose weeks validating ideas manually",
      solution: "Structured AI scorecard with quality tiers",
    });
    expect(result.success).toBe(true);
  });

  it("AssumptionListSchema enforces min/max count", () => {
    expect(AssumptionListSchema.safeParse({ canary: CANARY, assumptions: [] }).success).toBe(false);
  });

  it("BundleRequestSchema rejects idea_raw over 4000 chars", () => {
    const result = BundleRequestSchema.safeParse({
      idea_raw: "x".repeat(4001),
      extraction: { problem: "a".repeat(20), solution: "b".repeat(20) },
      assumptions: [],
      founder: {
        background: "x".repeat(10),
        domain_expertise_years: 1,
        primary_skill: "technical",
        commitment: "full-time",
        why_this_idea: "x".repeat(10),
      },
    });
    expect(result.success).toBe(false);
  });

  it.todo("AssumptionSchema validates id regex and category enum");
  it.todo("FounderProfileSchema accepts all primary_skill enum values");
  it.todo("BundleResponseSchema validates id regex and ISO datetime");
});
