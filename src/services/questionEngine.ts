import type { MeDbSnapshot } from "@/types/api";
import type { AIQuestion } from "@/types/domain";
import { runPipeline } from "@/services/aiGateway";

const fallbackQuestions: AIQuestion[] = [
  {
    question: "What felt most meaningful today?",
    coverageTag: "meaning",
  },
  {
    question: "What took the most energy?",
    coverageTag: "energy",
  },
  {
    question: "Was there a small win you want to remember?",
    coverageTag: "wins",
  },
];

export async function getNextQuestion({
  draftText,
  askedQuestions,
  meDb,
  mockMode,
}: {
  draftText: string;
  askedQuestions: string[];
  meDb: MeDbSnapshot;
  mockMode: boolean;
}): Promise<AIQuestion> {
  if (mockMode) {
    const next = fallbackQuestions.find(
      (question) => !askedQuestions.includes(question.question)
    );
    return next ?? fallbackQuestions[0];
  }

  const response = await runPipeline({
    mode: "next_question",
    draftText,
    askedQuestions,
    lastQuestion: askedQuestions[askedQuestions.length - 1] ?? null,
    meDb,
  });

  return (
    response.nextQuestion ??
    fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)]
  );
}

export async function validateQuestionAnswered({
  draftText,
  lastQuestion,
  meDb,
  mockMode,
}: {
  draftText: string;
  lastQuestion: string | null;
  meDb: MeDbSnapshot;
  mockMode: boolean;
}) {
  if (mockMode) {
    return {
      answered: draftText.trim().length > 20,
      evidence: [],
    };
  }

  const response = await runPipeline({
    mode: "next_question",
    draftText,
    askedQuestions: [],
    lastQuestion,
    meDb,
  });

  return response.validator ?? { answered: false, evidence: [] };
}
