webpackJsonp([0],{

/***/ 112:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(128);

__webpack_require__(127);

var _animejs = __webpack_require__(12);

var _animejs2 = _interopRequireDefault(_animejs);

var _notie = __webpack_require__(49);

__webpack_require__(129);

var _store = __webpack_require__(56);

var _store2 = _interopRequireDefault(_store);

var _dom = __webpack_require__(117);

var _search = __webpack_require__(120);

var _user = __webpack_require__(122);

var _match = __webpack_require__(118);

var _playlist = __webpack_require__(119);

var _time = __webpack_require__(116);

var _time2 = _interopRequireDefault(_time);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* eslint no-console: 0 */
/* global window, document, localforage, fetch */


document.querySelector('#search-form').addEventListener('submit', (() => {
  var _ref = _asyncToGenerator(function* (e) {
    e.preventDefault();

    if (_store2.default.getState().user.token === null) {
      return;
    }

    (0, _search.search)(document.querySelector('#search-input').value).then(function (matches) {
      if (matches.length === 0) {
        (0, _notie.alert)({
          type: 'neutral',
          text: "That's deep - I can't do that"
        });
        return;
      }

      _store2.default.dispatch((0, _match.match)(matches));

      document.querySelector('#schwifty-411').innerHTML = `Schwifty got <b>${matches.length}</b> track${matches.length > 1 ? 's' : ''}`;
      document.querySelector('.match').innerHTML = `<div class="track-list">${matches.map(function (m) {
        return `<div class="track" style="transform: translateY(100vh);">
      <div class="track__image">
        <img src="${m.album.images[1] ? m.album.images[1].url : 'app/static/placeholder.png'}" />
      </div>

      <div class="track__info">
        <div class="ashamed">
          <p class="track__name" class="text-white">${m.name}</p>
          <span class="track__artist text-mute">${m.artists.map(function (artist) {
          return artist.name;
        }).join(', ')}</span>
        </div>
      </div>

      <div class="ashamed-two-times">
        ${m.explicit ? '<span class="track__explicit">E</span>' : ''}
        <div class="track__duration text-mute">${(0, _time2.default)(m.duration_ms)}</div>
      </div>
    </div>`;
      }).join('')}</div>`;

      (0, _animejs2.default)({
        targets: '.track-list .track',
        translateY: ['100vh', '0vh'],
        delay: function (el, i) {
          return i * 100;
        }
      });
    }, function (err) {
      (0, _notie.alert)({
        type: 'error',
        text: err
      });
    });
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})(), false);

const enableProfileClickListener = () => {
  document.querySelector('#create-playlist').addEventListener('click', () => {
    const currentMatch = _store2.default.getState().match;

    if (currentMatch.length === 0) {
      (0, _notie.alert)({
        type: 'warning',
        text: "I can't create an empty playlist. You're being very un-Schwifty 😒"
      });

      return;
    }

    (0, _notie.input)({
      text: 'Playlist Name',
      submitText: 'Create Playlist',
      cancelText: 'Not Today',
      minlength: '3',
      placeholder: 'To: Future-X'
    }, value => {
      if (value.length === 0) {
        (0, _notie.alert)({
          type: 'info',
          text: 'ABORTED!'
        });

        return;
      }

      _store2.default.dispatch((0, _playlist.asyncAdd)(value, _store2.default.getState().match)).then(() => {
        (0, _notie.alert)({
          type: 'success',
          text: `Playlist <b>${value}</b> has been created`
        });

        document.querySelector('#schwifty-411').innerHTML = 'Get Schwifty!';

        (0, _animejs2.default)({
          targets: '.track-list .track',
          translateY: ['0vh', '100vh'],
          delay: (el, i) => i * 100,
          complete() {
            _store2.default.dispatch((0, _match.match)([]));
            document.querySelector('.match').innerHTML = '';
          }
        });
      }, err => {
        (0, _notie.alert)({
          type: 'error',
          text: 'Unable to create the playlist 😔'
        });

        console.error('DAMN IT!', err);
      });
    });
  }, false);

  document.querySelector('#logout').addEventListener('click', () => {
    (0, _notie.confirm)({
      text: 'Logout?',
      submitCallback() {
        (0, _user.logout)();
      }
    });
  }, false);
};

_store2.default.dispatch((0, _user.asyncUserIsLoggedIn)()).then(() => {
  document.querySelector('.container_profile').innerHTML = `<div id="profile" class="profile">
      <img id="profile-image" class="profile__image" src="app/static/placeholder.png">
      <p id="profile-username" class="profile__username text-mute"></p>
      <button id="create-playlist" class="button profile__playlist">Create a Playlist</button>
      <button id="logout" class="button button-auth button-danger profile__logout">Logout</button>
    </div>`;

  // not sending it via resolve because the store should be the
  // only source of truth for state - in Redux we trust
  const { user } = _store2.default.getState();
  document.querySelector('#profile-username').innerHTML = user.me.id;
  if (user.me.images.length > 0) {
    document.querySelector('#profile-image').setAttribute('src', user.me.images[0].url);
  }

  enableProfileClickListener();
  (0, _dom.showElement)('#profile');
}, () => {
  document.querySelector('.container_profile').innerHTML = `<div id="login-container">
      <small style="margin-bottom: 0.5em;" class="text-mute">You need to be logged in to get <b>Schwifty</b></small>
      <button id="login" class="button button-auth">Login with Spotify</button>
    </div>`;
  document.querySelector('#search-button').setAttribute('disabled', 'disabled');
  document.querySelector('#login').addEventListener('click', () => {
    (0, _user.authorizeSpotify)();
  }, false);
  (0, _dom.showElement)('#login-container');
});

/***/ }),

/***/ 113:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _localforage = __webpack_require__(25);

var _localforage2 = _interopRequireDefault(_localforage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const config = {
  NAME: 'Schwifty',
  STORE_NAME: 'schwifty',
  DESCRIPTION: 'Get Schwifty!',
  LF_STORE: {
    TOKEN: 'TOKEN',
    ME: 'ME'
  }
};

_localforage2.default.config({
  name: config.NAME,
  storeName: config.STORE_NAME,
  description: config.DESCRIPTION
});

module.exports = config;

/***/ }),

/***/ 114:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const CLIENT_ID = '8ad7a6f78ef9487a92183ea076446e27';
// const REDIRECT_URI = 'http://localhost:8080/'; // [LOCAL]
const REDIRECT_URI = 'https://moe-szyslak.github.io/Schwifty/'; // [GITHUB]
const SCOPE = 'playlist-modify-public';

module.exports = {
  CLIENT_ID,
  REDIRECT_URI,
  SCOPE
};

/***/ }),

