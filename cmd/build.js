const path = require('path');
const buildTool = require('../utils/build-tools.js');

let projectRoot = process.cwd();
let customConfig = {};

module.exports = () => {
  try {
    customConfig = require(path.resolve(projectRoot, './vue-scooter.config.js'));
  } catch (err) {
    console.warn('[Warning] vue-scooter.config.js not found in project root');
  }

  let buildConfig = customConfig.build || {};
  let buildSrc = path.resolve(projectRoot, customConfig.workspace || './src');
  let buildTarget = path.resolve(projectRoot, buildConfig.dist || './dist');
  buildTool.run(buildSrc, buildTarget);
}