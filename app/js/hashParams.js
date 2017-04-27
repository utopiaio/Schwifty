export default (hash = '') => {
  const hashParams = {};
  const regX = /([^&;=]+)=?([^&;]*)/g;
  const query = hash.substring(1);
  let e = false;

  while (e = regX.exec(query)) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }

  return hashParams;
};
