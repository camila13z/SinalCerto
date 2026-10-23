import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, typography, radius } from '../theme';
import { useApp } from '../context/AppContext';

import ScreenHeader from '../components/ScreenHeader';
import { InfoNote, SourceTag } from '../components/primitives';
import { LoadingView } from '../components/states';

export default function ModelsScreen({ navigation }) {
  const { models, modelsSource, loadingModels, selectedModelId, setSelectedModelId } = useApp();

  function choose(id) {
    setSelectedModelId(id);
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          overline="Previsão"
          title="Escolher modelo"
          onBack={() => navigation.goBack()}
        />

        <InfoNote icon="information-circle">
          Cada modelo foi feito por um grupo diferente. Nenhum é melhor que o outro — escolha um
          para ver a previsão dele.
        </InfoNote>

        <View style={{ height: spacing.md }} />
        <SourceTag source={modelsSource} />

        {loadingModels ? (
          <LoadingView message="Carregando modelos…" />
        ) : (
          <View
            style={{ marginTop: spacing.lg }}
            accessibilityRole="radiogroup"
            accessibilityLabel="Modelos de previsão"
          >
            {models.map((m) => {
              const selected = m.id === selectedModelId;
              return (
                <Pressable
                  key={m.id}
                  onPress={() => choose(m.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`${m.name}${m.groupName ? ', ' + m.groupName : ''}`}
                  accessibilityHint={selected ? 'Modelo selecionado' : 'Toque para usar este modelo'}
                  style={({ pressed }) => [
                    styles.modelCard,
                    selected && styles.modelCardSelected,
                    pressed && { opacity: 0.9 },
                  ]}
                >
                  <View style={{ flex: 1, paddingRight: spacing.md }}>
                    <Text style={typography.bodyStrong}>{m.name}</Text>
                    {m.description ? (
                      <Text style={[typography.secondary, { marginTop: 2 }]}>{m.description}</Text>
                    ) : null}
                    <Text style={[typography.secondary, { marginTop: spacing.sm }]}>
                      {[m.groupName, m.algorithm, m.version ? `v${m.version}` : null]
                        .filter(Boolean)
                        .join(' · ')}
                    </Text>
                    {selected ? (
                      <View style={styles.selectedRow}>
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color={colors.primary}
                          importantForAccessibility="no"
                        />
                        <Text style={styles.selectedText}>Em uso</Text>
                      </View>
                    ) : null}
                  </View>
                  <Ionicons
                    name={selected ? 'radio-button-on' : 'radio-button-off'}
                    size={24}
                    color={selected ? colors.primary : colors.borderStrong}
                    importantForAccessibility="no"
                  />
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  modelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  modelCardSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: '#EEF3FD',
  },
  selectedRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  selectedText: { color: colors.primary, fontWeight: '700', fontSize: 12, marginLeft: 4 },
});