/***/ 115:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = (hash = '') => {
  const hashParams = {};
  const regX = /([^&;=]+)=?([^&;]*)/g;
  const query = hash.substring(1);
  let e = false;

  while (e = regX.exec(query)) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }

  return hashParams;
};

/***/ }),

/***/ 116:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * given song duration in miliseconds
 * returns minute and second
 *
 * @type {Object}
 */
module.exports = (duration = 0) => {
  const minutes = Math.floor(duration / 60000);
  const seconds = Math.floor((duration - minutes * 60000) / 1000);

  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

/***/ }),

/***/ 117:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _animejs = __webpack_require__(12);

var _animejs2 = _interopRequireDefault(_animejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function showElement(targets, duration = 1000, easing = 'easeOutElastic') {
  return new Promise(resolve => {
    (0, _animejs2.default)({
      targets,
      translateY: ['100vh', '0vh'],
      duration,
      easing,
      complete() {
        resolve();
      }
    });
  });
}

function hideElement(targets, duration = 1000, easing = 'easeInElastic') {
  return new Promise(resolve => {
    (0, _animejs2.default)({
      targets,
      opacity: 0,
      duration,
      complete() {
        resolve();
        (0, _animejs2.default)({
          targets,
          duration: 0,
          translateY: ['0vh', '100vh'],
          easing
        });
      }
    });
  });
}

module.exports = {
  showElement,
  hideElement
};

/***/ }),

/***/ 118:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _match = __webpack_require__(52);

function match(payload) {
  return {
    type: _match.MATCH,
    payload
  };
}

