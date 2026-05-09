# API client y capa de modelos

## `apiRequest` — cliente HTTP

```js
import { apiRequest, setAuthToken, clearAuthToken } from '../../core/api.js';

// Auth — se inyecta como "Authorization: Bearer <token>" en todos los requests
setAuthToken('mi-jwt-token');
clearAuthToken();   // logout

// GET (retorna JSON por defecto)
const user = await apiRequest('/api/users/1');

// POST
const created = await apiRequest('/api/users', {
  method: 'POST',
  body: { name: 'Capy', email: 'capy@lab.com' }
});

// responseType: 'json' (default) | 'text' | 'blob'
const html  = await apiRequest('/api/template', { responseType: 'text' });
const file  = await apiRequest('/api/files/1',  { responseType: 'blob' });

// Headers custom (se fusionan con Content-Type y Authorization)
const data = await apiRequest('/api/data', {
  headers: { 'X-Custom': 'valor' }
});
```

`apiRequest` lanza un error si `res.ok === false`. Usar `try/catch` en los modelos.

---

## Capa de modelos

La lógica de API no va en los componentes — va en `models/` para que sea reutilizable y testeable.

```
models/
  request/   → funciones que envían datos (POST, PUT, DELETE)
  response/  → funciones que obtienen datos (GET, transformaciones)
```

```js
// models/response/getUser.js
import { apiRequest } from '../../core/api.js';

export async function getUser(id) {
  return apiRequest(`/api/users/${id}`);
}
```

```js
// models/request/saveUser.js
import { apiRequest } from '../../core/api.js';

export async function saveUser(data) {
  return apiRequest('/api/users', { method: 'POST', body: data });
}
```

---

## Registrar en actions.js

Los modelos se exponen a los componentes a través de `actions.js`:

```js
// core/actions.js
import { getUser }  from '../models/response/getUser.js';
import { saveUser } from '../models/request/saveUser.js';

export const actions = {
  getUser,
  saveUser,
};
```

Desde un componente:

```js
onMount: async (el, shadow, props) => {
  const user = await actions.getUser(props.id);
  el.render({ name: user.name, email: user.email });
}
```

---

## Manejo de errores

```js
// models/response/getUser.js
export async function getUser(id) {
  try {
    return await apiRequest(`/api/users/${id}`);
  } catch (err) {
    console.error('getUser falló:', err);
    return null;
  }
}
```

Manejar el error en el modelo — el componente solo recibe datos o `null`.
