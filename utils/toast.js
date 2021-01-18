const chalk = require('chalk')
module.exports = {
  error(msg) {
    console.log('')
    console.log(chalk.red(`❌ ${msg}`))
    console.log('')
  },
  success(msg) {
    console.log('')
    console.log(chalk.green(`✔ ${msg}`))
    console.log('')
  },
  info(msg) {
    console.log('')
    console.log(chalk.blue(msg))
    console.log('')
  }
}