module.exports = {
  match
};

/***/ }),

/***/ 119:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _playlist = __webpack_require__(53);

function add(payload) {
  return {
    type: _playlist.PLAYLIST_ADD,
    payload
  };
} /* global fetch */
/* eslint no-console: 0 */

function asyncAdd(name, tracks) {
  return (dispatch, getState) => new Promise((resolve, reject) => {
    const { user } = getState();

    fetch(`https://api.spotify.com/v1/users/${user.me.id}/playlists`, {
      method: 'POST',
      headers: {
        Authorization: `${user.token.token_type} ${user.token.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        description: 'Made by Schwifty'
      })
    }).then(response => response.json()).then(playlist => {
      if (Object.prototype.hasOwnProperty.call(playlist, 'error')) {
        reject("For some reason Spotify doesn't like the word 'the'");
        return;
      }

      fetch(`https://api.spotify.com/v1/users/${user.me.id}/playlists/${playlist.id}/tracks`, {
        method: 'POST',
        headers: {
          Authorization: `${user.token.token_type} ${user.token.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: tracks.map(track => track.uri)
        })
      }).then(response => response.json()).then(schwifty => {
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
    type: _playlist.PLAYLIST_REMOVE,
    payload
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
    type: _playlist.PLAYLIST_EDIT,
    payload
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
      edit: editItem
    }));
  };
}

module.exports = {
  add,
  asyncAdd,
  remove,
  asyncRemove,
  edit,
  asyncEdit
};

/***/ }),

/***/ 120:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _reverse = __webpack_require__(47);

var _reverse2 = _interopRequireDefault(_reverse);

var _sortBy = __webpack_require__(48);

var _sortBy2 = _interopRequireDefault(_sortBy);

var _store = __webpack_require__(56);

var _store2 = _interopRequireDefault(_store);

var _searching = __webpack_require__(121);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* global fetch */
/* eslint no-console: 0 */

function search(q) {
  return new Promise((() => {
    var _ref = _asyncToGenerator(function* (resolve, reject) {
      const { user } = _store2.default.getState();

      const words = q.replace(/ {2}|\?|,|!/g, '').split(/!| |\?/).map(function (term) {
        return term.trim();
      });

      yield _store2.default.dispatch((0, _searching.asyncSearching)(true));
      Promise.all(words.map(function (word) {
        return fetch(`https://api.spotify.com/v1/search?limit=50&q="${encodeURIComponent(word)}"&type=track`, {
          headers: {
            Authorization: `${user.token.token_type} ${user.token.access_token}`
          }
        }).then(function (response) {
          return response.json();
        });
      })).then(function (results) {
        _store2.default.dispatch((0, _searching.asyncSearching)(false));

        const error = results.filter(function (result) {
          return Object.prototype.hasOwnProperty.call(result, 'error');
        });
        if (error.length > 0) {
          reject("For some reason Spotify doesn't like the word 'the'");
          return;
        }

        /**
         * now that all words have been resolved, comes the difficult part,
         * with the use of `startsWith`, `endsWith` & `includes` I'm going to try to build the playlist
         */

        // step 1
        // go though first word and filter tracks that start with the first word
        // the first word is very important
        // const starterTracks = results[0].tracks.items.filter(track => track.name.toLowerCase().startsWith(words[0].toLowerCase()));
        const starterTracks = results.map(function (result, index) {
          return result.tracks.items.filter(function (track) {
            return track.name.toLowerCase().startsWith(words[index].toLowerCase());
          });
        });
        console.log('starter:', starterTracks);

        // step 2
        // going through the rest of the words and filtering out tracks that include the word
        // because Spotify sometimes returns album matches
        const includeTracks = results.map(function (result, index) {
          return result.tracks.items.filter(function (track) {
            return track.name.toLowerCase().includes(words[index].toLowerCase());
          });
        });
        console.log('include:', includeTracks);

        // step 3
        // building 100% match list
        // this will be used to ID which words should be concatenated
        const fullMatchs = results.map(function (result, index) {
          return result.tracks.items.filter(function (track) {
            return track.name.toLowerCase() === words[index].toLowerCase();
          })[0] || null;
        });
        console.log('full match:', fullMatchs);

        // step 4
        // checking for rare case of 100% match
        if (fullMatchs.filter(function (match) {
          return match === null;
        }).length === 0) {
          console.log('we have a full match! 🙌🏿');
          resolve(fullMatchs);
          return;
        }

        // step 5
        // concatenation begins...far far away...DONKEY!
        // non-full match indexes will be replaced with starter and includes
        const starterIncludeList = fullMatchs.map(function (fullMatch, index) {
          if (fullMatch !== null) {
            return fullMatch;
          }

          return starterTracks[index] || includeTracks[index];
        });
        console.log('concat:', starterIncludeList);

        // step 6
        // going through arrays and criss-crossing to find neighborhood match
        // CRISS-CROSS!!!
        const crissCross = starterIncludeList.map(function (list, index) {
          if (Array.isArray(list) === false) {
            return list;
          }

          // looking +- one index and looking for include
          const wordPrevious = [words[index - 1] || '', words[index]].join(' ').toLowerCase();
          const wordNext = [words[index], words[index + 1] || ''].join(' ').toLowerCase();

          return {
            previous: words[index - 1] ? list.filter(function (track) {
              return track.name.toLowerCase().includes(wordPrevious);
            }) : [],
            self: list,
            next: words[index + 1] ? list.filter(function (track) {
              return track.name.toLowerCase().includes(wordNext);
            }) : []
          };
        });

        console.log('criss-cross:', crissCross);

        // step 7
        // criss-crossed list ordering
        const crissCrossSorted = crissCross.map(function (list, index) {
          if (Object.prototype.hasOwnProperty.call(list, 'next') === false) {
            return list;
          }

          return {
            previous: (0, _reverse2.default)((0, _sortBy2.default)([function (item) {
              return item.name.length - (words[index - 1] || 0);
            }])(list.previous))[0] || null,
            self: (0, _sortBy2.default)([function (item) {
              return item.name.length - words[index].length;
            }])(list.self)[0] || null,
            next: (0, _reverse2.default)((0, _sortBy2.default)([function (item) {
              return item.name.length - (words[index + 1] || 0);
            }])(list.next))[0] || null
          };
        });

        console.log('criss-cross sorted:', crissCrossSorted);

        // step 8
        // decision maker 😱
        // full-matches are kept unless previous or next criss-cross is a full match
        // this is the part where you fix your face --- final is going to be mutated
        const final = [];

        crissCrossSorted.forEach(function (item, index) {
          if (final[index] === null) {
            return;
          }

          // full match
          if (Object.prototype.hasOwnProperty.call(item, 'self') === false) {
            const nextItem = crissCrossSorted[index + 1];

            if (nextItem === undefined) {
              final[index] = item;
              return;
            }

            // next item is also a full match
            if (Object.prototype.hasOwnProperty.call(nextItem, 'self') === false) {
              final[index] = item;
              return;
            }

            // next previous item has no CRISS-CORSS
            if (nextItem.previous === null) {
              final[index] = item;
              return;
            }

            // next previous item is a full match
            if (nextItem.previous.name.toLowerCase().startsWith(`${item.name.toLowerCase()} ${words[index].toLowerCase()}`)) {
              final[index] = null;
              return;
            }

            final[index] = item;
            return;
          }

          if (item.next !== null) {
            if (item.next.name.toLowerCase().startsWith(`${words[index]} ${words[index + 1]}`.toLowerCase())) {
              final[index] = item.next;
              final[index + 1] = null;
              return;
            }
          }

          if (item.previous !== null) {
            if (item.previous.name.toLowerCase().startsWith(`${words[index - 1]} ${words[index]}`.toLowerCase())) {
              final[index] = item.previous;
              final[index - 1] = null;
              return;
            }
          }

          final[index] = item.self;
        });

        console.log('final:', final.filter(function (item) {
          return item !== null;
        }));
        resolve(final.filter(function (item) {
          return item !== null;
        }));
      }, function (err) {
        _store2.default.dispatch((0, _searching.asyncSearching)(false));
        console.error(err);
        reject(err);
      });
    });

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })());
}

