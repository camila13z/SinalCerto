import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, typography, radius } from '../theme';
import { useApp } from '../context/AppContext';
import { fetchNearbyForecast, fetchTimeline } from '../services';
import { getQuality, suitabilityFor } from '../domain/quality';
import { formatRtt, formatLoss, formatFullDate, formatDistance, formatHour } from '../domain/format';
import { ACTIVITIES, SUITABILITY, RECOMMENDATION_LABEL } from '../i18n/labels';

import QualityBadge from '../components/QualityBadge';
import { Card, SectionTitle, Divider, MetricRow, SourceTag } from '../components/primitives';
import { PrimaryButton, SecondaryButton, LinkButton } from '../components/buttons';
import { LoadingView, ErrorView } from '../components/states';

export default function ForecastScreen({ navigation }) {
  const { selectedModel, selectedModelId, location, locationResolved, setProbeId, loadingModels } =
    useApp();
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState(null);
  const [day, setDay] = useState(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    if (!selectedModelId || !locationResolved) return;
    setLoading(true);
    setFailed(false);
    const f = await fetchNearbyForecast({
      lat: location.latitude,
      lon: location.longitude,
      modelId: selectedModelId,
    });
    setForecast(f);
    if (f?.probeId) setProbeId(f.probeId);
    const d = await fetchTimeline({ probeId: f?.probeId, modelId: selectedModelId, limit: 24 });
    setDay(d);
    setLoading(false);
  }, [selectedModelId, locationResolved, location, setProbeId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading || loadingModels || !locationResolved) {
    return (
      <SafeAreaView style={styles.safe}>
        <LoadingView />
      </SafeAreaView>
    );
  }

  if (failed || !forecast) {
    return (
      <SafeAreaView style={styles.safe}>
        <ErrorView onRetry={load} message="Verifique sua conexão e tente novamente." />
      </SafeAreaView>
    );
  }

  const q = getQuality(forecast.quality);
  const daySample = sampleDay(day?.items || []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Cabeçalho */}
        <Text style={typography.label}>PREVISÃO MAIS RECENTE</Text>
        <Text style={[typography.display, styles.greeting]} accessibilityRole="header">
          Como deve estar sua conexão?
        </Text>
        {forecast.predictionFor ? (
          <Text style={[typography.secondary, { marginBottom: spacing.lg }]}>
            {capitalize(formatFullDate(forecast.predictionFor))}
            {forecast.predictionFor ? ` · ${formatHour(forecast.predictionFor)}` : ''}
          </Text>
        ) : null}

        {/* Cartão principal de qualidade */}
        <Card
          style={[styles.heroCard, { borderColor: q.colors.border, backgroundColor: q.colors.bg }]}
        >
          <Text style={[typography.label, { color: q.colors.fg }]}>QUALIDADE PREVISTA</Text>
          <View style={styles.heroBadgeRow}>
            <QualityBadge code={forecast.quality} size="lg" />
          </View>
          <Text style={[typography.body, { color: q.colors.fg, marginTop: spacing.md }]}>
            {q.description}
          </Text>
          {forecast.recommendation ? (
            <View
              style={styles.recRow}
              accessible
              accessibilityRole="text"
              accessibilityLabel={`Recomendação: ${
                forecast.recommendation.message || RECOMMENDATION_LABEL[forecast.recommendation.code]
              }`}
            >
              <Ionicons
                name="bulb"
                size={18}
                color={q.colors.fg}
                style={{ marginRight: spacing.sm }}
                importantForAccessibility="no"
              />
              <Text style={[typography.bodyStrong, { color: q.colors.fg, flex: 1 }]}>
                {forecast.recommendation.message ||
                  RECOMMENDATION_LABEL[forecast.recommendation.code]}
              </Text>
            </View>
          ) : null}
        </Card>

        <View style={{ height: spacing.md }} />
        <SourceTag source={forecast.source} modelName={selectedModel?.name} />

        {/* O que dá pra fazer agora (RQ03) */}
        <View style={styles.section}>
          <SectionTitle overline="Guia rápido" title="O que dá pra fazer agora" />
          <Card>
            {ACTIVITIES.map((act, idx) => {
              const s = suitabilityFor(forecast.quality, act.id);
              const info = SUITABILITY[s];
              const sColors = getQuality(info.quality).colors;
              return (
                <View key={act.id}>
                  {idx > 0 ? <Divider /> : null}
                  <View
                    style={styles.activityRow}
                    accessible
                    accessibilityRole="text"
                    accessibilityLabel={`${act.label}: ${info.label}`}
                  >
                    <Ionicons
                      name={act.icon}
                      size={22}
                      color={colors.textSecondary}
                      style={{ marginRight: spacing.md }}
                      importantForAccessibility="no"
                    />
                    <Text style={[typography.body, { flex: 1 }]}>{act.label}</Text>
                    <View style={styles.suitWrap}>
                      <Ionicons
                        name={info.icon}
                        size={18}
                        color={sColors.fg}
                        style={{ marginRight: 4 }}
                        importantForAccessibility="no"
                      />
                      <Text style={{ color: sColors.fg, fontWeight: '700', fontSize: 13 }}>
                        {info.label}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </Card>
          <PrimaryButton
            title="Planejar uma atividade"
            icon="chevron-forward"
            onPress={() => navigation.navigate('Activity')}
            accessibilityHint="Abre a tela para verificar uma atividade em um horário"
            style={{ marginTop: spacing.md }}
          />
        </View>

        {/* Detalhes da previsão */}
        <View style={styles.section}>
          <SectionTitle title="Detalhes da previsão" />
          <Card>
            <MetricRow
              label="Tempo de resposta"
              sublabel="quanto menor, mais rápida"
              value={formatRtt(forecast.rttMs)}
            />
            <Divider />
            <MetricRow
              label="Dados perdidos"
              sublabel="acima de 1% pode travar"
              value={formatLoss(forecast.lossPct)}
            />
            <Divider />
            <View
              style={styles.refBlock}
              accessible
              accessibilityRole="text"
              accessibilityLabel={`Referência de medição: Ponto a ${formatDistance(
                forecast.distanceKm
              )}`}
            >
              <Text style={typography.body}>Referência de medição</Text>
              <Text style={[typography.secondary, { marginTop: 2 }]}>
                {`Ponto a ${formatDistance(forecast.distanceKm)}`}
              </Text>
            </View>
          </Card>
          <SecondaryButton
            title="Entender esses números"
            icon="help-circle"
            onPress={() => navigation.navigate('Glossary')}
            style={{ marginTop: spacing.md }}
          />
        </View>

        {/* Amostra do dia */}
        {daySample.length ? (
          <View style={styles.section}>
            <SectionTitle
              overline="Visão do dia"
              title="Como está o dia"
              action={
                <LinkButton
                  title="Ver tudo"
                  icon="chevron-forward"
                  onPress={() => navigation.navigate('Timeline')}
                  accessibilityHint="Abre a lista hora a hora"
                />
              }
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dayStrip}
            >
              {daySample.map((it) => (
                <View
                  key={it.predictionFor}
                  style={styles.daySlot}
                  accessible
                  accessibilityRole="text"
                  accessibilityLabel={`${formatHour(it.predictionFor)}, qualidade ${
                    getQuality(it.quality).label
                  }`}
                >
                  <Text style={[typography.bodyStrong, styles.daySlotHour]}>
                    {formatHour(it.predictionFor)}
                  </Text>
                  <QualityBadge code={it.quality} size="sm" />
                </View>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {/* Modelo em uso */}
        <View style={styles.section}>
          <Card style={styles.modelCard}>
            <View style={{ flex: 1 }}>
              <Text style={typography.label}>MODELO EM USO</Text>
              <Text style={typography.bodyStrong}>{selectedModel?.name || '—'}</Text>
              {selectedModel?.groupName ? (
                <Text style={typography.secondary}>{selectedModel.groupName}</Text>
              ) : null}
            </View>
            <SecondaryButton
              title="Alterar"
              onPress={() => navigation.navigate('Models')}
              accessibilityHint="Abre a lista de modelos de previsão"
            />
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/** Seleciona alguns horários representativos para a amostra do dia. */
function sampleDay(items) {
  if (!items.length) return [];
  const targets = [0, 6, 12, 18];
  const picked = targets
    .map((h) => items.find((it) => new Date(it.predictionFor).getHours() === h))
    .filter(Boolean);
  return picked.length ? picked : items.slice(0, 4);
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  greeting: { marginTop: 2, marginBottom: spacing.sm },
  heroCard: { borderWidth: 2 },
  heroBadgeRow: { marginTop: spacing.sm },
  recRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  section: { marginTop: spacing.xl },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  suitWrap: { flexDirection: 'row', alignItems: 'center', marginLeft: spacing.sm },
  refBlock: { paddingVertical: spacing.sm },
  dayStrip: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: 2,
    paddingRight: spacing.lg,
  },
  daySlot: {
    minWidth: 96,
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  daySlotHour: { marginBottom: spacing.sm },
  modelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceAlt,
  },
});
