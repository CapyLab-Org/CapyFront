/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { actions, runAction } from '../../core/actions.js';

console.log("Test: actions / runAction");

actions.__testSum = (a, b) => a + b;
const origWarn = console.warn;
let warned = false;

try {
  if (runAction('__testSum', 2, 3) !== 5) {
    throw new Error("❌ runAction no invocó la acción con sus argumentos");
  }
  console.warn = () => { warned = true; };
  if (runAction('__noExiste') !== undefined || !warned) {
    throw new Error("❌ runAction de una acción inexistente debería avisar y devolver undefined");
  }
} finally {
  console.warn = origWarn;
  delete actions.__testSum;
}

console.log("✅ Todos los tests de actions pasaron");
