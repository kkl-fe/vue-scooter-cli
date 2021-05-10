const childProcess = require('child_process')

module.exports = {
  removeBlankLines(str) {
    return str.replace(/(\n[\s\t]*\r*\n)/g, '\n').replace(/^[\n\r\n\t]*|[\n\r\n\t]*$/g, '')
  },
  libKeyNormalize(item) {
    const matchRes = item.matchAll(/-([a-z]|[A-Z])/g)
    for (let res of matchRes) {
      item = item.replace(res[0], res[1].toLocaleUpperCase())
    }
    return item
  },
  checkPackageManager() {
    let packageManager = []
    try {
      childProcess.execSync('npm -v', { stdio: ['ignore'] })
      packageManager.push('npm')
    } catch (e) { }
    try {
      childProcess.execSync('yarn -v', { stdio: ['ignore'] })
      packageManager.push('yarn')
    } catch (e) { }
    return packageManager
  }
}