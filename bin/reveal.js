#! /usr/bin/env node
'use strict'
const yargs = require('yargs')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const shell = require('shelljs')

yargs.usage('$0 command')
.command('new <name>', 'scaffolds a new app', function (args) {
  let newProjectDirectory = path.join(process.cwd(), args.argv._[1])
  let blueprintsDirectory = path.resolve(__dirname, '../blueprints')
  try {
    fs.lstatSync(newProjectDirectory) //  Project directory should not exist
    console.log(chalk.red('Error: Invalid project name, directory by the same name already exists.'))
    process.exit(0)
  } catch (e) {
    console.log(chalk.green('Creating project structure...'))
  }
  fs.mkdirSync(newProjectDirectory)
  let blueprintDir
  if (args.argv.full) {
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
  process.exit(0)
})
.boolean('full')
.describe('full', 'full setup scaffold with development server, only applicable to new command')
.demand(1, 'must provide a valid command')
    .help('h')
    .alias('h', 'help')
    .argv
