/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { initRouter, routes } from './router.js';
import { actions } from './actions.js';
import { setState, getState, subscribe } from './store.js';
import { load, save } from './storage.js';
import { setAuthToken as setApiToken } from './api.js';

window.actions = actions;
window.store = { setState, getState, subscribe };

// Restaurar carrito persistido
const savedCart = load('cart', []);
if (savedCart.length) setState('cart', savedCart);

// Persistir carrito en cada cambio
subscribe('cart', (items) => save('cart', items));

// Restaurar stock persistido (mantiene coherencia con el carrito al refrescar)
const savedStock = load('stock', null);
if (savedStock) setState('stock', savedStock);

// Persistir stock en cada cambio
subscribe('stock', (map) => save('stock', map));

// Restaurar token de sesión si existe
const savedToken = load('token');
if (savedToken) setApiToken(savedToken);

initRouter(routes);