module.exports = {
  search
};

/***/ }),

/***/ 121:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _animejs = __webpack_require__(12);

var _animejs2 = _interopRequireDefault(_animejs);

var _searching = __webpack_require__(54);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global document */

function searching(payload) {
  return {
    type: _searching.SEARCHING,
    payload
  };
}

function asyncSearching(payload) {
  return (dispatch, getState) => new Promise(resolve => {
    if (payload === getState().searching) {
      resolve();
      return;
    }

    dispatch(searching(payload));

    if (payload === true) {
      document.querySelector('#search-button').setAttribute('disabled', 'disabled');
      document.querySelector('#create-playlist').setAttribute('disabled', 'disabled');
      document.querySelector('#schwifty-411').innerHTML = 'Getting Schwifty...';

      // clearing match list...
      if (document.querySelectorAll('.track-list .track').length > 0) {
        (0, _animejs2.default)({
          targets: '.track-list .track',
          translateY: ['0vh', '100vh'],
          delay: (el, i) => i * 100,
          complete() {
            document.querySelector('.match').innerHTML = '';
            resolve();
          }
        });

        return;
      }

      resolve();
    } else {
      document.querySelector('#search-button').removeAttribute('disabled');
      document.querySelector('#create-playlist').removeAttribute('disabled');
      document.querySelector('#schwifty-411').innerHTML = '';
      resolve();
    }
  });
}

