/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { defineComponentFromFiles } from '../../core/component-loader.js';
import { actions } from '../../core/actions.js';

defineComponentFromFiles('loading-spinner-component', '../components/loading-spinner/loading-spinner.html', '../components/loading-spinner/loading-spinner.css', {
  observed: ['id', 'name'], // Propiedades de entrada
  onMount: (el, shadow) => {
    // Expone la accion como funcion global si no existe
    if (!window.getLoadingSpinnerId) {
      window.getLoadingSpinnerId = actions.getLoadingSpinnerId;
    }
  }
});
