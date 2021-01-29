const fs = require('fs-extra')
const toast = require('../utils/toast')
const QoaExtra = require('qoa-extra')
const options = require('../utils/options')
const templateHandle = require('../utils/temlpate-handle')

module.exports = async (source, cmd) => {
  const path = `${process.cwd()}/${source}`
  if(fs.existsSync(path)) {
    toast.error('The current directory already exists in the folder')
  } else {
    const prompt = []
    Object.values(options).forEach(item => {
      prompt.push(item)
    })
    QoaExtra.prompt(prompt).then(res => {
      templateHandle(res, source)
    })
  }
} 