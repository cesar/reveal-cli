'use strict'
const deploy = require('../../lib/deploy')
exports.command = 'deploy'
exports.describe = 'Deploy project to GitHub Pages'
exports.handler = function (argv) {
  deploy.main(argv)
}
