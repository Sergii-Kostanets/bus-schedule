const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: './assets/js/script.js',
    plugins: [
      new Dotenv(),
    ]
};
