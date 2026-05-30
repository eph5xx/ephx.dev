import { describe, it, expect } from "vitest";
import {
  CANARY,
  IdeaExtractionSchema,
  AssumptionSchema,
  AssumptionListSchema,
  FounderProfileSchema,
  SaveRequestSchema,
  SaveResponseSchema,
  FounderFitQuestionSchema,
  FounderFitQuestionListSchema,
  FounderFitAnswerSchema,
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

  it("SaveRequestSchema rejects idea_raw over 4000 chars", () => {
    const result = SaveRequestSchema.safeParse({
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

  it("AssumptionSchema validates id regex and category enum", () => {
    const valid = {
      id: "a_abcd1234",
      text: "Founders won't pay for this",
      category: "willingness-to-pay" as const,
      confidence: "high" as const,
    };
    expect(AssumptionSchema.safeParse(valid).success).toBe(true);

    const badId = { ...valid, id: "nope" };
    expect(AssumptionSchema.safeParse(badId).success).toBe(false);

    const badCategory = { ...valid, category: "random-category" };
    expect(AssumptionSchema.safeParse(badCategory).success).toBe(false);
  });

  it("FounderProfileSchema accepts all primary_skill enum values", () => {
    const skills = [
      "technical",
      "product",
      "sales",
      "design",
      "research",
      "ops",
      "other",
    ] as const;
    for (const primary_skill of skills) {
      const result = FounderProfileSchema.safeParse({
        background: "Ten years building developer tools at scale",
        domain_expertise_years: 10,
        primary_skill,
        commitment: "full-time",
        why_this_idea: "Because I faced this exact pain myself",
      });
      expect(result.success).toBe(true);
    }
  });

  it("SaveResponseSchema validates id regex and ISO datetime", () => {
    const valid = {
      id: "abcDEF0123456789-_",
      url: "https://ephx.dev/tweakidea/s/abcDEF0123456789-_",
      expires_at: "2026-04-14T10:20:30.000Z",
    };
    expect(SaveResponseSchema.safeParse(valid).success).toBe(true);

    const shortId = { ...valid, id: "short" };
    expect(SaveResponseSchema.safeParse(shortId).success).toBe(false);

    const badDate = { ...valid, expires_at: "yesterday" };
    expect(SaveResponseSchema.safeParse(badDate).success).toBe(false);
  });

  it("IdeaExtractionSchema.parse round-trips happy path", () => {
    const input = {
      canary: CANARY,
      problem: "Solo founders spend weeks validating ideas before writing code",
      solution: "AI-assisted structured scoring across 14 weighted dimensions",
    };
    const parsed = IdeaExtractionSchema.parse(input);
    expect(parsed.problem).toBe(input.problem);
    expect(parsed.solution).toBe(input.solution);
    expect(parsed.canary).toBe(CANARY);
  });

  it("AssumptionListSchema enforces >= 3 assumptions", () => {
    const tooFew = {
      canary: CANARY,
      assumptions: [
        { id: "a_abcd1234", text: "one", category: "market" as const, confidence: "low" as const },
        { id: "a_abcd1235", text: "two", category: "market" as const, confidence: "low" as const },
      ],
    };
    expect(AssumptionListSchema.safeParse(tooFew).success).toBe(false);
  });

  it("FounderFitQuestionSchema validates id regex", () => {
    const valid = {
      id: "fq_abc123",
      question: "What domain expertise do you have here?",
      rationale: "Checks whether the founder knows the space deeply",
    };
    expect(FounderFitQuestionSchema.safeParse(valid).success).toBe(true);
    expect(
      FounderFitQuestionSchema.safeParse({ ...valid, id: "nope" }).success,
    ).toBe(false);
  });

  it("FounderFitQuestionListSchema enforces min 2 max 4 questions", () => {
    const one = {
      canary: CANARY,
      questions: [
        {
          id: "fq_abc123",
          question: "What edge do you have on this problem space?",
          rationale: "Probes founder-market fit dimension",
        },
      ],
    };
    expect(FounderFitQuestionListSchema.safeParse(one).success).toBe(false);

    const three = {
      canary: CANARY,
      questions: [1, 2, 3].map((n) => ({
        id: `fq_abc12${n}`,
        question: "What edge do you have on this problem space?",
        rationale: "Probes founder-market fit dimension",
      })),
    };
    expect(FounderFitQuestionListSchema.safeParse(three).success).toBe(true);
  });

  it("FounderFitAnswerSchema enforces answer min length", () => {
    const tooShort = {
      question_id: "fq_abc123",
      question: "What edge do you have on this problem space?",
      answer: "x",
    };
    expect(FounderFitAnswerSchema.safeParse(tooShort).success).toBe(false);

    const ok = { ...tooShort, answer: "I spent 8 years as a product lead" };
    expect(FounderFitAnswerSchema.safeParse(ok).success).toBe(true);
  });

  it("SaveRequestSchema accepts a complete valid payload", () => {
    const req = {
      idea_raw: "A tool that helps founders validate ideas faster",
      extraction: {
        problem: "Validation is slow and subjective",
        solution: "Structured AI scorecards",
      },
      assumptions: [
        {
          id: "a_00000001",
          text: "Founders will pay for structured validation",
          category: "willingness-to-pay" as const,
          confidence: "medium" as const,
          keep: true,
        },
      ],
      founder: {
        background: "Ten years building developer tools at scale",
        domain_expertise_years: 10,
        primary_skill: "technical" as const,
        commitment: "full-time" as const,
        why_this_idea: "Because I faced this exact pain myself",
      },
    };
    const result = SaveRequestSchema.safeParse(req);
    expect(result.success).toBe(true);
  });
});
