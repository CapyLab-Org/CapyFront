# Documentación avanzada de CapyFront

Este documento cubre casos de uso más complejos y patrones recomendados para escalar proyectos con CapyFront.

---

## 1. Acciones complejas fuera de `actions.js`

En lugar de llenar `actions.js` con lógica extensa, podés crear archivos separados:

```js
// core/actions/getUserData.js
export async function getUserData() {
  const res = await apiRequest('/api/user');
  return res.json();
}

// core/actions.js
import { getUserData } from './actions/getUserData.js';

export const actions = {
  getUserData,
};
```

---

## 2. Consumir una API desde un componente

```js
defineComponentFromFiles('user-card', 'user-card.html', 'user-card.css', {
  observed: ['id'],
  onMount: async (el, shadow) => {
    const data = await actions.getUserData();
    shadow.querySelector('p').textContent = `Hola ${data.name}`;
  }
});
```

---

## 3. Input de datos con props

```html
<user-card-component id="42"></user-card-component>
```

El componente observa id y lo usa para pedir datos específicos.

---

## 4. Output con funciones expuestas

```js
onMount: (el, shadow) => {
  el.getUserName = () => shadow.querySelector('p').textContent;
}
```

Esto expone una función pública que otros scripts pueden invocar.

---

## 5. Variables internas en el .js del componente

```js
defineComponentFromFiles('counter-widget', 'counter.html', 'counter.css', {
  observed: [],
  onMount: (el, shadow) => {
    let count = 0; // estado interno

    shadow.querySelector('button').onclick = () => {
      count++;
      shadow.querySelector('p').textContent = `Clicks: ${count}`;
    };

    // expone la variable como getter
    el.getCount = () => count;
  }
});
```

---

## 6. ¿Dónde ubicar las funciones?

La arquitectura de CapyFront soporta dos enfoques:

### Funciones dentro del .js del componente

* ✅ Encapsulan lógica local (estado interno, eventos, cálculos propios).

* ✅ Mantienen todo el comportamiento en un solo archivo.

* ❌ No son reutilizables fuera del componente.

Ejemplo:

```js
onMount: (el, shadow) => {
  let localState = 0;
  shadow.querySelector('button').onclick = () => localState++;
  el.getLocalState = () => localState;
}
```

---

## Funciones en core/actions/

* ✅ Centralizan lógica reutilizable (ej: llamadas a API, validaciones).

* ✅ Se pueden invocar desde cualquier componente con runAction(...).

* ✅ Facilitan testing y mantenimiento.

* ❌ Requieren importación y registro en actions.js.

Ejemplo:

```js
// core/actions/validateForm.js
export function validateForm(data) {
  return data.name && data.email;
}
```

---

Regla práctica

* Si la función es específica del componente → va en el .js del componente.

* Si la función puede ser reutilizada o expuesta globalmente → va en core/actions/.

---

## 7. Buenas prácticas

* Mantener lógica compleja en archivos separados (core/actions/*.js) si es compartida.

* Usar props para entrada declarativa.

* Exponer funciones en el elemento para salida controlada.

* Mantener estado interno con variables locales en onMount.

* Documentar cada patrón con ejemplos claros.

---

>Esta guía complementa el README.md y está pensada para desarrolladores que quieran aprovechar CapyFront en escenarios más avanzados.

---
