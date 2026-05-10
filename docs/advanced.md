# Casos avanzados

## Estado global reactivo — `store.js`

Para compartir datos entre componentes sin pasar props manualmente.

```js
import { setState, getState, subscribe } from '../../core/store.js';

// Escribir
setState('cart', [{ id: 1, name: 'Widget', qty: 2 }]);

// Leer
const cart = getState('cart');

// Suscribirse — retorna función para cancelar
const unsub = subscribe('cart', (items) => {
  el.render({ items });
});

// Cancelar (importante en onDisconnect)
unsub();
```

`window.store` también está disponible globalmente: `window.store.setState(...)`.

---

## Re-render del template — `el.render(data)`

`el.render(data)` fusiona `data` con el estado interno del componente y re-aplica el template.

```html
<!-- product-list.html -->
<ul>
  {{#each products}}
    <li>{{name}} — ${{price}}</li>
  {{/each}}
</ul>
```

```js
defineComponentFromFiles('product-list-component', '...html', '...css', {
  onMount: async (el, shadow, props) => {
    const data = await actions.getProducts();
    el.render({ products: data });
  }
});
```

Los datos pasados a `render()` se acumulan — no reemplazan el estado anterior:

```js
el.render({ title: 'Catálogo' });
el.render({ products: data });
// el template tiene acceso a title y products
```

---

## `onDisconnect` — limpieza al desmontar

Se ejecuta cuando el componente se elimina del DOM (ej: al navegar a otra ruta).

```js
defineComponentFromFiles('live-feed-component', '...html', '...css', {
  onMount: (el, shadow, props) => {
    el._unsub = subscribe('feed', items => el.render({ items }));
    el._timer = setInterval(() => actions.refreshFeed(), 5000);
  },
  onDisconnect: (el) => {
    el._unsub();
    clearInterval(el._timer);
  }
});
```

Sin `onDisconnect`, los `subscribe` y los `setInterval` seguirían corriendo en segundo plano.

---

## Comunicación hijo → padre — `emit`

`emit` dispara un `CustomEvent` que burbujea a través del Shadow DOM. El padre lo escucha con `addEventListener`.

```js
// componente hijo
import { defineComponentFromFiles, emit } from '../../core/component-loader.js';

defineComponentFromFiles('product-card-component', '...html', '...css', {
  observed: ['id', 'name'],
  onMount: (el, shadow, props) => {
    shadow.addEventListener('click', (e) => {
      if (e.target.matches('.btn-add')) {
        emit(el, 'add-to-cart', { id: props.id, name: props.name });
      }
    });
  }
});
```

```js
// página padre — en onMount
const list = shadow.querySelector('#product-list');
list.addEventListener('add-to-cart', (e) => {
  const { id, name } = e.detail;
  const cart = getState('cart') || [];
  setState('cart', [...cart, { id, name }]);
});
```

---

## Rutas con parámetros

```js
// core/router.js
export const routes = {
  home:           () => import('../pages/home/home.js'),
  'producto/:id': () => import('../pages/producto/producto.js'),

  // Con título de pestaña
  about: { load: () => import('../pages/about/about.js'), title: 'Sobre nosotros' },
};
```

Los parámetros llegan como atributos al componente de página:

```
URL: #producto/42
→ <producto-page id="42">
→ onMount recibe props.id === '42'
```

```js
// pages/producto/producto.js
defineComponentFromFiles('producto-page', '...html', '...css', {
  observed: ['id'],
  onMount: async (el, shadow, props) => {
    const item = await actions.getProducto(props.id);
    el.render({ nombre: item.nombre, precio: item.precio });
  }
});
```

---

## Persistencia local — `storage.js`

```js
import { save, load, remove, saveSession, loadSession } from '../../core/storage.js';

// localStorage — persiste entre sesiones del navegador
save('token', 'abc123');
const token = load('token');           // 'abc123'
const missing = load('x', 'default'); // 'default' si no existe
remove('token');

// sessionStorage — se limpia al cerrar la pestaña
saveSession('draft', { title: 'Borrador' });
const draft = loadSession('draft');
```

Caso típico — persistir el carrito:

```js
// al cambiar el estado
subscribe('cart', (items) => save('cart', items));

// al montar la app (main.js o página)
const saved = load('cart', []);
if (saved.length) setState('cart', saved);
```

---

## Event delegation en Shadow DOM

Al llamar `el.render()`, el Shadow DOM se reemplaza y los listeners directos sobre elementos internos se pierden. Usar event delegation sobre el shadow root:

```js
// ✅ Sobrevive al re-render
shadow.addEventListener('click', (e) => {
  if (e.target.matches('.btn-delete')) eliminar(e.target.dataset.id);
  if (e.target.matches('.btn-edit'))   editar(e.target.dataset.id);
});

// ❌ Se pierde tras el próximo render
shadow.querySelector('.btn-delete').addEventListener('click', ...);
```

---

## Paths de assets en templates HTML

Los archivos JS resuelven sus paths con `import.meta.url`, por eso son portátiles en cualquier hosting. Pero las URLs de assets (`src`, `href`) dentro de los **templates HTML** se resuelven contra la URL del **documento**, no del archivo template.

Esto importa al desplegar en un subpath (GitHub Pages, Netlify con base path, etc.):

| Path en el template | Localhost (`/`) | Subpath (`/mi-repo/`) |
|---|---|---|
| `/public/assets/logo.png` | ✅ | ❌ resuelve a `/public/...` sin el subpath |
| `./public/assets/logo.png` | ✅ | ✅ |

**Regla: usar siempre `./` al inicio — nunca `/`.**

```html
<!-- ❌ Solo funciona si la app está en la raíz del dominio -->
<img src="/public/assets/logo.png" />

<!-- ✅ Funciona en cualquier hosting -->
<img src="./public/assets/logo.png" />
```

Encodear espacios en nombres de archivo:

```html
<!-- ❌ -->
<img src="./public/assets/Capylab minimal.png" />

<!-- ✅ -->
<img src="./public/assets/Capylab%20minimal.png" />
```

---

## Acciones complejas en archivos separados

Para lógica reutilizable entre componentes:

```js
// core/actions/fetchProducts.js
import { apiRequest } from '../api.js';

export async function fetchProducts(categoria) {
  return apiRequest(`/api/products?cat=${categoria}`);
}
```

```js
// core/actions.js
import { fetchProducts } from './actions/fetchProducts.js';

export const actions = {
  fetchProducts,
};
```
