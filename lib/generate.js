'use strict'
const path = require('path')
const fs = require('fs')
const shell = require('shelljs')
const debug = require('debug')('generate')

function generateProjectStructure (args) {
  return new Promise((resolve, reject) => {
    let projectDir = path.join(process.cwd(), args.name, '/')
    debug(`New project directory: ${projectDir}`)
    checkDirectory(projectDir).then(result => {
      try {
        fs.mkdirSync(projectDir)
      } catch (e) {
        reject(new Error('Unable to create directory'))
      }
      let blueprintDir = path.resolve(__dirname, '../blueprints')
      if (args.full) {
        blueprintDir = path.join(blueprintDir, 'full')
      } else {
        blueprintDir = path.join(blueprintDir, 'basic')
      }
      debug(`Blueprint directory: ${blueprintDir}`)
      let files
      try {
        files = fs.readdirSync(blueprintDir)
      } catch (e) {
        reject(new Error('Cannot read blueprint files'))
      }
      for (var index in files) {
        let filePath = path.join(blueprintDir, files[index])
        debug(`Current file path: ${filePath}`)
        shell.cp('-r', filePath, projectDir)
      }
      if (args.full && process.env.NODE_ENV !== 'test') {
        shell.exec(`cd ${projectDir} && npm install && bower install`)
      }

      if (args.git) { // Initialize git repository
        let gitignoreDir = path.resolve(blueprintDir, '../node.gitignore')
        shell.exec(`cd ${projectDir} && git init`)
        shell.cp(gitignoreDir, path.join(projectDir, '.gitignore'))
      }
      resolve()
    }).catch(err => {
      reject(err)
    })
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
