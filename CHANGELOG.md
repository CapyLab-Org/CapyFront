# Changelog

Todas las versiones de **CapyFront** siguen [Semantic Versioning](https://semver.org/).

---

## [1.1.0] - 2026-11-13

> Actualizar desde 1.0.0 es recomendable: incluye fixes de seguridad (XSS) y de bugs del core. Revisá **Cambios incompatibles** antes de actualizar.

### Seguridad

- **`component-loader.js`** — los valores de `{{prop}}` y `{{#each}}` ahora se escapan como HTML (previene XSS con datos de APIs). Nuevo helper exportado `escapeHTML(value)`.
- **`router.js`** — los parámetros de ruta se asignan con `setAttribute` en lugar de interpolarse en `innerHTML` (previene XSS vía hash).
- **`capy-new`** — valida el nombre (minúsculas, números y guiones). Antes `capy-new -d -c ..` podía borrar la raíz del proyecto, y `capy-new -c ../x` escribía fuera de él. Además, ya no pisa un componente o página existente.

### Nuevo

- **Condicionales en templates** — `{{#if key}}…{{else}}…{{/if}}`, anidables y también dentro de `{{#each}}`. Los arrays vacíos cuentan como falsos.
- **`data-on-<evento>="accion(args)"`** — conecta un evento del componente con una acción de `core/actions.js` (los argumentos se parsean como JSON).
- **`apiRequest`** — soporte para `FormData`, `Blob`, `string` y `URLSearchParams` como body; los errores HTTP exponen `err.status` y `err.body`.

### Fixes

- **`api.js`** — `Content-Type: application/json` solo se envía con body objeto/array (antes `FormData` se serializaba como `"{}"` y los GET disparaban un preflight CORS innecesario). Respuestas vacías (`204`) devuelven `null`.
- **`router.js`**
  - Una navegación lenta ya no pisa a una más reciente.
  - Los parámetros se decodifican (`%20` → espacio).
  - Las rutas estáticas con `/` usan el primer segmento como nombre de página.
  - Las rutas inexistentes avisan por consola antes de caer en `home`.
  - Scroll al inicio al cambiar de página.
- **`component-loader.js`** — mover un componente dentro del DOM ya no ejecuta `onDisconnect` (antes perdía sus suscripciones).
- **`store.js`** — un listener que lanza error ya no impide notificar al resto.
- **`capy-new`**
  - Las páginas se registran con el formato `{ load, title }` y la clave entre comillas (antes los nombres con guion generaban un `router.js` inválido).
  - Los templates esperan la definición del componente (`await`).
  - La página generada muestra su título.
  - La clase CSS del componente generado coincide con la de su HTML.
- **`capyfront-server`** — sirve el favicon desde `assets/`.
- **`pages/home`** — el texto `{{declarativas}}` se interpretaba como variable y se renderizaba vacío.
- **`pages/contact`** — el submit usa event delegation y sobrevive a `el.render()`.
- **`index.html`** — solo carga `core/main.js`, que importa el resto del núcleo.
- **`tests/tests.html`** — los logs se insertan como texto, no como HTML.

### Cambios incompatibles

- Los atributos `on<evento>="accion()"` en componentes ya no se procesan: usá `data-on-<evento>`. Con `on*` el navegador también evaluaba el atributo como JS global y lanzaba `ReferenceError` en cada evento.
- `capy-new` ya no registra la acción placeholder `get<Nombre>Id` en `actions.js`; el test generado monta el componente real. Las acciones placeholder de los componentes incluidos se eliminaron.
- Los ejemplos de `models/` se reorganizaron: `getExample` (GET) pasó a `models/response/`.

### Tests

- Nuevos tests del core en `tests/core/`: template, component (ciclo de vida y `data-on-*`), router, store, storage, actions y api.
- Los tests de componentes montan el componente y verifican su render.

### Docs

- `AI_CONTEXT.md` renombrado a `AGENTS.md` — los agentes de IA compatibles con la convención lo leen automáticamente.
- Documentados `{{#if}}`, `data-on-*`, la subida de archivos y el manejo de errores de `apiRequest`.
- `docs/architecture.md` y `docs/examples.md` actualizados (lógica de API en `models/`, rutas en formato `{ load, title }`).

---

## [1.0.0] - 2026-05-10

### Core

- **`component-loader.js`** — motor de Web Components
  - `defineComponentFromFiles(name, htmlPath, cssPath, options)` — define un custom element cargando HTML y CSS externos
  - `el.render(data)` — re-renderiza el template fusionando datos; event listeners sobreviven gracias a event delegation
  - `{{prop}}` — interpolación de variables en templates
  - `{{#each key}}...{{/each}}` — iteración sobre arrays en templates
  - `emit(el, eventName, detail)` — CustomEvent que burbujea a través del Shadow DOM
  - `observed: [...]` — atributos observados; un cambio dispara re-render automático
  - `onMount(el, shadow, props)` / `onDisconnect(el, shadow)` — ciclo de vida del componente

- **`router.js`** — router hash-based
  - Rutas estáticas (`home`) y con parámetros (`product/:id`, `user/:id/:tab`)
  - Formato `{ load: fn, title: 'Título' }` — actualiza `document.title` al navegar
  - Parámetros pasados como atributos al componente de página

- **`store.js`** — estado reactivo global
  - `setState(key, value)` / `getState(key)`
  - `subscribe(key, fn)` — retorna función `unsubscribe()`
  - Disponible globalmente como `window.store`

- **`storage.js`** — persistencia local
  - `save` / `load` / `remove` — `localStorage`
  - `saveSession` / `loadSession` / `removeSession` — `sessionStorage`
  - Serialización JSON automática y manejo seguro de errores

- **`api.js`** — cliente HTTP
  - `apiRequest(endpoint, options)` — wrapper sobre fetch
  - `setAuthToken(token)` / `clearAuthToken()` — `Authorization: Bearer` automático en todos los requests
  - `responseType: 'json' | 'text' | 'blob'`

- **`actions.js`** — registro central de funciones globales
  - `runAction(name, ...args)` — dispatcher
  - Disponible globalmente como `window.actions`

- **`components.js`** — registro de componentes con `loadUsedComponents(root)`

### Herramientas

- **`capy-new`** (Linux + Windows) — generador CLI
  - `-c <nombre>` / `-p <nombre>` — crea componente o página con todos los archivos
  - `-d -c <nombre>` / `-d -p <nombre>` — borra y desregistra limpiamente
  - Auto-registra en `components.js`, `router.js`, `actions.js` y `tests/tests.html`
  - Templates generados incluyen `emit`, `props`, `onDisconnect` y guías de `el.render` + `{{#each}}`

- **`capyfront-server`** (Linux + Windows) — servidor de desarrollo
  - Live reload automático para cambios en `.js`, `.html` y `.css`
  - Request logger con método, path, status coloreado y tiempo de respuesta
  - API proxy: `-proxy=/prefix:http://host:port`, repetible para múltiples backends
  - Muestra IP de red local al arrancar
  - Detección de conflictos de puerto

### Tests

- Runner visual en `tests/tests.html` — resultados en pantalla agrupados por categoría, banner pass/fail
- Test generado automáticamente por `capy-new` para cada componente nuevo
- `capyfront-server -test` sirve los tests en `http://localhost:8081`

### Documentación

- `docs/architecture.md` — estructura de carpetas y flujo de datos
- `docs/advanced.md` — store, emit, re-render, route params, asset paths, event delegation
- `docs/examples.md` — recetario de patrones comunes
- `docs/api.md` — capa de modelos y cliente HTTP
- `AI_CONTEXT.md` — guía compacta para usar CapyFront con asistentes de IA

---

## Filosofía

- **Minimalismo** — sin dependencias externas
- **Automatización** — generación, registro y testeo sin fricción
- **Modularidad** — componentes y acciones desacoplados
- **Transparencia** — tests visibles, código legible
