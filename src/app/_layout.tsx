import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { AuthProvider } from "@/state/auth";
import { JournalProvider } from "@/state/journal";
import { OnboardingProvider, useOnboarding } from "@/state/onboarding";
import { SettingsProvider } from "@/state/settings";

export default function RootLayout() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <JournalProvider>
          <OnboardingProvider>
            <RootNavigator />
          </OnboardingProvider>
        </JournalProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

function RootNavigator() {
  const router = useRouter();
  const segments = useSegments();
  const { loading, needsOnboarding } = useOnboarding();

  const inOnboardingGroup = segments[0] === "(onboarding)";
  const inTabsGroup = segments[0] === "(tabs)";

  useEffect(() => {
    if (loading) return;

    if (needsOnboarding && !inOnboardingGroup) {
      router.replace("/");
      return;
    }

    if (!needsOnboarding && !inTabsGroup) {
      router.replace("/(tabs)/home");
    }
  }, [inOnboardingGroup, inTabsGroup, loading, needsOnboarding, router]);

  if (loading) {
    return <LoadingScreen label="Preparing your journal" />;
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
