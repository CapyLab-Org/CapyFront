/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

// Registrá acá las funciones de models/ que quieras compartir entre componentes:
//   import { getProducts } from '../models/response/getProducts.js';
//   export const actions = { getProducts };
export const actions = {
};

export function runAction(name, ...args) {
  const fn = actions[name];
  if (typeof fn === 'function') {
    return fn(...args);
  } else {
    console.warn(`Acción '${name}' no registrada en actions.js`);
  }
}