/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { matchRoute } from '../../core/router.js';

console.log("Test: router matchRoute");

const load = () => {};
const routes = {
  home: { load },
  'user/settings': { load },
  'product/:id': { load },
  'user/:id/:tab': { load },
};

let m = matchRoute(routes, 'home');
if (!m || m.name !== 'home' || Object.keys(m.params).length) {
  throw new Error("❌ ruta estática 'home' no coincidió");
}
m = matchRoute(routes, 'product/42');
if (!m || m.name !== 'product' || m.params.id !== '42') {
  throw new Error("❌ 'product/:id' no extrajo el parámetro");
}
m = matchRoute(routes, 'user/7/perfil');
if (!m || m.name !== 'user' || m.params.id !== '7' || m.params.tab !== 'perfil') {
  throw new Error("❌ 'user/:id/:tab' no extrajo ambos parámetros");
}
m = matchRoute(routes, 'product/hola%20mundo');
if (m.params.id !== 'hola mundo') {
  throw new Error("❌ los parámetros no se decodificaron");
}
m = matchRoute(routes, 'product/%E0%A4%A');
if (m.params.id !== '%E0%A4%A') {
  throw new Error("❌ un parámetro mal codificado debería quedar tal cual");
}
m = matchRoute(routes, 'user/settings');
if (!m || m.name !== 'user') {
  throw new Error("❌ ruta estática con '/' debería usar el primer segmento como nombre");
}
if (matchRoute(routes, 'nope') !== null || matchRoute(routes, 'product/1/extra') !== null) {
  throw new Error("❌ rutas inexistentes deberían devolver null");
}

console.log("✅ Todos los tests de router pasaron");
