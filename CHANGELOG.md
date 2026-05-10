# Changelog

Todas las versiones de **CapyFront** siguen [Semantic Versioning](https://semver.org/).

---

## [1.0.0] - 2026-05-10

### Motor de componentes (`component-loader.js`)

- `defineComponentFromFiles(tag, html, css, opts)` — define un Web Component cargando template y estilos desde archivos externos
- `el.render(data)` — re-renderiza el template fusionando nuevos datos
- `{{prop}}` — interpolación de props en templates HTML
- `{{#each key}}...{{/each}}` — iteración sobre arrays
- Cambio de atributo observado dispara re-render automático
- `onMount(el, shadow, props)` — callback al montar el componente
- `onDisconnect(el, shadow)` — callback de limpieza al desmontar
- `emit(el, eventName, detail)` — emite `CustomEvent` que burbujea a través del Shadow DOM

### Router (`core/router.js`)

- Hash-based routing (`#ruta`)
- Rutas dinámicas con parámetros: `'product/:id'`, `'user/:id/:tab'`
- Parámetros pasados como atributos al componente de página
- Formato extendido: `{ load: () => import(...), title: 'Título' }`
- Cambio automático de `document.title` al navegar

### Estado global (`core/store.js`)

- `setState(key, value)` / `getState(key)` / `subscribe(key, fn)`
- `subscribe` retorna función `unsubscribe()` para limpiar suscripciones
- `window.store` expuesto globalmente desde `main.js`

### Persistencia (`core/storage.js`)

- `save` / `load` / `remove` sobre `localStorage`
- `saveSession` / `loadSession` / `removeSession` sobre `sessionStorage`
- Manejo seguro de errores (private browsing, cuota llena)

### Cliente HTTP (`core/api.js`)

- `apiRequest(url, opts)` — fetch wrapper con manejo de errores
- `setAuthToken(token)` / `clearAuthToken()` — inyección automática de `Authorization: Bearer`
- `responseType: 'json' | 'text' | 'blob'`

### Acciones (`core/actions.js`)

- Registro central de funciones globales
- `runAction(name, ...args)` — dispatcher con advertencia si la acción no existe
- Soporte para acciones en archivos separados (`core/actions/*.js`)

### Test runner visual (`tests/tests.html`)

- Carga dinámica de archivos `*.test.js` sin librerías externas
- Resultados agrupados por módulo con tarjetas visuales
- Captura de `console.log` para mostrar output de cada test
- Banner de estado global (todo OK / con errores)
- Integración con `capy-new`: registro automático al crear/borrar componentes

### Generador `capy-new`

- Crea componentes (`-c`) y páginas (`-p`) con estructura completa (`.html`, `.css`, `.js`, `.test.js`)
- Registra automáticamente en `components.js`, `router.js`, `actions.js`, `tests/tests.html`
- Borra componentes y páginas (`-d`) eliminando carpeta y todas las referencias
- Flags cortos: `-c`, `-p`, `-d`
- Paths generados con `import.meta.url` — portables en cualquier hosting

### Servidor de desarrollo `capyfront-server`

- Live reload — detecta cambios en `.js`, `.html` y `.css` y recarga el browser automáticamente
- Request logger — método, path, status coloreado y tiempo de respuesta
- API proxy — `-proxy=/prefix:http://host:port`, repetible para múltiples prefijos
- Muestra IP de red local al arrancar
- Detecta conflicto de puertos con mensaje claro

### Documentación

- `docs/architecture.md` — estructura de carpetas y flujo de datos
- `docs/advanced.md` — store, emit, render, route params, storage
- `docs/api.md` — capa models + cliente HTTP
- `docs/examples.md` — recetario de patrones comunes
- `AI_CONTEXT.md` — guía compacta en inglés para usar CapyFront con asistentes de IA

---

## Filosofía

- **Minimalismo**: sin dependencias externas
- **Automatización**: generación, registro y testeo sin fricción
- **Modularidad**: componentes y acciones desacopladas
- **Transparencia**: tests visibles, código legible

---

> CapyFront — arquitectura modular, automatizada y sin dependencias.  
> Ideal para equipos que valoran claridad, velocidad y control total sobre su frontend.

---
