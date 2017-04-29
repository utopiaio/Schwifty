/* global document */

import { SEARCHING } from 'App/redux/constants/search.js';

function search(payload) {
  return {
    type: SEARCHING,
    payload,
  };
}

function asyncSearch(payload) {
  return (dispatch, getState) => {
    if (payload === getState().searching) {
      return;
    }

    if (payload === true) {
      document.querySelector('#search-button').setAttribute('disabled', 'disabled');
    } else {
      document.querySelector('#search-button').removeAttribute('disabled');
    }

    dispatch(search(payload));
  };
}

module.exports = {
  search,
  asyncSearch,
};
