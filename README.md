# ![Mi ícono](https://raw.githubusercontent.com/CapyLab-Org/CapyFront/refs/heads/main/public/assets/emoji.png) CapyFront

**CapyFront** es un micro-framework modular en HTML, CSS y JS puro. Diseñado para construir interfaces web sin dependencias externas, con componentes reutilizables, acciones seguras, y una experiencia de desarrollo automatizada.

---

## 🚀 Características principales

- 🔧 Generador de componentes y páginas (`capy-new` / `capy-new.exe`)
  - Crea estructura mínima (`.html`, `.css`, `.js`)
  - Registra automáticamente en:
    - `components.js` (componentes)
    - `router.js` (páginas)
    - `actions.js` (acciones seguras)
    - `tests/tests.html` (para ejecución de tests)
- 🚀 Servidor local sin dependencias (`capyfront-server`/`capyfront-server.exe`)
  - Elige el puerto que quieras con el flag `-port=3000`
- 🧩 Props declarativas: `{{prop}}` en HTML reemplazadas por atributos del componente
- ⚡ Acciones seguras: `onClick="getUserId()"` validadas contra `actions.js`
- 🧪 Tests automáticos: cada componente genera un `*.test.js` con validaciones
- 🌐 Tests en navegador: `tests/tests.html` carga todos los tests sin dependencias
- 📦 Organización de modelos: carpeta `models/` con `request/` y `response/` para consumir y transformar datos
- 📁 Estructura clara y escalable

---

## 📂 Estructura del proyecto

```code
core/          → lógica base (component-loader, router, actions, api)
components/    → componentes generados
pages/         → páginas generadas
models/        → request/response para endpoints
tools/         → binarios auxiliares (capy-new/capyfront-server)
tests/         → tests.html + *.test.js
docs/          → documentación avanzada
```

---

## 🛠️ Uso del generador

- dale permisos de ejecución al binario (solo la primera vez)

```bash
chmod +x capy-new
```

Crear un componente:

```bash
tools/linux$ ./capy-new --component user
```

Crear una página:

```bash
tools/linux$ ./capy-new --page home
```

En Windows:

```ps1
tools\windows> ./capy-new.exe --component user
```

Esto genera:

- Archivos user.html, user.css, user.js
- Registro en components.js o router.js
- Acción getUserId en actions.js
- Test user.test.js con validaciones
- Inclusión automática en tests/tests.html

---

## 🌐 Consumo de endpoints

Usá core/api.js para llamadas HTTP:

```js
import { apiRequest } from '../../core/api.js';

const data = await apiRequest('/api/users', {
  method: 'POST',
  body: { name: 'Capy' }
});
```

Organizá tus modelos en:

```code
models/
├── request/   → funciones que llaman endpoints
└── response/  → funciones que transforman datos crudos
```

---

## 📁 Rutas y recursos

CapyFront funciona como una SPA (Single Page Application) basada en `public/index.html`, por lo que **todas las rutas deben resolverse como si estuvieras siempre parado en ese archivo**. Esto garantiza que los recursos (favicon, imágenes, scripts) se carguen correctamente sin importar la ruta actual.

✅ Estructura recomendada

```code
CapyFront/
├── public/
│   ├── index.html
│   └── assets/
│       ├── favicon.ico
│       └── Capylab minimal.png
├── components/
│   └── header-bar/
│       └── header-bar.html
```

✅ Rutas absolutas desde `/public`

Para mantener consistencia visual y evitar rutas rotas al navegar entre páginas, usá rutas absolutas que incluyan `/public/`:

```html
<!-- En index.html -->
<link rel="icon" href="/public/assets/favicon.ico" />

<!-- En componentes -->
<img src="/public/assets/Capylab minimal.png" alt="CapyFront Logo" />
```

Esto asegura que los recursos se carguen correctamente incluso cuando navegás a rutas como:

```code
http://localhost:8080/#about
```

