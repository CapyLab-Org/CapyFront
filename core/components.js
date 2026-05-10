/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

export const components = {
  'counter-component': () => import('../components/counter/counter.js'),
  'cart-icon-component': () => import('../components/cart-icon/cart-icon.js'),
  'product-card-component': () => import('../components/product-card/product-card.js'),
  'footer-bar-component': () => import('../components/footer-bar/footer-bar.js'),
  'header-bar-component': () => import('../components/header-bar/header-bar.js'),
  'loading-spinner-component': () => import('../components/loading-spinner/loading-spinner.js'),
};// se agregan automáticamente

export async function loadUsedComponents(root = document) {
  const tags = Object.keys(components);
  const found = tags.filter(tag => root.querySelector(tag));

  await Promise.all(found.map(tag => components[tag]()));
}