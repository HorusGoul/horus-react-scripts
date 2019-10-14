import postcssConfig from './postcss.config';
import * as TypedCSSModules from '@nice-labs/typed-css-modules';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';

import commonConfig from './webpack.common';

const context = commonConfig.context;

export default function createStyleRule(env = 'dev') {
  const isProduction = env === 'production';

  const preCSSLoader = isProduction
    ? MiniCSSExtractPlugin.loader
    : 'style-loader';

  const sourceMap = !isProduction;

  return {
    test: /\.(scss|css)$/,
    use: [
      preCSSLoader,
      {
        loader: 'css-loader',
        options: {
          sourceMap,
          modules: true,
          localsConvention: 'camelCase',
        },
      },
      {
        loader: TypedCSSModules.loader,
        options: {
          mode: 'local',
          camelCase: true,
        },
      },
      {
        loader: 'postcss-loader',
        options: { ...postcssConfig, sourceMap },
      },
      {
        loader: 'sass-loader',
        options: {
          data: `
            @import '${context}/styles/variables.scss';
            @import '${context}/styles/functions.scss';
            @import '${context}/styles/responsive.scss';
            @import '${context}/styles/transitions.scss';
          `,
          includePaths: ['./ui'],
          sourceMap,
        },
      },
    ],
  };
}
