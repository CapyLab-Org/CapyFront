/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { setState, getState, subscribe } from '../../core/store.js';

console.log("Test: store");

setState('__test_a', 1);
if (getState('__test_a') !== 1) throw new Error("❌ getState no devolvió el valor guardado");

const seen = [];
const unsub = subscribe('__test_a', (v, k) => seen.push([v, k]));
setState('__test_a', 2);
if (seen.length !== 1 || seen[0][0] !== 2 || seen[0][1] !== '__test_a') {
  throw new Error("❌ subscribe no recibió (value, key)");
}
unsub();
setState('__test_a', 3);
if (seen.length !== 1) throw new Error("❌ unsubscribe no canceló la suscripción");

// un listener que falla no corta al resto
const origError = console.error;
console.error = () => {};
let reached = false;
const u1 = subscribe('__test_b', () => { throw new Error('boom'); });
const u2 = subscribe('__test_b', () => { reached = true; });
try { setState('__test_b', 1); } finally { console.error = origError; }
u1(); u2();
if (!reached) throw new Error("❌ un listener con error impidió notificar al siguiente");

console.log("✅ Todos los tests de store pasaron");
