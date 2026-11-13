/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { save, load, remove, saveSession, loadSession, removeSession } from '../../core/storage.js';

console.log("Test: storage");

save('__test_k', { a: 1, list: [1, 2] });
const v = load('__test_k');
if (!v || v.a !== 1 || v.list.length !== 2) throw new Error("❌ save/load no serializó el objeto");
remove('__test_k');
if (load('__test_k', 'fallback') !== 'fallback') throw new Error("❌ remove/fallback no funcionó");

localStorage.setItem('__test_bad', '{no-json');
if (load('__test_bad', 'fb') !== 'fb') throw new Error("❌ JSON inválido debería devolver el fallback");
localStorage.removeItem('__test_bad');

saveSession('__test_s', 'hola');
if (loadSession('__test_s') !== 'hola') throw new Error("❌ saveSession/loadSession falló");
removeSession('__test_s');
if (loadSession('__test_s') !== null) throw new Error("❌ removeSession no eliminó la clave");

console.log("✅ Todos los tests de storage pasaron");
