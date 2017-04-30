/* eslint no-console: 0 */
/* global window, document, localforage, fetch */
import 'notie/dist/notie.min.css';
import 'normalize.css';

import { confirm } from 'notie';

import 'App/sass/schwifty.scss';
import store from 'App/redux/store.js';

import { showElement } from 'App/redux/actions/dom';
import { search } from 'App/redux/actions/search';
import { asyncUserIsLoggedIn, authorizeSpotify, logout } from 'App/redux/actions/user';

store.subscribe(() => {
});

store
  .dispatch(asyncUserIsLoggedIn())
  .then(() => {
    showElement('#profile');
  }, () => {
    showElement('#login-container');
  });

document.querySelector('#search-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  search(document.querySelector('#search-input').value);
}, false);

document.querySelector('#login').addEventListener('click', () => {
  authorizeSpotify();
}, false);

document.querySelector('#logout').addEventListener('click', () => {
  confirm({
    text: 'Logout?',
    submitCallback() {
      logout();
    },
  });
}, false);
