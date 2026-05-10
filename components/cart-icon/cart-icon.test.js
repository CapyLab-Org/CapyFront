/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { actions, runAction } from '../../core/actions.js';

console.log("Test: cart-icon-component actions");
if (actions.getCartIconId() !== 'cart-icon-id') {
  throw new Error("❌ getCartIconId no devolvió 'cart-icon-id'");
}

const result = runAction('getCartIconId');
if (result !== 'cart-icon-id') {
  throw new Error("❌ runAction('getCartIconId') no devolvió 'cart-icon-id'");
}

console.log("✅ Todos los tests de cart-icon-component pasaron");