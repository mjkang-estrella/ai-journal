import { supabase } from "@/lib/supabase/client";
import type { DailySummary, JournalSession } from "@/types/domain";

export type SaveSessionInput = {
  userId: string;
  draftText: string;
  summary: DailySummary;
};

export async function saveCompletedSession({
  userId,
  draftText,
  summary,
}: SaveSessionInput): Promise<JournalSession> {
  const timestamp = new Date().toISOString();

  const { data: session, error: sessionError } = await supabase
    .from("journal_sessions")
    .insert({
      user_id: userId,
      started_at: timestamp,
      ended_at: timestamp,
      status: "completed",
      mode: "text",
      title: summary.headline ?? null,
    })
    .select()
    .single();

  if (sessionError) {
    throw sessionError;
  }

  const { error: entryError } = await supabase.from("journal_entries").insert({
    session_id: session.id,
    created_at: timestamp,
    text: draftText,
    source: "user",
  });

  if (entryError) {
    throw entryError;
  }

  const { error: summaryError } = await supabase.from("daily_summaries").insert({
    session_id: session.id,
    created_at: timestamp,
    summary_json: JSON.stringify(summary),
  });

  if (summaryError) {
    throw summaryError;
  }

  return {
    id: session.id,
    userId: session.user_id,
    startedAt: session.started_at,
    endedAt: session.ended_at,
    status: session.status,
    mode: session.mode,
    title: session.title,
    summary,
  } as JournalSession;
}

export async function fetchRecentSessions(userId: string, limit = 20) {
  const { data: sessions, error } = await supabase
    .from("journal_sessions")
    .select("id, user_id, started_at, ended_at, status, mode, title")
    .eq("user_id", userId)
    .order("started_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  if (!sessions || sessions.length === 0) {
    return [] as JournalSession[];
  }

  const sessionIds = sessions.map((session) => session.id);
  const { data: summaries, error: summariesError } = await supabase
    .from("daily_summaries")
    .select("session_id, summary_json")
    .in("session_id", sessionIds);

  if (summariesError) {
    throw summariesError;
  }

  const summaryMap = new Map<string, DailySummary>();
  summaries?.forEach((row) => {
    try {
      summaryMap.set(row.session_id, JSON.parse(row.summary_json));
    } catch (_err) {
      summaryMap.set(row.session_id, {
        headline: "Summary unavailable",
        bullets: [],
      });
    }
  });

  return sessions.map((session) => ({
    id: session.id,
    userId: session.user_id,
    startedAt: session.started_at,
    endedAt: session.ended_at,
    status: session.status,
    mode: session.mode,
    title: session.title,
    summary: summaryMap.get(session.id) ?? null,
  })) as JournalSession[];
}
