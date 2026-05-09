/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { defineComponentFromFiles } from '../../core/component-loader.js';
import { loadUsedComponents } from '../../core/components.js';

await defineComponentFromFiles('contact-page', '../pages/contact/contact.html', '../pages/contact/contact.css', {
  observed: ['id', 'name'],
  onMount: async (el, shadow) => {
    await loadUsedComponents(shadow);
    const form = shadow.querySelector('#contact-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = shadow.querySelector('#contact-name').value.trim();
        const message = shadow.querySelector('#contact-message').value.trim();
        if (!name || !message) return;
        console.log('Formulario enviado:', { name, message });
      });
    }
  }
});
