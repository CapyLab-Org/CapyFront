/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { defineComponentFromFiles } from '../../core/component-loader.js';

const _dir = new URL('.', import.meta.url).href;
await defineComponentFromFiles('loading-spinner-component', `${_dir}loading-spinner.html`, `${_dir}loading-spinner.css`, {
  observed: ['id', 'name'],
});
