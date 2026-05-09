/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

const _state = Object.create(null);
const _listeners = Object.create(null);

export function setState(key, value) {
  _state[key] = value;
  if (_listeners[key]) {
    for (const fn of _listeners[key]) fn(value, key);
  }
}

export function getState(key) {
  return _state[key];
}

/**
 * Suscribe una función a cambios de una clave del estado global.
 * Retorna una función para cancelar la suscripción.
 * @param {string} key
 * @param {function} fn
 * @returns {function} unsubscribe
 */
export function subscribe(key, fn) {
  if (!_listeners[key]) _listeners[key] = [];
  _listeners[key].push(fn);
  return function unsubscribe() {
    _listeners[key] = _listeners[key].filter(l => l !== fn);
  };
}
