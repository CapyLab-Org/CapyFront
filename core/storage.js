/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

export function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { console.warn('storage.save:', e); }
}

export function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

export function remove(key) {
  try { localStorage.removeItem(key); } catch {}
}

export function saveSession(key, value) {
  try { sessionStorage.setItem(key, JSON.stringify(value)); } catch (e) { console.warn('storage.saveSession:', e); }
}

export function loadSession(key, fallback = null) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

export function removeSession(key) {
  try { sessionStorage.removeItem(key); } catch {}
}
