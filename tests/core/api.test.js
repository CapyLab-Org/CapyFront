/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { apiRequest, setAuthToken, clearAuthToken } from '../../core/api.js';

console.log("Test: api");

const origFetch = globalThis.fetch;
const origError = console.error;
let last;
const mock = (status, text) => async (url, opts) => {
  last = { url, opts };
  return new Response(text, { status, statusText: 'X' });
};

try {
  console.error = () => {};

  globalThis.fetch = mock(200, '{"ok":true}');
  const data = await apiRequest('/api/x');
  if (!data.ok) throw new Error("❌ no parseó JSON");
  if ('Content-Type' in last.opts.headers) throw new Error("❌ un GET sin body no debería mandar Content-Type");
  if ('body' in last.opts) throw new Error("❌ un GET sin body no debería mandar body");

  await apiRequest('/api/x', { method: 'POST', body: { a: 1 } });
  if (last.opts.headers['Content-Type'] !== 'application/json' || last.opts.body !== '{"a":1}') {
    throw new Error("❌ un objeto debería enviarse como JSON");
  }

  const fd = new FormData();
  fd.append('f', 'v');
  await apiRequest('/api/x', { method: 'POST', body: fd });
  if (last.opts.body !== fd || 'Content-Type' in last.opts.headers) {
    throw new Error("❌ FormData debería enviarse tal cual, sin Content-Type");
  }

  setAuthToken('tok');
  await apiRequest('/api/x');
  if (last.opts.headers.Authorization !== 'Bearer tok') throw new Error("❌ no aplicó el token");
  clearAuthToken();
  await apiRequest('/api/x');
  if ('Authorization' in last.opts.headers) throw new Error("❌ clearAuthToken no quitó el token");

  globalThis.fetch = mock(204, null);
  if (await apiRequest('/api/x', { method: 'DELETE' }) !== null) throw new Error("❌ 204 debería devolver null");

  globalThis.fetch = mock(200, 'hola');
  if (await apiRequest('/api/x', { responseType: 'text' }) !== 'hola') throw new Error("❌ responseType text falló");

  globalThis.fetch = mock(422, '{"error":"email inválido"}');
  let err;
  try { await apiRequest('/api/x'); } catch (e) { err = e; }
  if (!err || err.status !== 422 || err.body?.error !== 'email inválido') {
    throw new Error("❌ el error no expone status/body del backend");
  }
} finally {
  globalThis.fetch = origFetch;
  console.error = origError;
}

console.log("✅ Todos los tests de api pasaron");
