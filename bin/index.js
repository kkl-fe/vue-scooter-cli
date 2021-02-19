#!/usr/bin/env node
const path = require('path');
const getopts = require('getopts');
const fs = require('fs');
let opts = getopts(process.argv);
// 读取项目根目录vue-scooter.config.js配置
let projectRoot = process.cwd();
let customConfig = {};
console.log(projectRoot)
let customConfigPath = path.resolve(projectRoot, './vue-scooter.config.js');
if (!fs.existsSync(customConfigPath)) {
  console.warn('[Warning] vue-scooter.config.js not found in project root');
} else {
  customConfig = require(customConfigPath);
}

if (opts.build) {
  const buildTool = require('../build-tool');

  let buildConfig = customConfig.build || {};
  let buildSrc = path.resolve(projectRoot, customConfig.workspace || './src');
  let buildTarget = path.resolve(projectRoot, buildConfig.dist || './dist');
  buildTool.run(buildSrc, buildTarget);
}

if (opts.dev) {
  const liveDevServer = require('live-dev-server');

  liveDevServer(
    Object.assign({}, customConfig.devServer, {
      workspace: customConfig.workspace || './src',
      inject: function (event) {
        // ws message event
        let msgData = event.data;
        if (msgData.indexOf('watcher') < 0) return;
        let {
          data: { ext, path },
        } = JSON.parse(msgData);
        switch (ext) {
          case '.vue':
            window.VueScooter.reload(path);
            break;
          default:
            window.location.reload();
        }
      },
    })
  );
}
