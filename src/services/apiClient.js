import { BASE_URL, REQUEST_TIMEOUT } from './config';

/**
 * Erro padronizado da camada de rede, para o restante do app tratar os
 * diferentes estados da interface (carregando / erro / sucesso).
 */
export class ApiError extends Error {
  constructor(message, { status = null, code = null, cause = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code; // ex.: 'TIMEOUT', 'NETWORK', 'HTTP'
    this.cause = cause;
  }
}

function buildQuery(params) {
  if (!params) return '';
  const parts = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
  return parts.length ? `?${parts.join('&')}` : '';
}

async function request(path, { method = 'GET', query, body } = {}) {
  const url = `${BASE_URL}${path}${buildQuery(query)}`;

  // Timeout manual com AbortController (o Render free pode demorar a acordar).
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      method,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) {
      let payload = null;
      try {
        payload = await response.json();
      } catch (_) {
        // corpo não-JSON; ignora
      }
      const message =
        payload?.error?.message ||
        payload?.detail?.[0]?.msg ||
        `Falha na requisição (HTTP ${response.status}).`;
      throw new ApiError(message, {
        status: response.status,
        code: 'HTTP',
        cause: payload,
      });
    }

    return await response.json();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err?.name === 'AbortError') {
      throw new ApiError('O servidor demorou a responder. Tente novamente.', {
        code: 'TIMEOUT',
        cause: err,
      });
    }
    throw new ApiError('Não foi possível conectar ao servidor.', {
      code: 'NETWORK',
      cause: err,
    });
  } finally {
    clearTimeout(timer);
  }
}

export const apiClient = {
  get: (path, query) => request(path, { method: 'GET', query }),
  post: (path, body) => request(path, { method: 'POST', body }),
};

export default apiClient;
