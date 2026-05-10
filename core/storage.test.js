/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { save, load, remove, saveSession, loadSession, removeSession } from './storage.js';

// save / load — objeto
save('_test_obj', { x: 1, y: [2, 3] });
const obj = load('_test_obj');
if (!obj || obj.x !== 1 || obj.y[1] !== 3) throw new Error("save/load: objeto no se serializó correctamente");

// save / load — primitivos
save('_test_num', 99);
if (load('_test_num') !== 99) throw new Error("save/load: número no coincide");

save('_test_bool', false);
if (load('_test_bool') !== false) throw new Error("save/load: booleano false se perdió");

// load con fallback cuando la clave no existe
const def = load('_test_missing_key', 'fallback');
if (def !== 'fallback') throw new Error("load: fallback no se retornó para clave inexistente");

// remove borra la clave
save('_test_remove', 'borrar');
remove('_test_remove');
if (load('_test_remove') !== null) throw new Error("remove: la clave sigue existiendo después de borrarla");

// saveSession / loadSession
saveSession('_test_sess', { token: 'abc' });
const sess = loadSession('_test_sess');
if (!sess || sess.token !== 'abc') throw new Error("saveSession/loadSession: valor no coincide");

// removeSession borra la clave
removeSession('_test_sess');
if (loadSession('_test_sess') !== null) throw new Error("removeSession: la clave sigue existiendo");

// loadSession con fallback
if (loadSession('_test_sess_missing', 42) !== 42) throw new Error("loadSession: fallback no funcionó");

// Limpieza
remove('_test_obj'); remove('_test_num'); remove('_test_bool');

console.log("✅ Todos los tests de storage.js pasaron");
