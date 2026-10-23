import apiClient from './apiClient';
import { ENDPOINTS } from './config';

/**
 * Uma função por endpoint da API. Retornam o JSON cru da API; a normalização
 * para o modelo interno do app acontece em services/index.js.
 *
 * Contrato baseado no OpenAPI da Internet Quality API (v0.2.0).
 */

export function getHealth() {
  return apiClient.get(ENDPOINTS.health());
}

/** Lista modelos ativos: { items: ModelListItem[], total } */
export function getModels() {
  return apiClient.get(ENDPOINTS.models());
}

export function getModel(modelId) {
  return apiClient.get(ENDPOINTS.model(modelId));
}

/** Probes com dados: { items: LocationItem[], total } */
export function getLocations() {
  return apiClient.get(ENDPOINTS.locations());
}

/**
 * Previsão da probe mais próxima de um ponto, para um modelo.
 * GET /forecasts/nearby?lat&lon&model_id&radius_km
 * -> NearbyForecastResponse
 */
export function getNearbyForecast({ lat, lon, modelId, radiusKm }) {
  return apiClient.get(ENDPOINTS.nearby(), {
    lat,
    lon,
    model_id: modelId,
    radius_km: radiusKm,
  });
}

/**
 * Linha do tempo de previsões de uma probe para um modelo.
 * GET /forecasts/probes/{probe}/timeline?model_id&from&to&limit
 * -> TimelineResponse
 */
export function getTimeline({ probeId, modelId, from, to, limit = 24 }) {
  return apiClient.get(ENDPOINTS.timeline(probeId), {
    model_id: modelId,
    from,
    to,
    limit,
  });
}

/**
 * Compara modelos ativos para uma probe no mesmo instante.
 * GET /forecasts/probes/{probe}/compare?prediction_for
 * -> CompareResponse
 */
export function getCompare({ probeId, predictionFor }) {
  return apiClient.get(ENDPOINTS.compare(probeId), {
    prediction_for: predictionFor,
  });
}

/**
 * Verifica se uma atividade é adequada num instante.
 * POST /activity/check
 * body: { modelId, latitude, longitude, dateTime, activity }
 * -> ActivityCheckResponse
 */
export function checkActivity({ modelId, latitude, longitude, dateTime, activity }) {
  return apiClient.post(ENDPOINTS.activityCheck(), {
    modelId,
    latitude,
    longitude,
    dateTime,
    activity,
  });
}

export default {
  getHealth,
  getModels,
  getModel,
  getLocations,
  getNearbyForecast,
  getTimeline,
  getCompare,
  checkActivity,
};
