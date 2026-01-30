import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type LoadingScreenProps = {
  label?: string;
};

export function LoadingScreen({ label = "Loading" }: LoadingScreenProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    gap: 12,
    padding: 24,
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
});
