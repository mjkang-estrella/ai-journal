import { useRouter } from "expo-router";
import { StyleSheet, Switch, Text, View } from "react-native";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { useAuth } from "@/state/auth";
import { useSettings } from "@/state/settings";

export function SettingsScreen() {
  const router = useRouter();
  const { session, signOut } = useAuth();
  const { mockAiEnabled, toggleMockAi } = useSettings();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/onboarding");
  };

  return (
    <Screen>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={styles.label}>Mock AI mode</Text>
          <Text style={styles.helper}>Use stubbed AI responses.</Text>
        </View>
        <Switch value={mockAiEnabled} onValueChange={toggleMockAi} />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Signed in as</Text>
        <Text style={styles.value}>{session?.user?.email ?? "Unknown"}</Text>
      </View>

      <Button label="Sign Out" onPress={handleSignOut} variant="secondary" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  rowText: {
    flex: 1,
    marginRight: 12,
    gap: 4,
  },
  label: {
    fontWeight: "600",
    color: "#111827",
  },
  helper: {
    color: "#6B7280",
    fontSize: 12,
  },
  card: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 6,
  },
  value: {
    color: "#374151",
  },
});
