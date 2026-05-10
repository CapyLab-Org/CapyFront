/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { defineComponentFromFiles } from '../../core/component-loader.js';

const _dir = new URL('.', import.meta.url).href;
defineComponentFromFiles('counter-component', `${_dir}counter.html`, `${_dir}counter.css`, {
  onMount: (el, shadow, props) => {
    el.render({ count: 0 });

    // event delegation — sobrevive a cada el.render()
    shadow.addEventListener('click', (e) => {
      const n = el._data.count || 0;
      if (e.target.matches('.btn-inc'))   el.render({ count: n + 1 });
      if (e.target.matches('.btn-dec'))   el.render({ count: n - 1 });
      if (e.target.matches('.btn-reset')) el.render({ count: 0 });
    });
  },
  onDisconnect: (el) => {}
});
