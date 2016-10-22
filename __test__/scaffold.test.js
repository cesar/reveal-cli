'use strict'

/* global, it, expect, describe, afterAll */

const scaffold = require('../lib/scaffold')
const path = require('path')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))

describe('Scaffold', () => {
  afterAll(() => {
    let directory = path.join(__dirname, 'not_dummy')
    return fs.rmdir(directory)
  })

  it('should hault if it encounters a directory by the same name', () => {
    let directory = path.join(__dirname, 'dummy')
    return scaffold.createDirectory(directory)
      .catch(e => expect(e).toEqual(new Error('Directory already exists')))
  })

  it('should create a directory successfully', () => {
    let directory = path.join(__dirname, 'not_dummy')
    return scaffold.createDirectory(directory)
      .then(e => {
        expect(e).toBeUndefined()
      })
  })
})
