import { ME, TOKEN } from 'App/redux/constants/user.js';

function reducer(state = { me: null, token: null }, action) {
  switch (action.type) {
    case ME:
      return Object.assign({}, state, { me: action.payload });

    case TOKEN:
      return Object.assign({}, state, { token: action.payload });

    default:
      return state;
  }
}

module.exports = reducer;
