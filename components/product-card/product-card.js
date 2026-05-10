/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { defineComponentFromFiles, emit } from '../../core/component-loader.js';

defineComponentFromFiles('product-card-component', './components/product-card/product-card.html', './components/product-card/product-card.css', {
  observed: ['id', 'name', 'price', 'emoji', 'stock'],
  onMount: (el, shadow, props) => {
    const stock = parseInt(props.stock) || 0;
    const btn = shadow.querySelector('.btn-add');
    if (btn && stock <= 0) {
      btn.disabled = true;
      btn.textContent = 'Sin stock';
    }

    // event delegation — sobrevive a cada el.render() del padre
    shadow.addEventListener('click', (e) => {
      if (e.target.matches('.btn-add') && !e.target.disabled) {
        emit(el, 'add-to-cart', { id: props.id, name: props.name, price: props.price, emoji: props.emoji });
      }
    });
  },
  onDisconnect: (el) => {}
});
