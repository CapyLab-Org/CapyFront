/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

export async function saveContact(data) {
  await new Promise(r => setTimeout(r, 400));
  console.log('Contacto enviado:', data);
  return { ok: true };
}
