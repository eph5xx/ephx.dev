"use client";

// components/tweakidea/use-tweakidea-flow.ts
// Shared state-machine hook consumed by every design track.
// Tracks differ only in rendering — orchestration, API calls, callbacks,
// and analytics events live here once.

import { useCallback, useEffect, useReducer, useRef } from "react";
import * as api from "./api";
import {
  activeStage,
  flowReducer,
  initialState,
  stageIndex,
  STAGE_ORDER,
  type FlowState,
  type FlowAction,
  type StageName,
} from "./flow-state";
import type { FounderProfile } from "@/lib/tweakidea/schema";

declare global {
  interface Window {
    posthog?: {
      capture?: (event: string, props?: Record<string, unknown>) => void;
    };
  }
}

function capture(event: string, props?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.posthog?.capture?.(event, props);
}

export type TweakideaFlow = {
  state: FlowState;
  dispatch: React.Dispatch<FlowAction>;
  current: StageName;
  currentIdx: number;
  stageOrder: typeof STAGE_ORDER;
  submitIdea: () => Promise<void>;
  confirmExtraction: () => Promise<void>;
  confirmAssumptions: () => void;
  confirmFounder: () => Promise<void>;
  confirmFit: () => Promise<void>;
  reset: () => void;
};

export function useTweakideaFlow(): TweakideaFlow {
  const [state, dispatch] = useReducer(flowReducer, initialState);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const submitIdea = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    dispatch({ type: "submitIdea" });
    try {
      const extraction = await api.extractIdea(
        state.ideaRaw.trim(),
        controller.signal,
      );
      dispatch({ type: "receiveExtraction", extraction });
    } catch (e) {
      if (controller.signal.aborted) return;
      dispatch({
        type: "failExtraction",
        error: e instanceof Error ? e.message : "Something went wrong",
      });
    }
  }, [state.ideaRaw]);

  const confirmExtraction = useCallback(async () => {
    if (!state.extraction) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    capture("PROBLEM_CONFIRMED", {
      problem_length: state.extraction.problem.length,
      solution_length: state.extraction.solution.length,
      edited: state.extractionEdited,
    });

    dispatch({ type: "confirmExtraction" });
    try {
      const assumptions = await api.extractAssumptions(
        state.ideaRaw.trim(),
        state.extraction,
        controller.signal,
      );
      dispatch({ type: "receiveAssumptions", assumptions });
    } catch (e) {
      if (controller.signal.aborted) return;
      dispatch({
        type: "failAssumptions",
        error: e instanceof Error ? e.message : "Something went wrong",
      });
    }
  }, [state.extraction, state.extractionEdited, state.ideaRaw]);

  const confirmAssumptions = useCallback(() => {
    const kept = state.assumptions.filter((a) => a.keep);
    capture("ASSUMPTIONS_CONFIRMED", {
      kept: kept.length,
      edited: state.assumptionsTouched.size,
      removed: state.assumptions.length - kept.length,
    });
    dispatch({ type: "confirmAssumptions" });
  }, [state.assumptions, state.assumptionsTouched.size]);

  const buildFounder = useCallback((): FounderProfile => {
    return {
      background: state.founder.background.trim(),
      primary_skill: state.founder.primary_skill,
      commitment: state.founder.commitment,
    };
  }, [state.founder]);

  const confirmFounder = useCallback(async () => {
    if (!state.extraction) return;
    const kept = state.assumptions
      .filter((a) => a.keep)
      .map(({ keep: _keep, ...rest }) => {
        void _keep;
        return rest;
      });
    const founder = buildFounder();

    capture("FOUNDER_SUBMITTED", { answered_count: 3 });

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    dispatch({ type: "confirmFounder" });
    try {
      const questions = await api.founderFitQuestions(
        state.extraction,
        kept,
        founder,
        controller.signal,
      );
      dispatch({ type: "receiveFitQuestions", questions });
    } catch (e) {
      if (controller.signal.aborted) return;
      dispatch({
        type: "failFitQuestions",
        error: e instanceof Error ? e.message : "Something went wrong",
      });
    }
  }, [buildFounder, state.assumptions, state.extraction]);

  const confirmFit = useCallback(async () => {
    if (!state.extraction) return;
    const founder = buildFounder();

    const founderFitAnswers = state.fitQuestions
      .map((q) => ({
        question_id: q.id,
        question: q.question,
        answer: (state.fitAnswers[q.id] ?? "").trim(),
      }))
      .filter((a) => a.answer.length >= 5);

    capture("FOUNDER_FIT_QUESTIONS_SUBMITTED", {
      answered_count: founderFitAnswers.length,
    });

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    dispatch({ type: "confirmFit" });
    try {
      const save = await api.saveBundle(
        {
          idea_raw: state.ideaRaw.trim(),
          extraction: state.extraction,
          assumptions: state.assumptions,
          founder,
          founder_fit_answers: founderFitAnswers,
        },
        controller.signal,
      );
      dispatch({ type: "receiveSave", save });
    } catch (e) {
      if (controller.signal.aborted) return;
      dispatch({
        type: "failSave",
        error: e instanceof Error ? e.message : "Something went wrong",
      });
    }
  }, [
    buildFounder,
    state.assumptions,
    state.extraction,
    state.fitAnswers,
    state.fitQuestions,
    state.ideaRaw,
  ]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    dispatch({ type: "reset" });
  }, []);

  const current = activeStage(state.phase);
  const currentIdx = stageIndex(current);

  return {
    state,
    dispatch,
    current,
    currentIdx,
    stageOrder: STAGE_ORDER,
    submitIdea,
    confirmExtraction,
    confirmAssumptions,
    confirmFounder,
    confirmFit,
    reset,
  };
}
