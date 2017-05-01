/* global document */

import anime from 'animejs';
import { SEARCHING } from 'App/redux/constants/searching.js';

function searching(payload) {
  return {
    type: SEARCHING,
    payload,
  };
}

function asyncSearching(payload) {
  return (dispatch, getState) => new Promise((resolve) => {
    if (payload === getState().searching) {
      resolve();
      return;
    }

    dispatch(searching(payload));

    if (payload === true) {
      document.querySelector('#search-button').setAttribute('disabled', 'disabled');
      document.querySelector('#create-playlist').setAttribute('disabled', 'disabled');
      document.querySelector('#schwifty-411').innerHTML = 'Getting Schwifty...';

      // clearing match list...
      if (document.querySelectorAll('.track-list .track').length > 0) {
        anime({
          targets: '.track-list .track',
          translateY: ['0vh', '100vh'],
          delay: (el, i) => i * 100,
          complete() {
            document.querySelector('.match').innerHTML = '';
            resolve();
          },
        });

        return;
      }

      resolve();
    } else {
      document.querySelector('#search-button').removeAttribute('disabled');
      document.querySelector('#create-playlist').removeAttribute('disabled');
      document.querySelector('#schwifty-411').innerHTML = '';
      resolve();
    }
  });
}

module.exports = {
  searching,
  asyncSearching,
};
