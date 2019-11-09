# Storybook

You can connect Storybook's Webpack Configuration to ours just by creating a `.storybook/webpack.config.js` file in your project and putting this inside:

```js
module.exports = require('horus-react-scripts/addons/storybook/webpack.config');
```

Alternatively, you can do the same by copy-pasting the code located in [`webpack.config.js`](./webpack.config.js) inside your project's `.storybook/webpack.config.js`, and after that, changing the path that points to the HRS' Webpack Configuration to `horus-react-scripts/config/webpack.config.entry`.

Remember to also follow the [Storybook for React Guide](https://storybook.js.org/docs/guides/guide-react/#manual-setup) to complete your setup.

**You don't need to add react, react-dom @babel/core or babel-loader as these are already handled by `horus-react-scripts`**

## After ejecting

If you decide to eject, you'll need to do two things:

1. First, copy-paste the configuration from this folder as we explained earlier
2. Then replace the path to your project's webpack config from `horus-react-scripts/config/webpack.config.entry` to something like `../config/webpack.config.entry` (may vary depeding on your project's folder structure)

Now everything should continue working just like before ejecting 🎉
