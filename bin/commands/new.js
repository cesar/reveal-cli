'use strict'
const scaffold = require('../../lib/scaffold')
exports.command = 'new <name>'
exports.describe = 'scaffolds a new reveal.js project'
exports.builder = {
  git: {
    default: false
  }
}
exports.handler = function (argv) {
  scaffold.main(argv)
}
