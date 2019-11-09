const createWebpackConfig = require('../../config/webpack.config.entry')
  .default;

module.exports = async ({ config, mode }) => {
  const projectConfig = createWebpackConfig(
    mode === 'PRODUCTION' ? 'production' : 'dev',
  );

  const excludedPlugins = config.plugins.map(plugin => plugin.constructor.name);

  return {
    ...config,
    context: projectConfig.context,
    resolve: projectConfig.resolve,
    module: projectConfig.module,
    plugins: [
      ...config.plugins,
      ...projectConfig.plugins.filter(plugin => {
        return !excludedPlugins.includes(plugin.constructor.name);
      }),
    ],
  };
};
