import { USER } from 'App/redux/constants/user.js';

function reducer(state = null, action) {
  switch (action.type) {
    case USER:
      return action.payload;

    default:
      return state;
  }
}

module.exports = reducer;
