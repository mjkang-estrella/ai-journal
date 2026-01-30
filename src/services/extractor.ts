import type { DailySummary } from "@/types/domain";
import type { MeDbSnapshot } from "@/types/api";
import { runPipeline } from "@/services/aiGateway";

export async function extractSummary({
  finalText,
  meDb,
  mockMode,
}: {
  finalText: string;
  meDb: MeDbSnapshot;
  mockMode: boolean;
}): Promise<DailySummary> {
  if (mockMode) {
    const trimmed = finalText.trim();
    const headline = trimmed
      ? trimmed.split(".")[0]?.slice(0, 80)
      : "Today";
    return {
      headline: headline || "Today",
      bullets: [
        "Captured a few key moments from the day.",
        "Noted energy and mood shifts.",
      ],
    };
  }

  const response = await runPipeline({
    mode: "complete_session",
    finalText,
    meDb,
  });

  return (
    response.extracted?.dailySummary ?? {
      headline: "Summary",
      bullets: [],
    }
  );
}
