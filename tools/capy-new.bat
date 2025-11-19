@echo off
setlocal EnableDelayedExpansion

:: Inicializar variables
set TYPE=component
set NAME=

:: Parsear argumentos
:parse
if "%~1"=="" goto after_parse
if "%~1"=="--page" (
  set TYPE=page
  shift
  goto parse
)
if "%~1"=="--component" (
  set TYPE=component
  shift
  goto parse
)
set NAME=%~1
shift
goto parse

:after_parse
if "%NAME%"=="" (
  echo Uso: capy-new.bat [--page] NombreDelComponente
  exit /b 1
)

:: Normalizar nombre
set BASENAME=%NAME%
for /f %%C in ('powershell -nologo -command "$env:BASENAME.ToLower()"') do set BASENAME=%%C
set TAG=%BASENAME%-%TYPE%
set BASE_DIR=..\%TYPE%s
set COMP_DIR=%BASE_DIR%\%BASENAME%

mkdir "%COMP_DIR%"

set HTML=%COMP_DIR%\%BASENAME%.html
set CSS=%COMP_DIR%\%BASENAME%.css
set JS=%COMP_DIR%\%BASENAME%.js
set TEST=%COMP_DIR%\%BASENAME%.test.js

:: Convertir a PascalCase
for /f %%C in ('powershell -nologo -command "$s='%BASENAME%'; -join ($s -split '-' | ForEach-Object { $_.Substring(0,1).ToUpper() + $_.Substring(1) })"') do set CAPNAME=%%C

:: Generar HTML
> "%HTML%" echo <!-- @license MIT
>> "%HTML%" echo      Copyright (c) 2025 CapyLab Studio -->

if "%TYPE%"=="page" (
  >> "%HTML%" echo ^<div^>
  >> "%HTML%" echo   ^<h2^>{{id}} - {{name}}^</h2^>
  >> "%HTML%" echo ^</div^>
) else (
  >> "%HTML%" echo ^<div^>
  >> "%HTML%" echo   ^<p^>Id: {{id}}^</p^>
  >> "%HTML%" echo   ^<p^>Edad: {{name}}^</p^>
  >> "%HTML%" echo   ^<button onClick="get%CAPNAME%Id()"^>Obtener ID^</button^>
  >> "%HTML%" echo ^</div^>
)

:: Generar CSS
> "%CSS%" echo /* @license MIT
>> "%CSS%" echo    Copyright (c) 2025 CapyLab Studio */
>> "%CSS%" echo.
>> "%CSS%" echo /* estilos para %TAG% */
>> "%CSS%" echo div {
>> "%CSS%" echo   padding: 1em;
>> "%CSS%" echo }

:: Generar JS
> "%JS%" echo /**
>> "%JS%" echo  * @license MIT
>> "%JS%" echo  * Copyright (c) 2025 CapyLab Studio
>> "%JS%" echo  */

if "%TYPE%"=="page" (
  >> "%JS%" echo import { defineComponentFromFiles } from '../../core/component-loader.js';
  >> "%JS%" echo import { loadUsedComponents } from '../../core/components.js';
  >> "%JS%" echo.
  >> "%JS%" echo defineComponentFromFiles('%TAG%', '%HTML%', '%CSS%', {
  >> "%JS%" echo   observed: ['id', 'name'],
  >> "%JS%" echo   onMount: async (el, shadow) => {
  >> "%JS%" echo     await loadUsedComponents(shadow);
  >> "%JS%" echo   }
  >> "%JS%" echo });
) else (
  >> "%JS%" echo import { defineComponentFromFiles } from '../../core/component-loader.js';
  >> "%JS%" echo import { actions } from '../../core/actions.js';
  >> "%JS%" echo.
  >> "%JS%" echo defineComponentFromFiles('%TAG%', '%HTML%', '%CSS%', {
  >> "%JS%" echo   observed: ['id', 'name'],
  >> "%JS%" echo   onMount: (el, shadow) => {
  >> "%JS%" echo     if (!window.get%CAPNAME%Id) {
  >> "%JS%" echo       window.get%CAPNAME%Id = actions.get%CAPNAME%Id;
  >> "%JS%" echo     }
  >> "%JS%" echo   }
  >> "%JS%" echo });
)

echo ✅ %TYPE% '%TAG%' creado en %COMP_DIR%

:: Registro en router.js
if "%TYPE%"=="page" (
  powershell -Command "(Get-Content ../core/router.js) -replace 'export const routes = {', 'export const routes = {\n  %BASENAME%: () => import(''../pages/%BASENAME%/%BASENAME%.js''),' | Set-Content ../core/router.js"
  echo 🔗 Ruta '%BASENAME%' registrada con lazy load en router.js
)

:: Registro en components.js y actions.js
if "%TYPE%"=="component" (
  powershell -Command "(Get-Content ../core/components.js) -replace 'export const components = {', 'export const components = {\n  ''%TAG%'': () => import(''../components/%BASENAME%/%BASENAME%.js''),' | Set-Content ../core/components.js"
  echo 🔗 Componente '%TAG%' registrado en components.js

  powershell -Command "(Get-Content ../core/actions.js) -replace 'export const actions = {', 'export const actions = {\n  get%CAPNAME%Id: () => ''%BASENAME%-id'',' | Set-Content ../core/actions.js"
  echo 🔗 Acción 'get%CAPNAME%Id' registrada en actions.js

  :: Crear test
  > "%TEST%" echo /**
  >> "%TEST%" echo  * @license MIT
  >> "%TEST%" echo  * Copyright (c) 2025 CapyLab Studio
  >> "%TEST%" echo  */
  >> "%TEST%" echo.
  >> "%TEST%" echo import { actions, runAction } from '../../core/actions.js';
  >> "%TEST%" echo.
  >> "%TEST%" echo console.log("Test: %TAG% actions");
  >> "%TEST%" echo.
  >> "%TEST%" echo if (actions.get%CAPNAME%Id() !== '%BASENAME%-id') {
  >> "%TEST%" echo   throw new Error("❌ get%CAPNAME%Id no devolvió '%BASENAME%-id'");
  >> "%TEST%" echo }
  >> "%TEST%" echo.
  >> "%TEST%" echo const result = runAction('get%CAPNAME%Id');
  >> "%TEST%" echo if (result !== '%BASENAME%-id') {
  >> "%TEST%" echo   throw new Error("❌ runAction('get%CAPNAME%Id') no devolvió '%BASENAME%-id'");
  >> "%TEST%" echo }
  >> "%TEST%" echo.
  >> "%TEST%" echo console.log("✅ Todos los tests de %TAG% pasaron");

  echo 🧪 Test '%TEST%' creado para acción 'get%CAPNAME%Id'

  powershell -Command "(Get-Content ../tests/tests.html) -replace '</body>', '  <script type=\"module\" src=\"../components/%BASENAME%/%BASENAME%.test.js\"></script>\n</body>' | Set-Content ../tests/tests.html"
  echo 🔗 Test '%BASENAME%.test.js' agregado a tests.html
)

endlocal