module.exports = {
  searching,
  asyncSearching
};

/***/ }),

/***/ 122:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _localforage = __webpack_require__(25);

var _localforage2 = _interopRequireDefault(_localforage);

var _user = __webpack_require__(55);

var _localforage3 = __webpack_require__(113);

var _spotify = __webpack_require__(114);

var _hashParams = __webpack_require__(115);

var _hashParams2 = _interopRequireDefault(_hashParams);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* global window, document, fetch */
/* eslint no-console: 0 */

function userToken(payload) {
  return {
    type: _user.TOKEN,
    payload
  };
}

function userMe(payload) {
  return {
    type: _user.ME,
    payload
  };
}

/**
 * redirects to Spotify for authorization
 */
function authorizeSpotify() {
  const state = `${Date.now()}`;
  const url = `https://accounts.spotify.com/authorize?response_type=token&client_id=${encodeURIComponent(_spotify.CLIENT_ID)}&scope=${encodeURIComponent(_spotify.SCOPE)}&redirect_uri=${encodeURIComponent(_spotify.REDIRECT_URI)}&state=${encodeURIComponent(state)}`;
  window.location = url;
}

/**
 * clears everything, triggers reload to origin
 */
function logout() {
  _localforage2.default.clear();
  window.location = window.location.origin;
}

/**
 * looks for location.hash > localforage
 *
 * @return {Promise}
 */
function asyncUserIsLoggedIn() {
  return dispatch => new Promise((resolve, reject) => {
    const HASH_PARAMS = (0, _hashParams2.default)(window.location.hash);

    const me = (() => {
      var _ref = _asyncToGenerator(function* (token) {
        // getting me...
        try {
          const moi = yield fetch('https://api.spotify.com/v1/me', {
            headers: {
              Authorization: `${token.token_type} ${token.access_token}`
            }
          }).then(function (response) {
            return response.json();
          });

          if (Object.prototype.hasOwnProperty.call(moi, 'error')) {
            throw moi;
          }

          _localforage2.default.setItem(_localforage3.LF_STORE.TOKEN, token);
          _localforage2.default.setItem(_localforage3.LF_STORE.ME, moi);

          dispatch(userToken(token));
          dispatch(userMe(moi));
          resolve();
        } catch (e) {
          // clearing any previously set values inside LF...
          _localforage2.default.removeItem(_localforage3.LF_STORE.TOKEN);
          _localforage2.default.removeItem(_localforage3.LF_STORE.ME);
          dispatch(userToken(null));
          dispatch(userMe(null));
          reject();
        }
      });

      return function me(_x) {
        return _ref.apply(this, arguments);
      };
    })();

    // we have token on the url, verifying...
    if (Object.prototype.hasOwnProperty.call(HASH_PARAMS, 'access_token')) {
      _localforage2.default.setItem(_localforage3.LF_STORE.TOKEN, HASH_PARAMS).then(lfToken => {
        me(lfToken);
      }, err => {
        console.warn('Unable to set lfToken', err);
        reject();
      });

      return;
    }

    // we have no token on the URL, checking inside LF...
    _localforage2.default.getItem(_localforage3.LF_STORE.TOKEN).then(lfToken => {
      // no token inside LF
      if (lfToken === null) {
        reject();
        return;
      }

      me(lfToken);
    });
  });
}

