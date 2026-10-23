import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, typography, radius, MIN_TOUCH } from '../theme';
import { useApp } from '../context/AppContext';
import { fetchTimeline } from '../services';
import { getQuality } from '../domain/quality';
import { formatHour, formatFullDate, formatRtt, formatLoss } from '../domain/format';
import { QUALITY_LABEL } from '../i18n/labels';

import ScreenHeader from '../components/ScreenHeader';
import QualityBadge from '../components/QualityBadge';
import { Card, SourceTag, InfoNote } from '../components/primitives';
import { LoadingView, EmptyView } from '../components/states';

const FILTERS = ['ALL', 'GOOD', 'MODERATE', 'UNSTABLE'];

export default function TimelineScreen({ navigation }) {
  const { selectedModel, selectedModelId, probeId } = useApp();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const load = useCallback(async () => {
    setLoading(true);
    const d = await fetchTimeline({ probeId, modelId: selectedModelId, limit: 24 });
    setData(d);
    setLoading(false);
  }, [probeId, selectedModelId]);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    const items = data?.items || [];
    return {
      GOOD: items.filter((i) => i.quality === 'GOOD').length,
      MODERATE: items.filter((i) => i.quality === 'MODERATE').length,
      UNSTABLE: items.filter((i) => i.quality === 'UNSTABLE').length,
    };
  }, [data]);

  const items = data?.items || [];
  const visible = filter === 'ALL' ? items : items.filter((i) => i.quality === filter);
  const firstDate = items[0]?.predictionFor;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          overline="Planejar meu dia"
          title="Próximas previsões"
          onBack={() => navigation.goBack()}
        />

        {loading ? (
          <LoadingView />
        ) : (
          <>
            <Card style={styles.periodCard}>
              <Text style={typography.label}>PERÍODO DISPONÍVEL</Text>
              <Text style={typography.bodyStrong}>
                {firstDate ? capitalize(formatFullDate(firstDate)) : '—'}
              </Text>
              <Text style={typography.secondary}>Previsões de hora em hora</Text>
            </Card>

            <View style={{ height: spacing.md }} />
            <SourceTag source={data?.source} modelName={selectedModel?.name} />

            {/* Resumo em texto (ajuda leitura de tela e baixa carga cognitiva) */}
            <View style={{ marginTop: spacing.lg }}>
              <InfoNote icon="reader" title={`${counts.GOOD} horário(s) com qualidade boa`}>
                {`Também há ${counts.MODERATE} regular(es) e ${counts.UNSTABLE} instável(is). Confira cada horário abaixo.`}
              </InfoNote>
            </View>

            {/* Filtros */}
            <View
              style={styles.filters}
              accessibilityRole="radiogroup"
              accessibilityLabel="Filtrar por qualidade"
            >
              {FILTERS.map((f) => (
                <FilterChip
                  key={f}
                  value={f}
                  active={filter === f}
                  onPress={() => setFilter(f)}
                />
              ))}
            </View>

            {/* Lista */}
            {visible.length === 0 ? (
              <EmptyView message="Nenhum horário para este filtro." />
            ) : (
              <View style={{ marginTop: spacing.sm }}>
                {visible.map((it) => (
                  <View
                    key={it.predictionFor}
                    style={styles.row}
                    accessible
                    accessibilityRole="text"
                    accessibilityLabel={`${formatHour(it.predictionFor)}, qualidade ${
                      getQuality(it.quality).label
                    }. Tempo de resposta ${formatRtt(it.rttMs)}, dados perdidos ${formatLoss(
                      it.lossPct
                    )}.`}
                  >
                    <View style={styles.rowLeft}>
                      <Text style={styles.rowHour}>{formatHour(it.predictionFor)}</Text>
                      <Text style={typography.secondary}>
                        {formatRtt(it.rttMs)} · {formatLoss(it.lossPct)} perdidos
                      </Text>
                    </View>
                    <QualityBadge code={it.quality} size="sm" />
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function FilterChip({ value, active, onPress }) {
  const label = value === 'ALL' ? 'Todos' : QUALITY_LABEL[value];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.filterChip,
        active && styles.filterChipActive,
        pressed && { opacity: 0.8 },
      ]}
    >
      {active ? (
        <Ionicons
          name="checkmark"
          size={16}
          color={colors.primaryText}
          style={{ marginRight: 4 }}
          importantForAccessibility="no"
        />
      ) : null}
      <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
    </Pressable>
  );
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  periodCard: { backgroundColor: colors.surfaceAlt },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  filterChip: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { color: colors.textPrimary, fontWeight: '700', fontSize: 14 },
  filterTextActive: { color: colors.primaryText },
  row: {
    minHeight: MIN_TOUCH + 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  rowLeft: { flexShrink: 1, paddingRight: spacing.md },
  rowHour: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
});
