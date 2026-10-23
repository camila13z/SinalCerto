import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, MIN_TOUCH } from '../theme';

/**
 * Botões do app. Todos:
 *  - têm área de toque mínima de 48dp (RNF09);
 *  - expõem accessibilityRole="button" e um rótulo claro;
 *  - informam estado desabilitado às tecnologias assistivas (RNF02);
 *  - funcionam com toque simples, sem gestos complexos (RNF06).
 */

export function PrimaryButton({ title, onPress, icon, disabled, accessibilityHint, style }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.base,
        styles.primary,
        pressed && styles.primaryPressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.primaryText}>{title}</Text>
        {icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={colors.primaryText}
            style={styles.iconRight}
            importantForAccessibility="no"
          />
        ) : null}
      </View>
    </Pressable>
  );
}

export function SecondaryButton({ title, onPress, icon, disabled, accessibilityHint, style }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.base,
        styles.secondary,
        pressed && styles.secondaryPressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.content}>
        {icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={colors.primary}
            style={styles.iconLeft}
            importantForAccessibility="no"
          />
        ) : null}
        <Text style={styles.secondaryText}>{title}</Text>
      </View>
    </Pressable>
  );
}

export function LinkButton({ title, onPress, icon, accessibilityHint, align = 'center', style }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      hitSlop={10}
      style={({ pressed }) => [
        styles.link,
        { justifyContent: align === 'left' ? 'flex-start' : 'center' },
        pressed && { opacity: 0.6 },
        style,
      ]}
    >
      <Text style={styles.linkText}>{title}</Text>
      {icon ? (
        <Ionicons
          name={icon}
          size={16}
          color={colors.primary}
          style={styles.iconRight}
          importantForAccessibility="no"
        />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: MIN_TOUCH,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primary: { backgroundColor: colors.primary },
  primaryPressed: { backgroundColor: colors.primaryPressed },
  primaryText: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  secondaryPressed: { backgroundColor: '#EEF3FD' },
  secondaryText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  disabled: { opacity: 0.45 },
  link: {
    minHeight: MIN_TOUCH,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  linkText: { color: colors.primary, fontSize: 16, fontWeight: '700' },
  iconLeft: { marginRight: spacing.sm },
  iconRight: { marginLeft: spacing.sm },
});

export default { PrimaryButton, SecondaryButton, LinkButton };
