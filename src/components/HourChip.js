import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, MIN_TOUCH } from '../theme';
import { getQuality } from '../domain/quality';

/**
 * Botão de horário (ex.: "10:00" + "Regular").
 *
 * Mostra a hora e a qualidade em TEXTO (não só por cor). Quando selecionado,
 * ganha borda grossa + "check", além da cor. Informa o estado selecionado às
 * tecnologias assistivas e tem alvo de toque adequado.
 */
export default function HourChip({ hourLabel, quality, selected, onPress }) {
  const q = getQuality(quality);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: !!selected }}
      accessibilityLabel={`${hourLabel}, qualidade ${q.label}`}
      accessibilityHint={selected ? undefined : 'Toque para escolher este horário'}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && { opacity: 0.85 },
      ]}
    >
      <View style={styles.hourRow}>
        <Text style={[styles.hour, selected && styles.hourSelected]}>{hourLabel}</Text>
        {selected ? (
          <Ionicons
            name="checkmark-circle"
            size={16}
            color={colors.primary}
            importantForAccessibility="no"
          />
        ) : null}
      </View>
      <Text style={[styles.quality, { color: q.colors.fg }]}>{q.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: MIN_TOUCH,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    justifyContent: 'center',
  },
  chipSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: '#EEF3FD',
  },
  hourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hour: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  hourSelected: { color: colors.primary },
  quality: { fontSize: 13, fontWeight: '600', marginTop: 2 },
});
