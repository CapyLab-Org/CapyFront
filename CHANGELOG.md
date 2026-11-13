# Changelog

Todas las versiones de **CapyFront** siguen [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Seguridad

- **`component-loader.js`** — los valores de `{{prop}}` y `{{#each}}` ahora se escapan como HTML (previene XSS con datos de APIs). Nuevo helper exportado `escapeHTML(value)`.
- **`router.js`** — los parámetros de ruta se asignan con `setAttribute` en lugar de interpolarse en `innerHTML` (previene XSS vía hash).

### Fixes

- **`component-loader.js`** — los atributos de evento declarativos pasan de `on<evento>` a `data-on-<evento>="accion(args)"`. Con `on*` el navegador también evaluaba el atributo como JS global y lanzaba `ReferenceError` en cada evento.
- **`api.js`** — `Content-Type: application/json` solo se envía con body objeto/array; `FormData`, `Blob`, `string` y `URLSearchParams` se envían tal cual (antes `FormData` se serializaba como `"{}"`). Respuestas vacías (`204`) devuelven `null`. Los errores HTTP exponen `err.status` y `err.body`.
- **`router.js`** — una navegación lenta ya no pisa a una más reciente; los parámetros se decodifican (`%20` → espacio); las rutas estáticas con `/` usan el primer segmento como nombre de página; las rutas inexistentes avisan por consola antes de caer en `home`.
- **`store.js`** — un listener que lanza error ya no impide notificar al resto.
- **`pages/home`** — el texto `{{declarativas}}` se interpretaba como variable y se renderizaba vacío.
- **`pages/contact`** — el submit usa event delegation y sobrevive a `el.render()`.
- **`tests/tests.html`** — los logs se insertan como texto, no como HTML.

### Tests

- Nuevos tests del core en `tests/core/`: template, router, store, storage y api.

### Docs

- `AI_CONTEXT.md` renombrado a `AGENTS.md` — los agentes de IA compatibles con la convención lo leen automáticamente.

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
