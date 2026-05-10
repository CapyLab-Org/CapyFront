/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { getProducts } from './getProducts.js';

const products = await getProducts();

if (!Array.isArray(products)) throw new Error("getProducts: no devolvió un array");
if (products.length === 0)    throw new Error("getProducts: el catálogo está vacío");

const REQUIRED = ['id', 'name', 'price', 'emoji', 'stock', 'desc'];
for (const p of products) {
  for (const field of REQUIRED) {
    if (!(field in p)) throw new Error(`getProducts: producto sin campo '${field}'`);
    if (p[field] === '' || p[field] === undefined) throw new Error(`getProducts: campo '${field}' vacío en producto ${p.id}`);
  }
  if (isNaN(parseFloat(p.price))) throw new Error(`getProducts: precio no numérico en producto ${p.id}`);
  if (isNaN(parseInt(p.stock)))   throw new Error(`getProducts: stock no entero en producto ${p.id}`);
  if (parseInt(p.stock) < 0)      throw new Error(`getProducts: stock negativo en producto ${p.id}`);
}

// IDs únicos
const ids = products.map(p => p.id);
if (new Set(ids).size !== ids.length) throw new Error("getProducts: IDs duplicados en el catálogo");

console.log(`✅ getProducts devolvió ${products.length} productos con estructura válida`);
