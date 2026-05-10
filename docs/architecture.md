# Arquitectura de CapyFront

## Principios

- **Sin dependencias** — HTML, CSS y JS nativos. Nada de npm, bundler ni build step.
- **Modular** — cada componente, página y acción vive en su propio archivo.
- **Automatizado** — `capy-new` genera y registra todo, y también borra limpiamente; nunca crear ni eliminar archivos a mano.

---

## Estructura de carpetas

```
core/
  main.js              → bootstrap: inicializa router, expone window.actions y window.store
  router.js            → mapa de rutas → páginas, soporta parámetros (:id)
  component-loader.js  → factory de Web Components, procesa templates, expone emit()
  components.js        → registro de componentes reutilizables
  actions.js           → registro de funciones globales + runAction()
  api.js               → fetch wrapper con auth token y responseType
  store.js             → estado reactivo global (setState / getState / subscribe)
  storage.js           → helpers para localStorage y sessionStorage

components/<nombre>/
  <nombre>.html        → template (soporta {{prop}} y {{#each items}})
  <nombre>.css         → estilos con scope Shadow DOM
  <nombre>.js          → defineComponentFromFiles(...)
  <nombre>.test.js     → test unitario

pages/<nombre>/
  <nombre>.html / .css / .js   → igual que componente, sin test

models/
  request/             → funciones que envían datos (POST, PUT, DELETE)
  response/            → funciones que obtienen datos (GET)

tests/
  tests.html           → runner visual; carga todos los *.test.js como módulos ES

AI_CONTEXT.md          → guía compacta para usar CapyFront con asistentes de IA
```

---

## Flujo de una página

```
URL: #producto/42
      ↓
router.js  →  matchRoute('producto/:id')  →  { params: { id: '42' } }
      ↓
lazy import('../pages/producto/producto.js')
      ↓
<producto-page id="42"> montado en #app
      ↓
connectedCallback → render(props) → onMount(el, shadow, { id: '42' })
      ↓
onMount carga datos → el.render({ items: [...] }) → template re-renderizado
```

---

## Flujo de datos

```
Entrada  →  atributos HTML  →  props en onMount  →  template {{prop}}
Salida   →  emit(el, 'evento', payload)  →  escucha el padre con addEventListener
Compartido  →  window.store.setState / subscribe
Persistido  →  import { save, load } from 'core/storage.js'
```

---

## Dónde poner la lógica

| Tipo | Dónde |
|------|-------|
| Estado local del componente | Variable en `onMount` |
| Estado compartido entre componentes | `core/store.js` |
| Llamada a API reutilizable | `core/actions/` → registrada en `actions.js` |
| Llamada a API específica de una página | `onMount` de la página directamente |
| Persistencia entre sesiones | `core/storage.js` |
