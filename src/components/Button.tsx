import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

type ButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  style?: ViewStyle;
};

export function Button({
  label,
  onPress,
  disabled = false,
  variant = "primary",
  style,
}: ButtonProps) {
  const labelStyles = [
    styles.label,
    variant === "primary" ? null : styles.darkLabel,
  ];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
        style,
      ]}
    >
      <Text style={labelStyles}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  primary: {
    backgroundColor: "#111827",
  },
  secondary: {
    backgroundColor: "#E5E7EB",
  },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: "#fff",
    fontWeight: "600",
  },
  darkLabel: {
    color: "#111827",
  },
});
