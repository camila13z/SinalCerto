import React, { useRef, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, AccessibilityInfo, findNodeHandle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, MIN_TOUCH } from '../theme';

/**
 * Cabeçalho reutilizável para telas internas.
 *
 * - O título é marcado como accessibilityRole="header".
 * - Ao abrir a tela, o foco da leitura de tela é movido para o título, para
 *   comunicar a mudança de contexto sem perda (RNF08).
 * - O botão voltar tem rótulo claro e alvo de toque de 48dp.
 */
export default function ScreenHeader({ title, overline, onBack }) {
  const titleRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => {
      const node = findNodeHandle(titleRef.current);
      if (node) AccessibilityInfo.setAccessibilityFocus(node);
    }, 250);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          hitSlop={8}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} importantForAccessibility="no" />
        </Pressable>
      ) : null}
      <View style={styles.titleBlock}>
        {overline ? <Text style={typography.label}>{overline.toUpperCase()}</Text> : null}
        <Text ref={titleRef} accessibilityRole="header" style={typography.title}>
          {title}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: spacing.md,
  },
  backBtn: {
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    borderRadius: MIN_TOUCH / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  titleBlock: { flexShrink: 1 },
});
