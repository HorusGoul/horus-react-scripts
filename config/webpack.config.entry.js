const dotenvConfig = require('dotenv');
dotenvConfig.config();

const config = require('./babel.config');

require('@babel/register')({
  ...config,
  ignore: [/\/node_modules\/(?!horus-react-scripts)/],
});

module.exports = require('./webpack.config.babel');
