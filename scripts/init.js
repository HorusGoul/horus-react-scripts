// @remove-file-on-eject

process.on('unhandledRejection', err => {
  throw err;
});

const copy = require('copy-template-dir');
const { resolve } = require('path');
const spawn = require('cross-spawn');

const templatesPath = resolve(__dirname, '../templates');
const packageJson = require(resolve(__dirname, '../package.json'));

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
        scriptsVersion: 'file:../',
      },
      (err, createdFiles) => (err ? onReject(err) : onResolve(createdFiles)),
    ),
  );

  const result = spawn.sync('yarn', ['--cwd', appPath], {
    stdio: 'inherit',
  });

  if (result.signal) {
    process.exit(1);
  }

  process.exit(result.status);
};
