'use strict'

const ghpages = require('gh-pages')
const chalk = require('chalk')

/**
 * @todo Check there is a git installation in the system
 * @todo Check that there is a remote git
 * @todo Read credentials
 * @todo Create branch
 * @todo Push branch
 * @return {[type]} [description]
 */
function main () {
  deploy()
    .then(function () {
      console.log(chalk.green('Project successfully deployed to Githib Pages'))
    })
    .catch(function (error) {
      console.error(chalk.red(error))
    })
}

function deploy () {
  return new Promise(function (resolve, reject) {
    ghpages.publish(process.cwd(), {
      logger: function (message) {
        console.log(chalk.green(message))
      }
    }, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

module.exports = {
  main: main
}
