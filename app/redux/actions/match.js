import { MATCH } from 'App/redux/constants/match';

function match(payload) {
  return {
    type: MATCH,
    payload,
  };
}

module.exports = {
  match,
};
