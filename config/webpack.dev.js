import webpack from 'webpack';
import commonConfig from './webpack.common';
import createStyleRule from './style-rule';
import babelOptions from './babel.config';
import { getReactAppVars } from './env';

const PORT = parseInt(process.env.PORT, 10) || 3000;

export default {
  entry: [
    `webpack-dev-server/client?http://localhost:${PORT}`,
    'webpack/hot/only-dev-server',
  ],

  mode: 'development',

  devtool: 'inline-source-map',

  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },

    symlinks: false,
  },

  module: {
    rules: [
      createStyleRule('dev'),
      {
        test: /\.(j|t)sx?/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              ...babelOptions,
            },
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
            },
          },
        ],
        include: commonConfig.context,
      },
    ],
  },

  devServer: {
    hot: true,
    contentBase: commonConfig.output.path,
    publicPath: '/',
    port: PORT,
    historyApiFallback: true,
    disableHostCheck: true,
    host: '0.0.0.0',
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        ...getReactAppVars(),
      },
    }),
  ],
};
