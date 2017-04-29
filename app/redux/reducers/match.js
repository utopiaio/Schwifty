import { MATCH } from 'App/redux/constants/match.js';

function reducer(state = [], action) {
  switch (action.type) {
    case MATCH:
      return action.payload;

    default:
      return state;
  }
}

module.exports = reducer;
