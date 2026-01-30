import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

const ONBOARDING_KEY = "needs_onboarding";

type OnboardingContextValue = {
  needsOnboarding: boolean;
  loading: boolean;
  completeOnboarding: () => Promise<void>;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [needsOnboarding, setNeedsOnboarding] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    AsyncStorage.getItem(ONBOARDING_KEY)
      .then((value) => {
        if (!isMounted) return;
        if (value === null) {
          setNeedsOnboarding(true);
          return;
        }
        setNeedsOnboarding(value === "true");
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const completeOnboarding = async () => {
    setNeedsOnboarding(false);
    await AsyncStorage.setItem(ONBOARDING_KEY, "false");
  };

  const value = useMemo(
    () => ({
      needsOnboarding,
      loading,
      completeOnboarding,
    }),
    [needsOnboarding, loading]
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
}
