/* global window, document, fetch */
/* eslint no-console: 0 */

import localforage from 'localforage';

import { ME, TOKEN } from 'App/redux/constants/user';
import { LF_STORE } from 'App/config/localforage';
import { CLIENT_ID, REDIRECT_URI, SCOPE } from 'App/config/spotify';
import hashParams from 'App/js/hashParams';

function userToken(payload) {
  return {
    type: TOKEN,
    payload,
  };
}

function userMe(payload) {
  return {
    type: ME,
    payload,
  };
}

/**
 * redirects to Spotify for authorization
 */
function authorizeSpotify() {
  const state = `${Date.now()}`;
  const url = `https://accounts.spotify.com/authorize?response_type=token&client_id=${encodeURIComponent(CLIENT_ID)}&scope=${encodeURIComponent(SCOPE)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${encodeURIComponent(state)}`;
  window.location = url;
}

/**
 * clears everything, triggers reload to origin
 */
function logout() {
  localforage.clear();
  window.location = window.location.origin;
}

/**
 * looks for location.hash > localforage
 *
 * @return {Promise}
 */
function asyncUserIsLoggedIn() {
  return dispatch => new Promise((resolve, reject) => {
    const HASH_PARAMS = hashParams(window.location.hash);

    const me = async (token) => {
      // getting me...
      try {
        const moi = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `${token.token_type} ${token.access_token}`,
          },
        }).then(response => response.json());

        localforage.setItem(LF_STORE.TOKEN, token);
        localforage.setItem(LF_STORE.ME, moi);

        dispatch(userToken(token));
        dispatch(userMe(moi));
        resolve();
      } catch (e) {
        // clearing any previously set values inside LF...
        localforage.removeItem(LF_STORE.TOKEN);
        localforage.removeItem(LF_STORE.ME);
        dispatch(userToken(null));
        dispatch(userMe(null));
        reject();
      }
    };

    // we have token on the url, verifying...
    if (Object.prototype.hasOwnProperty.call(HASH_PARAMS, 'access_token')) {
      localforage
        .setItem(LF_STORE.TOKEN, HASH_PARAMS)
        .then((lfToken) => {
          me(lfToken);
        }, (err) => {
          console.warn('Unable to set lfToken', err);
          reject();
        });

      return;
    }

    // we have no token on the URL, checking inside LF...
    localforage
      .getItem(LF_STORE.TOKEN)
      .then((lfToken) => {
        // no token inside LF
        if (lfToken === null) {
          reject();
          return;
        }

        me(lfToken);
      });
  });
}

module.exports = {
  userToken,
  userMe,
  asyncUserIsLoggedIn,
  authorizeSpotify,
  logout,
};
