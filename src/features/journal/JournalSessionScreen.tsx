import { SafeAreaView, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Card } from "@/ui/Card";
import { Text } from "@/ui/Text";
import { colors, spacing } from "@/theme/tokens";

type JournalParams = {
  id?: string;
};

export function JournalSessionScreen() {
  const { id } = useLocalSearchParams<JournalParams>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="title">Journal session</Text>
          <Text tone="muted">Session ID: {id ?? "new-session"}</Text>
        </View>

        <Card>
          <Text variant="subtitle">Draft space</Text>
          <Text tone="secondary">
            This is where the journaling editor will live.
          </Text>
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
    gap: spacing.lg,
  },
  header: {
    gap: spacing.xs,
  },
});
