import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { saveCompletedSession } from "@/data/journalRepository";
import { extractSummary } from "@/services/extractor";
import { getNextQuestion } from "@/services/questionEngine";
import { useAuth } from "@/state/auth";
import { useJournalStore } from "@/state/journal";
import { useSettings } from "@/state/settings";
import type { AIQuestion, DailySummary, JournalSession } from "@/types/domain";

export function JournalScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const { mockAiEnabled } = useSettings();
  const { addSession } = useJournalStore();
  const [draftText, setDraftText] = useState("");
  const [question, setQuestion] = useState<AIQuestion | null>(null);
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [completing, setCompleting] = useState(false);

  const meDb = useMemo(
    () => ({
      profile: {},
      state: {},
      patterns: {},
      trust: {},
    }),
    [],
  );

  const handleNextQuestion = async () => {
    if (!draftText.trim()) {
      Alert.alert(
        "Start with a draft",
        "Write a bit before requesting a question.",
      );
      return;
    }
    setLoadingQuestion(true);
    try {
      const next = await getNextQuestion({
        draftText,
        askedQuestions,
        meDb,
        mockMode: mockAiEnabled,
      });
      setQuestion(next);
      setAskedQuestions((prev) => [...prev, next.question]);
    } catch (error) {
      Alert.alert("Question unavailable", "Try again in a moment.");
    } finally {
      setLoadingQuestion(false);
    }
  };

  const handleComplete = async () => {
    if (!draftText.trim()) {
      Alert.alert("Draft is empty", "Write something before completing.");
      return;
    }
    if (!session?.user?.id) {
      Alert.alert("Sign in required", "Please sign in before saving.");
      router.replace("/onboarding");
      return;
    }

    setCompleting(true);
    try {
      const extracted = await extractSummary({
        finalText: draftText,
        meDb,
        mockMode: mockAiEnabled,
      });
      setSummary(extracted);

      const saved = await saveCompletedSession({
        userId: session.user.id,
        draftText,
        summary: extracted,
      });

      addSession(saved);
      setDraftText("");
      setQuestion(null);
      setAskedQuestions([]);
      Alert.alert("Session saved", "Your entry is in history.");
    } catch (error) {
      const fallbackSummary =
        summary ??
        ({
          headline: "Session",
          bullets: [],
        } as DailySummary);
      const fallback: JournalSession = {
        id: `local-${Date.now()}`,
        userId: session?.user?.id ?? "local",
        startedAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
        status: "completed",
        mode: "text",
        title: fallbackSummary.headline,
        summary: fallbackSummary,
      };
      addSession(fallback);
      Alert.alert(
        "Saved locally",
        "Could not reach the backend. Saved in memory.",
      );
    } finally {
      setCompleting(false);
    }
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Today’s Journal</Text>
          <Text style={styles.subtitle}>
            Capture the day, then ask for a nudge.
          </Text>
        </View>

        <TextField
          label="Draft"
          value={draftText}
          onChangeText={setDraftText}
          placeholder="Start writing..."
          multiline
        />

        {question ? (
          <View style={styles.questionCard}>
            <Text style={styles.questionLabel}>Nudge</Text>
            <Text style={styles.questionText}>{question.question}</Text>
          </View>
        ) : null}

        <View style={styles.actions}>
          <Button
            label={loadingQuestion ? "Loading..." : "Next Question"}
            onPress={handleNextQuestion}
            disabled={loadingQuestion}
          />
          <Button
            label={completing ? "Saving..." : "Complete Session"}
            onPress={handleComplete}
            disabled={completing}
            variant="secondary"
          />
        </View>

        <View style={styles.linkRow}>
          <Button
            label="History"
            onPress={() => router.push("/history")}
            variant="ghost"
          />
          <Button
            label="Settings"
            onPress={() => router.push("/settings")}
            variant="ghost"
          />
        </View>

        {summary ? (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Latest Summary</Text>
            <Text style={styles.summaryHeadline}>{summary.headline}</Text>
            {summary.bullets.map((bullet) => (
              <Text key={bullet} style={styles.summaryBullet}>
                • {bullet}
              </Text>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    gap: 16,
    paddingBottom: 40,
  },
  header: {
    gap: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#4B5563",
  },
  questionCard: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    gap: 6,
  },
  questionLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#4338CA",
  },
  questionText: {
    fontSize: 16,
    color: "#1E1B4B",
  },
  actions: {
    gap: 12,
  },
  linkRow: {
    flexDirection: "row",
    gap: 12,
  },
  summaryCard: {
    backgroundColor: "#F3F4F6",
    padding: 14,
    borderRadius: 12,
    gap: 6,
  },
  summaryTitle: {
    fontWeight: "700",
    color: "#111827",
  },
  summaryHeadline: {
    fontSize: 16,
    color: "#111827",
  },
  summaryBullet: {
    color: "#374151",
  },
});
