/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { actions, runAction } from '../../core/actions.js';

console.log("Test: counter-component actions");
if (actions.getCounterId() !== 'counter-id') {
  throw new Error("❌ getCounterId no devolvió 'counter-id'");
}

const result = runAction('getCounterId');
if (result !== 'counter-id') {
  throw new Error("❌ runAction('getCounterId') no devolvió 'counter-id'");
}

console.log("✅ Todos los tests de counter-component pasaron");