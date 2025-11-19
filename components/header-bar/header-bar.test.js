/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */
 
import { actions, runAction } from '../../core/actions.js';

console.log("Test: header-bar-component actions");

if (actions.getHeaderBarId() !== 'header-bar-id') {
  throw new Error("❌ getHeaderBarId no devolvió 'header-bar-id'");
}

const result = runAction('getHeaderBarId');
if (result !== 'header-bar-id') {
  throw new Error("❌ runAction('getHeaderBarId') no devolvió 'header-bar-id'");
}

console.log("✅ Todos los tests de header-bar-component pasaron");
