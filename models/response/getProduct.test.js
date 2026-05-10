/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { getProducts } from './getProducts.js';
import { getProduct }  from './getProduct.js';

const all = await getProducts();

// Buscar cada producto por su ID real
for (const expected of all) {
  const found = await getProduct(expected.id);
  if (!found)              throw new Error(`getProduct('${expected.id}'): devolvió null para producto existente`);
  if (found.id !== expected.id)     throw new Error(`getProduct('${expected.id}'): id no coincide`);
  if (found.name !== expected.name) throw new Error(`getProduct('${expected.id}'): name no coincide`);
}

// ID inexistente debe retornar null
const missing = await getProduct('__no_existe__');
if (missing !== null) throw new Error("getProduct: debería devolver null para un ID inexistente");

console.log(`✅ getProduct encontró correctamente todos los productos y retornó null para IDs inexistentes`);
