const spawn = require('cross-spawn');
const { resolve } = require('path');
const rimraf = require('rimraf');
const getPortSync = require('get-port-sync');

function createSandbox(name = 'sandbox') {
  const projectDir = resolve(__dirname, '..');
  const testAppName = 'test-app-' + name;
  const testAppDir = resolve(__dirname, testAppName);

  function createTestApp() {
    return spawn.sync(
      'npx',
      [
        'create-react-app',
        '--scripts-version',
        `file:${projectDir}`,
        testAppName,
      ],
      {
        cwd: __dirname,
      },
    );
  }

  function deleteTestApp(callback) {
    rimraf(resolve(__dirname, testAppName), callback);
  }

  function ejectTestApp() {
    return spawn.sync('yarn', ['eject'], { cwd: testAppDir });
  }

  return {
    createTestApp,
    deleteTestApp,
    testAppName,
    projectDir,
    testAppDir,
    ejectTestApp,
    testAppPort: getPortSync(),
  };
}

module.exports = {
  createSandbox,
};
