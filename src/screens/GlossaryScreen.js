import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, typography, radius } from '../theme';
import { GLOSSARY } from '../i18n/labels';
import { getQuality } from '../domain/quality';

import ScreenHeader from '../components/ScreenHeader';
import QualityBadge from '../components/QualityBadge';
import { Card, InfoNote } from '../components/primitives';

export default function GlossaryScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Sobre esta previsão" onBack={() => navigation.goBack()} />

        <InfoNote icon="sparkles" title={GLOSSARY.intro.title}>
          {GLOSSARY.intro.text}
        </InfoNote>

        {/* Termos técnicos explicados */}
        {GLOSSARY.terms.map((t) => (
          <TermCard key={t.key} icon={t.icon} title={t.title} text={t.text} />
        ))}

        {/* Estados de qualidade */}
        <Text style={[typography.sectionTitle, styles.sectionTitle]} accessibilityRole="header">
          O que significa cada qualidade
        </Text>
        {GLOSSARY.qualities.map((item) => {
          const q = getQuality(item.key);
          return (
            <Card key={item.key} style={styles.qualityCard}>
              <View style={{ flex: 1, paddingRight: spacing.md }}>
                <Text style={typography.bodyStrong}>{item.title}</Text>
                <Text style={[typography.secondary, { marginTop: 2 }]}>{q.description}</Text>
                <View style={{ marginTop: spacing.md }}>
                  <QualityBadge code={item.key} size="sm" />
                </View>
              </View>
            </Card>
          );
        })}

        {/* Privacidade e referência (textos oficiais da API) */}
        <Text style={[typography.sectionTitle, styles.sectionTitle]} accessibilityRole="header">
          Transparência
        </Text>
        {GLOSSARY.about.map((a) => (
          <TermCard key={a.key} icon={a.icon} title={a.title} text={a.text} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function TermCard({ icon, title, text }) {
  return (
    <Card style={styles.termCard} accessibilityLabel={`${title}. ${text}`} accessible>
      <View style={styles.termHeader}>
        <View style={styles.termIcon}>
          <Ionicons name={icon} size={20} color={colors.primary} importantForAccessibility="no" />
        </View>
        <Text style={[typography.bodyStrong, { flex: 1 }]}>{title}</Text>
      </View>
      <Text style={[typography.secondary, { marginTop: spacing.sm }]}>{text}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  sectionTitle: { marginTop: spacing.xl, marginBottom: spacing.md },
  termCard: { marginTop: spacing.md },
  termHeader: { flexDirection: 'row', alignItems: 'center' },
  termIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceInfo,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  qualityCard: { marginTop: spacing.md },
});
