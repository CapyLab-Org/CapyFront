/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { defineComponentFromFiles } from '../../core/component-loader.js';

const _dir = new URL('.', import.meta.url).href;
defineComponentFromFiles('counter-component', `${_dir}counter.html`, `${_dir}counter.css`, {
  onMount: (el, shadow, props) => {
    el.render({ count: window.store.getState('counterValue') ?? 0 });
    // refleja cambios hechos desde afuera (ej: actions.resetCounter vía data-on-dblclick)
    el._unsub = window.store.subscribe('counterValue', count => el.render({ count }));

    // event delegation — sobrevive a cada el.render()
    shadow.addEventListener('click', (e) => {
      const n = el._data.count || 0;
      let next = n;
      if (e.target.matches('.btn-inc'))   next = n + 1;
      if (e.target.matches('.btn-dec'))   next = n - 1;
      if (e.target.matches('.btn-reset')) next = 0;
      if (next !== n) {
        el.render({ count: next });
        window.store.setState('counterValue', next);
      }
    });
  },
  onDisconnect: (el) => {
    if (el._unsub) el._unsub();
  }
});
