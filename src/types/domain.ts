export type JournalEntry = {
  id: string;
  sessionId: string;
  createdAt: string;
  text: string;
  source: "user" | "ai";
};

export type AIQuestion = {
  question: string;
  coverageTag: string;
  whyThisNow?: string;
};

export type DailySummary = {
  headline: string;
  bullets: string[];
  signals?: string[];
};

export type WeeklyPattern = {
  headline: string;
  patterns: string[];
};

export type MeProfile = {
  values?: string[];
  boundaries?: string[];
  preferences?: string[];
};

export type MeState = {
  mood?: string;
  energy?: string;
  stress?: string;
};

export type MePatterns = {
  recurring?: string[];
  emerging?: string[];
};

export type TrustCalibration = {
  proactivity?: "low" | "medium" | "high";
  sensitivity?: "low" | "medium" | "high";
};

export type JournalSession = {
  id: string;
  userId: string;
  startedAt: string;
  endedAt?: string | null;
  status: "draft" | "completed";
  mode: "text" | "voice";
  title?: string | null;
  summary?: DailySummary | null;
};
