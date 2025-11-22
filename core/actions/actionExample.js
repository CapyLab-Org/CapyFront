/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { apiRequest } from '../api.js';

export async function actionExample() {
  const res = await apiRequest('/api/products');
  return res.json();
}