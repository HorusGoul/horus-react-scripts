const spawn = require('cross-spawn');
const { createSandbox } = require('./common');
const { deleteTestApp, createTestApp, testAppDir, testAppPort } = createSandbox(
  'cli',
);

jest.setTimeout(50000);

describe('CLI', () => {
  beforeAll(done => {
    deleteTestApp(done);
  });

  afterAll(done => {
    deleteTestApp(done);
  });

  test('it should create an app', () => {
    const result = createTestApp();

    expect(result.status).toBe(0);
  });

  test('it should run the app', async done => {
    expect.assertions(2);
    const start = spawn.spawn('yarn', ['start'], {
      cwd: testAppDir,
      env: {
        PORT: await testAppPort,
      },
    });

    start.stdout.on('data', data => {
      const success = data.includes('Compiled successfully.');
      const failure = data.includes('Command failed with exit code');

      if (success || failure) {
        expect(success).toBe(true);
        expect(failure).toBe(false);
        start.kill();
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
