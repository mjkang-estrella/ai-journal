import { useEffect, useRef } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Card } from "@/ui/Card";
import { Text } from "@/ui/Text";
import { colors, spacing } from "@/theme/tokens";

const createMockSessionId = () => {
  const time = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `session-${time}-${rand}`;
};

export function AddJournalScreen() {
  const router = useRouter();
  const hasRouted = useRef(false);

  useEffect(() => {
    if (hasRouted.current) return;
    hasRouted.current = true;
    const sessionId = createMockSessionId();
    router.replace(`/(tabs)/home/journal/${sessionId}`);
  }, [router]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Card>
          <Text variant="subtitle">Starting a new entry</Text>
          <Text tone="muted">Setting up a fresh session for your journal.</Text>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: "center",
  },
});
