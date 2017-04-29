import { SEARCHING } from 'App/redux/constants/search.js';

function reducer(state = false, action) {
  switch (action.type) {
    case SEARCHING:
      return action.payload;

    default:
      return state;
  }
}

module.exports = reducer;
