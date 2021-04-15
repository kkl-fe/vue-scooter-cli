// const getopts = require('getopts');
// let opts = getopts(process.argv);
// 读取项目根目录vue-scooter.config.js配置
const path = require('path');
const liveDevServer = require('live-dev-server');
const projectRoot = process.cwd();

module.exports = function() {
  try {
    const customConfig = require(path.resolve(projectRoot, './vue-scooter.config.js'));
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
  } catch (err) {
    console.error(err);
    console.warn('[Warning] vue-scooter.config.js not found in project root');
  }
}