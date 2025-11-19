# Guía de uso de APIs en CapyFront

CapyFront permite consumir APIs externas o internas de forma modular, manteniendo la lógica separada en `models/request` y `models/response`.

---

## 📂 Organización recomendada

```code
models/
├── request/ → funciones para enviar datos (POST, PUT, DELETE)
└── response/ → funciones para procesar respuestas (GET, transformaciones)
```

---

## 1. Request: enviar datos

```js
// models/request/saveUser.js
export async function saveUser(data) {
  const res = await apiRequest('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}
```

---

## 2. Response: obtener datos

```js
// models/response/getUser.js
export async function getUser(id) {
  const res = await apiRequest(`/api/users/${id}`);
  return res.json();
}
```

---

## 3. Integración con acciones

```js
// core/actions.js
import { saveUser } from '../models/request/saveUser.js';
import { getUser } from '../models/response/getUser.js';

export const actions = {
  saveUser,
  getUser
};
```

---

## 4. Uso en componentes

### Consumir datos (GET)

```js
defineComponentFromFiles('user-card-component', 'user-card.html', 'user-card.css', {
  observed: ['id'],
  onMount: async (el, shadow) => {
    const data = await actions.getUser(el.getAttribute('id'));
    shadow.querySelector('p').textContent = `Hola ${data.name}`;
  }
});
```

### Enviar datos (POST)

```js
defineComponentFromFiles('user-form-component', 'user-form.html', 'user-form.css', {
  observed: [],
  onMount: (el, shadow) => {
    const form = shadow.querySelector('form');
    form.onsubmit = async (e) => {
      e.preventDefault();
      const name = shadow.querySelector('#name').value;
      const email = shadow.querySelector('#email').value;

      const result = await actions.saveUser({ name, email });
      alert(`Usuario guardado con ID: ${result.id}`);
    };
  }
});
```

---

## 5. Buenas prácticas

* Mantener requests y responses separados para claridad.

* Usar actions.js como punto central de acceso.

* Manejar errores con try/catch dentro de las funciones de request/response.

* Documentar cada endpoint en este archivo (docs/api.md) con ejemplos de entrada/salida.

* Evitar lógica compleja en el componente: delegar a models.

---

>Esta guía asegura que el consumo de APIs en CapyFront sea modular, mantenible y fácil de escalar.

---
