/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { defineComponentFromFiles } from '../../core/component-loader.js';

await defineComponentFromFiles('header-bar-component', '../components/header-bar/header-bar.html', '../components/header-bar/header-bar.css', {
  observed: ['id', 'name'],
});
