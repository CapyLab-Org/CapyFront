/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { defineComponentFromFiles } from '../../core/component-loader.js';
import { loadUsedComponents } from '../../core/components.js';

const _dir = new URL('.', import.meta.url).href;
await defineComponentFromFiles('home-page', `${_dir}home.html`, `${_dir}home.css`, {
  observed: ['id', 'name'],
  onMount: async (el, shadow) => {
    await loadUsedComponents(shadow);
  }
});
