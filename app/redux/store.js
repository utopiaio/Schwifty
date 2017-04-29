/* global window */

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import playlist from 'App/redux/reducers/playlist.js';
import match from 'App/redux/reducers/match.js';
import user from 'App/redux/reducers/user.js';
import searching from 'App/redux/reducers/searching.js';

const store = createStore(
  combineReducers({ searching, user, playlist, match }),
  { user: { token: null, me: null }, searching: false, playlist: [], match: [] },
  window.devToolsExtension
    ? compose(applyMiddleware(thunk), window.devToolsExtension())
    : applyMiddleware(thunk),
);

module.exports = store;
