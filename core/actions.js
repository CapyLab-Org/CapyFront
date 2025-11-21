/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { actionExample } from './actions/actionExample.js';

export const actions = {
  actionExample,
  getFooterBarId: () => 'footer-bar-id',
  getHeaderBarId: () => 'header-bar-id',
  getLoadingSpinnerId: () => 'loading-spinner-id',
};// se agregan automáticamente

export function runAction(name, ...args) {
  const fn = actions[name];
  if (typeof fn === 'function') {
    return fn(...args);
  } else {
    console.warn(`Acción '${name}' no registrada en actions.js`);
  }
}