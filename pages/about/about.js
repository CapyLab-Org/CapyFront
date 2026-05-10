/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { defineComponentFromFiles } from '../../core/component-loader.js';
import { loadUsedComponents } from '../../core/components.js';

const _dir = new URL('.', import.meta.url).href;
await defineComponentFromFiles('about-page', `${_dir}about.html`, `${_dir}about.css`, {
  observed: ['id', 'name'],
  onMount: async (el, shadow) => {
    await loadUsedComponents(shadow);
  }
});
