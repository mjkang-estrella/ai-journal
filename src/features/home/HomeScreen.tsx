import { useMemo } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Card } from "@/ui/Card";
import { Text } from "@/ui/Text";
import { colors, spacing } from "@/theme/tokens";

const RECENT_PLACEHOLDERS = [
  "Evening reflection",
  "Midweek reset",
  "Weekend recap",
];

export function HomeScreen() {
  const recentItems = useMemo(() => RECENT_PLACEHOLDERS, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text variant="title">Today</Text>
          <Text tone="secondary">
            A gentle check-in space for your day.
          </Text>
        </View>

        <Card>
          <View style={styles.cardHeader}>
            <Text variant="subtitle">Daily snapshot</Text>
            <Text tone="muted">Not started yet</Text>
          </View>
          <View style={styles.cardBody}>
            <Text tone="secondary">
              Capture a few lines about what feels most present right now.
            </Text>
          </View>
        </Card>

        <View style={styles.section}>
          <Text variant="subtitle">Recent entries</Text>
          <View style={styles.list}>
            {recentItems.map((label) => (
              <Card key={label} style={styles.listCard}>
                <Text variant="label">{label}</Text>
                <Text tone="muted">Draft preview goes here.</Text>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    gap: spacing.xs,
  },
  cardHeader: {
    gap: spacing.xs,
  },
  cardBody: {
    marginTop: spacing.sm,
  },
  section: {
    gap: spacing.sm,
  },
  list: {
    gap: spacing.sm,
  },
  listCard: {
    padding: spacing.md,
  },
});
