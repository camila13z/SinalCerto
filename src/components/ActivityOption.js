import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography, MIN_TOUCH } from '../theme';

/**
 * Cartão de atividade selecionável (ex.: "Chamada de vídeo").
 *
 * Acessibilidade:
 *  - A seleção NÃO depende só de cor: o item selecionado ganha borda mais
 *    grossa + um ícone de "check" + o texto "Selecionado".
 *  - accessibilityRole="radio" e accessibilityState={{ selected }} informam o
 *    estado às tecnologias assistivas (RNF02).
 *  - Área de toque confortável (>= 48dp).
 */
export default function ActivityOption({ label, icon, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: !!selected }}
      accessibilityLabel={label}
      accessibilityHint={selected ? 'Selecionado' : 'Toque para selecionar esta atividade'}
      style={({ pressed }) => [
        styles.option,
        selected && styles.optionSelected,
        pressed && { opacity: 0.85 },
      ]}
    >
      <View style={styles.iconWrap}>
        <Ionicons
          name={icon}
          size={24}
          color={selected ? colors.primary : colors.textSecondary}
          importantForAccessibility="no"
        />
      </View>
      <Text style={[typography.bodyStrong, styles.label]} numberOfLines={2}>
        {label}
      </Text>
      {selected ? (
        <View style={styles.selectedRow}>
          <Ionicons
            name="checkmark-circle"
            size={16}
            color={colors.primary}
            importantForAccessibility="no"
          />
          <Text style={styles.selectedText}>Selecionado</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    minHeight: MIN_TOUCH + 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    justifyContent: 'center',
  },
  optionSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: '#EEF3FD',
  },
  iconWrap: { marginBottom: spacing.sm },
  label: {},
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  selectedText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
    marginLeft: 4,
  },
});
