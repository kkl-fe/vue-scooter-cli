module.exports = {
  npm: {
    install(package, options = '') {
      return `npm install ${package} ${options}`
    },
    version(package, options = '') {
      return `npm view ${package} --json ${options}`
    }
  },
  yarn: {
    install(package, options = '') {
      return `yarn add ${package} ${options}`
    },
    version(package, options = '') {
      return `yarn info ${package} version --json ${options}`
    }
  }
}