>🧠 Aunque `public/` no es una carpeta "pública" en términos de frameworks tradicionales, en este setup se sirve desde la raíz del proyecto, por lo que `/public/assets/..` es una ruta válida.

❌ Qué evitar

• **No uses rutas relativas** como `assets/favicon.ico` o `../assets/logo.png`, ya que pueden romperse al cambiar de ruta.
• **No navegues directamente a archivos HTML físicos** como `/page/about/about.html`. Usá rutas hash (`#about`) para que el router maneje la navegación.

---

## 🚀 Servidor local sin dependencias

CapyFront incluye un binario llamado **capyfront-server** para levantar el proyecto localmente sin necesidad de instalar ninguna dependencia externa.

### 📦 ¿Qué hace?

- Sirve todo el proyecto desde la raíz (`./`)
- Redirige automáticamente `/` a `public/index.html`
- Permite navegación SPA con rutas como `/#about`
- Abre el navegador automáticamente al iniciar

### 🧪 Cómo usarlo

- Si estas en linux, dale permisos de ejecución al binario (solo la primera vez)

```bash
chmod +x capyfront-server
```

- Ejecutá el servidor

```bash
tools/linux$ ./capyfront-server
```

- Esto levanta el sitio en:

```code
http://localhost:8080/
```

- El navegador se abrirá automáticamente.

En Windows:

```ps1
tools\windows> ./capyfront-server.exe
```

> si no notas tus cambios reinicia el servidor o conectate en incognito

### ⚙️ Opciones disponibles

Podés cambiar el puerto con el flag :

```bash
./capyfront-server -port=3000
```

Esto abrirá el sitio en `http://localhost:3000/`

### 🧪 Modo test

Si querés levantar el entorno de pruebas (`tests/tests.html`), usá el flag `-test`:

```bash
./capyfront-server -test
```

Esto abrirá automáticamente:

```code
http://localhost:8081/
```

…pero servirá el archivo `tests/tests.html` en lugar de `public/index.html`.

También podés combinarlo con el flag de puerto:

```bash
./capyfront-server -test -port=5000
```

---

## 💖 Donaciones

Si **CapyFront** te resulta útil, podés apoyar el proyecto:

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/B0B21OQ3KN)

---

## 📦 Versionado

**CapyFront** sigue SemVer:

- v1.0.0 → primera versión estable
- Releases publicados como tags (git tag v1.0.0 && git push origin v1.0.0)
- Cambios documentados en CHANGELOG.md

---

## ![Mi ícono](https://raw.githubusercontent.com/CapyLab-Org/CapyFront/refs/heads/main/public/assets/emoji.png) Filosofía

- Minimalismo: sin dependencias, sin build, sin bundlers
- Automatización: binarios para generar, registrar y testear
- Escalabilidad: componentes modulares y acciones seguras
- Transparencia: tests visibles en navegador, sin magia

---

**CapyFront** es una herramienta para quienes aman el control, la claridad y la velocidad.
Construí interfaces limpias y sin ruido, trabaja siempre chill como capibara.

> Desarrollado por Kevin como parte de CapyLab Studio.

---

## 📚 Documentación

CapyFront está pensado para ser minimalista en su uso básico, pero también escalable en escenarios complejos.  
Para mantener este README claro, la documentación avanzada vive en la carpeta [`docs/`](./docs).

- [⚙️ Arquitectura](./docs/architecture.md)  
  Filosofía, estructura de carpetas y flujo de trabajo interno.

- [🧠 Casos avanzados](./docs/advanced.md)  
  Ejemplos de acciones complejas, consumo de APIs, props y funciones expuestas.

- [📖 Ejemplos prácticos](./docs/examples.md)  
  Recetario con snippets listos para usar (formularios, contadores, listas dinámicas).

- [🌐 API](./docs/api.md)  
  Guía para organizar requests/responses y consumir APIs desde componentes.

---

> Para un onboarding rápido, seguí las instrucciones básicas de este README.  
> Para profundizar en la arquitectura y casos complejos, explorá los documentos en `docs/`.

---
