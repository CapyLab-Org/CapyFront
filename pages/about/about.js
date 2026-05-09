/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { defineComponentFromFiles } from '../../core/component-loader.js';
import { loadUsedComponents } from '../../core/components.js';

await defineComponentFromFiles('about-page', '../pages/about/about.html', '../pages/about/about.css', {
  observed: ['id', 'name'],
  onMount: async (el, shadow) => {
    await loadUsedComponents(shadow);
  }
});
