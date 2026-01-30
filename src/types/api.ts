import type { AIQuestion, DailySummary, MePatterns, MeProfile, MeState, TrustCalibration } from "@/types/domain";

export type PipelineMode = "next_question" | "complete_session";

export type MeDbSnapshot = {
  profile: MeProfile;
  state: MeState;
  patterns: MePatterns;
  trust: TrustCalibration;
};

export type AiPipelineRequest = {
  mode: PipelineMode;
  sessionId?: string;
  draftText?: string;
  finalText?: string;
  askedQuestions?: string[];
  lastQuestion?: string | null;
  meDb: MeDbSnapshot;
};

export type AiPipelineResponse = {
  nextQuestion?: AIQuestion;
  validator?: {
    answered: boolean;
    evidence: string[];
  };
  extracted?: {
    dailySummary: DailySummary;
    signals?: string[];
    meDbUpdates?: Record<string, unknown>;
    followUpsForTomorrow?: string[];
  };
  advice?: {
    suggestions: string[];
  };
  debug?: {
    usedFallback?: boolean;
  };
};
