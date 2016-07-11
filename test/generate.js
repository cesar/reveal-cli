'use strict'
const test = require('ava')
const fs = require('fs')
const path = require('path')
const generate = require('../lib/generate')

const invalidFilePath = path.join(__dirname, 'invalid-directory')
const validFilePath = path.join(__dirname, 'valid-directory')

test.before(t => {
  try {
    fs.mkdirSync(invalidFilePath)
  } catch (e) {}
})

test.after(t => {
  try {
    fs.rmdirSync(invalidFilePath)
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
