/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */
 
import { actions, runAction } from '../../core/actions.js';

console.log("Test: loading-spinner-component actions");

if (actions.getLoadingSpinnerId() !== 'loading-spinner-id') {
  throw new Error("❌ getLoadingSpinnerId no devolvió 'loading-spinner-id'");
}

const result = runAction('getLoadingSpinnerId');
if (result !== 'loading-spinner-id') {
  throw new Error("❌ runAction('getLoadingSpinnerId') no devolvió 'loading-spinner-id'");
}

console.log("✅ Todos los tests de loading-spinner-component pasaron");
