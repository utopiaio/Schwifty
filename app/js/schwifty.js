/* eslint no-console: 0 */
/* global window, document, localforage, fetch */
import 'notie/dist/notie.min.css';
import 'normalize.css';

import anime from 'animejs';
import { alert, confirm, input } from 'notie';

import 'App/sass/schwifty.scss';
import store from 'App/redux/store.js';

import { showElement } from 'App/redux/actions/dom';
import { search } from 'App/redux/actions/search';
import { asyncUserIsLoggedIn, authorizeSpotify, logout } from 'App/redux/actions/user';
import { match } from 'App/redux/actions/match';
import { asyncAdd } from 'App/redux/actions/playlist';
import time from 'App/js/time';

document.querySelector('#search-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  if (store.getState().user.token === null) {
    return;
  }

  search(document.querySelector('#search-input').value).then((matches) => {
    if (matches.length === 0) {
      alert({
        type: 'neutral',
        text: "That's deep - I can't do that",
      });
      return;
    }

    store.dispatch(match(matches));

    document.querySelector('#schwifty-411').innerHTML = `Schwifty got <b>${matches.length}</b> track${matches.length > 1 ? 's' : ''}`;
    document.querySelector('.match').innerHTML = `<div class="track-list">${matches.map(m => `<div class="track" style="transform: translateY(100vh);">
      <div class="track__image">
        <img src="${m.album.images[1] ? m.album.images[1].url : 'app/static/placeholder.png'}" />
      </div>

      <div class="track__info">
        <div class="ashamed">
          <p class="track__name" class="text-white">${m.name}</p>
          <span class="track__artist text-mute">${m.artists.map(artist => artist.name).join(', ')}</span>
        </div>
      </div>

      <div class="ashamed-two-times">
        ${m.explicit ? '<span class="track__explicit">E</span>' : ''}
        <div class="track__duration text-mute">${time(m.duration_ms)}</div>
      </div>
    </div>`).join('')}</div>`;

    anime({
      targets: '.track-list .track',
      translateY: ['100vh', '0vh'],
      delay: (el, i) => i * 100,
    });
  }, (err) => {
    alert({
      type: 'error',
      text: err,
    });
  });
}, false);

const enableProfileClickListener = () => {
  document.querySelector('#create-playlist').addEventListener('click', () => {
    const currentMatch = store.getState().match;

    if (currentMatch.length === 0) {
      alert({
        type: 'warning',
        text: "I can't create an empty playlist. You're being very un-Schwifty 😒",
      });

      return;
    }

    input({
      text: 'Playlist Name',
      submitText: 'Create Playlist',
      cancelText: 'Not Today',
      minlength: '3',
      placeholder: 'To: Future-X',
    }, (value) => {
      if (value.length === 0) {
        alert({
          type: 'info',
          text: 'ABORTED!',
        });

        return;
      }

      store
        .dispatch(asyncAdd(value, store.getState().match))
        .then(() => {
          alert({
            type: 'success',
            text: `Playlist <b>${value}</b> has been created`,
          });

          document.querySelector('#schwifty-411').innerHTML = 'Get Schwifty!';

          anime({
            targets: '.track-list .track',
            translateY: ['0vh', '100vh'],
            delay: (el, i) => i * 100,
            complete() {
              store.dispatch(match([]));
              document.querySelector('.match').innerHTML = '';
            },
          });
        }, (err) => {
          alert({
            type: 'error',
            text: 'Unable to create the playlist 😔',
          });

          console.error('DAMN IT!', err);
        });
    });
  }, false);

  document.querySelector('#logout').addEventListener('click', () => {
    confirm({
      text: 'Logout?',
      submitCallback() {
        logout();
      },
    });
  }, false);
};

store
  .dispatch(asyncUserIsLoggedIn())
  .then(() => {
    document.querySelector('.container_profile').innerHTML = `<div id="profile" class="profile">
      <img id="profile-image" class="profile__image" src="app/static/placeholder.png">
      <p id="profile-username" class="profile__username text-mute"></p>
      <button id="create-playlist" class="button profile__playlist">Create a Playlist</button>
      <button id="logout" class="button button-auth button-danger profile__logout">Logout</button>
    </div>`;

    // not sending it via resolve because the store should be the
    // only source of truth for state - in Redux we trust
    const { user } = store.getState();
    document.querySelector('#profile-username').innerHTML = user.me.id;
    if (user.me.images.length > 0) {
      document.querySelector('#profile-image').setAttribute('src', user.me.images[0].url);
    }

    enableProfileClickListener();
    showElement('#profile');
  }, () => {
    document.querySelector('.container_profile').innerHTML = `<div id="login-container">
      <small style="margin-bottom: 0.5em;" class="text-mute">You need to be logged in to get <b>Schwifty</b></small>
      <button id="login" class="button button-auth">Login with Spotify</button>
    </div>`;
    document.querySelector('#search-button').setAttribute('disabled', 'disabled');
    document.querySelector('#login').addEventListener('click', () => {
      authorizeSpotify();
    }, false);
    showElement('#login-container');
  });
