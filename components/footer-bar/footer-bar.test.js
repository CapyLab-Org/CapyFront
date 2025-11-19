/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */
 
import { actions, runAction } from '../../core/actions.js';

console.log("Test: footer-bar-component actions");

if (actions.getFooterBarId() !== 'footer-bar-id') {
  throw new Error("❌ getFooterBarId no devolvió 'footer-bar-id'");
}

const result = runAction('getFooterBarId');
if (result !== 'footer-bar-id') {
  throw new Error("❌ runAction('getFooterBarId') no devolvió 'footer-bar-id'");
}

console.log("✅ Todos los tests de footer-bar-component pasaron");
