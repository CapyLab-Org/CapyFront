/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { apiRequest } from '../../core/api.js';

// Normaliza la respuesta del backend al formato que usan los componentes
export function exampleResponse(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    active: raw.active ?? false,
  };
}

export async function getExample(id) {
  const raw = await apiRequest(`/api/example/${encodeURIComponent(id)}`);
  return exampleResponse(raw);
}
