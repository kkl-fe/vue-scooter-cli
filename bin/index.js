#!/usr/bin/env node
console.log(process.npm_config_build, 111);
const path = require('path');
const buildTool = require('../build-tool');
// 读取项目根目录vue-scooter.config.js配置
let workspace = process.cwd();
let customConfig = require(path.resolve(workspace, './vue-scooter.config.js'));
let buildConfig = customConfig.build;
let buildSrc = path.resolve(workspace, buildConfig.src);
let buildTarget = path.resolve(workspace, buildConfig.dist);
buildTool.run(buildSrc, buildTarget);
