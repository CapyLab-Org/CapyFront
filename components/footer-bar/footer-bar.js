/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { defineComponentFromFiles } from '../../core/component-loader.js';

const _dir = new URL('.', import.meta.url).href;
await defineComponentFromFiles('footer-bar-component', `${_dir}footer-bar.html`, `${_dir}footer-bar.css`, {
  observed: ['id', 'name'],
});
