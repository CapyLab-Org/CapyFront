/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { apiRequest } from '../../core/api.js';

export async function getExample(id) {
  return await apiRequest(`/api/example/${id}`, { method: 'GET' });
}

export async function createExample(payload) {
  return await apiRequest('/api/example', { method: 'POST', body: payload });
}