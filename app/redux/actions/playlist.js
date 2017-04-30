/* global fetch */
/* eslint no-console: 0 */

import { PLAYLIST_ADD, PLAYLIST_REMOVE, PLAYLIST_EDIT } from 'App/redux/constants/playlist';
import { asyncSearching } from 'App/redux/actions/searching';

function add(payload) {
  return {
    type: PLAYLIST_ADD,
    payload,
  };
}

function asyncAdd(name, tracks) {
  return (dispatch, getState) => new Promise((resolve, reject) => {
    const { user } = getState();

    fetch(`https://api.spotify.com/v1/users/${user.me.id}/playlists`, {
      method: 'POST',
      headers: {
        Authorization: `${user.token.token_type} ${user.token.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description: 'Made by Schwifty',
      }),
    }).then(response => response.json()).then((playlist) => {
      if (Object.prototype.hasOwnProperty.call(playlist, 'error')) {
        reject("For some reason Spotify doesn't like the word 'the'");
        return;
      }

      fetch(`https://api.spotify.com/v1/users/${user.me.id}/playlists/${playlist.id}/tracks`, {
        method: 'POST',
        headers: {
          Authorization: `${user.token.token_type} ${user.token.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: tracks.map(track => track.uri),
        }),
      }).then(response => response.json()).then((schwifty) => {
        if (Object.prototype.hasOwnProperty.call(schwifty, 'error')) {
          reject('Unable to create the playlist 😔');
          return;
        }

        resolve(schwifty);
      });
    });
  });
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
  asyncAdd,
  remove,
  asyncRemove,
  edit,
  asyncEdit,
};
