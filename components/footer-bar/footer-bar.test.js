/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import './footer-bar.js';   // registra <footer-bar-component>

console.log("Test: footer-bar-component");

const el = document.createElement('footer-bar-component');
document.body.appendChild(el);

try {
  if (!el.shadowRoot) {
    throw new Error("❌ footer-bar-component no creó su shadow root");
  }
  if (!el.shadowRoot.querySelector('a[href*="github.com"]')) {
    throw new Error("❌ footer-bar-component no renderizó el link a GitHub");
  }
} finally {
  el.remove();
}

console.log("✅ Todos los tests de footer-bar-component pasaron");
