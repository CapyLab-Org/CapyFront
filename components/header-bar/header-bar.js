/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { defineComponentFromFiles } from '../../core/component-loader.js';
import { actions } from '../../core/actions.js';

defineComponentFromFiles('header-bar-component', '../components/header-bar/header-bar.html', '../components/header-bar/header-bar.css', {
  observed: ['id', 'name'], // Propiedades de entrada
  onMount: (el, shadow) => {
    // Expone la accion como funcion global si no existe
    if (!window.getHeaderBarId) {
      window.getHeaderBarId = actions.getHeaderBarId;
    }
  }
});