module.exports = {
  userToken,
  userMe,
  asyncUserIsLoggedIn,
  authorizeSpotify,
  logout
};

/***/ }),

/***/ 123:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _match = __webpack_require__(52);

function reducer(state = [], action) {
  switch (action.type) {
    case _match.MATCH:
      return action.payload;

    default:
      return state;
  }
}

module.exports = reducer;

/***/ }),

/***/ 124:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _playlist = __webpack_require__(53);

function reducer(state = [], action) {
  switch (action.type) {
    case _playlist.PLAYLIST_ADD:
      return [Object.assign({}, action.payload), ...state];

    case _playlist.PLAYLIST_EDIT:
      return [...state.slice(0, action.payload.index), Object.assign({}, state[action.payload.index], action.payload.edit), ...state.slice(action.payload.index + 1)];

    case _playlist.PLAYLIST_REMOVE:
      return [...state.slice(0, action.payload.index), ...state.slice(action.payload.index + 1)];

    default:
      return state;
  }
}

module.exports = reducer;

/***/ }),

/***/ 125:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _searching = __webpack_require__(54);

function reducer(state = false, action) {
  switch (action.type) {
    case _searching.SEARCHING:
      return action.payload;

    default:
      return state;
  }
}

module.exports = reducer;

/***/ }),

/***/ 126:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _user = __webpack_require__(55);

function reducer(state = { me: null, token: null }, action) {
  switch (action.type) {
    case _user.ME:
      return Object.assign({}, state, { me: action.payload });

    case _user.TOKEN:
      return Object.assign({}, state, { token: action.payload });

    default:
      return state;
  }
}

module.exports = reducer;

/***/ }),

/***/ 127:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 128:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 129:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 272:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(112);


/***/ }),

/***/ 52:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const MATCH = 'MATCH';

module.exports = {
  MATCH
};

/***/ }),

/***/ 53:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const PLAYLIST_ADD = 'PLAYLIST_ADD';
const PLAYLIST_REMOVE = 'PLAYLIST_REMOVE';
const PLAYLIST_EDIT = 'PLAYLIST_EDIT';

module.exports = {
  PLAYLIST_ADD,
  PLAYLIST_REMOVE,
  PLAYLIST_EDIT
};

/***/ }),

/***/ 54:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const SEARCHING = 'SEARCHING';

module.exports = {
  SEARCHING
};

/***/ }),

/***/ 55:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const ME = 'ME';
const TOKEN = 'TOKEN';

module.exports = {
  ME,
  TOKEN
};

/***/ }),

/***/ 56:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _redux = __webpack_require__(51);

var _reduxThunk = __webpack_require__(50);

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _playlist = __webpack_require__(124);

var _playlist2 = _interopRequireDefault(_playlist);

var _match = __webpack_require__(123);

var _match2 = _interopRequireDefault(_match);

var _user = __webpack_require__(126);

var _user2 = _interopRequireDefault(_user);

var _searching = __webpack_require__(125);

var _searching2 = _interopRequireDefault(_searching);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global window */

const store = (0, _redux.createStore)((0, _redux.combineReducers)({ searching: _searching2.default, user: _user2.default, playlist: _playlist2.default, match: _match2.default }), { user: { token: null, me: null }, searching: false, playlist: [], match: [] }, window.devToolsExtension ? (0, _redux.compose)((0, _redux.applyMiddleware)(_reduxThunk2.default), window.devToolsExtension()) : (0, _redux.applyMiddleware)(_reduxThunk2.default));

module.exports = store;

/***/ })

},[272]);