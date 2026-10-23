import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';
import { PrimaryButton } from './buttons';

/**
 * Estados de interface reutilizáveis. A mensagem de carregamento usa
 * accessibilityLiveRegion para que a leitura de tela anuncie a mudança.
 */
export function LoadingView({ message = 'Carregando previsão…' }) {
  return (
    <View style={styles.center} accessibilityLiveRegion="polite">
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[typography.secondary, styles.text]} accessibilityRole="text">
        {message}
      </Text>
    </View>
  );
}

export function ErrorView({ message, onRetry }) {
  return (
    <View style={styles.center} accessibilityLiveRegion="polite">
      <Ionicons
        name="alert-circle"
        size={40}
        color={colors.quality.UNSTABLE.fg}
        importantForAccessibility="no"
      />
      <Text style={[typography.bodyStrong, styles.text]} accessibilityRole="text">
        Não foi possível carregar os dados
      </Text>
      {message ? (
        <Text style={[typography.secondary, styles.text]} accessibilityRole="text">
          {message}
        </Text>
      ) : null}
      {onRetry ? (
        <PrimaryButton
          title="Tentar novamente"
          onPress={onRetry}
          icon="refresh"
          style={styles.retry}
        />
      ) : null}
    </View>
  );
}

export function EmptyView({ message = 'Nada por aqui ainda.' }) {
  return (
    <View style={styles.center}>
      <Text style={[typography.secondary, styles.text]} accessibilityRole="text">
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { marginTop: spacing.md, textAlign: 'center' },
  retry: { marginTop: spacing.lg, alignSelf: 'stretch' },
});

export default { LoadingView, ErrorView, EmptyView };
