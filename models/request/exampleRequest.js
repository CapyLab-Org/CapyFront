/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { apiRequest } from '../../core/api.js';

export async function createExample(payload) {
  return apiRequest('/api/example', { method: 'POST', body: payload });
}
