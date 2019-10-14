#!/usr/bin/env node
const spawn = require("cross-spawn");

const [task] = process.argv.slice(2);
const webpackConfig = require.resolve(`../config/webpack.config.babel.js`);

let result;

switch (task) {
  case "dev": {
    result = spawnWebpack("dev");
    break;
  }
  case "build": {
    result = spawnWebpack("production");
    break;
  }
}

if (result.signal) {
  process.exit(1);
}

process.exit(result.status);

function spawnWebpack(env) {
  const program = env === "dev" ? "webpack-dev-server" : "webpack";

  return spawn.sync(
    program,
    ["--config", webpackConfig, "--progress", "--env", env],
    {
      stdio: "inherit"
    }
  );
}
