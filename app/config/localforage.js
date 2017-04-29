import localforage from 'localforage';

const config = {
  NAME: 'Schwifty',
  STORE_NAME: 'schwifty',
  DESCRIPTION: 'Get Schwifty!',
  LF_STORE: {
    USER: 'USER',
  },
};

localforage.config({
  name: config.NAME,
  storeName: config.STORE_NAME,
  description: config.DESCRIPTION,
});

module.exports = config;
