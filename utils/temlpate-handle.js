const path = require('path')
const childProcess = require('child_process')
const fs = require('fs-extra')
const toast = require('./toast')
const simplet = require('simplet')
const tools = require('./tools')
const options = require('../config/options')
const packages = require('../config/packages')
const engine = simplet()
const cmd = require('../config/command')

let projectPath = ''
const library = {
  vueRouter() {
    fs.copySync(`${projectPath}/library/vue-router`, `${projectPath}/src`)
  },
  vuex() {
    fs.copySync(`${projectPath}/library/vuex`, `${projectPath}/src`)
  }
}

function outputFile(fromUrl, toUrl, need) {
  let str = fs.readFileSync(fromUrl, { encoding: 'utf8' })
  engine.template(fromUrl, str)
  let strRes = engine.render(fromUrl, need)
  strRes = tools.removeBlankLines(strRes)
  fs.outputFileSync(toUrl, strRes)
}

function install(source, packages, packageManager) {
  let dependencies, devDependencies
  if (packages.dependencies.length) {
    let packageNameStr = packages.dependencies.join(' ')
    dependencies = childProcessCmd(packageManager.install(packageNameStr, '--save'), { cwd: `${process.cwd()}/${source}` })
  }

  if (packages.devDependencies.length) {
    let packageNameStr = packages.devDependencies.join(' ')
    devDependencies = childProcessCmd(packageManager.install(packageNameStr, '--save-dev'), { cwd: `${process.cwd()}/${source}` })
  }
  return Promise.all([dependencies, devDependencies])
}

function childProcessCmd(commandStr, ops) {
  return new Promise((resolve, reject) => {
    childProcess.exec(commandStr, ops, (error) => {
      if (error) {
        reject(error)
        toast.error(error)
      }
      resolve()
    })
  })
}

module.exports = async function (answer, source) {
  let pkgCmd = cmd[answer.packageManager]
  projectPath = `${process.cwd()}/${source}`
  toast.info('update vue-scooter-template latest version...')
  let version = JSON.parse(childProcess.execSync(pkgCmd.version('vue-scooter-template')).toString())
  childProcess.execSync(pkgCmd.install(`vue-scooter-template@${version.version || version.data}`), { cwd: path.join(__dirname, '../'), stdio: ['ignore'] })
  toast.info('update completely...')
  fs.copySync(path.join(__dirname, '../node_modules/vue-scooter-template'), `${projectPath}`)
  let answerRes = {}
  options.library.menu.forEach(item => {
    item = tools.libKeyNormalize(item)
    answerRes[item] = false
  })
  answer.library.forEach(item => {
    item = tools.libKeyNormalize(item)
    answerRes[item] = true
    if (answerRes[item]) library[item] && library[item]()
  })

  outputFile(`${projectPath}/library/index.ejs`, `${projectPath}/src/index.js`, answerRes)
  outputFile(`${projectPath}/library/page.ejs`, `${projectPath}/src/index.html`, answerRes)
  outputFile(`${projectPath}/library/app.ejs`, `${projectPath}/src/app.vue`, answerRes)
  outputFile(`${projectPath}/library/package.ejs`, `${projectPath}/package.json`, { appName: source })
  toast.info('install packages...')
  await install(source, packages, pkgCmd)
  toast.info('install packages completely...')
  fs.remove(projectPath + '/library')
  fs.remove(projectPath + '/LICENSE')
  toast.success(`the ${source} is created`)
}