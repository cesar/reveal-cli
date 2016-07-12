'use strict'
const generate = require('../../lib/generate')
const chalk = require('chalk')
exports.command = 'new <name>'
exports.describe = 'scaffolds a new app'
exports.builder = {
  full: {
    default: false
  },
  git: {
    default: false
  }
}
exports.handler = function (argv) {
  generate.generateProjectStructure(argv).then(() => {
    console.log(chalk.green('Generated project successfully'))
  }).catch(err => {
    console.log(chalk.red(err))
  })
}
