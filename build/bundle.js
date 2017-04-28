webpackJsonp([0],{

/***/ 13:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 29:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(8);


/***/ }),

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(13);

console.log('HERE');

// import hashParams from './hashParams.js';
// import isAuthorized from './isAuthorized.js';

// console.log('here?');

// (async () => {
//   const clientID = '8ad7a6f78ef9487a92183ea076446e27';
//   const redirectURI = 'http://schwifty.io';
//   const state = `${Date.now()}`;
//   const scope = 'playlist-modify-public';
//   const url = `https://accounts.spotify.com/authorize?response_type=token&client_id=${encodeURIComponent(clientID)}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectURI)}&state=${encodeURIComponent(state)}`;

//   const HASH_PARAMS = hashParams(window.location.hash);

//   const LF_AUTH_KEY = 'AUTH_KEY';

//   localforage.config({
//     name: 'Schwifty',
//     storeName: 'schwifty',
//     version: '1.0',
//     description: 'Get Schwifty',
//   });

//   try {
//     const lfAppState = await localforage.getItem(LF_AUTH_KEY);

//     // no auth key found in store...
//     if (lfAppState === null) {
//       if (isAuthorized(HASH_PARAMS)) {
//         localforage.setItem(LF_AUTH_KEY, Object.assign({}, HASH_PARAMS, { issued_on: Date.now() }));
//         console.log('LOGGED IN');
//       }
//     } else if (isAuthorized(lfAppState)) {
//       const user = await fetch('https://api.spotify.com/v1/me', {
//         headers: {
//           Authorization: `${lfAppState.token_type} ${lfAppState.access_token}`,
//         },
//       }).then(response => response.json());

//       const playlist = await fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`, {
//         method: 'POST',
//         headers: {
//           Authorization: `${lfAppState.token_type} ${lfAppState.access_token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ name: 'DUDE', description: 'DUDE description' }),
//       }).then(response => response.json());

//       console.log(playlist);
//     }
//   } catch (e) {
//     console.log(e);
//   }

//   // https://api.spotify.com/v1/me
//   // 'Authorization': 'Bearer ' + access_token
//   // console.log(window.location.hash, window.location.hash.includes('#access_token'));

//   document.querySelector('#login').addEventListener('click', () => {
//     window.location = url;
//   }, false);
// })();
/* eslint no-console: 0 */
/* global window, document, localforage, fetch */

/***/ })

},[29]);