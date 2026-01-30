import { useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { fetchRecentSessions } from "@/data/journalRepository";
import { useAuth } from "@/state/auth";
import { useJournalStore } from "@/state/journal";
import type { JournalSession } from "@/types/domain";

export function HistoryScreen() {
  const { session } = useAuth();
  const { sessions: localSessions } = useJournalStore();
  const [remoteSessions, setRemoteSessions] = useState<JournalSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = async () => {
    if (!session?.user?.id) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecentSessions(session.user.id, 20);
      setRemoteSessions(data);
    } catch (err) {
      setError("Unable to reach the backend. Showing local history only.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [session?.user?.id]);

  const combined = useMemo(() => {
    const map = new Map<string, JournalSession>();
    remoteSessions.forEach((sessionItem) => map.set(sessionItem.id, sessionItem));
    localSessions.forEach((sessionItem) => {
      if (!map.has(sessionItem.id)) {
        map.set(sessionItem.id, sessionItem);
      }
    });
    return Array.from(map.values());
  }, [remoteSessions, localSessions]);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <Button label="Refresh" onPress={loadSessions} variant="ghost" />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadSessions} />}
      >
        {combined.length === 0 ? (
          <Text style={styles.empty}>No sessions yet.</Text>
        ) : (
          combined.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.cardTitle}>{item.title ?? "Session"}</Text>
              <Text style={styles.cardMeta}>{new Date(item.startedAt).toDateString()}</Text>
              {item.summary?.bullets?.length ? (
                <Text style={styles.cardBody}>{item.summary.bullets[0]}</Text>
              ) : null}
            </View>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  list: {
    gap: 12,
    paddingBottom: 40,
  },
  card: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 6,
  },
  cardTitle: {
    fontWeight: "700",
    color: "#111827",
  },
  cardMeta: {
    fontSize: 12,
    color: "#6B7280",
  },
  cardBody: {
    color: "#374151",
  },
  empty: {
    color: "#6B7280",
  },
  error: {
    color: "#B45309",
    backgroundColor: "#FEF3C7",
    padding: 8,
    borderRadius: 8,
  },
});
