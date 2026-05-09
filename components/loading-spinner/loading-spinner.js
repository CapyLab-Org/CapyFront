/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { defineComponentFromFiles } from '../../core/component-loader.js';

await defineComponentFromFiles('loading-spinner-component', '../components/loading-spinner/loading-spinner.html', '../components/loading-spinner/loading-spinner.css', {
  observed: ['id', 'name'],
});
