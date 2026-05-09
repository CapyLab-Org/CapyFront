/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

function processTemplate(template, data) {
  // {{#each key}}...{{/each}}
  let result = template.replace(
    /\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g,
    (_, key, inner) => {
      const arr = Array.isArray(data[key]) ? data[key] : [];
      return arr.map(item =>
        inner.replace(/\{\{(\w+)\}\}/g, (__, prop) => item[prop] ?? '')
      ).join('');
    }
  );
  // {{key}}
  return result.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] ?? '');
}

/**
 * Emite un CustomEvent que burbujea hacia arriba a través del Shadow DOM.
 * @param {HTMLElement} el
 * @param {string} eventName
 * @param {any} detail
 */
export function emit(el, eventName, detail = null) {
  el.dispatchEvent(new CustomEvent(eventName, { bubbles: true, composed: true, detail }));
}

/**
 * Define un Web Component cargando su HTML y CSS desde archivos externos.
 * @param {string} name - nombre del custom element (kebab-case)
 * @param {string} htmlPath - ruta al archivo .html
 * @param {string|null} cssPath - ruta al archivo .css (opcional)
 * @param {{ observed?, onMount?, onDisconnect? }} options
 */
export async function defineComponentFromFiles(name, htmlPath, cssPath = null, options = {}) {
  if (customElements.get(name)) return;

  const [htmlRes, cssRes] = await Promise.all([
    fetch(htmlPath),
    cssPath ? fetch(cssPath) : Promise.resolve(null)
  ]);

  if (!htmlRes.ok) throw new Error(`No se pudo cargar ${htmlPath}: ${htmlRes.status}`);
  const html = await htmlRes.text();
  const css = cssRes ? (cssRes.ok ? await cssRes.text() : '') : '';

  class GenericComponent extends HTMLElement {
    static get observedAttributes() {
      return options.observed || [];
    }

    attributeChangedCallback(attr, oldVal, newVal) {
      if (oldVal === newVal) return;
      if (!this._data) this._data = {};
      this._data[attr] = newVal;
      if (this._mounted) this.render();
    }

    connectedCallback() {
      if (this._mounted) return;
      this._mounted = true;

      const shadow = this.attachShadow({ mode: 'open' });
      this._shadow = shadow;
      this._data = {};

      for (const attr of this.attributes) {
        this._data[attr.name] = attr.value;
      }

      // on* attribute → event listeners (attached to element, sobreviven re-renders)
      for (const attr of this.attributes) {
        if (!attr.name.startsWith('on')) continue;
        const eventName = attr.name.slice(2).toLowerCase();
        const match = attr.value.trim().match(/^(\w+)\((.*)\)$/);
        if (!match) continue;
        const fnName = match[1];
        const argsStr = match[2].trim();
        let args = [];
        if (argsStr) {
          try { args = JSON.parse(`[${argsStr}]`); } catch {
            console.warn(`No se pudieron parsear los parámetros de ${attr.value}`);
          }
        }
        const fn = window.actions?.[fnName];
        if (typeof fn === 'function') {
          this.addEventListener(eventName, () => fn(...args));
        } else {
          console.warn(`Función '${fnName}' no registrada en actions`);
        }
      }

      this.render();

      if (typeof options.onMount === 'function') {
        options.onMount(this, shadow, { ...this._data });
      }
    }

    /**
     * Re-renderiza el template con datos nuevos o actualizados.
     * Los datos se fusionan con el estado interno existente.
     * @param {object} data
     */
    render(data = {}) {
      Object.assign(this._data, data);
      const content = processTemplate(html, this._data);
      this._shadow.innerHTML = `
        ${css ? `<style>${css}</style>` : ''}
        ${content}
      `;
    }

    disconnectedCallback() {
      if (typeof options.onDisconnect === 'function') {
        options.onDisconnect(this, this._shadow);
      }
    }
  }

  customElements.define(name, GenericComponent);
}
