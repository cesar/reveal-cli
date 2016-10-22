'use strict'

const shell = require('shelljs')
const fs = require('fs')
const Promise = require('bluebird')
const path = require('path')


/**
 * Fetch latest stable release from NPM
 *
 * If successful, resolve promise, else reject
 * promise with the stderr as the parameters
 * @return [Promise]
 */
const fetchLatestRelease = dir => {
  return new Promise((resolve, reject) => {
    // @TODO: Log progress to console
    shell.exec('npm install reveal.js', {async: true}, (code, stdout, stderr) => {
      if (code === 0) {
        resolve()
      } else {
        reject(stderr)
      }
    })
  })
}

/**
 * If the installation is not able to fetch the files from
 * NPM, construct project with cached files. There is no
 * guarantee that project files will be up-to-date with current
 * reveal.js release
 */

const failbackFiles = dir => {
  let blueprintDir = path.resolve(__dirname, '../blueprint')
  shell.cp('-rf', blueprintDir, dir)
}

/**
 * Check whether the directory exists, if it does,
 * reject with a promise, if it doesn't, create the directory
 * @param  {String} dir Path to new project folder
 * @return {[Promise]}
 */
const createDirectory = dir => {
  return new Promise((resolve, reject) => {
    fs.lstat(dir, function (err, stats) {
      if (err) {
        fs.mkdir(dir, function (err) {
          if (!err) {
            resolve()
          } else {
            reject(err || new Error('Unable to create directory'))
          }
        })
      } else {
        reject(new Error('Directory already exists'))
      }
    })
  })
}

const generateGitRepo = path => {
  
}

const copyDevDependencies = path => {}

const removeUnnecessaryFiles = path => {}

module.exports = {
  createDirectory
}
