const fs = require('fs-extra');
const path = require('path');
const createHash = require('crypto').createHash;
const filewalker = require('filewalker');
//
let targetDir = '';
const hashLen = 8;
let started = Date.now();
let moduleDict = {}; // 模块字典，key为原始路径
const checkExts = ['html', 'vue', 'js', 'css']; // 遍历文件类型

// 模块数据结构
class FileModule {
  constructor(originPath) {
    this.originPath = originPath;
    this.hashPath = '';
    this.content = '';
    this.childModules = [];
    this.parentModules = [];
  }
}

/**
 * 返回模块对象，没有则创建
 */
function getModuleObj(originPath) {
  if (!moduleDict[originPath]) {
    let fileModule = new FileModule(originPath);
    moduleDict[originPath] = fileModule;
  }
  return moduleDict[originPath];
}

/**
 * 更新子模块路径
 */
function updateChildModulesPath(filePath) {
  let fileModule = getModuleObj(filePath);
  fileModule.content = fs.readFileSync(filePath, {
    encoding: 'utf-8',
  });
  let hasUnhashedChildModule = false;
  fileModule.content = fileModule.content.replace(
    /(?<=['"])[^'"]*?\.[\w-]+(?=['"])/g,
    ($0) => {
      let childPath = path.resolve(path.dirname(filePath), $0);

      let relativePath = $0;
      childModule = getModuleObj(childPath);
      if (childModule.hashPath) {
        // 移除即将更新的子模块路径
        fileModule.childModules.splice(
          fileModule.childModules.indexOf(relativePath, 1)
        );
        // 替换路径为hash路径
        return (
          path.dirname(relativePath) + '/' + path.basename(childModule.hashPath)
        );
      } else {
        if (fs.existsSync(childPath)) {
          if (fileModule.childModules.indexOf(relativePath) == -1) {
            fileModule.childModules.push(relativePath);
          }
          hasUnhashedChildModule = true;
          if (childModule.parentModules.indexOf(filePath) == -1) {
            childModule.parentModules.push(filePath);
          }
        } else {
          delete moduleDict[childPath];
        }
        return $0;
      }
    }
  );
  // 是否包含未hash子模块
  if (!hasUnhashedChildModule) {
    hashFile(filePath);
  }
}

/**
 * hash
 */
function hashFile(filePath) {
  let fileModule = moduleDict[filePath];
  if (checkExts.indexOf(path.extname(filePath).slice(1)) != -1) {
    fs.writeFileSync(filePath, fileModule.content);
  }
  if (filePath !== path.resolve(targetDir, 'index.html')) {
    let hash = createHash('md5');
    hash.update(fileModule.content);
    let hashValue = hash.digest('hex').substr(0, hashLen);
    let extname = path.extname(filePath);
    fileModule.hashPath = path.resolve(
      path.dirname(filePath),
      path.basename(filePath, extname) + '-' + hashValue + extname
    );

    fs.renameSync(filePath, fileModule.hashPath);

    fileModule.parentModules.forEach((parentPath) => {
      updateChildModulesPath(parentPath);
    });
  }
}

/**
 * 遍历文件
 */
function generateHashPath(targetDir) {
  return new Promise((resolve, reject) => {
    filewalker(targetDir)
      .on('file', function (p) {
        let originPath = path.resolve(targetDir, p);
        getModuleObj(originPath);
        if (checkExts.indexOf(path.extname(p).slice(1)) != -1) {
          updateChildModulesPath(originPath);
        } else {
          hashFile(originPath);
        }
      })
      .on('error', function (err) {
        console.error(err);
      })
      .on('done', function () {
        resolve();
      })
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
  targetDir = target;
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
