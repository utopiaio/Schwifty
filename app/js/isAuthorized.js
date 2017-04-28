/**
 * given state, checks whether we have `access_token`
 * and it's still valid
 *
 * @param  {Object} store
 * @return {Bool}
 */
export default (lfState) => {
  if (Object.prototype.hasOwnProperty.call(lfState, 'access_token')) {
    // if (Date.now() - lfState.issued_on > 360000) {
    //   return false;
    // }

    return true;
  }

  return false;
};
