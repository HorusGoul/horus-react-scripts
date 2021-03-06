const spawn = require('cross-spawn');
const { createSandbox } = require('./common');
const {
  deleteTestApp,
  createTestApp,
  testAppDir,
  ejectTestApp,
  getTestAppPort,
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
        PORT: await getTestAppPort(),
      },
      detached: true,
    });

    start.stdout.on('data', data => {
      const dataString = data.toString();
      const success = dataString.includes('Compiled successfully.');
      const failure = dataString.includes('Command failed with exit code');

      if (success || failure) {
        expect(success).toBe(true);
        expect(failure).toBe(false);
        process.kill(-start.pid);
      }
    });

    start.on('disconnect', () => done());
    start.on('exit', () => done());
    start.on('close', () => done());
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
