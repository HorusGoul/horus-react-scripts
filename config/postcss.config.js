import autoprefixer from 'autoprefixer';
import pxtorem from 'postcss-pxtorem';

export default {
  plugins: () => [
    autoprefixer(),
    pxtorem({
      propList: ['*'],
    }),
  ],
};
