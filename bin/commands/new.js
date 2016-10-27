'use strict'
const scaffold = require('../../lib/scaffold')
const chalk = require('chalk')
exports.command = 'new <name>'
exports.describe = 'scaffolds a new reveal.js project'
exports.builder = {
  git: {
    default: false
  }
}
exports.handler = function (argv) {
  scaffold.main(argv).then(() => {
    console.log(chalk.green('Generated project successfully'))
  }).catch(err => {
    console.log(chalk.red(err))
  })
}
