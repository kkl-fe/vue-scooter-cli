const chalk = require('chalk')
module.exports = {
  error(msg) {
    console.log('')
    console.log(chalk.red(`❌ ${msg}`))
  },
  success(msg) {
    console.log('')
    console.log(chalk.green(`✔ ${msg}`))
  },
  info(msg) {
    console.log('')
    console.log(chalk.blue(msg))
  }
}