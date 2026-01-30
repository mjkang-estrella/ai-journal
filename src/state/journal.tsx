import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import type { JournalSession } from "@/types/domain";

type JournalContextValue = {
  sessions: JournalSession[];
  addSession: (session: JournalSession) => void;
  clearSessions: () => void;
};

const JournalContext = createContext<JournalContextValue | null>(null);

export function JournalProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<JournalSession[]>([]);

  const addSession = (session: JournalSession) => {
    setSessions((prev) => [session, ...prev]);
  };

  const clearSessions = () => {
    setSessions([]);
  };

  const value = useMemo(
    () => ({
      sessions,
      addSession,
      clearSessions,
    }),
    [sessions]
  );

  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>;
}

export function useJournalStore() {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error("useJournalStore must be used within JournalProvider");
  }
  return context;
}
