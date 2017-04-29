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
    } else {
      document.querySelector('#search-button').removeAttribute('disabled');
    }

    dispatch(searching(payload));
  };
}

module.exports = {
  searching,
  asyncSearching,
};
