// 模块数据结构
class Module {
  constructor(originPath) {
    this.originPath = originPath;
    this.hashPath = '';
    this.content = '';
    this.childModules = [];
    this.parentModules = [];
  }
}
let moduleDict = {}; // 模块字典，key为原始路径
const checkExts = ['html', 'vue', 'js', 'css']; // 遍历文件类型

/**
 * 返回模块对象，没有则创建
 */
function getModuleObj(originPath) {
  if (!moduleDictp[originPath]) {
    let module = new Module(originPath);
    moduleDict[originPath] = module;
  }
}
/**
 * 遍历文件
 */
const filewalker = require('filewalker');
function generateHashPath(target) {
  return new Promise((resolve, reject) => {
    filewalker('.')
      .on('file', function (p, s) {
        console.log('file: %s, %d bytes', p, s.size);
      })
      .on('error', function (err) {
        console.error(err);
      })
      .on('done', function () {})
      .walk();
  });
}

exports.run = async (src, target) => {
  try {
    if (fs.existsSync(target)) {
      fs.removeSync(target);
    }
    fs.mkdirpSync(target);
  } catch (err) {
    console.log(err);
  }
  // copy src files to target dir
  try {
    fs.copySync(src, target);
    await generateHashPath(target);
    let duration = Date.now() - started;
    console.log('%d ms, done!', duration);
  } catch (err) {
    console.log(err);
  }
};
