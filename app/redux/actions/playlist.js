import { PLAYLIST_ADD, PLAYLIST_REMOVE, PLAYLIST_EDIT } from 'App/redux/constants/playlist';

function add(payload) {
  return {
    type: PLAYLIST_ADD,
    payload,
  };
}

function remove(payload) {
  return {
    type: PLAYLIST_REMOVE,
    payload,
  };
}

function asyncRemove(id) {
  return (dispatch, getState) => {
    const { playlist } = getState();
    let removeIndex = -1;

    playlist.forEach((p, index) => {
      if (p.id === id) {
        removeIndex = index;
      }
    });

    dispatch(remove({ index: removeIndex }));
  };
}

function edit(payload) {
  return {
    type: PLAYLIST_EDIT,
    payload,
  };
}

function asyncEdit(editItem) {
  return (dispatch, getState) => {
    const { playlist } = getState();
    let removeIndex = -1;

    playlist.forEach((p, index) => {
      if (p.id === editItem.id) {
        removeIndex = index;
      }
    });

    dispatch(remove({
      index: removeIndex,
      edit: editItem,
    }));
  };
}

module.exports = {
  add,
  remove,
  asyncRemove,
  edit,
  asyncEdit,
};
