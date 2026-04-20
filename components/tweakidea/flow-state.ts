// components/tweakidea/flow-state.ts
// Shared state types + reducer for the /tweakidea interactive flow.

import type {
  Assumption,
  FounderFitQuestion,
  FounderProfile,
  IdeaExtraction,
  SaveResponse,
} from "@/lib/tweakidea/schema";

export type Phase =
  | "typing-idea"
  | "extracting-idea"
  | "reviewing-extraction"
  | "extracting-assumptions"
  | "reviewing-assumptions"
  | "filling-founder"
  | "fetching-fit"
  | "reviewing-fit"
  | "saving"
  | "done";

export type Extraction = Omit<IdeaExtraction, "canary">;
export type AssumptionWithKeep = Assumption & { keep: boolean };

export type FlowState = {
  phase: Phase;
  error: string | null;

  ideaRaw: string;

  extraction: Extraction | null;
  extractionEdited: boolean;

  assumptions: AssumptionWithKeep[];
  assumptionsTouched: Set<string>; // ids the user edited or toggled

  founder: FounderProfileForm;

  fitQuestions: FounderFitQuestion[];
  fitAnswers: Record<string, string>;

  save: SaveResponse | null;
};

export type FounderProfileForm = {
  background: string;
  primary_skill: FounderProfile["primary_skill"];
  commitment: FounderProfile["commitment"];
};

export const emptyFounder: FounderProfileForm = {
  background: "",
  primary_skill: "technical",
  commitment: "full-time",
};

export const initialState: FlowState = {
  phase: "typing-idea",
  error: null,
  ideaRaw: "",
  extraction: null,
  extractionEdited: false,
  assumptions: [],
  assumptionsTouched: new Set(),
  founder: emptyFounder,
  fitQuestions: [],
  fitAnswers: {},
  save: null,
};

export type FlowAction =
  | { type: "setIdeaRaw"; value: string }
  | { type: "submitIdea" }
  | { type: "receiveExtraction"; extraction: Extraction }
  | { type: "failExtraction"; error: string }
  | {
      type: "editExtraction";
      field: "problem" | "solution";
      value: string;
    }
  | { type: "confirmExtraction" }
  | { type: "receiveAssumptions"; assumptions: Assumption[] }
  | { type: "failAssumptions"; error: string }
  | {
      type: "editAssumptionText";
      id: string;
      value: string;
    }
  | { type: "toggleAssumptionKeep"; id: string }
  | { type: "confirmAssumptions" }
  | {
      type: "setFounderField";
      field: keyof FounderProfileForm;
      value: string;
    }
  | { type: "confirmFounder" }
  | { type: "receiveFitQuestions"; questions: FounderFitQuestion[] }
  | { type: "failFitQuestions"; error: string }
  | { type: "setFitAnswer"; questionId: string; value: string }
  | { type: "confirmFit" }
  | { type: "receiveSave"; save: SaveResponse }
  | { type: "failSave"; error: string }
  | { type: "reset" };

export function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case "setIdeaRaw":
      return { ...state, ideaRaw: action.value, error: null };

    case "submitIdea":
      return { ...state, phase: "extracting-idea", error: null };

    case "receiveExtraction":
      return {
        ...state,
        phase: "reviewing-extraction",
        extraction: action.extraction,
        extractionEdited: false,
        error: null,
      };

    case "failExtraction":
      return { ...state, phase: "typing-idea", error: action.error };

    case "editExtraction":
      if (!state.extraction) return state;
      return {
        ...state,
        extraction: { ...state.extraction, [action.field]: action.value },
        extractionEdited: true,
      };

    case "confirmExtraction":
      return { ...state, phase: "extracting-assumptions", error: null };

    case "receiveAssumptions":
      return {
        ...state,
        phase: "reviewing-assumptions",
        assumptions: action.assumptions.map((a) => ({ ...a, keep: true })),
        assumptionsTouched: new Set(),
        error: null,
      };

    case "failAssumptions":
      return {
        ...state,
        phase: "reviewing-extraction",
        error: action.error,
      };

    case "editAssumptionText": {
      const touched = new Set(state.assumptionsTouched);
      touched.add(action.id);
      return {
        ...state,
        assumptions: state.assumptions.map((a) =>
          a.id === action.id ? { ...a, text: action.value } : a,
        ),
        assumptionsTouched: touched,
      };
    }

    case "toggleAssumptionKeep": {
      const touched = new Set(state.assumptionsTouched);
      touched.add(action.id);
      return {
        ...state,
        assumptions: state.assumptions.map((a) =>
          a.id === action.id ? { ...a, keep: !a.keep } : a,
        ),
        assumptionsTouched: touched,
      };
    }

    case "confirmAssumptions":
      return { ...state, phase: "filling-founder", error: null };

    case "setFounderField":
      return {
        ...state,
        founder: { ...state.founder, [action.field]: action.value },
      };

    case "confirmFounder":
      return { ...state, phase: "fetching-fit", error: null };

    case "receiveFitQuestions":
      return {
        ...state,
        phase: "reviewing-fit",
        fitQuestions: action.questions,
        fitAnswers: Object.fromEntries(
          action.questions.map((q) => [q.id, ""]),
        ),
        error: null,
      };

    case "failFitQuestions":
      return { ...state, phase: "filling-founder", error: action.error };

    case "setFitAnswer":
      return {
        ...state,
        fitAnswers: { ...state.fitAnswers, [action.questionId]: action.value },
      };

    case "confirmFit":
      return { ...state, phase: "saving", error: null };

    case "receiveSave":
      return { ...state, phase: "done", save: action.save, error: null };

    case "failSave":
      return { ...state, phase: "reviewing-fit", error: action.error };

    case "reset":
      return initialState;

    default:
      return state;
  }
}

// Order of stages as rendered in the UI.
export const STAGE_ORDER = [
  "idea",
  "extraction",
  "assumptions",
  "founder",
  "founder-fit",
  "install",
] as const;
export type StageName = (typeof STAGE_ORDER)[number];

// Map reducer phase → which stage is currently "active."
export function activeStage(phase: Phase): StageName {
  switch (phase) {
    case "typing-idea":
    case "extracting-idea":
      return "idea";
    case "reviewing-extraction":
    case "extracting-assumptions":
      return "extraction";
    case "reviewing-assumptions":
      return "assumptions";
    case "filling-founder":
    case "fetching-fit":
      return "founder";
    case "reviewing-fit":
    case "saving":
      return "founder-fit";
    case "done":
      return "install";
  }
}

// How far the user has progressed (for showing/hiding future stages).
export function stageIndex(name: StageName): number {
  return STAGE_ORDER.indexOf(name);
}
