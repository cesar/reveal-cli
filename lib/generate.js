'use strict'
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const shell = require('shelljs')

function generateProjectStructure (args) {
  let projectDir = path.join(process.cwd(), args.name)
  checkDirectory(projectDir).then(result => {
    fs.mkdir(projectDir, err => {
      if (err) {
        console.log(chalk.red('Unable to create a new directory'))
        process.exit(0)
      }
      let blueprintDir = path.resolve(__dirname, '../blueprints')
      if (args.full) {
        blueprintDir = path.join(blueprintDir, 'full')
      } else {
        blueprintDir = path.join(blueprintDir, 'simple')
      }
      fs.readdir(blueprintDir, (err, files) => {
        if (err) {
          console.log(chalk.red('Problems with blueprint files'))
          process.exit(0)
        } else {
          for (var index in files) {
            shell.cp('-r', path.join(blueprintDir, files[index]), projectDir)
          }
        }
        if (args.full) {
          shell.exec(`cd ${projectDir} && npm install && bower install`)
        }

        if (args.git) { // Initialize git repository
          let gitignoreDir = path.resolve(blueprintDir, '../node.gitignore')
          shell.exec(`cd ${projectDir} && git init`)
          shell.cp(gitignoreDir, path.join(projectDir, '.gitignore'))
        }
        console.log(chalk.green('Generated project successfully'))
        process.exit(0)
      })
    })
  }).catch(err => {
    console.log(chalk.red(err))
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

exports.checkDirectory = checkDirectory
exports.generateProjectStructure = generateProjectStructure
