/**
 * given song duration in miliseconds
 * returns minute and second
 *
 * @type {Object}
 */
module.exports = (duration = 0) => {
  const minutes = Math.floor(duration / 60000);
  const seconds = Math.floor((duration - (minutes * 60000)) / 1000);

  return `${minutes}:${seconds < 0 ? `0${seconds}` : seconds}`;
};
