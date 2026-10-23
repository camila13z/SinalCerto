import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius, spacing } from '../theme';
import { getQuality } from '../domain/quality';

/**
 * Selo que representa a qualidade da conexão.
 *
 * Acessibilidade (RNF03): a informação NUNCA depende só da cor. O selo mostra
 * sempre, ao mesmo tempo:
 *   - um ÍCONE com forma distinta por estado (check / triângulo / x);
 *   - o TEXTO do estado ("Boa", "Regular", "Instável");
 *   - a COR apenas como reforço.
 * Para a leitura de tela, o conjunto é anunciado como "Qualidade: <estado>".
 *
 * size: 'sm' | 'md' | 'lg'
 */
export default function QualityBadge({ code, size = 'md', style }) {
  const q = getQuality(code);
  const dims = SIZES[size] || SIZES.md;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: q.colors.bg,
          borderColor: q.colors.border,
          paddingVertical: dims.padV,
          paddingHorizontal: dims.padH,
        },
        style,
      ]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Qualidade: ${q.label}`}
    >
      <Ionicons
        name={q.icon}
        size={dims.icon}
        color={q.colors.fg}
        style={{ marginRight: spacing.sm }}
        importantForAccessibility="no"
      />
      <Text
        style={{ color: q.colors.fg, fontSize: dims.font, fontWeight: '700' }}
      >
        {q.label}
      </Text>
    </View>
  );
}

const SIZES = {
  sm: { padV: 4, padH: 10, icon: 16, font: 13 },
  md: { padV: 6, padH: 12, icon: 20, font: 15 },
  lg: { padV: 10, padH: 16, icon: 26, font: 20 },
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radius.pill,
  },
});
