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
  return (dispatch, getState) => {
    if (payload === getState().searching) {
      return;
    }

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
        });
      }
    } else {
      document.querySelector('#search-button').removeAttribute('disabled');
      document.querySelector('#create-playlist').removeAttribute('disabled');
      document.querySelector('#schwifty-411').innerHTML = '';
    }

    dispatch(searching(payload));
  };
}

module.exports = {
  searching,
  asyncSearching,
};
