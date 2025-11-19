# ![Mi ícono](/CapyFront/public/assets/emoji.png) CapyFront

**CapyFront** es un micro-framework modular en HTML, CSS y JS puro. Diseñado para construir interfaces web sin dependencias externas, con componentes reutilizables, acciones seguras, y una experiencia de desarrollo automatizada vía Bash y Batch.

---

## 🚀 Características principales

- 🔧 Generador de componentes y páginas (`capy-new.sh` / `capy-new.bat`)
  - Crea estructura mínima (`.html`, `.css`, `.js`)
  - Registra automáticamente en:
    - `components.js` (componentes)
    - `router.js` (páginas)
    - `actions.js` (acciones seguras)
    - `tests/tests.html` (para ejecución de tests)
- 🧩 Props declarativas: `{{prop}}` en HTML reemplazadas por atributos del componente
- ⚡ Acciones seguras: `onClick="getUserId()"` validadas contra `actions.js`
- 🧪 Tests automáticos: cada componente genera un `*.test.js` con validaciones
- 🌐 Tests en navegador: `tests/tests.html` carga todos los tests sin dependencias
- 📦 Organización de modelos: carpeta `models/` con `request/` y `response/` para consumir y transformar datos
- 📁 Estructura clara y escalable

---

## 📂 Estructura del proyecto

core/          → lógica base (component-loader, router, actions, api)
components/    → componentes generados
pages/         → páginas generadas
models/        → request/response para endpoints
tools/         → scripts auxiliares (capy-new)
tests/         → tests.html + *.test.js

---

## 🛠️ Uso del generador

Crear un componente:

```bash
./tools/capy-new.sh --component user
```

Crear una página:

```bash
./tools/capy-new.sh --page home
```

En Windows:

```bash
tools\capy-new.bat --component user
```

Esto genera:

- Archivos user.html, user.css, user.js
- Registro en components.js o router.js
- Acción getUserId en actions.js
- Test user.test.js con validaciones
- Inclusión automática en tests/tests.html

---

## 🧪 Correr tests

Abrí en tu navegador:

```bash
tests/tests.html
```

Los resultados se muestran en la consola.
Cada componente nuevo se agrega automáticamente.

---

## 🌐 Consumo de endpoints

Usá core/api.js para llamadas HTTP:

```bash
import { apiRequest } from '../../core/api.js';

const data = await apiRequest('/api/users', {
  method: 'POST',
  body: { name: 'Capy' }
});
```

Organizá tus modelos en:

models/
├── request/   → funciones que llaman endpoints
└── response/  → funciones que transforman datos crudos

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

## ![Mi ícono](/CapyFront/public/assets/emoji.png) Filosofía

- Minimalismo: sin dependencias, sin build, sin bundlers
- Automatización: scripts para generar, registrar y testear
- Escalabilidad: componentes modulares y acciones seguras
- Transparencia: tests visibles en navegador, sin magia

---

**CapyFront** es una herramienta para quienes aman el control, la claridad y la velocidad.
Construí interfaces limpias y sin ruido, trabaja siempre chill como capibara.

---

> Desarrollado por Kevin como parte de CapyLab Studio.
