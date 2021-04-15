const path = require('path')
const fs = require('fs-extra')
const toast = require('./toast')
const simplet = require('simplet')
const tools = require('./tools')
const options = require('./options')
const engine = simplet()

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

module.exports = function (answer, source) {
  projectPath = `${process.cwd()}/${source}`
  fs.copySync(path.join(__dirname, '../node_modules/vue-scooter-template'), `${projectPath}`)
  let answerRes = {}
  options.library.menu.forEach(item => {
    item = tools.libKeyNormalize(item)
    answerRes[item] = false
  })
  answer.library.forEach(item => {
    item = tools.libKeyNormalize(item)
    answerRes[item] = true
    if(answerRes[item]) library[item] && library[item]()
  })

  outputFile(`${projectPath}/library/index.ejs`, `${projectPath}/src/index.js`, answerRes)
  outputFile(`${projectPath}/library/page.ejs`, `${projectPath}/src/index.html`, answerRes)

  fs.remove(projectPath + '/library')
  toast.success(`the ${source} is created`)
}