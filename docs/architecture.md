# Arquitectura de CapyFront

CapyFront está diseñado bajo tres principios fundamentales:

- **Minimalismo** → sin dependencias externas, puro HTML, CSS y JS.
- **Modularidad** → cada pieza (componente, página, acción) vive en su propio archivo.
- **Automatización** → binarios (`capy-new` / `capy-new.exe`) generan y registran todo automáticamente.

---

## 📂 Estructura de carpetas

```code
core/ → núcleo del framework
├── actions.js → registro central de acciones
├── components.js → registro de componentes
├── router.js → registro de páginas
├── api.js → utilidades para requests
└── component-loader.js → carga dinámica de componentes

components/ → componentes reutilizables
pages/ → páginas completas
models/ → lógica de datos
├── request/ → funciones para enviar datos
└── response/ → funciones para procesar respuestas

tests/ → pruebas automáticas
tools/ → binarios auxiliares
docs/ → documentación técnica
```

---

## 🔗 Flujo de trabajo

1. **Generación**  
   - Usá `capy-new` o `capy-new.exe` para crear un componente o página.  
   - Se generan automáticamente los archivos `.html`, `.css`, `.js` y `.test.js`.

2. **Registro automático**  
   - Los binarios insertan el componente en `components.js` o la página en `router.js`.  
   - También crean una acción básica en `actions.js`.

3. **Props (entrada)**  
   - Los componentes observan atributos declarativos (`observed: ['id', 'name']`).  
   - Ejemplo: `<user-card-component id="42"></user-card-component>`.

4. **Acciones (salida)**  
   - Las funciones en `actions.js` permiten invocar lógica global.  
   - Ejemplo: `runAction('getUserData')`.

5. **Estado interno**  
   - Cada componente puede definir variables locales en su `.js` para manejar lógica propia.  
   - Ejemplo: contador interno, flags de validación, etc.

---

## 🧠 Filosofía de separación

- **Funciones locales** → van en el `.js` del componente (estado, eventos, lógica propia).  
- **Funciones globales** → van en `core/actions/` y se registran en `actions.js` (API calls, validaciones compartidas).  

Esto permite que CapyFront sea flexible:

- Encapsulado cuando lo necesitás.
- Reutilizable cuando lo querés compartir.  

---

## 🧪 Testing

- Cada componente genera su propio test (`*.test.js`).  
- `tests/tests.html` carga todos los tests automáticamente.  
- Se validan props, acciones y outputs.

---

## 🚀 Conclusión

CapyFront busca un balance entre **simplicidad y poder**:

- Minimalista para que cualquier dev pueda usarlo sin dependencias.  
- Modular para que escale en proyectos grandes.  
- Automatizado para que el flujo de trabajo sea rápido y sin fricción.  

> La arquitectura está pensada para freelancers, agencias y equipos que valoran claridad, velocidad y control total sobre su frontend.

---
