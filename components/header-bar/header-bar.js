/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { defineComponentFromFiles } from '../../core/component-loader.js';

const _dir = new URL('.', import.meta.url).href;
await defineComponentFromFiles('header-bar-component', `${_dir}header-bar.html`, `${_dir}header-bar.css`, {
  observed: ['id', 'name'],
});
