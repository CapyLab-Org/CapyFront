/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { defineComponentFromFiles } from '../../core/component-loader.js';
import { loadUsedComponents } from '../../core/components.js';
import { actions } from '../../core/actions.js';

const _dir = new URL('.', import.meta.url).href;
defineComponentFromFiles('product-page', `${_dir}product.html`, `${_dir}product.css`, {
  observed: ['id'],
  onMount: async (el, shadow, props) => {
    await loadUsedComponents(shadow);

    const item = await actions.getProduct(props.id);
    if (!item) {
      el.render({ notFound: true });
      return;
    }

    const getStock = () => {
      const stockMap = window.store.getState('stock') || {};
      return stockMap[item.id] !== undefined ? stockMap[item.id] : parseInt(item.stock);
    };

    const updateDisplay = () => {
      const currentStock = getStock();
      // inStock es booleano: un string como "0" sería verdadero en {{#if}}
      el.render({ ...item, found: true, stock: currentStock, inStock: currentStock > 0 });
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
