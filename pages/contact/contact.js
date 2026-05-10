/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { defineComponentFromFiles } from '../../core/component-loader.js';
import { loadUsedComponents } from '../../core/components.js';
import { actions } from '../../core/actions.js';

await defineComponentFromFiles('contact-page', './pages/contact/contact.html', './pages/contact/contact.css', {
  onMount: async (el, shadow) => {
    await loadUsedComponents(shadow);

    shadow.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name    = shadow.querySelector('#contact-name').value.trim();
      const email   = shadow.querySelector('#contact-email').value.trim();
      const message = shadow.querySelector('#contact-message').value.trim();

      if (!name || !email || !message) {
        el.render({ error: 'Completá todos los campos.', successMsg: '' });
        return;
      }

      el.render({ error: '' });
      await actions.saveContact({ name, email, message });
      el.render({ successMsg: `✅ Mensaje de ${name} enviado. (Ver consola)` });
    });
  },
  onDisconnect: (el) => {}
});
