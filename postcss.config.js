module.exports = {
  plugins: [
    require('precss'),
    require('autoprefixer')({
      browsers: ['iOS >= 8'],
    }),
  ],
};
