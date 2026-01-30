import { Redirect } from "expo-router";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useAuth } from "@/state/auth";

export default function Index() {
  const { session, loading } = useAuth();

  if (loading) {
    return <LoadingScreen label="Checking session" />;
  }

  return session ? <Redirect href="/journal" /> : <Redirect href="/onboarding" />;
}
