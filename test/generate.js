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
  } catch (e) {}
})

test('Generate a new project when the directory name already exists rejects', t => {
  t.plan(1) // Must pass at lease one assetion
  return generate.checkDirectory(invalidFilePath).catch(err => {
    if (err) {
      t.pass()
    }
  })
})

test('Generate a new project with a valid directory name', t => {
  t.plan(1)
  return generate.checkDirectory(validFilePath).then(pwd => {
    t.is(pwd, validFilePath)
  })
})

test('Create a project folder', t => {
  t.plan(1)
  return generate.createDirectory(validFilePath).then(() => {
    t.pass()
  })
})

test('Copy files to new directory', t => {
  t.plan(1)
  let blueprintDir = path.resolve(__dirname, '../blueprints/simple')
  return generate.copyFiles(blueprintDir, validFilePath).then(() => {
    console.log(fs.readdirSync(validFilePath))
    t.pass()
  })
})
