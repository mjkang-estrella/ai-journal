import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

const MOCK_AI_KEY = "mock_ai_enabled";

type SettingsContextValue = {
  mockAiEnabled: boolean;
  loading: boolean;
  toggleMockAi: () => Promise<void>;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [mockAiEnabled, setMockAiEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem(MOCK_AI_KEY)
      .then((value) => {
        if (!isMounted) return;
        if (value === null) {
          setMockAiEnabled(true);
          return;
        }
        setMockAiEnabled(value === "true");
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

  const toggleMockAi = async () => {
    const next = !mockAiEnabled;
    setMockAiEnabled(next);
    await AsyncStorage.setItem(MOCK_AI_KEY, String(next));
  };

  const value = useMemo(
    () => ({
      mockAiEnabled,
      loading,
      toggleMockAi,
    }),
    [mockAiEnabled, loading]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}
