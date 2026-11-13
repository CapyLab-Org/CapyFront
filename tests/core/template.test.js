/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { escapeHTML, processTemplate } from '../../core/component-loader.js';

console.log("Test: template engine");

if (escapeHTML('<img onerror="x">') !== '&lt;img onerror=&quot;x&quot;&gt;') {
  throw new Error("❌ escapeHTML no escapó etiquetas y comillas");
}
if (escapeHTML(null) !== '' || escapeHTML(undefined) !== '') {
  throw new Error("❌ escapeHTML(null/undefined) debería devolver ''");
}
if (processTemplate('<p>{{name}}</p>', { name: 'Capy' }) !== '<p>Capy</p>') {
  throw new Error("❌ {{prop}} no se interpoló");
}
if (processTemplate('<p>{{missing}}</p>', {}) !== '<p></p>') {
  throw new Error("❌ {{prop}} faltante debería quedar vacío");
}
if (processTemplate('<p>{{x}}</p>', { x: '<b>' }) !== '<p>&lt;b&gt;</p>') {
  throw new Error("❌ {{prop}} no escapó HTML");
}
if (processTemplate('{{a}}', { a: '{{b}}', b: 'pwn' }) !== '&#123;&#123;b&#125;&#125;') {
  throw new Error("❌ un valor con {{...}} se re-interpoló");
}
const list = processTemplate('<ul>{{#each items}}<li>{{n}}</li>{{/each}}</ul>', { items: [{ n: 1 }, { n: '<i>' }] });
if (list !== '<ul><li>1</li><li>&lt;i&gt;</li></ul>') {
  throw new Error("❌ {{#each}} no iteró/escapó correctamente: " + list);
}
if (processTemplate('{{#each items}}<li>{{n}}</li>{{/each}}', { items: 'no-array' }) !== '') {
  throw new Error("❌ {{#each}} sobre un no-array debería quedar vacío");
}

console.log("✅ Todos los tests de template pasaron");
