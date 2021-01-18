const path = require('path')
const fs = require('fs-extra')
const toast = require('./toast')
const template = require('art-template')

let projectPath = ''
const library = {
  Vuex() {
    try {
      const copyPath = path.join(__dirname, '../node_modules/vue-scooter-template')
      fs.copySync(copyPath, `${projectPath}`)
      fs.copySync(`${projectPath}/library/Vuex`, `${projectPath}/src`)
    } catch(e) {
      toast.error(`Files copy error: ${e}`)
    }
  }
}

function removeBlankLines(str) {
  return str.replace(/(\n[\s\t]*\r*\n)/g, '\n').replace(/^[\n\r\n\t]*|[\n\r\n\t]*$/g, '')
}

module.exports = function (answer, source) {
  projectPath = `${process.cwd()}/${source}`
  answer.library.forEach(item => {
    library[item] && library[item]()
  })

  let templateStr = template(`${projectPath}/library/index.art`, { Vuex: answer.library.indexOf('Vuex') > -1 })
  templateStr = removeBlankLines(templateStr)
  
  fs.outputFileSync(`${projectPath}/src/index.js`, templateStr)
  fs.remove(projectPath + '/library')
  toast.success(`the ${source} is created`)
}