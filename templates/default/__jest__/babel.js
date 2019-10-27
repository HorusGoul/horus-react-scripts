const { createTransformer } = require('babel-jest');
const { resolve } = require('path');

const config = require(process.env.RS_BABEL_CONFIG_LOCATION ||
  resolve(__dirname, '../config/babel.config.js'));

module.exports = createTransformer(config);
