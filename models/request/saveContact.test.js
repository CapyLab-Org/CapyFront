/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { saveContact } from './saveContact.js';

// Envío normal
const res = await saveContact({ name: 'Test', email: 'test@capylab.dev', message: 'Hola desde los tests' });
if (!res)             throw new Error("saveContact: no retornó respuesta");
if (res.ok !== true)  throw new Error(`saveContact: esperaba { ok: true }, recibió ${JSON.stringify(res)}`);

// Envío con datos vacíos — la función no debería tirar error, solo registrar
const res2 = await saveContact({});
if (!res2 || res2.ok !== true) throw new Error("saveContact: falló con datos vacíos");

console.log("✅ saveContact retornó { ok: true } correctamente");
