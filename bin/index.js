#!/usr/bin/env node
const path = require('path');
const buildTool = require('../build-tool');
const getopts = require('getopts');
const liveDevServer = require('live-dev-server');
let opts = getopts(process.argv);
// 读取项目根目录vue-scooter.config.js配置
let projectRoot = process.cwd();
let customConfig = require(path.resolve(
  projectRoot,
  './vue-scooter.config.js'
));

if (opts.build) {
  let buildConfig = customConfig.build;
  let buildSrc = path.resolve(projectRoot, customConfig.workspace || './src');
  let buildTarget = path.resolve(projectRoot, buildConfig.dist);
  buildTool.run(buildSrc, buildTarget);
}
if (opts.dev) {
  console.log('dev');
  liveDevServer(
    Object.assign(customConfig.devServer, {
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
