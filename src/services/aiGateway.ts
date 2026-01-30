import { supabase } from "@/lib/supabase/client";
import type { AiPipelineRequest, AiPipelineResponse } from "@/types/api";

export async function runPipeline(
  payload: AiPipelineRequest
): Promise<AiPipelineResponse> {
  const { data, error } = await supabase.functions.invoke("ai-run-pipeline", {
    body: payload,
  });

  if (error) {
    throw error;
  }

  return data as AiPipelineResponse;
}
