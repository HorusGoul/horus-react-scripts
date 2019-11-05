import postcssConfig from './postcss.config';
import * as TypedCSSModules from '@nice-labs/typed-css-modules';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';

import commonConfig from './webpack.common';

const context = commonConfig.context;

// On windows, `context` uses `\` as path separator, we must
// replace it with `/` as it's what it's actually used in code.
const prependDataContext =
  process.platform === 'win32' ? context.replace(/\\/g, '') : context;

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
          modules: {
            mode: 'local',
            localIdentName:
              env === 'dev' ? '[local]__[hash:base64]' : '[hash:base64]',
          },
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
          prependData: `
            @import '${prependDataContext}/styles/variables.scss';
            @import '${prependDataContext}/styles/functions.scss';
            @import '${prependDataContext}/styles/responsive.scss';
            @import '${prependDataContext}/styles/transitions.scss';
          `,
          sourceMap,
          sassOptions: {
            includePaths: ['./ui', './components'],
          },
        },
      },
    ],
  };
}
