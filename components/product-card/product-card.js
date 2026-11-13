/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { defineComponentFromFiles, emit } from '../../core/component-loader.js';

const _dir = new URL('.', import.meta.url).href;
defineComponentFromFiles('product-card-component', `${_dir}product-card.html`, `${_dir}product-card.css`, {
  observed: ['id', 'name', 'price', 'emoji', 'stock'],
  onMount: (el, shadow, props) => {
    // props.stock llega como string ("0" es verdadero): se pasa un booleano al template
    el.render({ inStock: (parseInt(props.stock) || 0) > 0 });

    // event delegation — sobrevive a cada el.render() del padre
    shadow.addEventListener('click', (e) => {
      if (e.target.matches('.btn-add') && !e.target.disabled) {
        emit(el, 'add-to-cart', { id: props.id, name: props.name, price: props.price, emoji: props.emoji });
      }
    });
  },
  onDisconnect: (el) => {}
});
