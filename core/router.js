/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

export const routes = {
  contact: { load: () => import('../pages/contact/contact.js'), title: 'Contacto — CapyFront' },
  about:   { load: () => import('../pages/about/about.js'),    title: 'Sobre — CapyFront' },
  home:    { load: () => import('../pages/home/home.js'),      title: 'CapyFront' },
};// se agregan automáticamente

function decodeParam(value) {
  try { return decodeURIComponent(value); } catch { return value; }
}

/**
 * Busca la ruta que coincide con `path`. Exportada para tests.
 * El nombre de la página es siempre el primer segmento: 'product/:id' → <product-page>.
 * @returns {{ entry, params, name } | null}
 */
export function matchRoute(routeMap, path) {
  const pathParts = path.split('/');

  if (routeMap[path]) {
    return { entry: routeMap[path], params: {}, name: pathParts[0] };
  }

  for (const pattern of Object.keys(routeMap)) {
    if (!pattern.includes(':')) continue;
    const patParts = pattern.split('/');
    if (patParts.length !== pathParts.length) continue;

    const params = {};
    const matched = patParts.every((part, i) => {
      if (part.startsWith(':')) { params[part.slice(1)] = decodeParam(pathParts[i]); return true; }
      return part === pathParts[i];
    });

    if (matched) return { entry: routeMap[pattern], params, name: patParts[0] };
  }

  return null;
}

export function initRouter(routeMap) {
  const app = document.getElementById('app');
  let navId = 0;

  async function renderRoute() {
    // si llega otra navegación mientras esta carga, la vieja no debe pisar a la nueva
    const current = ++navId;
    const path = location.hash.slice(1) || 'home';
    let matched = matchRoute(routeMap, path);
    if (!matched) {
      console.warn(`Ruta '${path}' no registrada en router.js — mostrando 'home'`);
      matched = matchRoute(routeMap, 'home');
    }

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
      if (current !== navId) return;
      // createElement + setAttribute: los params vienen del hash y no deben interpretarse como HTML
      const page = document.createElement(`${name}-page`);
      for (const [k, v] of Object.entries(params)) page.setAttribute(k, v);
      app.replaceChildren(page);
      window.scrollTo(0, 0);
    } catch (err) {
      if (current !== navId) return;
      console.error('Error al cargar la ruta:', err);
      app.innerHTML = `<p>Error al cargar la página.</p>`;
    }
  }

  window.addEventListener('hashchange', renderRoute);
  window.addEventListener('DOMContentLoaded', renderRoute);
}
