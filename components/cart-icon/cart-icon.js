/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { defineComponentFromFiles } from '../../core/component-loader.js';

defineComponentFromFiles('cart-icon-component', './components/cart-icon/cart-icon.html', './components/cart-icon/cart-icon.css', {
  onMount: (el, shadow, props) => {
    el.render({ count: (window.store.getState('cart') || []).length });

    el._unsub = window.store.subscribe('cart', (items) => {
      el.render({ count: (items || []).length });
    });
  },
  onDisconnect: (el) => {
    if (el._unsub) el._unsub();
  }
});
