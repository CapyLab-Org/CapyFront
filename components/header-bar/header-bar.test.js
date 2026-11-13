/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import './header-bar.js';   // registra <header-bar-component>

console.log("Test: header-bar-component");

const el = document.createElement('header-bar-component');
document.body.appendChild(el);

try {
  if (!el.shadowRoot) {
    throw new Error("❌ header-bar-component no creó su shadow root");
  }
  const links = [...el.shadowRoot.querySelectorAll('nav a')].map(a => a.getAttribute('href'));
  if (!links.includes('#about') || !links.includes('#contact')) {
    throw new Error("❌ header-bar-component no renderizó los links de navegación");
  }
} finally {
  el.remove();
}

console.log("✅ Todos los tests de header-bar-component pasaron");
