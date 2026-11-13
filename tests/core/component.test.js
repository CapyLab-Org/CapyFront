/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { defineComponentFromFiles } from '../../core/component-loader.js';

console.log("Test: ciclo de vida de componentes");

const dataURL = (type, text) => `data:${type},${encodeURIComponent(text)}`;
const counts = { mount: 0, disconnect: 0 };

await defineComponentFromFiles(
  'test-lifecycle-component',
  dataURL('text/html', '<p class="name">{{name}}</p>{{#if done}}<span class="done">ok</span>{{/if}}'),
  dataURL('text/css', 'p { color: red; }'),
  {
    observed: ['name'],
    onMount: () => { counts.mount++; },
    onDisconnect: () => { counts.disconnect++; },
  }
);

const tick = () => new Promise(r => setTimeout(r, 0));
const boxA = document.createElement('div');
const boxB = document.createElement('div');
document.body.append(boxA, boxB);

try {
  const el = document.createElement('test-lifecycle-component');
  el.setAttribute('name', '<Capy>');
  boxA.appendChild(el);

  if (counts.mount !== 1) throw new Error("❌ onMount no se ejecutó al conectar");
  if (el.shadowRoot.querySelector('.name').textContent !== '<Capy>') {
    throw new Error("❌ el atributo no se renderizó (o no se escapó)");
  }
  if (!el.shadowRoot.querySelector('style')) throw new Error("❌ el CSS no se inyectó");

  el.setAttribute('name', 'Nuevo');
  if (el.shadowRoot.querySelector('.name').textContent !== 'Nuevo') {
    throw new Error("❌ un atributo observado no disparó re-render");
  }

  el.render({ done: true });
  if (!el.shadowRoot.querySelector('.done')) throw new Error("❌ el.render() no aplicó {{#if}}");

  // mover el elemento no debe ejecutar onDisconnect
  boxB.appendChild(el);
  await tick();
  if (counts.disconnect !== 0) throw new Error("❌ mover el componente ejecutó onDisconnect");

  el.remove();
  await tick();
  if (counts.disconnect !== 1) throw new Error("❌ quitar el componente no ejecutó onDisconnect");

  // data-on-<evento> → window.actions
  const prevActions = window.actions;
  const calls = [];
  window.actions = { ...prevActions, __testAction: (...args) => calls.push(args) };
  try {
    const btn = document.createElement('test-lifecycle-component');
    btn.setAttribute('data-on-click', '__testAction(42, "promo")');
    boxA.appendChild(btn);
    btn.click();
    btn.remove();
  } finally {
    window.actions = prevActions;
  }
  if (calls.length !== 1 || calls[0][0] !== 42 || calls[0][1] !== 'promo') {
    throw new Error("❌ data-on-click no invocó la acción con sus argumentos");
  }
} finally {
  boxA.remove();
  boxB.remove();
}

console.log("✅ Todos los tests de ciclo de vida pasaron");
