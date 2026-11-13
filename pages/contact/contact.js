/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { defineComponentFromFiles } from '../../core/component-loader.js';
import { loadUsedComponents } from '../../core/components.js';

const _dir = new URL('.', import.meta.url).href;
await defineComponentFromFiles('contact-page', `${_dir}contact.html`, `${_dir}contact.css`, {
  observed: ['id', 'name'],
  onMount: async (el, shadow) => {
    await loadUsedComponents(shadow);
    // delegación sobre el shadow root: sobrevive a el.render()
    shadow.addEventListener('submit', (e) => {
      if (!e.target.matches('#contact-form')) return;
      e.preventDefault();
      const name = shadow.querySelector('#contact-name').value.trim();
      const message = shadow.querySelector('#contact-message').value.trim();
      if (!name || !message) return;
      console.log('Formulario enviado:', { name, message });
    });
  }
});
