import { colors } from '../theme';
import { QUALITY_LABEL, QUALITY_DESCRIPTION } from '../i18n/labels';

/**
 * Centraliza a representação de cada estado de qualidade.
 *
 * Importante para acessibilidade (RNF03): cada estado tem SEMPRE três sinais
 * independentes — cor, ícone (forma distinta) e texto. As formas dos ícones
 * são diferentes entre si para serem distinguíveis sem depender de cor:
 *   GOOD      -> círculo com "check"
 *   MODERATE  -> triângulo de atenção
 *   UNSTABLE  -> círculo com "x"
 */
const ICONS = {
  GOOD: 'checkmark-circle',
  MODERATE: 'warning',
  UNSTABLE: 'close-circle',
};

const ORDER = { GOOD: 0, MODERATE: 1, UNSTABLE: 2 };

export function getQuality(code) {
  const key = ORDER[code] !== undefined ? code : 'MODERATE';
  return {
    code: key,
    label: QUALITY_LABEL[key],
    description: QUALITY_DESCRIPTION[key],
    icon: ICONS[key],
    colors: colors.quality[key],
    order: ORDER[key],
  };
}

export function qualityLabel(code) {
  return QUALITY_LABEL[code] || QUALITY_LABEL.MODERATE;
}

/**
 * Regra de apoio (BUSINESS) para o resumo rápido "O que dá pra fazer agora"
 * na tela inicial, derivada da qualidade prevista (RQ03).
 *
 * Observação: esta é uma visão rápida. A verificação detalhada por atividade
 * e horário é feita pela própria API em POST /activity/check (tela Planejar
 * atividade), que é a fonte oficial de decisão.
 *
 * Retorna 'OK' | 'CAUTION' | 'AVOID' por atividade.
 */
const SUITABILITY_BY_QUALITY = {
  GOOD: {
    VIDEO_CALL: 'OK',
    AUDIO_CALL: 'OK',
    STREAMING: 'OK',
    FILE_UPLOAD: 'OK',
    WEB_BROWSING: 'OK',
    MESSAGING: 'OK',
  },
  MODERATE: {
    VIDEO_CALL: 'CAUTION',
    AUDIO_CALL: 'OK',
    STREAMING: 'CAUTION',
    FILE_UPLOAD: 'CAUTION',
    WEB_BROWSING: 'OK',
    MESSAGING: 'OK',
  },
  UNSTABLE: {
    VIDEO_CALL: 'AVOID',
    AUDIO_CALL: 'CAUTION',
    STREAMING: 'AVOID',
    FILE_UPLOAD: 'AVOID',
    WEB_BROWSING: 'CAUTION',
    MESSAGING: 'OK',
  },
};

export function suitabilityFor(qualityCode, activityId) {
  const table = SUITABILITY_BY_QUALITY[qualityCode] || SUITABILITY_BY_QUALITY.MODERATE;
  return table[activityId] || 'CAUTION';
}

export default { getQuality, qualityLabel, suitabilityFor };
