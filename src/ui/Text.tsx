import { Text as RNText, StyleSheet, TextProps } from "react-native";
import { colors, typography } from "@/theme/tokens";

type TextVariant = "title" | "subtitle" | "body" | "label" | "caption";
type TextTone = "primary" | "secondary" | "muted";

type AppTextProps = TextProps & {
  variant?: TextVariant;
  tone?: TextTone;
};

const variantStyles = StyleSheet.create({
  title: typography.title,
  subtitle: typography.subtitle,
  body: typography.body,
  label: typography.label,
  caption: typography.caption,
});

const toneStyles = StyleSheet.create({
  primary: { color: colors.textPrimary },
  secondary: { color: colors.textSecondary },
  muted: { color: colors.textMuted },
});

export function Text({
  variant = "body",
  tone = "primary",
  style,
  ...props
}: AppTextProps) {
  return (
    <RNText
      {...props}
      style={[styles.base, variantStyles[variant], toneStyles[tone], style]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
