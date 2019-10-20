import { resolve } from 'path';
import webpack from 'webpack';

import WebpackCleanupPlugin from 'webpack-cleanup-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { projectDir } from './common';

export default {
  context: resolve(projectDir, 'src'),

  entry: ['./index.tsx'],

  output: {
    path: resolve(projectDir, 'build'),
    publicPath: '/',
    filename: 'bundle.js',
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.scss', '.css', '.html'],
    alias: {
      '@': resolve(projectDir, 'src'),
    },
  },

  module: {
    rules: [
      {
        test: /\.svg$/,
        issuer: {
          test: /\.(scss|css)$/,
        },
        use: ['url-loader'],
      },
      {
        test: /\.svg$/,
        issuer: {
          test: /\.(jsx|js|tsx|ts|mdx)$/,
        },
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgoConfig: {
                plugins: {
                  removeViewBox: false,
                },
              },
            },
          },
          'file-loader',
        ],
      },
      {
        test: /\.(gif|png|jpe?g)$/i,
        loaders: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            query: {
              mozjpeg: {
                progressive: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(woff|eot|otf|woff2|ttf)$/,
        loaders: ['file-loader'],
      },
    ],
  },

  plugins: [
    new WebpackCleanupPlugin(),
    new HtmlWebpackPlugin({
      template: resolve(projectDir, 'public/index.html'),
    }),
    new webpack.NamedModulesPlugin(),
    new CopyWebpackPlugin([
      { from: resolve(projectDir, 'public'), ignore: ['index.html'] },
    ]),
  ],
};
