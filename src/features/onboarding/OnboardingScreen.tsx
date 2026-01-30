import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { useAuth } from "@/state/auth";

export function OnboardingScreen() {
  const router = useRouter();
  const { session, signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.replace("/journal");
    }
  }, [session, router]);

  const handleSignIn = async () => {
    setLoading(true);
    setMessage(null);
    const result = await signIn(email.trim(), password);
    setLoading(false);

    if (result.error) {
      setMessage(result.error);
      return;
    }

    router.replace("/journal");
  };

  const handleSignUp = async () => {
    setLoading(true);
    setMessage(null);
    const result = await signUp(email.trim(), password);
    setLoading(false);

    if (result.error) {
      setMessage(result.error);
      return;
    }

    setMessage("Check your email to confirm your account, then sign in.");
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Journal2</Text>
        <Text style={styles.subtitle}>Sign in to start your session.</Text>
      </View>

      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
      />
      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Minimum 6 characters"
        secureTextEntry
      />

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <View style={styles.actions}>
        <Button label="Sign In" onPress={handleSignIn} disabled={loading} />
        <Button
          label="Create Account"
          onPress={handleSignUp}
          disabled={loading}
          variant="secondary"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 15,
    color: "#4B5563",
  },
  message: {
    color: "#B45309",
    backgroundColor: "#FEF3C7",
    padding: 10,
    borderRadius: 8,
  },
  actions: {
    gap: 12,
  },
});
