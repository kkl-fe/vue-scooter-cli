module.exports = {
  library: {
    type: "multiple",
    query: "Select the development library you need",
    handle: "library",
    symbol: '>',
    menu: [
      'vue-router',
      'vuex'
    ],
  },
  packageManager: {
    type: "interactive",
    query: "Select the package manager you need",
    handle: "packageManager",
    symbol: '>',
    menu: [
      'npm',
      'yarn'
    ]
  }
}