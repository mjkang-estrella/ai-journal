// Supabase Edge Function placeholder for /ai/runPipeline
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  const body = await req.json().catch(() => ({}));

  const response = {
    nextQuestion: {
      question: "What felt most meaningful today?",
      coverageTag: "meaning",
      whyThisNow: "Placeholder response from edge function stub",
    },
    extracted: {
      dailySummary: {
        headline: "Summary",
        bullets: ["Edge function stub response."],
      },
    },
    advice: {
      suggestions: ["Small reminder: take one restorative break tomorrow."],
    },
    debug: {
      usedFallback: true,
    },
    input: body,
  };

  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" },
  });
});
