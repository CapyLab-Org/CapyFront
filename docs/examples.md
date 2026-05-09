# Recetario de patrones

## 1. Componente básico con props

```html
<!-- user-card.html -->
<div class="user-card">
  <h3>{{name}}</h3>
  <p>ID: {{id}}</p>
</div>
```

```html
<user-card-component id="42" name="Capy"></user-card-component>
```

```js
defineComponentFromFiles('user-card-component', '...html', '...css', {
  observed: ['id', 'name'],
});
```

---

## 2. Lista dinámica con `{{#each}}`

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
    const products = await actions.getProducts();
    el.render({ products });
  }
});
```

---

## 3. Contador con re-render

```html
<!-- counter.html -->
<div>
  <p>Clicks: {{count}}</p>
  <button class="btn-add">+1</button>
</div>
```

```js
defineComponentFromFiles('counter-component', '...html', '...css', {
  onMount: (el, shadow, props) => {
    el.render({ count: 0 });

    shadow.addEventListener('click', (e) => {
      if (e.target.matches('.btn-add')) {
        el.render({ count: (el._data.count || 0) + 1 });
      }
    });
  }
});
```

---

## 4. Formulario

```js
defineComponentFromFiles('contact-form-component', '...html', '...css', {
  onMount: (el, shadow, props) => {
    shadow.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name  = shadow.querySelector('#name').value;
      const email = shadow.querySelector('#email').value;

      if (!name || !email) {
        el.render({ error: 'Completá todos los campos' });
        return;
      }

      await actions.saveContact({ name, email });
      el.render({ success: true, error: '' });
    });
  }
});
```

---

## 5. Componente conectado al store global

```js
// componente carrito
defineComponentFromFiles('cart-icon-component', '...html', '...css', {
  onMount: (el, shadow, props) => {
    el._unsub = window.store.subscribe('cart', (items) => {
      el.render({ count: items.length });
    });
    el.render({ count: (window.store.getState('cart') || []).length });
  },
  onDisconnect: (el) => {
    el._unsub();
  }
});

// desde cualquier parte de la app
window.store.setState('cart', [...items, nuevoItem]);
// → cart-icon-component se actualiza automáticamente
```

---

## 6. Comunicación hijo → padre

```js
// hijo: product-card emite evento al hacer clic en "Agregar"
shadow.addEventListener('click', (e) => {
  if (e.target.matches('.btn-add')) {
    emit(el, 'add-to-cart', { id: props.id, name: props.name, price: props.price });
  }
});

// padre: página escucha el evento
shadow.addEventListener('add-to-cart', (e) => {
  const cart = window.store.getState('cart') || [];
  window.store.setState('cart', [...cart, e.detail]);
});
```

---

## 7. Página con parámetro de ruta

```js
// core/router.js
'producto/:id': () => import('../pages/producto/producto.js'),
```

```js
// pages/producto/producto.js
defineComponentFromFiles('producto-page', '...html', '...css', {
  observed: ['id'],
  onMount: async (el, shadow, props) => {
    await loadUsedComponents(shadow);
    const item = await actions.getProducto(props.id);  // props.id = '42' para #producto/42
    el.render({ nombre: item.nombre, precio: item.precio, stock: item.stock });
  }
});
```

---

## 8. Persistir estado entre recargas

```js
import { save, load } from '../../core/storage.js';

// Guardar cada vez que cambia el carrito
window.store.subscribe('cart', (items) => save('cart', items));

// Restaurar al iniciar (en main.js o en la página principal)
const saved = load('cart', []);
if (saved.length) window.store.setState('cart', saved);
```

---

## 9. Acción con auth token

```js
// Al hacer login
import { setAuthToken } from '../../core/api.js';
import { save } from '../../core/storage.js';

async function login(email, password) {
  const { token } = await apiRequest('/api/login', {
    method: 'POST',
    body: { email, password }
  });
  setAuthToken(token);
  save('token', token);
}

// Al cargar la app (main.js)
import { load } from './storage.js';
import { setAuthToken } from './api.js';

const savedToken = load('token');
if (savedToken) setAuthToken(savedToken);
```
