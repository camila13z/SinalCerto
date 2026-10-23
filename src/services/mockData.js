/**
 * Dados simulados, no MESMO formato da Internet Quality API.
 *
 * Usados automaticamente quando a API real não responde (ex.: o serviço no
 * Render ainda está "acordando"), para que o app continue navegável e para
 * demonstrar todos os estados na avaliação. Sempre que estes dados são usados,
 * a interface exibe um aviso de "dados simulados".
 */

const PROBE_ID = 900001;
const LOCATION = { latitude: -23.55, longitude: -46.63, countryCode: 'BR' };

export const MOCK_MODELS = {
  items: [
    {
      id: 'model-a',
      name: 'Modelo A',
      description: 'Modelo desenvolvido pelo Grupo 1.',
      groupName: 'Grupo 1',
      algorithm: 'Linear Regression',
      version: '1.0',
    },
    {
      id: 'model-b',
      name: 'Modelo B',
      description: 'Modelo desenvolvido pelo Grupo 2.',
      groupName: 'Grupo 2',
      algorithm: 'Random Forest',
      version: '1.0',
    },
    {
      id: 'model-c',
      name: 'Modelo C',
      description: 'Modelo desenvolvido pelo Grupo 3.',
      groupName: 'Grupo 3',
      algorithm: 'ARIMA',
      version: '1.0',
    },
  ],
  total: 3,
};

function classify(rtt, loss) {
  if (rtt <= 60 && loss < 1) return { quality: 'GOOD', qualityScore: 88 };
  if (rtt <= 120 && loss < 3) return { quality: 'MODERATE', qualityScore: 66 };
  return { quality: 'UNSTABLE', qualityScore: 34 };
}

function recommendationFor(quality) {
  if (quality === 'GOOD') {
    return { code: 'NORMAL_USE', message: 'A conexão deve funcionar bem neste período.' };
  }
  if (quality === 'MODERATE') {
    return {
      code: 'REDUCE_NETWORK_USAGE',
      message: 'A conexão pode apresentar alguma instabilidade neste período.',
    };
  }
  return {
    code: 'PREPARE_OFFLINE',
    message: 'A conexão pode falhar. Evite tarefas que dependam muito da internet.',
  };
}

const METADATA = {
  disclaimer:
    'A previsão está associada à probe RIPE Atlas selecionada como referência geográfica e não representa uma medição direta do dispositivo do usuário.',
  locationPrivacy:
    'As coordenadas públicas das probes recebem proteção de privacidade do RIPE Atlas e não devem ser tratadas como a localização exata do usuário.',
};

// Perfil de 24h: horários variando entre boa, regular e instável.
const DAY_PROFILE = [
  { rtt: 48, loss: 0.4 }, // 00
  { rtt: 46, loss: 0.3 }, // 01
  { rtt: 44, loss: 0.2 }, // 02
  { rtt: 43, loss: 0.2 }, // 03
  { rtt: 45, loss: 0.3 }, // 04
  { rtt: 47, loss: 0.4 }, // 05
  { rtt: 52, loss: 0.5 }, // 06
  { rtt: 55, loss: 0.6 }, // 07
  { rtt: 58, loss: 0.8 }, // 08
  { rtt: 59, loss: 0.9 }, // 09
  { rtt: 72, loss: 1.4 }, // 10
  { rtt: 78, loss: 1.6 }, // 11
  { rtt: 84, loss: 1.9 }, // 12
  { rtt: 90, loss: 2.1 }, // 13
  { rtt: 96, loss: 2.3 }, // 14
  { rtt: 102, loss: 2.6 }, // 15
  { rtt: 110, loss: 2.8 }, // 16
  { rtt: 118, loss: 2.9 }, // 17
  { rtt: 165, loss: 6.2 }, // 18
  { rtt: 182, loss: 7.8 }, // 19
  { rtt: 158, loss: 5.4 }, // 20
  { rtt: 96, loss: 2.2 }, // 21
  { rtt: 74, loss: 1.3 }, // 22
  { rtt: 56, loss: 0.7 }, // 23
];

function startOfToday() {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  d.setHours(0);
  return d;
}

export function buildMockTimelineItems(limit = 24) {
  const base = startOfToday();
  return DAY_PROFILE.slice(0, limit).map((p, hour) => {
    const when = new Date(base);
    when.setHours(hour);
    const c = classify(p.rtt, p.loss);
    return {
      predictionFor: when.toISOString(),
      predictedAvgRttMs: p.rtt,
      predictedPacketLossPct: p.loss,
      quality: c.quality,
      qualityScore: c.qualityScore,
    };
  });
}

function nearestUpcoming(items) {
  const now = Date.now();
  return (
    items.find((it) => new Date(it.predictionFor).getTime() >= now) ||
    items[items.length - 1]
  );
}

const MODEL_REF = { id: 'model-a', name: 'Modelo A', version: '1.0' };

export function mockNearbyForecast() {
  const items = buildMockTimelineItems(24);
  const it = nearestUpcoming(items);
  const rec = recommendationFor(it.quality);
  return {
    model: MODEL_REF,
    requestedLocation: { latitude: -23.551, longitude: -46.634 },
    matchedProbe: { probeId: PROBE_ID, distanceKm: 2.7 },
    prediction: {
      predictionFor: it.predictionFor,
      predictedAvgRttMs: it.predictedAvgRttMs,
      predictedPacketLossPct: it.predictedPacketLossPct,
      modelConfidence: 0.82,
    },
    assessment: { quality: it.quality, qualityScore: it.qualityScore },
    recommendation: rec,
    metadata: METADATA,
  };
}

export function mockTimeline(limit = 24) {
  return {
    model: MODEL_REF,
    probeId: PROBE_ID,
    items: buildMockTimelineItems(limit),
  };
}

// Regras simples de adequação por atividade, alinhadas ao app.
const ACTIVITY_MIN_QUALITY = {
  VIDEO_CALL: 'GOOD',
  AUDIO_CALL: 'MODERATE',
  STREAMING: 'GOOD',
  FILE_UPLOAD: 'GOOD',
  WEB_BROWSING: 'MODERATE',
  MESSAGING: 'UNSTABLE',
};
const RANK = { GOOD: 0, MODERATE: 1, UNSTABLE: 2 };

export function mockActivityCheck({ dateTime, activity }) {
  const items = buildMockTimelineItems(24);
  const target = dateTime ? new Date(dateTime).getHours() : new Date().getHours();
  const it = items[target] || nearestUpcoming(items);
  const min = ACTIVITY_MIN_QUALITY[activity] || 'MODERATE';
  const suitable = RANK[it.quality] <= RANK[min];
  const rec = recommendationFor(it.quality);
  return {
    model: MODEL_REF,
    activity,
    suitable,
    forecast: {
      quality: it.quality,
      predictedAvgRttMs: it.predictedAvgRttMs,
      predictedPacketLossPct: it.predictedPacketLossPct,
    },
    recommendation: rec,
    metadata: METADATA,
  };
}

export default {
  MOCK_MODELS,
  mockNearbyForecast,
  mockTimeline,
  mockActivityCheck,
  buildMockTimelineItems,
};
