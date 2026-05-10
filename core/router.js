/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

export const routes = {
  login: { load: () => import('../pages/login/login.js'), title: 'Iniciar sesión' },
  cart:  { load: () => import('../pages/cart/cart.js'),  title: 'Carrito' },
  'product/:id': () => import('../pages/product/product.js'),
  contact: () => import('../pages/contact/contact.js'),
  about: { load: () => import('../pages/about/about.js'), title: 'Sobre CapyFront' },
  home: () => import('../pages/home/home.js'),
};// se agregan automáticamente

function matchRoute(routeMap, path) {
  if (routeMap[path]) {
    return { entry: routeMap[path], params: {}, name: path };
  }

  for (const pattern of Object.keys(routeMap)) {
    if (!pattern.includes(':')) continue;
    const patParts = pattern.split('/');
    const pathParts = path.split('/');
    if (patParts.length !== pathParts.length) continue;

    const params = {};
    const matched = patParts.every((part, i) => {
      if (part.startsWith(':')) { params[part.slice(1)] = pathParts[i]; return true; }
      return part === pathParts[i];
    });

    if (matched) return { entry: routeMap[pattern], params, name: patParts[0] };
  }

  return null;
}

export function initRouter(routeMap) {
  const app = document.getElementById('app');

  async function renderRoute() {
    const path = location.hash.slice(1) || 'home';
    const matched = matchRoute(routeMap, path) || matchRoute(routeMap, 'home');

    if (!matched) {
      app.innerHTML = `<p>Error: ruta no encontrada.</p>`;
      return;
    }

    const { entry, params, name } = matched;
    const loadFn = typeof entry === 'function' ? entry : entry.load;
    const title = typeof entry === 'object' && entry.title ? entry.title : null;

    if (title) document.title = title;

    app.innerHTML = `<loading-spinner-component></loading-spinner-component>`;

    try {
      await loadFn();
      const tag = `${name}-page`;
      const attrs = Object.entries(params).map(([k, v]) => `${k}="${v}"`).join(' ');
      app.innerHTML = `<${tag} ${attrs}></${tag}>`;
    } catch (err) {
      console.error('Error al cargar la ruta:', err);
      app.innerHTML = `<p>Error al cargar la página.</p>`;
    }
  }

  window.addEventListener('hashchange', renderRoute);
  window.addEventListener('DOMContentLoaded', renderRoute);
}
