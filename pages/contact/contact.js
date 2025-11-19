/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { defineComponentFromFiles } from '../../core/component-loader.js';
import { loadUsedComponents } from '../../core/components.js';

defineComponentFromFiles('contact-page', '../pages/contact/contact.html', '../pages/contact/contact.css', {
  observed: ['id', 'name'], // Propiedades de entrada
  onMount: async (el, shadow) => {
    await loadUsedComponents(shadow);
  }
});
