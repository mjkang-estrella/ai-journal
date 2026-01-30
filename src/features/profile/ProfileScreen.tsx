import { SafeAreaView, StyleSheet, View } from "react-native";
import { Card } from "@/ui/Card";
import { Text } from "@/ui/Text";
import { colors, spacing } from "@/theme/tokens";

export function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="title">Profile</Text>
          <Text tone="secondary">
            Preferences and privacy controls live here.
          </Text>
        </View>

        <View style={styles.section}>
          <Card>
            <Text variant="subtitle">Profile</Text>
            <Text tone="muted">Name, timezone, and journaling cadence.</Text>
          </Card>
          <Card>
            <Text variant="subtitle">Settings</Text>
            <Text tone="muted">Notifications, reminders, and export.</Text>
          </Card>
          <Card>
            <Text variant="subtitle">Privacy</Text>
            <Text tone="muted">Encryption, data controls, and safety.</Text>
          </Card>
        </View>
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
  section: {
    gap: spacing.md,
  },
});
