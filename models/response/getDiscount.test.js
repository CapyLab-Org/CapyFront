/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { getProducts } from './getProducts.js';

const products = await getProducts();

for (const p of products) {
  if (!('discount' in p)) throw new Error(`producto '${p.name}' no tiene campo 'discount'`);
  if (typeof p.discount !== 'number') throw new Error(`'discount' debe ser número en producto '${p.name}'`);
  if (p.discount < 0 || p.discount > 100) throw new Error(`descuento fuera de rango en producto '${p.name}'`);
}

console.log("✅ Todos los productos tienen descuento válido");
