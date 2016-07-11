'use strict'
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const shell = require('shelljs')

function generateProjectStructure (args) {
  let projectDir = path.join(process.cwd(), args.name)
  checkDirectory(projectDir).then(result => {
    return createDirectory(result)
  }).then(() => {
    let blueprintDir = path.resolve(__dirname, '../blueprints')
    if (args.full) {
      blueprintDir = path.join(blueprintDir, 'full')
    } else {
      blueprintDir = path.join(blueprintDir, 'simple')
    }
    return copyFiles(blueprintDir, projectDir)
  }).then(() => {
    if (args.full) {
      shell.exec(`cd ${projectDir} && npm install && bower install`)
    }
    console.log(chalk.green('Generated project successfully'))
    process.exit(0)
  }).catch(err => {
    console.log(chalk.red(`Error: ${err}`))
    process.exit(0)
  })
}

function checkDirectory (projectDir) {
  return new Promise((resolve, reject) => {
    fs.lstat(projectDir, (err, stat) => {
      if (err) {
        resolve(projectDir)
      } else {
        reject(new Error('Directory already exists'))
      }
    })
  })
}

function createDirectory (projectDir) {
  return new Promise((resolve, reject) => {
    fs.mkdir(projectDir, err => {
      if (err) {
        reject(new Error('Could not create directory'))
      } else {
        resolve()
      }
    })
  })
}

function copyFiles (from, to) {
  return new Promise((resolve, reject) => {
    fs.readdir(from, (err, files) => {
      if (err) {
        reject(new Error('Problems with blueprint files'))
      } else {
        for (var index in files) {
          shell.cp('-r', path.join(from, files[index]), to)
        }
        resolve()
      }
    })
  })
}

exports.copyFiles = copyFiles
exports.createDirectory = createDirectory
exports.checkDirectory = checkDirectory
exports.generateProjectStructure = generateProjectStructure
