/**
 * Camada de fachada entre as telas e a API.
 *
 * Responsabilidades:
 *  1. Chamar a Internet Quality API.
 *  2. Normalizar a resposta para um modelo interno simples e estável
 *     (rttMs, lossPct, quality...), isolando as telas do formato da API.
 *  3. Em caso de falha de rede/timeout, usar dados simulados equivalentes,
 *     marcando source = 'mock' para a interface avisar o usuário.
 *
 * Com isso, se o contrato da API mudar, basta ajustar as funções de
 * normalização aqui — nenhum componente de tela precisa mudar.
 */
import * as api from './internetQualityApi';
import * as mock from './mockData';

const SOURCE = { API: 'api', MOCK: 'mock' };

// --- Normalizadores --------------------------------------------------------

function normModel(m) {
  if (!m) return null;
  return {
    id: m.id,
    name: m.name,
    description: m.description,
    groupName: m.groupName,
    algorithm: m.algorithm,
    version: m.version,
  };
}

function normForecast(resp, source) {
  const pred = resp.prediction || {};
  const assess = resp.assessment || {};
  return {
    source,
    model: resp.model || null,
    probeId: resp.matchedProbe?.probeId ?? resp.probeId ?? null,
    distanceKm: resp.matchedProbe?.distanceKm ?? null,
    predictionFor: pred.predictionFor || null,
    rttMs: pred.predictedAvgRttMs ?? null,
    lossPct: pred.predictedPacketLossPct ?? null,
    confidence: pred.modelConfidence ?? null,
    quality: assess.quality || 'MODERATE',
    qualityScore: assess.qualityScore ?? null,
    recommendation: resp.recommendation || null,
    metadata: resp.metadata || null,
  };
}

function normTimeline(resp, source) {
  return {
    source,
    model: resp.model || null,
    probeId: resp.probeId ?? null,
    items: (resp.items || []).map((it) => ({
      predictionFor: it.predictionFor,
      rttMs: it.predictedAvgRttMs,
      lossPct: it.predictedPacketLossPct,
      quality: it.quality,
      qualityScore: it.qualityScore,
    })),
  };
}

function normActivity(resp, source) {
  const f = resp.forecast || {};
  return {
    source,
    model: resp.model || null,
    activity: resp.activity,
    suitable: !!resp.suitable,
    quality: f.quality || 'MODERATE',
    rttMs: f.predictedAvgRttMs ?? null,
    lossPct: f.predictedPacketLossPct ?? null,
    recommendation: resp.recommendation || null,
    metadata: resp.metadata || null,
  };
}

// --- Funções usadas pelas telas -------------------------------------------

export async function fetchModels() {
  try {
    const resp = await api.getModels();
    return {
      source: SOURCE.API,
      models: (resp.items || []).map(normModel).filter(Boolean),
    };
  } catch (err) {
    return {
      source: SOURCE.MOCK,
      models: (mock.MOCK_MODELS.items || []).map(normModel),
      error: err,
    };
  }
}

export async function fetchNearbyForecast({ lat, lon, modelId }) {
  try {
    const resp = await api.getNearbyForecast({ lat, lon, modelId });
    return normForecast(resp, SOURCE.API);
  } catch (err) {
    const data = normForecast(mock.mockNearbyForecast(), SOURCE.MOCK);
    data.error = err;
    return data;
  }
}

export async function fetchTimeline({ probeId, modelId, limit = 24 }) {
  // Sem probe não há como pedir a timeline real; usa simulação.
  if (!probeId) {
    return normTimeline(mock.mockTimeline(limit), SOURCE.MOCK);
  }
  try {
    const resp = await api.getTimeline({ probeId, modelId, limit });
    return normTimeline(resp, SOURCE.API);
  } catch (err) {
    const data = normTimeline(mock.mockTimeline(limit), SOURCE.MOCK);
    data.error = err;
    return data;
  }
}

export async function fetchActivityCheck({
  modelId,
  latitude,
  longitude,
  dateTime,
  activity,
}) {
  try {
    const resp = await api.checkActivity({
      modelId,
      latitude,
      longitude,
      dateTime,
      activity,
    });
    return normActivity(resp, SOURCE.API);
  } catch (err) {
    const data = normActivity(mock.mockActivityCheck({ dateTime, activity }), SOURCE.MOCK);
    data.error = err;
    return data;
  }
}

export { SOURCE };

export default {
  fetchModels,
  fetchNearbyForecast,
  fetchTimeline,
  fetchActivityCheck,
  SOURCE,
};
