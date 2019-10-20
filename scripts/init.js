// @remove-file-on-eject

process.on('unhandledRejection', err => {
  throw err;
});

const copy = require('copy-template-dir');
const { resolve } = require('path');
const spawn = require('cross-spawn');
const commandExists = require('command-exists');

const templatesPath = resolve(__dirname, '../templates');
const packageJson = require(resolve(__dirname, '../package.json'));

const scriptsPath = resolve(process.env.HORUS_RS_LOCATION || './');

module.exports = async function(
  appPath,
  appName,
  verbose,
  originalDirectory,
  template,
) {
  template = template || 'default';

  await new Promise((onResolve, onReject) =>
    copy(
      resolve(templatesPath, template),
      appPath,
      {
        appName,
        scriptsName: packageJson.name,
        scriptsVersion: scriptsPath
          ? `file:${scriptsPath}`
          : `^${packageJson.version}`,
      },
      (err, createdFiles) => (err ? onReject(err) : onResolve(createdFiles)),
    ),
  );

  if (commandExists.sync('git')) {
    spawn.sync('git', ['init', appPath], {
      stdio: 'inherit',
    });

    // Install husky git hooks
    spawn.sync(
      'node',
      [resolve(appPath, 'node_modules', 'husky', 'husky.js'), 'install'],
      {
        cwd: appPath,
        stdio: 'inherit',
      },
    );
  }

  if (scriptsPath) {
    spawn.sync('yarn', ['link', packageJson.name], {
      cwd: appPath,
      stdio: 'ignore',
    });
  }

  process.exit(0);
};
