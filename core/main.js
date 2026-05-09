/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

import { initRouter, routes } from './router.js';
import { actions } from './actions.js';
import { setState, getState, subscribe } from './store.js';

window.actions = actions;
window.store = { setState, getState, subscribe };

initRouter(routes);
