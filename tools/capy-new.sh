#!/bin/bash

TYPE="component"
NAME=""

# Parse args
for arg in "$@"; do
  case $arg in
    --page)
      TYPE="page"
      shift
      ;;
    --component)
      TYPE="component"
      shift
      ;;
    *)
      NAME="$arg"
      ;;
  esac
done

if [ -z "$NAME" ]; then
  echo "Uso: ./capy-new.sh [--page] NombreDelComponente"
  exit 1
fi

BASENAME=$(echo "$NAME" | tr '[:upper:]' '[:lower:]')
TAG="${BASENAME}-${TYPE}"
BASE_DIR="../${TYPE}s"
COMP_DIR="${BASE_DIR}/${BASENAME}"

mkdir -p "$COMP_DIR"

HTML="${COMP_DIR}/${BASENAME}.html"
CSS="${COMP_DIR}/${BASENAME}.css"
JS="${COMP_DIR}/${BASENAME}.js"
TEST="${COMP_DIR}/${BASENAME}.test.js"
CAPNAME=$(echo "$BASENAME" | sed -E 's/(^|-)([a-z])/\U\2/g')

# HTML
if [ "$TYPE" = "page" ]; then
cat > "$HTML" <<EOF
<!-- @license MIT
     Copyright (c) 2025 CapyLab Studio -->

<div>
  <h2>{{id}} - {{name}}</h2>
</div>
EOF
else
cat > "$HTML" <<EOF
<!-- @license MIT
     Copyright (c) 2025 CapyLab Studio -->

<div>
  <p>Id: {{id}}</p>
  <p>Edad: {{name}}</p>
  <button onClick="get${CAPNAME}Id()">Obtener ID</button>
</div>
EOF
fi

# CSS
cat > "$CSS" <<EOF
/* @license MIT
   Copyright (c) 2025 CapyLab Studio */

/* estilos para ${TAG} */
div {
  padding: 1em;
}
EOF

# JS 
if [ "$TYPE" = "page" ]; then
  cat > "$JS" <<EOF
/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { defineComponentFromFiles } from '../../core/component-loader.js';
import { loadUsedComponents } from '../../core/components.js';

defineComponentFromFiles('${TAG}', '${HTML}', '${CSS}', {
  observed: ['id', 'name'], // Propiedades de entrada
  onMount: async (el, shadow) => {
    await loadUsedComponents(shadow);
  }
});
EOF
else
  cat > "$JS" <<EOF
/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { defineComponentFromFiles } from '../../core/component-loader.js';
import { actions } from '../../core/actions.js';

defineComponentFromFiles('${TAG}', '${HTML}', '${CSS}', {
  observed: ['id', 'name'], // Propiedades de entrada
  onMount: (el, shadow) => {
    // Expone la accion como funcion global si no existe
    if (!window.get${CAPNAME}Id) {
      window.get${CAPNAME}Id = actions.get${CAPNAME}Id;
    }
  }
});
EOF
fi

echo "✅ ${TYPE^} '${TAG}' creado en ${COMP_DIR}/"

# Registro automático en router.js 
if [ "$TYPE" = "page" ]; then
  ROUTER_FILE="../core/router.js"
  if grep -q "export const routes = {" "$ROUTER_FILE"; then
    sed -i "/export const routes = {/a \ \ ${BASENAME}: () => import('../pages/${BASENAME}/${BASENAME}.js')," "$ROUTER_FILE"
    echo "🔗 Ruta '${BASENAME}' registrada con lazy load en router.js"
  else
    echo "⚠️ No se encontró el bloque de rutas en router.js"
  fi
fi

# Registro automático en components.js 
if [ "$TYPE" = "component" ]; then
  COMPONENTS_FILE="../core/components.js"

  if grep -q "export const components = {" "$COMPONENTS_FILE"; then
    sed -i "/export const components = {/a \ \ '${TAG}': () => import('../components/${BASENAME}/${BASENAME}.js')," "$COMPONENTS_FILE"
    echo "🔗 Componente '${TAG}' registrado en components.js"
  else
    echo "⚠️ No se encontró el bloque de componentes en components.js"
  fi

  # Registro automático en actions.js
  ACTIONS_FILE="../core/actions.js"
  if grep -q "export const actions = {" "$ACTIONS_FILE"; then
    sed -i "/export const actions = {/a \ \ get${CAPNAME}Id: () => '${BASENAME}-id'," "$ACTIONS_FILE"
    echo "🔗 Acción 'get${CAPNAME}Id' registrada en actions.js"
  else
    echo "⚠️ No se encontró el bloque de aciones en actions.js"
  fi

  # Crear test básico
cat > "$TEST" <<EOF
/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */
 
import { actions, runAction } from '../../core/actions.js';

console.log("Test: ${TAG} actions");

if (actions.get${CAPNAME}Id() !== '${BASENAME}-id') {
  throw new Error("❌ get${CAPNAME}Id no devolvió '${BASENAME}-id'");
}

const result = runAction('get${CAPNAME}Id');
if (result !== '${BASENAME}-id') {
  throw new Error("❌ runAction('get${CAPNAME}Id') no devolvió '${BASENAME}-id'");
}

console.log("✅ Todos los tests de ${TAG} pasaron");
EOF
echo "🧪 Test '${TEST}' creado para acción 'get${CAPNAME}Id'"

# Insertar script en tests.html
TESTS_HTML="../tests/tests.html"
if grep -q "</body>" "$TESTS_HTML"; then
  sed -i "/<\/body>/i \  <script type=\"module\" src=\"../components/${BASENAME}/${BASENAME}.test.js\"></script>" "$TESTS_HTML"
  echo "🔗 Test '${BASENAME}.test.js' agregado a tests.html"
else
  echo "⚠️ No se encontró </body> en tests.html"
fi
fi