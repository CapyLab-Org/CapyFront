/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { getProducts } from './getProducts.js';

export async function getProduct(id) {
  try {
    const products = await getProducts();
    return products.find(p => p.id === id) || null;
  } catch (err) {
    console.error('getProduct falló:', err);
    return null;
  }
}
