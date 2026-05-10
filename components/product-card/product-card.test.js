/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { actions, runAction } from '../../core/actions.js';

console.log("Test: product-card-component actions");
if (actions.getProductCardId() !== 'product-card-id') {
  throw new Error("❌ getProductCardId no devolvió 'product-card-id'");
}

const result = runAction('getProductCardId');
if (result !== 'product-card-id') {
  throw new Error("❌ runAction('getProductCardId') no devolvió 'product-card-id'");
}

console.log("✅ Todos los tests de product-card-component pasaron");