# Changelog

Todas las versiones de **CapyFront** siguen [Semantic Versioning](https://semver.org/).

---

## [1.0.0] - 2025-11-21

### 🎉 Added

- Generador de componentes y páginas (`capy-new` / `capy-new.exe`)
  - Crea estructura mínima (`.html`, `.css`, `.js`)
  - Registra automáticamente en `components.js`, `router.js`, `actions.js`, `tests/tests.html`
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

- `capy-new` para Linux/macOS
- `capy-new.exe` para Windows
- Ambos binarios generan componentes/páginas con registro completo y test

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
