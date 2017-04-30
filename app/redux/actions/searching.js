/* global document */

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
      document.querySelector('#schwifty-411').innerHTML = 'Getting Schwifty...';
    } else {
      document.querySelector('#search-button').removeAttribute('disabled');
      document.querySelector('#schwifty-411').innerHTML = '';
    }

    dispatch(searching(payload));
  };
}

module.exports = {
  searching,
  asyncSearching,
};
