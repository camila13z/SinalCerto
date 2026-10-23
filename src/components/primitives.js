import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';

/** Cartão base. */
export function Card({ children, style, accessibilityLabel, ...rest }) {
  return (
    <View
      style={[styles.card, style]}
      accessibilityLabel={accessibilityLabel}
      {...rest}
    >
      {children}
    </View>
  );
}

/** Rótulo pequeno em maiúsculas + título de seção. */
export function SectionTitle({ overline, title, action }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleBlock}>
        {overline ? (
          <Text style={typography.label} accessibilityRole="header">
            {overline.toUpperCase()}
          </Text>
        ) : null}
        {title ? (
          <Text style={typography.sectionTitle} accessibilityRole="header">
            {title}
          </Text>
        ) : null}
      </View>
      {action ? <View>{action}</View> : null}
    </View>
  );
}

export function Divider({ style }) {
  return <View style={[styles.divider, style]} />;
}

/** Linha "rótulo .... valor", com o par lido em conjunto pela leitura de tela. */
export function MetricRow({ label, value, sublabel }) {
  return (
    <View
      style={styles.metricRow}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${label}${sublabel ? ', ' + sublabel : ''}: ${value}`}
    >
      <View style={styles.metricLabelBlock}>
        <Text style={typography.body}>{label}</Text>
        {sublabel ? <Text style={typography.secondary}>{sublabel}</Text> : null}
      </View>
      <Text style={[typography.bodyStrong, styles.metricValue]}>{value}</Text>
    </View>
  );
}

/** Indicador de origem dos dados (API real ou dados simulados). */
export function SourceTag({ source, modelName }) {
  const isMock = source === 'mock';
  const base = modelName ? `Dados da Internet Quality API · ${modelName}` : 'Dados da Internet Quality API';
  const text = isMock
    ? 'Dados simulados (servidor indisponível no momento)'
    : base;
  return (
    <View
      style={[styles.sourceTag, isMock ? styles.sourceTagMock : styles.sourceTagApi]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={text}
    >
      <Ionicons
        name={isMock ? 'cloud-offline' : 'information-circle'}
        size={16}
        color={isMock ? colors.quality.MODERATE.fg : colors.primary}
        style={{ marginRight: spacing.sm }}
        importantForAccessibility="no"
      />
      <Text style={[typography.secondary, styles.sourceText]}>{text}</Text>
    </View>
  );
}

/** Bloco informativo neutro, com título e texto. */
export function InfoNote({ icon = 'information-circle', title, children, style }) {
  return (
    <View style={[styles.infoNote, style]} accessible accessibilityRole="text">
      <Ionicons
        name={icon}
        size={20}
        color={colors.primary}
        style={{ marginRight: spacing.md, marginTop: 2 }}
        importantForAccessibility="no"
      />
      <View style={{ flex: 1 }}>
        {title ? <Text style={typography.bodyStrong}>{title}</Text> : null}
        {typeof children === 'string' ? (
          <Text style={[typography.secondary, { marginTop: title ? 2 : 0 }]}>{children}</Text>
        ) : (
          children
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitleBlock: { flexShrink: 1, paddingRight: spacing.sm },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  metricLabelBlock: { flexShrink: 1, paddingRight: spacing.md },
  metricValue: { textAlign: 'right' },
  sourceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  sourceTagApi: { backgroundColor: colors.surfaceInfo },
  sourceTagMock: { backgroundColor: colors.quality.MODERATE.bg },
  sourceText: { flex: 1, flexWrap: 'wrap' },
  infoNote: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceInfo,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
});

export default { Card, SectionTitle, Divider, MetricRow, SourceTag, InfoNote };
