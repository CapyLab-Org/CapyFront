# CapyFront — AI Context

Zero-dependency vanilla JS micro-framework for SPAs. Native Web Components + Shadow DOM, hash-based router, reactive global store, localStorage helpers, and a CLI generator. No npm, no bundler, no build step.

---

## Read these files before writing any code

These files reflect the **current live state** of the project — always read them first:

| File | What it tells you |
|------|-------------------|
| `core/components.js` | Every registered component and its import path |
| `core/router.js` | Every registered route (page) and its hash URL |
| `core/actions.js` | Every registered action callable via `runAction()` |

For the framework APIs themselves, the source is authoritative:
`core/store.js` · `core/storage.js` · `core/api.js` · `core/component-loader.js`

---

## CLI — never create files manually

```bash
# Linux/macOS
tools/linux/capy-new --component my-name   # → components/my-name/
tools/linux/capy-new --page my-page        # → pages/my-page/
tools/linux/capy-new -d --component my-name  # delete + unregister

# Windows
tools\windows\capy-new.exe --component my-name
```

`capy-new` generates all files and auto-registers in `components.js`, `router.js`, `actions.js`, and `tests/tests.html`.

---

## Component pattern

```js
// components/my-name/my-name.js
import { defineComponentFromFiles, emit } from '../../core/component-loader.js';

const _dir = new URL('.', import.meta.url).href;
defineComponentFromFiles('my-name-component', `${_dir}my-name.html`, `${_dir}my-name.css`, {
  observed: ['id', 'name'],                          // becomes props.id, props.name
  onMount: (el, shadow, props) => {
    el.render({ title: props.name });                // fills {{title}} in template
    shadow.addEventListener('click', e => {          // event delegation — survives re-render
      if (e.target.matches('.btn'))
        emit(el, 'my-event', { id: props.id });      // bubbles through Shadow DOM
    });
    el._unsub = window.store.subscribe('key', v => el.render({ key: v }));
  },
  onDisconnect: (el) => { if (el._unsub) el._unsub(); }
});
```

```html
<!-- components/my-name/my-name.html -->
<div class="my-name">
  <p>{{title}}</p>
  <ul>{{#each items}}<li>{{name}} — ${{price}}</li>{{/each}}</ul>
</div>
```

---

## Page pattern

Same as component but registered in `core/router.js`. Accessed via `#my-page` hash.

```js
// core/router.js — add with { load, title } format
'my-page': { load: () => import('../pages/my-page/my-page.js'), title: 'My Page' },
'product/:id': { load: () => import('../pages/product/product.js'), title: 'Product' },
// params arrive as props: #product/42 → props.id === '42'
```

---

## Store — reactive global state

```js
window.store.setState('cart', [{ id: '1', qty: 2 }]);
const cart = window.store.getState('cart');
const unsub = window.store.subscribe('cart', items => el.render({ items }));
// cancel in onDisconnect:
unsub();
```

---

## Storage — persistence

```js
import { save, load, remove, saveSession, loadSession, removeSession } from '../../core/storage.js';

save('token', 'abc');                    const t = load('token', null);   remove('token');
saveSession('draft', { text: 'hi' });   const d = loadSession('draft');
```

---

## Actions — shared logic registry

```js
// 1. Create the function in models/response/ or models/request/
// 2. Import and register in core/actions.js:
import { getProducts } from '../models/response/getProducts.js';
export const actions = { getProducts, ... };

// 3. Call from any component:
const data = await actions.getProducts();
// or: await window.actions.getProducts()
```

---

## API client

```js
import { apiRequest, setAuthToken } from '../../core/api.js';
setAuthToken('my-jwt');                                           // auto-applied to all requests
const data = await apiRequest('/api/users');
await apiRequest('/api/users', { method: 'POST', body: { name: 'Capy' } });
const blob = await apiRequest('/api/files/1', { responseType: 'blob' });
```

---

## Key rules

1. **Never create component/page files manually** — always use `capy-new`
2. **No npm, no build** — ES6 modules run directly in the browser
3. **Asset paths** in HTML templates: `./assets/file.png` (relative `./`), never `/assets/file.png`
4. **Event delegation** over direct listeners — direct listeners are lost on `el.render()`
5. **Always cancel** store subscriptions in `onDisconnect`
6. **New actions** must be imported and added to the `actions` object in `core/actions.js`
7. **Route titles**: use `{ load, title }` object format, not a bare function

---

## Need more context or examples?

| Doc | Content |
|-----|---------|
| `docs/advanced.md` | Store, emit, re-render, route params, asset paths, event delegation |
| `docs/examples.md` | Forms, counters, async patterns, cart/auth flows |
| `docs/api.md` | Models layer and HTTP client patterns |
| `docs/architecture.md` | Folder structure and full workflow |
| `CLAUDE.md` | Extended rules for Claude Code (if using this tool) |
