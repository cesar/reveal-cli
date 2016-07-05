'use strict'
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const shell = require('shelljs')
exports.command = 'new <name>'
exports.describe = 'scaffolds a new app'
exports.builder = {}
exports.handler = function (argv) {
  let newProjectDirectory = path.join(process.cwd(), argv.name)
  let blueprintsDirectory = path.resolve(__dirname, '../../blueprints')
  try {
    fs.lstatSync(newProjectDirectory) //  Project directory should not exist
    console.log(chalk.red('Error: Invalid project name, directory by the same name already exists.'))
    process.exit(0)
  } catch (e) {
    console.log(chalk.green('Creating project structure...'))
  }
  fs.mkdirSync(newProjectDirectory)
  let blueprintDir
  if (argv.full) {
    blueprintDir = path.join(blueprintsDirectory, 'full')
  } else {
    blueprintDir = path.join(blueprintsDirectory, 'simple')
  }
  let files
  try {
    files = fs.readdirSync(blueprintDir)
  } catch (e) {
    console.log(chalk.red('Error: Blueprints not found.'))
    process.exit(0)
  }
  for (var index in files) {
    shell.cp('-r', path.join(blueprintDir, files[index]), newProjectDirectory)
  }
  if (argv.full) { // bower && npm install
    shell.exec('cd ' + newProjectDirectory + ' && npm install  && bower install')
  }
  console.log(chalk.green('Generated project folder successfully'))
  process.exit(0)
}
