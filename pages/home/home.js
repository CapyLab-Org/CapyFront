/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { defineComponentFromFiles } from '../../core/component-loader.js';
import { loadUsedComponents } from '../../core/components.js';

defineComponentFromFiles('home-page', '../pages/home/home.html', '../pages/home/home.css', {
  observed: ['id', 'name'], // Propiedades de entrada
  onMount: async (el, shadow) => {
    await loadUsedComponents(shadow);
  }
});
