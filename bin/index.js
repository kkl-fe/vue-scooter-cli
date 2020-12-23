#!/usr/bin/env node
const path = require('path');
const buildTool = require('../build-tool');
const getopts = require('getopts');
let opts = getopts(process.argv);
// 读取项目根目录vue-scooter.config.js配置
let workspace = process.cwd();
let customConfig = require(path.resolve(workspace, './vue-scooter.config.js'));
if (opts.build) {
  let buildConfig = customConfig.build;
  let buildSrc = path.resolve(workspace, buildConfig.src);
  let buildTarget = path.resolve(workspace, buildConfig.dist);
  buildTool.run(buildSrc, buildTarget);
}
if(opts.dev){
    console.log('dev')
}