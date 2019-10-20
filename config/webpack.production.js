import webpack from 'webpack';
import commonConfig from './webpack.common';
import createStyleRule from './style-rule';
import ChunkHashPlugin from 'webpack-chunk-hash';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { resolve } from 'path';
import babelOptions from './babel.config';
import WorkboxPlugin from 'workbox-webpack-plugin';
import { getReactAppVars } from './env';

const context = commonConfig.context;
const hashDigestLength = 8;

export default {
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[chunkhash].js',
    hashDigestLength,
  },

  stats: 'errors-warnings',

  mode: 'production',

  devtool: 'nosources-source-map',

  module: {
    rules: [
      createStyleRule('production'),
      {
        test: /\.(j|t)sx?/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: resolve(
                context,
                '../node_modules/.cache/webpack-babel-loader',
              ),
              ...babelOptions,
            },
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        include: commonConfig.context,
      },
    ],
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        sourceMap: true,
        cache: resolve(context, '../node_modules/.cache/webpack-terser-cache'),
        terserOptions: {
          ie8: false,
          // eslint-disable-next-line @typescript-eslint/camelcase
          keep_fnames: true,
        },
      }),
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[chunkhash].css',
      allChunks: true,
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        ...getReactAppVars(),
      },
    }),
    new ChunkHashPlugin({ algorithm: 'md5' }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: resolve(context, '../bundle-report.html'),
      openAnalyzer: true,
    }),
    new ForkTsCheckerWebpackPlugin({
      tsconfig: resolve(context, '../tsconfig.json'),
      workers: ForkTsCheckerWebpackPlugin.TWO_CPUS_FREE,
      useTypescriptIncrementalApi: false,
    }),
    new WorkboxPlugin.InjectManifest({
      swSrc: resolve(context, './workers/service-worker.ts'),
      swDest: resolve(commonConfig.output.path, './service-worker.js'),
    }),
  ],
};
