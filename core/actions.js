/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { getProducts } from '../models/response/getProducts.js';
import { getProduct }  from '../models/response/getProduct.js';
import { saveContact } from '../models/request/saveContact.js';

export const actions = {
  getProducts,
  getProduct,
  saveContact,
  getCounterId: () => 'counter-id',
  getCartIconId: () => 'cart-icon-id',
  getProductCardId: () => 'product-card-id',
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