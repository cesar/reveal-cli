'use strict'
const test = require('ava')
const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
const generate = require('../lib/generate')

const invalidFilePath = path.join(__dirname, 'invalid-directory')
const validFilePath = path.join(__dirname, 'valid-directory')

test.before(t => {
  try {
    fs.mkdirSync(invalidFilePath)
  } catch (e) {}
})

test.after.always(t => {
  try {
    fs.rmdirSync(invalidFilePath)
    shell.exec('rm -rf ' + validFilePath)
    shell.exec('rm -rf ' + path.join(__dirname, 'some-project'))
    shell.exec('rm -rf ' + path.join(__dirname, 'some-project2'))
    shell.exec('rm -rf ' + path.join(__dirname, 'some-project3'))
    shell.exec('rm -rf ' + path.join(__dirname, '.git'))
    shell.exec('rm -rf ' + path.join(__dirname, '.gitignore'))
  } catch (e) {}
})

test('Generate a new project when the directory name already exists rejects', t => {
  t.plan(1) // Must pass at lease one assetion
  let args = {
    name: 'invalid-directory',
    full: false,
    git: false
  }
  return generate.generateProjectStructure(args).catch(err => {
    if (err) {
      t.pass()
    }
  })
})

test('Generate basic project', t => {
  t.plan(1)
  let args = {
    name: 'some-project',
    full: false,
    git: false
  }
  return generate.generateProjectStructure(args).then(() => {
    t.pass()
  })
})

test('Generate full project', t => {
  t.plan(1)
  let args = {
    name: 'some-project2',
    full: true,
    git: false
  }
  return generate.generateProjectStructure(args).then(() => {
    t.pass()
  })
})

test('Generate a project plus a git repo', t => {
  t.plan(1)
  let args = {
    name: 'some-project3',
    full: false,
    git: true
  }
  return generate.generateProjectStructure(args).then(() => {
    t.pass()
  })
})
