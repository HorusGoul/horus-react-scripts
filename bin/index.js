#!/usr/bin/env node
const spawn = require("cross-spawn");
const { resolve } = require("path");

const [task] = process.argv.slice(2);
const webpackConfig = resolve(__dirname, `../config/webpack.config.entry.js`);

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
