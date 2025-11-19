/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

export async function defineComponentFromFiles(name, htmlPath, cssPath = null, options = {}) {
  if (customElements.get(name)) return;

  const [html, css] = await Promise.all([
    fetch(htmlPath).then(res => res.text()),
    cssPath ? fetch(cssPath).then(res => res.text()) : Promise.resolve('')
  ]);

  class GenericComponent extends HTMLElement {
    static get observedAttributes() {
      return options.observed || [];
    }

    attributeChangedCallback(attr, oldVal, newVal) {
      this[attr] = newVal;
    }

    connectedCallback() {
      const shadow = this.attachShadow({ mode: 'open' });

      // Leer atributos como props
      const props = {};
      for (const attr of this.attributes) {
        props[attr.name] = attr.value;
      }

      // Reemplazar {{prop}} en HTML
      let content = typeof html === 'function' ? html(this) : html;
      if (typeof content === 'string') {
        content = content.replace(/\{\{(\w+)\}\}/g, (_, key) => props[key] ?? '');
      }

      shadow.innerHTML = `
        ${css ? `<style>${css}</style>` : ''}
        ${content}
      `;

      // Validar atributos tipo onClick
      for (const attr of this.attributes) {
        if (attr.name.startsWith('on')) {
          const eventName = attr.name.slice(2).toLowerCase(); // onClick → click
          const fnCall = attr.value.trim();                   

          // Extraer nombre y parámetros
          const match = fnCall.match(/^(\w+)\((.*)\)$/);
          if (match) {
            const fnName = match[1];
            const argsStr = match[2].trim();

            if (argsStr) {
              try {
                args = JSON.parse(`[${argsStr}]`); 
              } catch (err) {
                console.warn(`No se pudieron parsear los parámetros de ${fnCall}`);
              }
            }

            // Busco funcion en actions
            const fn = window.actions?.[fnName];
            if (typeof fn === 'function') {
              this.addEventListener(eventName, () => fn(...args));
            } else {
              console.warn(`Función '${fnName}' no registrada en actions`);
            }
          }
        }
      }

      if (typeof options.onMount === 'function') {
        options.onMount(this, shadow, props);
      }
    }
  }

  customElements.define(name, GenericComponent);
}