/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

export async function apiRequest(endpoint, { method = 'GET', body = null, headers = {} } = {}) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(endpoint, options);

    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("❌ Error en apiRequest:", err);
    throw err;
  }
}