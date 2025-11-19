# Ejemplos prácticos de CapyFront

Este documento reúne snippets y patrones comunes para implementar componentes y páginas con CapyFront.

---

## 1. Formulario con validación

```html
<user-form-component></user-form-component>
```

```js
defineComponentFromFiles('user-form-component', 'user-form.html', 'user-form.css', {
  observed: [],
  onMount: (el, shadow) => {
    const form = shadow.querySelector('form');
    form.onsubmit = (e) => {
      e.preventDefault();
      const name = shadow.querySelector('#name').value;
      const email = shadow.querySelector('#email').value;

      if (!actions.validateForm({ name, email })) {
        alert('❌ Datos inválidos');
        return;
      }
      alert('✅ Formulario válido');
    };
  }
});
```

---

## 2. Contador con estado interno

```html
<counter-widget-component></counter-widget-component>
```

```js
defineComponentFromFiles('counter-widget-component', 'counter.html', 'counter.css', {
  observed: [],
  onMount: (el, shadow) => {
    let count = 0;
    const btn = shadow.querySelector('button');
    const output = shadow.querySelector('p');

    btn.onclick = () => {
      count++;
      output.textContent = `Clicks: ${count}`;
    };

    // expone el estado como función pública
    el.getCount = () => count;
  }
});
```

---

## 3. Consumir una API y renderizar datos

```html
<user-card-component id="42"></user-card-component>
```

```js
defineComponentFromFiles('user-card-component', 'user-card.html', 'user-card.css', {
  observed: ['id'],
  onMount: async (el, shadow) => {
    const data = await actions.getUserData(el.getAttribute('id'));
    shadow.querySelector('p').textContent = `Hola ${data.name}`;
  }
});
```

---

## 4. Input con props y output con funciones

```html
<math-box-component a="5" b="3"></math-box-component>
```

```js
defineComponentFromFiles('math-box-component', 'math-box.html', 'math-box.css', {
  observed: ['a', 'b'],
  onMount: (el, shadow) => {
    const a = parseInt(el.getAttribute('a'));
    const b = parseInt(el.getAttribute('b'));
    shadow.querySelector('p').textContent = `${a} + ${b} = ${a + b}`;

    // expone función pública
    el.getSum = () => a + b;
  }
});
```

---

## 5. Acción global reutilizable

```js
// core/actions/fetchProducts.js
export async function fetchProducts() {
  const res = await apiRequest('/api/products');
  return res.json();
}

// core/actions.js
import { fetchProducts } from './actions/fetchProducts.js';
export const actions = { fetchProducts };
```

```js
defineComponentFromFiles('product-list', 'product-list.html', 'product-list.css', {
  observed: [],
  onMount: async (el, shadow) => {
    const products = await actions.fetchProducts();
    shadow.querySelector('ul').innerHTML = products
      .map(p => `<li>${p.name} - $${p.price}</li>`)
      .join('');
  }
});
```

---

## 🧪 Buenas prácticas en ejemplos

* Usar props para entrada declarativa.

* Exponer funciones públicas en el elemento para salida controlada.

* Mantener estado interno con variables locales.

* Centralizar lógica compartida en core/actions/.

* Documentar cada patrón con un snippet claro y breve.

---
