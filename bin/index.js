#!/usr/bin/env node
const spawn = require('cross-spawn');
const { resolve } = require('path');
const fs = require('fs');
const copyDir = require('copy-dir');

const [task] = process.argv.slice(2);

const projectDir = resolve(process.cwd());
const configDir = resolve(__dirname, '../config');

const webpackConfig = resolve(configDir, `./webpack.config.entry.js`);

let result;

switch (task) {
  case 'dev': {
    result = spawnWebpack('dev');
    break;
  }
  case 'build': {
    process.env.NODE_ENV = 'production';
    result = spawnWebpack('production');
    break;
  }
  case 'eject': {
    copyDir.sync(configDir, resolve(projectDir, 'config'));

    const packageJsonPath = resolve(projectDir, './package.json');
    const internalPackageJson = require(resolve(__dirname, '../package.json'));
    const packageJson = require(packageJsonPath);

    // Remove scripts dependency
    if (packageJson.dependencies[internalPackageJson.name]) {
      delete packageJson.dependencies[internalPackageJson.name];
    }

    // Move scripts dependencies to the user app
    const scriptsDependencies = [
      'copy-dir',
      'copy-template-dir',
      'cross-spawn',
      'command-exists',
    ];

    scriptsDependencies.forEach(dep => {
      if (internalPackageJson.dependencies[dep]) {
        delete internalPackageJson.dependencies[dep];
      }
    });

    Object.assign(packageJson.dependencies, internalPackageJson.dependencies);

    // Replace the 'start' and 'build' scripts
    Object.assign(packageJson.scripts, {
      start: `webpack-dev-server --config ./config/webpack.config.entry.js --progress --env=dev`,
      build: `cross-env NODE_ENV=production webpack --config ./config/webpack.config.entry.js --progress --env=production`,
    });

    // Remove the 'eject' script
    if (packageJson.scripts.eject) {
      delete packageJson.scripts.eject;
    }

    // Save the changes
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // Run yarn to fix the dependencies
    result = spawn.sync('yarn', ['--cwd', projectDir], {
      stdio: 'inherit',
    });
  }
}

if (result && result.signal) {
  process.exit(1);
}

process.exit(result ? result.status : 0);

function spawnWebpack(env) {
  const program = env === 'dev' ? 'webpack-dev-server' : 'webpack';

  return spawn.sync(
    program,
    ['--config', webpackConfig, '--progress', '--env', env],
    {
      stdio: 'inherit',
    },
  );
}
