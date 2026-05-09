/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

export function exampleResponse(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    active: raw.active ?? false,
  };
}