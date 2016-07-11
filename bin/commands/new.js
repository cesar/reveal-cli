'use strict'
const generate = require('../../lib/generate')
exports.command = 'new <name>'
exports.describe = 'scaffolds a new app'
exports.builder = {
  full: {
    default: false
  }
}
exports.handler = function (argv) {
  generate.generateProjectStructure(argv)
}
