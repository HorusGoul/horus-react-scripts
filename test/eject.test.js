const spawn = require('cross-spawn');
const { createSandbox } = require('./common');
const {
  deleteTestApp,
  createTestApp,
  testAppDir,
  ejectTestApp,
  testAppPort,
} = createSandbox('eject');

jest.setTimeout(50000);

describe('Eject', () => {
  beforeAll(done => {
    deleteTestApp(() => {
      createTestApp();
      done();
    });
  });

  afterAll(done => {
    deleteTestApp(done);
  });

  test('it should eject an app', () => {
    const ejectResult = ejectTestApp();
    expect(ejectResult.status).toBe(0);
  });

  test('it should run the app', async done => {
    expect.assertions(2);
    const start = spawn.spawn('yarn', ['start'], {
      cwd: testAppDir,
      env: {
        PORT: await testAppPort,
      },
      detached: true,
    });

    start.stdout.on('data', data => {
      const success = data.includes('Compiled successfully.');
      const failure = data.includes('Command failed with exit code');

      if (success || failure) {
        expect(success).toBe(true);
        expect(failure).toBe(false);
        start.kill(-start.pid);
      }
    });

    start.on('exit', () => {
      done();
    });
  });

  test('it should build the app', () => {
    const buildResult = spawn.sync('yarn', ['build'], { cwd: testAppDir });
    expect(buildResult.status).toBe(0);
  });

  test('it should test the app', () => {
    const testResult = spawn.sync('yarn', ['test'], { cwd: testAppDir });
    expect(testResult.status).toBe(0);
  });
});
