/**
 * Configuração da integração com a Internet Quality API.
 *
 * A API é educacional e está hospedada no Render (plano free), que "dorme"
 * quando fica sem uso. O primeiro acesso pode levar até ~1 minuto para
 * responder enquanto o serviço acorda. Por isso usamos um timeout generoso e,
 * em caso de falha, o app recorre a dados simulados (ver services/index.js).
 */

export const BASE_URL = 'https://internet-quality-api.onrender.com';
export const API_PREFIX = '/api/v1';

// Tempo máximo de espera por resposta (ms).
// O guia da API avisa que o servidor no Render (plano free) hiberna e a
// primeira chamada pode levar 30 a 60 segundos para acordar.
export const REQUEST_TIMEOUT = 60000;

/**
 * Referência geográfica padrão (São Paulo).
 *
 * O app pede permissão de localização ao usuário. Se concedida, usa a posição
 * aproximada do aparelho apenas para encontrar a probe mais próxima. Se o
 * usuário negar a permissão, usamos esta referência fixa como fallback, em
 * linha com os princípios de privacidade do documento de requisitos.
 */
export const REFERENCE_LOCATION = {
  latitude: -23.55,
  longitude: -46.63,
  label: 'São Paulo',
};

export const ENDPOINTS = {
  health: () => `${API_PREFIX}/health`,
  models: () => `${API_PREFIX}/models`,
  model: (id) => `${API_PREFIX}/models/${encodeURIComponent(id)}`,
  locations: () => `${API_PREFIX}/locations`,
  nearby: () => `${API_PREFIX}/forecasts/nearby`,
  probeForecast: (probeId) => `${API_PREFIX}/forecasts/probes/${probeId}`,
  timeline: (probeId) => `${API_PREFIX}/forecasts/probes/${probeId}/timeline`,
  compare: (probeId) => `${API_PREFIX}/forecasts/probes/${probeId}/compare`,
  activityCheck: () => `${API_PREFIX}/activity/check`,
};

export default { BASE_URL, API_PREFIX, REQUEST_TIMEOUT, REFERENCE_LOCATION, ENDPOINTS };
