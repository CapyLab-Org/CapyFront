/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { defineComponentFromFiles } from '../../core/component-loader.js';
import { loadUsedComponents } from '../../core/components.js';

function calcTotal(items) {
  return items.reduce((sum, i) => sum + parseFloat(i.price || 0), 0).toFixed(2);
}

function renderCart(el, items) {
  const emptyMsg = items.length === 0 ? 'Tu carrito está vacío.' : '';
  el.render({ items, total: calcTotal(items), emptyMsg });
}

defineComponentFromFiles('cart-page', './pages/cart/cart.html', './pages/cart/cart.css', {
  onMount: async (el, shadow) => {
    await loadUsedComponents(shadow);

    // Render inicial desde el store
    const current = window.store.getState('cart') || [];
    renderCart(el, current);

    // Suscribirse a cambios del carrito (store reactivo)
    el._unsub = window.store.subscribe('cart', (items) => renderCart(el, items));

    // Event delegation — btn-remove y btn-clear sobreviven a cada el.render()
    shadow.addEventListener('click', (e) => {
      const cart = window.store.getState('cart') || [];

      if (e.target.matches('.btn-clear')) {
        window.store.setState('cart', []);
        return;
      }

      if (e.target.matches('.btn-remove')) {
        const id = e.target.dataset.id;
        const idx = cart.findIndex(i => i.id === id);
        if (idx !== -1) {
          const next = [...cart.slice(0, idx), ...cart.slice(idx + 1)];
          window.store.setState('cart', next);
        }
      }
    });
  },
  onDisconnect: (el) => {
    if (el._unsub) el._unsub();
  }
});
