/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { defineComponentFromFiles } from '../../core/component-loader.js';
import { actions } from '../../core/actions.js';

defineComponentFromFiles('footer-bar-component', '../components/footer-bar/footer-bar.html', '../components/footer-bar/footer-bar.css', {
  observed: ['id', 'name'], // Propiedades de entrada
  onMount: (el, shadow) => {
    // Expone la accion como funcion global si no existe
    if (!window.getFooterBarId) {
      window.getFooterBarId = actions.getFooterBarId;
    }
  }
});
