import merge from 'webpack-merge';

import common from './webpack.common';
import devConfig from './webpack.dev';
import productionConfig from './webpack.production';

const configMap = {
  dev: devConfig,
  production: productionConfig,
};

export default env => merge(common, configMap[env]);
