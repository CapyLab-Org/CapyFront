# ![CapyFront](https://raw.githubusercontent.com/CapyLab-Org/CapyFront/refs/heads/main/public/assets/emoji.png) CapyFront

Micro-framework SPA en HTML, CSS y JS puro. Sin dependencias, sin bundler, sin build step.

---

## Características

- Componentes con **Web Components + Shadow DOM** nativos
- **Props declarativas** `{{prop}}` e **iteración** `{{#each items}}`
- **Re-render reactivo** — `el.render(data)` actualiza el template
- **Estado global** reactivo (`store.js`) y **persistencia** local (`storage.js`)
- **Router hash-based** con rutas con parámetros (`#producto/42`)
- **API client** con auth token automático y soporte `json | text | blob`
- **Eventos** entre componentes con `emit` (atraviesa Shadow DOM)
- Generador CLI (`capy-new`) — crea y borra componentes/páginas con un comando
- Servidor local sin dependencias (`capyfront-server`) con live reload, logger, proxy y detección de IP de red
- Tests en navegador sin librerías externas

---

## Inicio rápido

```bash
# 1. Permisos (solo la primera vez, Linux/macOS)
chmod +x tools/linux/capyfront-server tools/linux/capy-new

# 2. Levantar servidor
tools/linux/capyfront-server                              # → http://localhost:8080
tools/linux/capyfront-server -port=3000                   # puerto custom
tools/linux/capyfront-server -test                        # → http://localhost:8081 (tests)
tools/linux/capyfront-server -proxy=/api:http://localhost:3001   # proxy de API

# Windows
tools\windows\capyfront-server.exe
```

El servidor incluye **live reload** automático: detecta cambios en `.js`, `.html` y `.css` y recarga el browser sin intervención manual.

---

## CLI — capy-new

```bash
# Crear
capy-new -c <nombre>    # componente  (alias: -component)
capy-new -p <nombre>    # página      (alias: -page)

# Borrar (carpeta + todas las referencias en el framework)
capy-new -d -c <nombre>
capy-new -d -p <nombre>  # alias: -delete

# Windows
capy-new.exe -c <nombre>
```

Cada componente/página generado incluye `.html`, `.css`, `.js` y (en componentes) `.test.js`, registrados automáticamente en `components.js` / `router.js` / `actions.js` / `tests/tests.html`.

---

## Estructura del proyecto

```
core/           → motor del framework
  router.js     → rutas hash + params
  component-loader.js  → Web Components + emit
  actions.js    → funciones globales
  api.js        → cliente HTTP
  store.js      → estado reactivo global
  storage.js    → localStorage / sessionStorage
components/     → componentes reutilizables
pages/          → páginas (una por ruta)
models/
  request/      → funciones que envían datos
  response/     → funciones que obtienen datos
tests/          → tests.html + *.test.js
tools/          → binarios capy-new y capyfront-server
docs/           → documentación avanzada
```

---

## Rutas y assets

CapyFront es una SPA — todas las rutas se resuelven desde `public/index.html`. Usá siempre **rutas absolutas** para assets:

```html
<img src="/public/assets/logo.png" />   ✅
<img src="../assets/logo.png" />         ❌
```

Navegación hash: `http://localhost:8080/#about`  
No navegues directamente a archivos `.html` — usá el router.

---

## Consumir una API

```js
import { apiRequest, setAuthToken } from '../../core/api.js';

setAuthToken('mi-jwt');   // se aplica a todos los requests siguientes

const data = await apiRequest('/api/users/1');
const blob = await apiRequest('/api/files/1', { responseType: 'blob' });
await apiRequest('/api/users', { method: 'POST', body: { name: 'Capy' } });
```

---

## Documentación

| Doc | Contenido |
|-----|-----------|
| [docs/architecture.md](./docs/architecture.md) | Estructura, flujo y filosofía |
| [docs/advanced.md](./docs/advanced.md) | Store, emit, render, route params, storage |
| [docs/examples.md](./docs/examples.md) | Recetario de patrones comunes |
| [docs/api.md](./docs/api.md) | Capa models + cliente HTTP |

---

## Servidor de desarrollo — flags completos

| Flag | Default | Descripción |
|------|---------|-------------|
| `-port=<n>` | `8080` | Puerto del servidor |
| `-test` | — | Sirve `tests/tests.html` en lugar de `index.html` (puerto default `8081`) |
| `-proxy=/prefix:http://host:port` | — | Redirige requests con ese prefijo a otro servidor. Repetible para múltiples proxies |

```bash
# Múltiples proxies
./capyfront-server -proxy=/api:http://localhost:3001 -proxy=/auth:http://localhost:3002
```

**Qué hace el servidor al arrancar:**
- Muestra la URL local y la IP de red (para probar desde celular/otro dispositivo)
- Activa live reload — cualquier cambio en `.js`, `.html` o `.css` recarga el browser
- Loguea cada request con método, path, status (coloreado) y tiempo de respuesta
- Detecta si el puerto está en uso y avisa en lugar de tirar un error críptico

---

## Versión y cambios

v1.1.0 — ver [CHANGELOG.md](./CHANGELOG.md)

---

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/B0B21OQ3KN)

> Desarrollado por Kevin · CapyLab Studio
