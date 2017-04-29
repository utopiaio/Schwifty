/* eslint no-console: 0 */
/* global window, document, localforage, fetch */
import 'notie/dist/notie.min.css';
import 'normalize.css';

import anime from 'animejs';
import { confirm } from 'notie';

import 'App/sass/schwifty.scss';
import store from 'App/redux/store.js';

import { showElement, hideElement } from 'App/redux/actions/dom';
import { asyncUserIsLoggedIn, authorizeSpotify, asyncUserBoot, logout } from 'App/redux/actions/user';

store.subscribe(() => {
});

store
  .dispatch(asyncUserIsLoggedIn())
  .then(() => {
    showElement('#profile');
    console.log(store.getState());
  }, () => {
    showElement('#login-container');
  });

document.querySelector('#search-form').addEventListener('submit', (e) => {
  e.preventDefault();
  store.dispatch(asyncUserBoot(true));
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
