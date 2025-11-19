/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

export const routes = {
  contact: () => import('../pages/contact/contact.js'),
  about: () => import('../pages/about/about.js'),
  home: () => import('../pages/home/home.js'),
};// se agregan automáticamente

export function initRouter(routeMap) {
  const app = document.getElementById('app');

  async function renderRoute() {
    const route = location.hash.slice(1) || 'home';
    const loader = routeMap[route] || routeMap['home'];

    app.innerHTML = `<loading-spinner-component></loading-spinner-component>`;
    await loader();

    const tag = `${route}-page`;
    app.innerHTML = `<${tag}></${tag}>`;
  }

  window.addEventListener('hashchange', renderRoute);
  window.addEventListener('DOMContentLoaded', renderRoute);
}