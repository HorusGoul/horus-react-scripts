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

const rsLocation = process.env.HORUS_RS_LOCATION;
const scriptsPath = rsLocation ? resolve(rsLocation) : null;

module.exports = async function(
  appPath,
  appName,
  verbose,
  originalDirectory,
  template,
) {
  template = template || 'default';

  const scriptsName = packageJson.name;
  const scriptsVersion = scriptsPath
    ? `file:${scriptsPath}`
    : `^${packageJson.version}`;

  await new Promise((onResolve, onReject) =>
    copy(
      resolve(templatesPath, template),
      appPath,
      {
        appName,
        scriptsName,
        scriptsVersion,
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
  } else {
    spawn.sync('yarn', ['add', `${scriptsName}@^${scriptsVersion}`], {
      cwd: appPath,
      stdio: 'ignore',
    });
  }

  process.exit(0);
};
