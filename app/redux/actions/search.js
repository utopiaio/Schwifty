/* global fetch */
/* eslint no-console: 0 */

import _ from 'lodash';

import store from 'App/redux/store';
import { asyncSearching } from 'App/redux/actions/searching';

function search(q) {
  return new Promise(async (resolve, reject) => {
    const { user } = store.getState();

    const words = q.replace(/ {2}|\?|,|!/g, '').split(/!| |\?/).map(term => term.trim());

    await store.dispatch(asyncSearching(true));
    Promise.all(words.map(word => fetch(`https://api.spotify.com/v1/search?limit=50&q="${encodeURIComponent(word)}"&type=track`, {
      headers: {
        Authorization: `${user.token.token_type} ${user.token.access_token}`,
      },
    }).then(response => response.json()))).then((results) => {
      store.dispatch(asyncSearching(false));

      const error = results.filter(result => Object.prototype.hasOwnProperty.call(result, 'error'));
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
      const starterTracks = results.map((result, index) => result.tracks.items.filter(track => track.name.toLowerCase().startsWith(words[index].toLowerCase())));
      console.log('starter:', starterTracks);

      // step 2
      // going through the rest of the words and filtering out tracks that include the word
      // because Spotify sometimes returns album matches
      const includeTracks = results.map((result, index) => result.tracks.items.filter(track => track.name.toLowerCase().includes(words[index].toLowerCase())));
      console.log('include:', includeTracks);

      // step 3
      // building 100% match list
      // this will be used to ID which words should be concatenated
      const fullMatchs = results.map((result, index) => result.tracks.items.filter(track => track.name.toLowerCase() === words[index].toLowerCase())[0] || null);
      console.log('full match:', fullMatchs);

      // step 4
      // checking for rare case of 100% match
      if (fullMatchs.filter(match => match === null).length === 0) {
        console.log('we have a full match! 🙌🏿');
        resolve(fullMatchs);
        return;
      }

      // step 5
      // concatenation begins...far far away...DONKEY!
      // non-full match indexes will be replaced with starter and includes
      const starterIncludeList = fullMatchs.map((fullMatch, index) => {
        if (fullMatch !== null) {
          return fullMatch;
        }

        return starterTracks[index] || includeTracks[index];
      });
      console.log('concat:', starterIncludeList);

      // step 6
      // going through arrays and criss-crossing to find neighborhood match
      // CRISS-CROSS!!!
      const crissCross = starterIncludeList.map((list, index) => {
        if (Array.isArray(list) === false) {
          return list;
        }

        // looking +- one index and looking for include
        const wordPrevious = [words[index - 1] || '', words[index]].join(' ').toLowerCase();
        const wordNext = [words[index], words[index + 1] || ''].join(' ').toLowerCase();

        return {
          previous: words[index - 1] ? list.filter(track => track.name.toLowerCase().includes(wordPrevious)) : [],
          self: list,
          next: words[index + 1] ? list.filter(track => track.name.toLowerCase().includes(wordNext)) : [],
        };
      });

      console.log('criss-cross:', crissCross);

      // step 7
      // criss-crossed list ordering
      const crissCrossSorted = crissCross.map((list, index) => {
        if (Object.prototype.hasOwnProperty.call(list, 'next') === false) {
          return list;
        }

        return {
          previous: _.reverse(_.sortBy(list.previous, [item => item.name.length - (words[index - 1] || 0)]))[0] || null,
          self: _.sortBy(list.self, [item => item.name.length - words[index].length])[0] || null,
          next: _.reverse(_.sortBy(list.next, [item => item.name.length - (words[index + 1] || 0)]))[0] || null,
        };
      });

      console.log('criss-cross sorted:', crissCrossSorted);

      // step 8
      // decision maker 😱
      // full-matches are kept unless previous or next criss-cross is a full match
      // this is the part where you fix your face --- final is going to be mutated
      const final = [];

      crissCrossSorted.forEach((item, index) => {
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

      console.log('final:', final.filter(item => item !== null));
      resolve(final.filter(item => item !== null));
    }, (err) => {
      store.dispatch(asyncSearching(false));
      console.error(err);
      reject(err);
    });
  });
}

module.exports = {
  search,
};
