/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { defineComponentFromFiles } from '../../core/component-loader.js';
import { loadUsedComponents } from '../../core/components.js';
import { actions } from '../../core/actions.js';

defineComponentFromFiles('product-page', '../pages/product/product.html', '../pages/product/product.css', {
  observed: ['id'],
  onMount: async (el, shadow, props) => {
    await loadUsedComponents(shadow);

    const item = await actions.getProduct(props.id);
    if (!item) {
      el.render({ name: 'Producto no encontrado', desc: '', price: '', stock: '0', emoji: '❓' });
      return;
    }

    const getStock = () => {
      const stockMap = window.store.getState('stock') || {};
      return stockMap[item.id] !== undefined ? stockMap[item.id] : parseInt(item.stock);
    };

    const updateDisplay = () => {
      const currentStock = getStock();
      el.render({ ...item, stock: String(currentStock) });
      const btn = shadow.querySelector('.btn-add');
      if (btn) {
        btn.disabled = currentStock <= 0;
        btn.textContent = currentStock <= 0 ? 'Sin stock' : 'Agregar al carrito';
      }
    };

    updateDisplay();
    el._unsub = window.store.subscribe('stock', updateDisplay);

    shadow.addEventListener('click', (e) => {
      if (e.target.matches('.btn-add')) {
        const currentStock = getStock();
        if (currentStock <= 0) return;

        const stockMap = window.store.getState('stock') || {};
        window.store.setState('stock', { ...stockMap, [item.id]: currentStock - 1 });

        const cart = window.store.getState('cart') || [];
        window.store.setState('cart', [...cart, { id: item.id, name: item.name, price: item.price, emoji: item.emoji }]);
      }
    });
  },
  onDisconnect: (el) => {
    if (el._unsub) el._unsub();
  }
});
