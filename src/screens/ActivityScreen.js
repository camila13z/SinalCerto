import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, AccessibilityInfo } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, typography, radius } from '../theme';
import { useApp } from '../context/AppContext';
import { fetchTimeline, fetchActivityCheck } from '../services';
import { getQuality } from '../domain/quality';
import { formatHour, formatRtt, formatLoss } from '../domain/format';
import { ACTIVITIES, ACTIVITY_LABEL, RECOMMENDATION_LABEL } from '../i18n/labels';

import ScreenHeader from '../components/ScreenHeader';
import QualityBadge from '../components/QualityBadge';
import ActivityOption from '../components/ActivityOption';
import HourChip from '../components/HourChip';
import { Card, SectionTitle } from '../components/primitives';
import { LoadingView } from '../components/states';

export default function ActivityScreen({ navigation }) {
  const { selectedModelId, location, probeId } = useApp();
  const [loadingHours, setLoadingHours] = useState(true);
  const [items, setItems] = useState([]);
  const [activity, setActivity] = useState('VIDEO_CALL');
  const [selectedISO, setSelectedISO] = useState(null);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);
  const reqIdRef = useRef(0); // garante que vale sempre a consulta mais recente

  const loadHours = useCallback(async () => {
    setLoadingHours(true);
    const d = await fetchTimeline({ probeId, modelId: selectedModelId, limit: 24 });
    setItems(d.items || []);
    // Pré-seleciona o primeiro horário futuro, se houver.
    const now = Date.now();
    const next = (d.items || []).find((it) => new Date(it.predictionFor).getTime() >= now);
    setSelectedISO((next || d.items?.[0])?.predictionFor || null);
    setLoadingHours(false);
  }, [probeId, selectedModelId]);

  useEffect(() => {
    loadHours();
  }, [loadHours]);

  // Consulta a previsão automaticamente sempre que a atividade ou o horário
  // mudam (não há mais botão). A requisição mais recente é a que vale, mesmo
  // que o usuário toque em vários itens em sequência.
  const runCheck = useCallback(async () => {
    if (!selectedISO || !selectedModelId) return;
    const myId = reqIdRef.current + 1;
    reqIdRef.current = myId;
    setChecking(true);
    const r = await fetchActivityCheck({
      modelId: selectedModelId,
      latitude: location.latitude,
      longitude: location.longitude,
      dateTime: selectedISO,
      activity,
    });
    if (myId !== reqIdRef.current) return; // uma consulta mais nova começou
    setResult(r);
    setChecking(false);

    // Anuncia o resultado para tecnologias assistivas (RNF08).
    const verdict = r.suitable ? 'Pode fazer' : 'Pode apresentar dificuldades';
    AccessibilityInfo.announceForAccessibility &&
      AccessibilityInfo.announceForAccessibility(
        `${verdict}. Qualidade prevista ${getQuality(r.quality).label}.`
      );
  }, [selectedISO, selectedModelId, location, activity]);

  useEffect(() => {
    runCheck();
  }, [runCheck]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          overline="Planejar atividade"
          title="O que você quer fazer?"
          onBack={() => navigation.goBack()}
        />

        {/* 1. Atividade */}
        <SectionTitle overline="Passo 1" title="Escolha uma atividade" />
        <View
          style={styles.grid}
          accessibilityRole="radiogroup"
          accessibilityLabel="Atividade"
        >
          {ACTIVITIES.map((a) => (
            <View key={a.id} style={styles.gridCell}>
              <ActivityOption
                label={a.label}
                icon={a.icon}
                selected={activity === a.id}
                onPress={() => setActivity(a.id)}
              />
            </View>
          ))}
        </View>

        {/* 2. Horário */}
        <View style={{ marginTop: spacing.xl }}>
          <SectionTitle overline="Passo 2" title="Qual horário?" />
          {loadingHours ? (
            <LoadingView message="Carregando horários…" />
          ) : (
            <View
              style={styles.grid}
              accessibilityRole="radiogroup"
              accessibilityLabel="Horário"
            >
              {items.map((it) => (
                <View key={it.predictionFor} style={styles.hourCell}>
                  <HourChip
                    hourLabel={formatHour(it.predictionFor)}
                    quality={it.quality}
                    selected={selectedISO === it.predictionFor}
                    onPress={() => setSelectedISO(it.predictionFor)}
                  />
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Resultado (atualiza sozinho ao escolher atividade e horário) */}
        <View style={{ marginTop: spacing.xl }}>
          <SectionTitle title="Dá pra fazer agora?" />
          {checking && !result ? (
            <LoadingView message="Consultando a previsão…" />
          ) : result ? (
            <View ref={resultRef} accessibilityLiveRegion="polite">
              <ResultCard result={result} />
            </View>
          ) : (
            <LoadingView message="Consultando a previsão…" />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ResultCard({ result }) {
  const q = getQuality(result.quality);
  const verdict = result.suitable ? 'Pode fazer' : 'Pode apresentar dificuldades';
  const verdictIcon = result.suitable ? 'checkmark-circle' : 'warning';

  return (
    <Card style={[styles.resultCard, { borderColor: q.colors.border, backgroundColor: q.colors.bg }]}>
      <Text style={[typography.label, { color: q.colors.fg }]}>
        RESULTADO · {ACTIVITY_LABEL[result.activity]?.toUpperCase()}
      </Text>

      <View style={styles.verdictRow}>
        <Ionicons
          name={verdictIcon}
          size={26}
          color={q.colors.fg}
          style={{ marginRight: spacing.sm }}
          importantForAccessibility="no"
        />
        <Text style={[typography.title, { color: q.colors.fg }]}>{verdict}</Text>
      </View>

      <View style={{ marginTop: spacing.sm, marginBottom: spacing.md }}>
        <QualityBadge code={result.quality} size="md" />
      </View>

      {result.recommendation ? (
        <Text style={[typography.body, { color: q.colors.fg }]}>
          {result.recommendation.message || RECOMMENDATION_LABEL[result.recommendation.code]}
        </Text>
      ) : null}

      <View style={styles.resultMetrics}>
        <Text style={[typography.secondary, { color: q.colors.fg }]}>
          Tempo de resposta: {formatRtt(result.rttMs)} · Dados perdidos: {formatLoss(result.lossPct)}
        </Text>
      </View>

      {result.metadata?.disclaimer ? (
        <Text style={[typography.secondary, { color: q.colors.fg, marginTop: spacing.md }]}>
          {result.metadata.disclaimer}
        </Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  gridCell: {
    width: '50%',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  hourCell: {
    width: '33.333%',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  resultCard: { borderWidth: 2 },
  verdictRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  resultMetrics: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
});
