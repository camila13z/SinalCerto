/**
 * Funções de formatação para exibição. Tudo em pt-BR e em linguagem simples.
 * Datas da API vêm em UTC (ISO-8601 com "Z"); o Date do JS converte para o
 * horário local do aparelho automaticamente ao usar getHours/getDate.
 */

export function formatRtt(ms) {
  if (ms === null || ms === undefined || Number.isNaN(ms)) return '—';
  // Uma casa decimal é suficiente e evita poluir a leitura.
  const value = Math.round(ms * 10) / 10;
  return `${value.toString().replace('.', ',')} ms`;
}

export function formatLoss(pct) {
  if (pct === null || pct === undefined || Number.isNaN(pct)) return '—';
  const value = Math.round(pct * 10) / 10;
  return `${value.toString().replace('.', ',')}%`;
}

export function formatConfidence(conf) {
  if (conf === null || conf === undefined || Number.isNaN(conf)) return null;
  return `${Math.round(conf * 100)}%`;
}

const WEEKDAYS = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
];

const MONTHS = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

function toDate(value) {
  if (value instanceof Date) return value;
  return new Date(value);
}

/** "quinta-feira, 20 de agosto de 2026" */
export function formatFullDate(value) {
  const d = toDate(value);
  if (Number.isNaN(d.getTime())) return '';
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
}

/** "23:00" (horário local do aparelho) */
export function formatHour(value) {
  const d = toDate(value);
  if (Number.isNaN(d.getTime())) return '';
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

/** "20/08/2026, 23:00" */
export function formatDateTime(value) {
  const d = toDate(value);
  if (Number.isNaN(d.getTime())) return '';
  const dd = d.getDate().toString().padStart(2, '0');
  const mm = (d.getMonth() + 1).toString().padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}, ${formatHour(d)}`;
}

/** Distância aproximada em km, com vírgula decimal. */
export function formatDistance(km) {
  if (km === null || km === undefined || Number.isNaN(km)) return '—';
  const value = Math.round(km * 10) / 10;
  return `aproximadamente ${value.toString().replace('.', ',')} km`;
}

export default {
  formatRtt,
  formatLoss,
  formatConfidence,
  formatFullDate,
  formatHour,
  formatDateTime,
  formatDistance,
};
