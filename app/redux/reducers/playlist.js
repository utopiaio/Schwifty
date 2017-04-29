import { PLAYLIST_ADD, PLAYLIST_REMOVE, PLAYLIST_EDIT } from 'App/redux/constants/playlist';

function reducer(state = [], action) {
  switch (action.type) {
    case PLAYLIST_ADD:
      return [Object.assign({}, action.payload), ...state];

    case PLAYLIST_EDIT:
      return [
        ...state.slice(0, action.payload.index),
        Object.assign({}, state[action.payload.index], action.payload),
        ...state.slice(action.payload.index + 1),
      ];

    case PLAYLIST_REMOVE:
      return [
        ...state.slice(0, action.payload.index),
        ...state.slice(action.payload.index + 1),
      ];

    default:
      return state;
  }
}

module.exports = reducer;
