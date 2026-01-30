import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/state/auth";
import { JournalProvider } from "@/state/journal";
import { SettingsProvider } from "@/state/settings";

export default function RootLayout() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <JournalProvider>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }} />
        </JournalProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
