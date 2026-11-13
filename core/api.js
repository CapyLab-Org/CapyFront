/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

let _authToken = null;

export function setAuthToken(token) {
  _authToken = token;
}

export function clearAuthToken() {
  _authToken = null;
}

// Bodies que fetch envía tal cual; el navegador pone su propio Content-Type (ej. boundary de multipart)
function isRawBody(body) {
  return typeof body === 'string'
    || body instanceof FormData
    || body instanceof Blob
    || body instanceof URLSearchParams
    || body instanceof ArrayBuffer;
}

async function readBody(res, responseType) {
  if (responseType === 'blob') return res.blob();
  const text = await res.text();
  if (responseType === 'text') return text;
  if (!text) return null;   // 204 No Content o body vacío
  try { return JSON.parse(text); } catch { return text; }
}

/**
 * Wrapper sobre fetch para consumir APIs REST.
 * - Objetos/arrays se envían como JSON; FormData, Blob, string y URLSearchParams se envían tal cual.
 * - Respuestas vacías (204) devuelven null.
 * - En error HTTP lanza un Error con `status` y `body` (respuesta del backend ya parseada).
 * @param {string} endpoint
 * @param {{ method?, body?, headers?, responseType?: 'json'|'text'|'blob' }} options
 * @returns {Promise<any>}
 */
export async function apiRequest(endpoint, { method = 'GET', body = null, headers = {}, responseType = 'json' } = {}) {
  try {
    const hasBody = body !== null && body !== undefined;
    const raw = hasBody && isRawBody(body);
    const options = {
      method,
      headers: {
        ...(hasBody && !raw ? { 'Content-Type': 'application/json' } : {}),
        ...(_authToken ? { Authorization: `Bearer ${_authToken}` } : {}),
        ...headers,
      },
    };

    if (hasBody) {
      options.body = raw ? body : JSON.stringify(body);
    }

    const res = await fetch(endpoint, options);

    if (!res.ok) {
      const error = new Error(`Error ${res.status}: ${res.statusText}`);
      error.status = res.status;
      error.body = await readBody(res, 'json').catch(() => null);
      throw error;
    }

    return await readBody(res, responseType);
  } catch (err) {
    console.error('❌ Error en apiRequest:', err);
    throw err;
  }
}
