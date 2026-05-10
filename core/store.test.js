/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { setState, getState, subscribe } from './store.js';

// setState / getState
setState('_test_val', 42);
if (getState('_test_val') !== 42) throw new Error("setState/getState: valor no coincide");

setState('_test_val', 'hello');
if (getState('_test_val') !== 'hello') throw new Error("setState/getState: no sobrescribe correctamente");

// subscribe dispara en cada cambio
let received;
const unsub = subscribe('_test_sub', (v) => { received = v; });
setState('_test_sub', 'A');
if (received !== 'A') throw new Error("subscribe: no notificó el cambio");

setState('_test_sub', 'B');
if (received !== 'B') throw new Error("subscribe: no notificó el segundo cambio");

// unsubscribe detiene las notificaciones
unsub();
setState('_test_sub', 'C');
if (received !== 'B') throw new Error("unsubscribe: siguió recibiendo cambios después de cancelar");

// múltiples suscriptores al mismo key
let countA = 0, countB = 0;
const u1 = subscribe('_test_multi', () => countA++);
const u2 = subscribe('_test_multi', () => countB++);
setState('_test_multi', 1);
setState('_test_multi', 2);
if (countA !== 2 || countB !== 2) throw new Error("subscribe múltiple: no notificó a todos los suscriptores");
u1(); u2();

// getState retorna undefined para claves inexistentes
if (getState('_test_inexistente') !== undefined) throw new Error("getState: debería retornar undefined para clave inexistente");

console.log("✅ Todos los tests de store.js pasaron");
