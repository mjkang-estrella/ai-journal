import { SafeAreaView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Text } from "@/ui/Text";
import { colors, spacing } from "@/theme/tokens";
import { useOnboarding } from "@/state/onboarding";

export function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding, loading } = useOnboarding();

  const handleContinue = async () => {
    await completeOnboarding();
    router.replace("/(tabs)/home");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="title">Welcome to Journal2</Text>
          <Text tone="secondary">
            A calm space to write, reflect, and notice patterns over time.
          </Text>
        </View>

        <Card>
          <View style={styles.cardStack}>
            <Text variant="subtitle">What to expect</Text>
            <Text tone="secondary">
              Start with a few sentences, then answer one thoughtful follow-up.
            </Text>
            <Text tone="secondary">
              We will help summarize your day and surface gentle insights.
            </Text>
          </View>
        </Card>

        <View style={styles.footer}>
          <Button
            label={loading ? "Loading..." : "Get started"}
            onPress={handleContinue}
            disabled={loading}
          />
          <Text tone="muted">
            You can update reminders and privacy settings anytime.
          </Text>
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
    justifyContent: "space-between",
  },
  header: {
    gap: spacing.sm,
  },
  cardStack: {
    gap: spacing.sm,
  },
  footer: {
    gap: spacing.sm,
  },
});
