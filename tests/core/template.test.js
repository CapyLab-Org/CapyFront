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

// {{#if}}
const ifTpl = '{{#if ok}}<b>sí</b>{{else}}<i>no</i>{{/if}}';
if (processTemplate(ifTpl, { ok: true }) !== '<b>sí</b>') throw new Error("❌ {{#if}} verdadero falló");
if (processTemplate(ifTpl, { ok: '' }) !== '<i>no</i>') throw new Error("❌ {{else}} falló");
if (processTemplate('{{#if ok}}x{{/if}}', {}) !== '') throw new Error("❌ {{#if}} sin else debería quedar vacío");
if (processTemplate('{{#if items}}hay{{else}}vacío{{/if}}', { items: [] }) !== 'vacío') {
  throw new Error("❌ un array vacío debería ser falso en {{#if}}");
}
if (processTemplate('{{#if error}}<p>{{error}}</p>{{/if}}', { error: '<x>' }) !== '<p>&lt;x&gt;</p>') {
  throw new Error("❌ {{prop}} dentro de {{#if}} no se interpoló/escapó");
}
const mixed = processTemplate(
  '{{#each users}}<li>{{name}}{{#if admin}} ★{{/if}}</li>{{/each}}',
  { users: [{ name: 'a', admin: true }, { name: 'b' }] }
);
if (mixed !== '<li>a ★</li><li>b</li>') throw new Error("❌ {{#if}} dentro de {{#each}} falló: " + mixed);
const nested = '{{#if a}}{{#if b}}AB{{else}}A{{/if}}{{else}}{{#if b}}B{{else}}-{{/if}}{{/if}}';
const cases = [[{ a: 1, b: 1 }, 'AB'], [{ a: 1 }, 'A'], [{ b: 1 }, 'B'], [{}, '-']];
for (const [data, expected] of cases) {
  const out = processTemplate(nested, data);
  if (out !== expected) throw new Error(`❌ {{#if}} anidado con ${JSON.stringify(data)} dio '${out}'`);
}
if (processTemplate('{{#if a}}1{{/if}}-{{#if b}}2{{/if}}', { a: 1, b: 1 }) !== '1-2') {
  throw new Error("❌ varios {{#if}} consecutivos fallaron");
}

console.log("✅ Todos los tests de template pasaron");
