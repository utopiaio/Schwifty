import { MATCH } from 'App/redux/constants/match';

function reducer(state = [], action) {
  switch (action.type) {
    case MATCH:
      return action.payload;

    default:
      return state;
  }
}

module.exports = reducer;
