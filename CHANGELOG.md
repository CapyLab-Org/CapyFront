# Changelog

Todas las versiones de **CapyFront** siguen [Semantic Versioning](https://semver.org/).

---

## [1.1.2] - 2026-05-10

### 🔧 Changed

- **Entry point estandarizado** — `index.html` se ubica ahora en la raíz del repositorio en lugar de `public/`. El servidor de desarrollo (`capyfront-server`) sirve `index.html` desde la raíz; `public/` queda exclusivamente para assets estáticos.

---

## [1.1.1] - 2026-05-10

### 🐛 Fixed

- **Portabilidad de paths en templates** — `capy-new` ahora genera paths resueltos con `import.meta.url` en lugar de paths relativos al documento (`../components/...`). Los paths anteriores funcionaban solo cuando el documento estaba servido desde `public/`; los nuevos funcionan en cualquier hosting y subpath.

  ```js
  // Antes (frágil)
  defineComponentFromFiles('my-component', '../components/my/my.html', ...)

  // Ahora (portátil)
  const _dir = new URL('.', import.meta.url).href;
  defineComponentFromFiles('my-component', `${_dir}my.html`, ...)
  ```

- **Assets en templates HTML** — documentado que las URLs de assets (`src`, `href`) en templates HTML se resuelven contra la URL del documento, no del template. La regla es usar `./` en lugar de `/` al inicio del path para garantizar compatibilidad con cualquier subpath de despliegue.

---

## [1.1.0] - 2026-05-09

### 🎉 Added — framework

- **`core/store.js`** — estado reactivo global sin dependencias
  - `setState(key, value)` / `getState(key)` / `subscribe(key, fn)`
  - `subscribe` retorna función `unsubscribe()` para limpiar suscripciones
  - `window.store` expuesto globalmente desde `main.js`

- **`core/storage.js`** — helpers para persistencia local
  - `save` / `load` / `remove` sobre `localStorage`
  - `saveSession` / `loadSession` / `removeSession` sobre `sessionStorage`
  - Manejo seguro de errores (private browsing, cuota llena)

- **`core/api.js`** — extensiones al cliente HTTP
  - `setAuthToken(token)` / `clearAuthToken()` — inyección automática de `Authorization: Bearer`
  - Nuevo parámetro `responseType: 'json' | 'text' | 'blob'` en `apiRequest`

- **Router — rutas con parámetros** (`core/router.js`)
  - Soporte para rutas dinámicas: `'product/:id'`, `'user/:id/:tab'`
  - Parámetros pasados como atributos al componente de página
  - Soporte para formato extendido de ruta: `{ load: fn, title: 'Título' }`
  - Cambio automático de `document.title` al navegar

- **`component-loader.js`** — motor de componentes mejorado
  - `el.render(data)` — re-renderiza el template fusionando nuevos datos
  - Cambio de atributo observado dispara re-render automático
  - `{{#each key}}...{{/each}}` — iteración sobre arrays en templates
  - `onDisconnect(el, shadow)` — callback de limpieza al desmontar el componente
  - `emit(el, eventName, detail)` — emite `CustomEvent` que burbujea a través del Shadow DOM

### 🎉 Added — servidor de desarrollo (`capyfront-server`)

- **Live reload** — detecta cambios en `.js`, `.html` y `.css` e inyecta un script SSE en `index.html` que recarga el browser automáticamente. Ignora `tools/` y `.git/`.
- **Request logger** — loguea método, path, status coloreado (verde/amarillo/rojo) y tiempo de respuesta por cada request.
- **API proxy** — flag `-proxy=/prefix:http://host:port` reenvía requests al backend sin necesidad de configurar CORS. Repetible para múltiples prefijos.
- **Network IP** — muestra la IP de red local al arrancar para probar desde celulares u otros dispositivos.
- **Port conflict detection** — avisa si el puerto está en uso con mensaje claro en lugar de fallar silenciosamente.

### 🎉 Added — generador `capy-new`

- Flags cortos: `-c` (alias de `-component`), `-p` (alias de `-page`), `-d` (alias de `-delete`)
- Comando **delete** (`-d -c <nombre>` / `-d -p <nombre>`) — borra la carpeta del componente/página y elimina todas sus referencias en `components.js`, `router.js`, `actions.js` y `tests/tests.html`
- Templates generados actualizados: incluyen `emit`, `props` en `onMount`, `onDisconnect`, y comentarios guía para `el.render` y `{{#each}}`

### 🔧 Changed

- `core/main.js` expone `window.store` con `setState`, `getState`, `subscribe`
- `component-loader.js` refactoriza rendering en función interna `processTemplate`
- `api.js` corrige condición `body !== null` (antes `if (body)` ignoraba `0` y `false`)
- CSS generado por `capy-new` usa selector de clase (`.nombre-component`) en lugar de `div` genérico

---

## [1.0.0] - 2025-11-21

### 🎉 Added

- Generador de componentes y páginas (`capy-new` / `capy-new.exe`)
  - Crea estructura mínima (`.html`, `.css`, `.js`)
  - Registra automáticamente en `components.js`, `router.js`, `actions.js`, `tests/tests.html`
- Servidor local sin dependencias (`capyfront-server`/`capyfront-server.exe`)
- Props declarativas (`{{prop}}`) en HTML
- Acciones seguras (`onClick="getXyzId()"`) validadas contra `actions.js`
- Registro automático de acciones con nombre camelCase (`getLoadingSpinnerId`)
- Generación de tests (`*.test.js`) por componente
- Ejecución de tests en navegador vía `tests/tests.html`
- Carpeta `models/` con `request/` y `response/` para organizar lógica de datos
- Función `apiRequest()` en `core/api.js` para consumir endpoints
- Validación de nombres en generador (solo letras, números y guiones)
- Capitalización segura para nombres con guiones (`loading-spinner` → `getLoadingSpinnerId`)
- Soporte para acciones complejas en archivos separados (`core/actions/*.js`)
- Registro modular de acciones importadas en `actions.js`

### 🧹 Changed

- Estructura del repo organizada en carpetas:
  - `core/`, `components/`, `pages/`, `models/`, `tools/`, `tests/`
- `actions.js` convertido en registro central, delegando lógica a archivos externos

### 🧪 Tests

- Cada componente genera su propio test
- `tests/tests.html` carga todos los tests automáticamente
- Validación de acciones existentes y fallos esperados (`runAction('inexistente') → undefined`)

### 📁 Binarios

#### Generadores

- `capy-new` para Linux/macOS
- `capy-new.exe` para Windows
- Ambos binarios generan componentes/páginas con registro completo y test

#### Servidores

- `capyfront-server` para Linux/macOS
- `capyfront-server.exe` para Windows
- Ambos binarios levantan un servidor local sin dependecias ni instalaciones externas

---

## ![Mi ícono](https://raw.githubusercontent.com/CapyLab-Org/CapyFront/refs/heads/main/public/assets/emoji.png) Filosofía

- **Minimalismo**: sin dependencias externas
- **Automatización**: generación, registro y testeo sin fricción
- **Modularidad**: componentes y acciones desacopladas
- **Transparencia**: tests visibles, código legible

---

> CapyFront v1.0 marca el inicio de una arquitectura modular, automatizada y sin dependencias.  
> Ideal para equipos que valoran claridad, velocidad y control total sobre su frontend.

---
