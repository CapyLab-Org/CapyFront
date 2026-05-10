/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { defineComponentFromFiles } from '../../core/component-loader.js';
import { loadUsedComponents } from '../../core/components.js';
import { actions } from '../../core/actions.js';

const _dir = new URL('.', import.meta.url).href;
await defineComponentFromFiles('home-page', `${_dir}home.html`, `${_dir}home.css`, {
  onMount: async (el, shadow) => {
    await loadUsedComponents(shadow);

    const rawProducts = await actions.getProducts();

    // Inicializar stock en el store solo si todavía no fue seteado
    if (!window.store.getState('stock')) {
      const stockMap = Object.fromEntries(rawProducts.map(p => [p.id, parseInt(p.stock)]));
      window.store.setState('stock', stockMap);
    }
    window.store.setState('catalog', rawProducts);

    const renderGrid = async () => {
      const stockMap = window.store.getState('stock') || {};
      const products = rawProducts.map(p => ({
        ...p,
        stock: String(stockMap[p.id] ?? parseInt(p.stock)),
      }));
      el.render({ products });
      await loadUsedComponents(shadow);
    };

    await renderGrid();

    // Re-renderizar la grilla cuando cambia el stock en el store
    el._unsub = window.store.subscribe('stock', () => renderGrid());

    // Escuchar add-to-cart de los product-card hijos (emit con composed:true)
    shadow.addEventListener('add-to-cart', (e) => {
      const { id } = e.detail;
      const stockMap = window.store.getState('stock') || {};
      if ((stockMap[id] ?? 0) <= 0) return;

      window.store.setState('stock', { ...stockMap, [id]: stockMap[id] - 1 });
      const cart = window.store.getState('cart') || [];
      window.store.setState('cart', [...cart, e.detail]);
    });
  },
  onDisconnect: (el) => {
    if (el._unsub) el._unsub();
  }
});
