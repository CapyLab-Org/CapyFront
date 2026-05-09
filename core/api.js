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

/**
 * Wrapper sobre fetch para consumir APIs REST.
 * @param {string} endpoint
 * @param {{ method?, body?, headers?, responseType? }} options
 * @returns {Promise<any>}
 */
export async function apiRequest(endpoint, { method = 'GET', body = null, headers = {}, responseType = 'json' } = {}) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(_authToken ? { Authorization: `Bearer ${_authToken}` } : {}),
        ...headers,
      },
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(endpoint, options);

    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }

    if (responseType === 'text') return res.text();
    if (responseType === 'blob') return res.blob();
    return res.json();
  } catch (err) {
    console.error('❌ Error en apiRequest:', err);
    throw err;
  }
}
