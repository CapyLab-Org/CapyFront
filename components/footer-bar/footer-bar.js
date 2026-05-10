/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { defineComponentFromFiles } from '../../core/component-loader.js';

await defineComponentFromFiles('footer-bar-component', './components/footer-bar/footer-bar.html', './components/footer-bar/footer-bar.css', {
  observed: ['id', 'name'],
});
