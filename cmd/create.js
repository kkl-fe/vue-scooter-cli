const fs = require('fs-extra')
const toast = require('../utils/toast')
const QoaExtra = require('qoa-extra')
const options = require('../config/options')
const templateHandle = require('../utils/temlpate-handle')
const tools = require('../utils/tools')

module.exports = async (source, cmd) => {
  const path = `${process.cwd()}/${source}`
  if (fs.existsSync(path)) {
    toast.error('The current directory already exists in the folder')
  } else {
    const prompt = []
    let packageManagerRes = []
    Object.values(options).forEach(item => {
      if (item.handle === 'packageManager') {
        packageManagerRes = tools.checkPackageManager()
        if (packageManagerRes.length === 2) prompt.push(item)
      } else {
        prompt.push(item)
      }
    })
    QoaExtra.prompt(prompt).then(res => {
      if (packageManagerRes.length === 1) res.packageManager = packageManagerRes[0]
      if (packageManagerRes.length === 0) {
        toast.error('you should install package manager first. npm or yarn.')
        process.exit(1)
      }
      templateHandle(res, source)
    })
  }
}