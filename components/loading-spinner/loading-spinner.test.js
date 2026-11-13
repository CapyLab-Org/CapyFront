/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import './loading-spinner.js';   // registra <loading-spinner-component>

console.log("Test: loading-spinner-component");

const el = document.createElement('loading-spinner-component');
document.body.appendChild(el);

try {
  if (!el.shadowRoot) {
    throw new Error("❌ loading-spinner-component no creó su shadow root");
  }
  if (!el.shadowRoot.querySelector('.spinner')) {
    throw new Error("❌ loading-spinner-component no renderizó el .spinner");
  }
} finally {
  el.remove();
}

console.log("✅ Todos los tests de loading-spinner-component pasaron");
