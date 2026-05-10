/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { defineComponentFromFiles } from '../../core/component-loader.js';
import { loadUsedComponents } from '../../core/components.js';
import { setAuthToken } from '../../core/api.js';
import { save, load, saveSession, loadSession } from '../../core/storage.js';

defineComponentFromFiles('login-page', '../pages/login/login.html', '../pages/login/login.css', {
  onMount: async (el, shadow) => {
    await loadUsedComponents(shadow);

    // Restaurar draft del email desde sessionStorage
    const draft = loadSession('login-draft');
    if (draft) {
      shadow.querySelector('#email').value = draft;
    }

    shadow.addEventListener('input', (e) => {
      if (e.target.id === 'email') {
        saveSession('login-draft', e.target.value);
      }
    });

    shadow.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email    = shadow.querySelector('#email').value.trim();
      const password = shadow.querySelector('#password').value.trim();

      if (!email || !password) {
        el.render({ error: 'Completá todos los campos.', successMsg: '' });
        return;
      }

      // Simular login: generar token fake
      const token = btoa(`${email}:${Date.now()}`);
      setAuthToken(token);
      save('token', token);

      el.render({ error: '', successMsg: `✅ Sesión iniciada como ${email}. Token guardado en localStorage.` });
    });
  },
  onDisconnect: (el) => {}
});
